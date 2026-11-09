// A fila em um laço só. Uma posição contínua P (float, em looks) decide tudo: cada figura tem um número inteiro n na
// linha infinita, fica a v = n − P do centro, e vaga(v) devolve eixo, pés, escala, desfoque e opacidade.
//
// - Nove elementos para as vagas −4 a +4. O elemento i guarda o n ≡ i (mod 9) que cai em [c − 4, c + 4], com
//   c = round(P). Ao passar de meio look, só o elemento que sai por uma ponta muda: vira o novo da outra ponta, com o
//   look seguinte (BRIEF.md, "O elemento que sai por −4 é reaproveitado como o novo +4").
// - Cada vaga mostra o look n mod 8: o anel é de vagas, não de looks, e ±4 caem no mesmo look.
// - Desfoque sem filter: três versões do recorte (nítida, desfoque 1, desfoque 2) empilhadas, somadas com
//   mix-blend-mode: plus-lighter dentro da caixa isolada. Os pesos de duas versões vizinhas somam 1, então a troca é
//   uma mistura exata, sem a figura ficar transparente no meio.
// - O laço só roda enquanto algo anda (troca, arrasto, foco, entrada); parado, não gasta quadro.
// - Foco e fila não andam juntos: no vídeo o foco só abre com a fila parada. Uma troca pedida com o foco aberto (ou
//   fechando) espera ele quase fechar para a fila sair do lugar, e quem reabre o foco é o palco, quando a fila para
//   (aoParar). O peso do foco ainda cai com a distância ao centro (pesoCentro), então nenhum caso que escape dessa
//   ordem troca o modelo do centro seco: o que sai perde o foco andando e o que chega ganha andando.
import { vaga, VAGAS_N } from './anel.js';
import { C, T, tween, clamp01, lerp } from './curvas.js';

const N_EL = VAGAS_N * 2 + 1; // 9
// a fila sai do lugar quando o fechamento do foco passa desta fração do tempo (o foco já está em ~12 %)
const FECHA_ANTES_DE_ANDAR = 0.55;
// peso do foco e da presença no centro: 1 na vaga 0, 0 a meia vaga, contínuo no meio
const pesoCentro = a => clamp01(1 - 2 * a);
const mod = (a, m) => ((a % m) + m) % m;
const agora = () => performance.now() / 1000;

// desfoque (px em 1440) → nível de imagem: 0 nítida, 1 = 2,5 px, 2 = 4 px
const DESFOQUE_NIVEIS = [0, 2.5, 4];
function nivel(d) {
  if (d <= 0) return 0;
  if (d <= DESFOQUE_NIVEIS[1]) return d / DESFOQUE_NIVEIS[1];
  if (d <= DESFOQUE_NIVEIS[2]) return 1 + (d - DESFOQUE_NIVEIS[1]) / (DESFOQUE_NIVEIS[2] - DESFOQUE_NIVEIS[1]);
  return 2;
}

/**
 * @param {object} o
 * @param {HTMLElement} o.palco
 * @param {HTMLElement[]} o.figuras   nove .fig, cada uma com .sombra e três .fig-img
 * @param {HTMLElement} o.sobre       .fig-foco, a camada dos pinos e do clique do centro (sempre na vaga 0)
 * @param {object[]} o.looks
 * @param {MediaQueryList} o.celular
 * @param {MediaQueryList} o.menosMovimento
 */
export function criarFila({ palco, figuras, sobre, looks, celular, menosMovimento }) {
  const total = looks.length;
  let P = 0; // posição contínua
  let alvo = 0; // inteiro, sem módulo; o look é alvo mod 8
  let anim = null; // tween de P
  let arrastando = false;
  let foco = tween(0, 0, { duracao: 0 });
  let vizinhos = tween(1, 1, { duracao: 0 });
  let entrada = null; // { op, extra } durante a entrada da tela
  let rodando = false;
  let medida = null;
  let aoPararFila = []; // callbacks para quando a fila assentar

  const els = figuras.map((el, i) => ({
    el,
    i,
    n: null,
    imgs: [...el.querySelectorAll('.fig-img')],
    sombra: el.querySelector('.sombra'),
    fadeT0: null, // início do fade próprio do novo ±4
    cache: {},
  }));

  function medir() {
    const r = palco.getBoundingClientRect();
    const cs = getComputedStyle(document.documentElement);
    medida = {
      W: r.width,
      topo: r.top,
      H: sonda.getBoundingClientRect().height || innerHeight, // 100svh em px
      cel: celular.matches,
      focoEscala: parseFloat(cs.getPropertyValue('--foco-escala')) || 1.205,
      focoPes: parseFloat(cs.getPropertyValue('--foco-pes')) || 94,
    };
  }
  const sonda = document.createElement('div');
  sonda.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
  document.body.append(sonda);

  // escreve só o que mudou: transform e opacidade a cada quadro, o resto raramente
  const escreve = (e, chave, valor, fn) => {
    if (e.cache[chave] !== valor) { e.cache[chave] = valor; fn(valor); }
  };

  function atribuir(e, n, emTroca) {
    const l = looks[mod(n, total)];
    const veioDeFora = e.n !== null && emTroca;
    e.n = n;
    e.imgs.forEach((img, k) => { img.src = l.desfoque[k]; });
    e.el.style.setProperty('--sombra-x', l.sombra);
    e.el.dataset.look = l.id;
    e.fadeT0 = veioDeFora && anim ? anim.inicio : null;
  }

  function desenhar(t) {
    if (!medida) medir();
    const { W, H, topo, cel, focoEscala, focoPes } = medida;
    const c = Math.round(P);
    const fT = foco.valor(t);
    const viz = vizinhos.valor(t);
    const entOp = entrada ? entrada.op.valor(t) : 1;
    const extra = entrada ? entrada.extra.valor(t) : 0;
    let pendente = false;

    for (const e of els) {
      const n = c - VAGAS_N + mod(e.i - (c - VAGAS_N), N_EL);
      if (e.n !== n) atribuir(e, n, !!anim || arrastando);
      const v = n - P;
      const a = Math.abs(v);
      const g = vaga(v, cel);
      const wc = pesoCentro(a);
      const kf = fT * wc; // quanto do foco esta figura carrega

      let op = g.opacidade;
      if (e.fadeT0 !== null && !cel) {
        // o novo ±4 fica parado na vaga e entra por último, com fade próprio (BRIEF.md, "Caminho ao avançar")
        const p = clamp01((t - e.fadeT0 - T.novoQuarto.inicio) / T.novoQuarto.duracao);
        op = (a >= VAGAS_N ? 0.16 : op) * C.suave(p);
        if (p >= 1 || a < 3.5) e.fadeT0 = null;
        else pendente = true;
      }

      let escala = g.escala, pes = g.pes;
      if (kf > 0) {
        escala = lerp(g.escala, focoEscala, kf);
        pes = lerp(g.pes, focoPes, kf);
      }
      op *= lerp(viz, 1, wc); // vizinhos somem no foco; o centro fica, e a passagem entre os dois é contínua
      op *= entOp;

      const x = (W * g.x) / 100;
      const y = (H * pes) / 100 - topo;
      e.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${escala.toFixed(4)})`;
      escreve(e, 'op', op.toFixed(3), val => (e.el.style.opacity = val));
      escreve(e, 'vis', op > 0.002 ? '' : 'hidden', val => (e.el.style.visibility = val));
      escreve(e, 'z', g.z, val => (e.el.style.zIndex = val));
      escreve(e, 'alcance', a <= 2.5 && op > 0.5 && fT === 0, val => e.el.classList.toggle('is-alcance', val));

      // a sombra não cresce em altura no foco
      const sy = kf > 0 ? (g.escala / escala).toFixed(4) : '1';
      escreve(e, 'sy', sy, val => (e.sombra.style.transform = val === '1' ? '' : `translate(-50%, -50%) scaleY(${val})`));

      // pesos das três versões do recorte
      const L = nivel(g.desfoque + extra);
      const i0 = Math.min(Math.floor(L), 1), tt = L - i0;
      const w = [0, 0, 0];
      w[i0] = 1 - tt;
      w[i0 + 1] = tt;
      e.imgs.forEach((img, k) => escreve(e, `w${k}`, w[k].toFixed(3), val => (img.style.opacity = val)));
    }

    // a camada dos pinos e do clique do centro fica sempre na vaga 0
    const g0 = vaga(0, cel);
    const s0 = lerp(g0.escala, focoEscala, fT);
    const y0 = (H * lerp(g0.pes, focoPes, fT)) / 100 - topo;
    sobre.style.transform = `translate3d(${(W * 0.5).toFixed(2)}px, ${y0.toFixed(2)}px, 0) scale(${s0.toFixed(4)})`;
    sobre.style.setProperty('--s', s0.toFixed(4));

    return pendente;
  }

  function quadro() {
    const t = agora();
    if (anim && !arrastando) {
      P = anim.valor(t);
      if (anim.acabou(t)) { P = alvo; anim = null; }
    }
    if (entrada && entrada.op.acabou(t) && entrada.extra.acabou(t)) entrada = null;
    const pendente = desenhar(t);
    if (!anim && !arrastando && aoPararFila.length) {
      const fns = aoPararFila;
      aoPararFila = [];
      fns.forEach(fn => fn());
    }
    const ativo = pendente || arrastando || anim || entrada || !foco.acabou(t) || !vizinhos.acabou(t);
    if (ativo) requestAnimationFrame(quadro);
    else rodando = false;
  }

  // com o foco fechando, a fila espera ele quase sumir; com o foco aberto, quem chama fecha antes (palco.js)
  function esperaDoFoco(t) {
    if (foco.para !== 0 || foco.acabou(t)) return 0;
    return Math.max(0, foco.inicio + foco.duracao * FECHA_ANTES_DE_ANDAR - t);
  }

  function pedir() {
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(quadro);
  }

  function duracaoAte(destino) {
    const d = Math.abs(destino - P);
    if (d < 1) return lerp(T.encaixe, T.fila, d);
    return Math.min(T.fila + T.filaPorPasso * (d - 1), 1.1);
  }

  const api = {
    // troca de look pelo caminho do anel (passo de −4 a +4); anda a partir de onde a fila está agora
    irPara(passo) {
      alvo += passo;
      if (menosMovimento.matches) {
        P = alvo;
        anim = null;
        palco.querySelector('.fila')?.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
      } else {
        const t = agora();
        const espera = esperaDoFoco(t);
        // vindo do foco, os vizinhos terminam de voltar antes de a fila andar: senão o modelo que sai do centro
        // passaria por vagas ainda apagadas e ficaria translúcido no caminho
        if (vizinhos.para === 1 && !vizinhos.acabou(t)) {
          vizinhos = tween(vizinhos.valor(t), 1, { duracao: Math.max(0.12, espera), curva: C.suave, inicio: t });
        }
        anim = tween(P, alvo, { duracao: duracaoAte(alvo), curva: C.fila, atraso: espera, inicio: t });
      }
      pedir();
    },
    // a fila está parada no alvo (sem troca, sem arrasto)
    get parada() { return !anim && !arrastando && P === alvo; },
    // chama fn quando a fila assentar (na hora, se já está parada)
    aoParar(fn) {
      if (api.parada) { fn(); return; }
      aoPararFila.push(fn);
      pedir();
    },
    // arrasto: segura a fila onde está, move livre e, ao soltar, encaixa no alvo (ou volta)
    segurar() {
      arrastando = true;
      anim = null;
      pedir();
      return P;
    },
    mover(p) { P = p; pedir(); },
    soltar() {
      arrastando = false;
      if (P !== alvo) anim = tween(P, alvo, { duracao: duracaoAte(alvo), curva: C.fila });
      pedir();
    },
    // o alvo atual, inteiro: o arrasto usa para saber quantos looks andou
    get alvo() { return alvo; },
    get posicao() { return P; },
    // vaga (inteira) em que a figura está agora; o clique em vizinho anda até ela
    vagaDe(el) {
      const e = els.find(x => x.el === el);
      return e ? Math.round(e.n - P) : null;
    },
    passoPx() { if (!medida) medir(); return (medida.W * (medida.cel ? 42 : 29.3)) / 100; },
    abrirFoco() {
      const t = agora();
      foco = tween(foco.valor(t), 1, { duracao: T.focoAbre, curva: C.fila, inicio: t });
      vizinhos = tween(vizinhos.valor(t), 0, { duracao: T.vizinhosSaem, curva: C.linear, atraso: 0.02, inicio: t });
      pedir();
    },
    fecharFoco() {
      const t = agora();
      foco = tween(foco.valor(t), 0, { duracao: T.focoFecha, curva: C.fila, inicio: t });
      vizinhos = tween(vizinhos.valor(t), 1, { duracao: T.vizinhosVoltam, curva: C.suave, atraso: T.vizinhosVoltamAtraso, inicio: t });
      pedir();
    },
    // entrada da tela: modelos aparecem e assentam saindo de um desfoque extra
    entrar() {
      const t = agora();
      if (menosMovimento.matches) {
        entrada = { op: tween(0, 1, { duracao: 0.25, curva: C.suave, inicio: t }), extra: tween(0, 0, { duracao: 0 }) };
      } else {
        entrada = {
          op: tween(0, 1, { duracao: 0.25, curva: C.suave, inicio: t }),
          extra: tween(2.5, 0, { duracao: T.entrada, curva: C.fila, inicio: t }),
        };
      }
      pedir();
    },
    esconder() { entrada = { op: tween(0, 0, { duracao: 0.01 }), extra: tween(2.5, 2.5, { duracao: 0.01 }) }; desenhar(agora()); },
    redesenhar() { medir(); pedir(); },
    // imagens de todas as vagas para decodificar antes da entrada
    imagensIniciais() {
      const c = Math.round(P);
      const set = new Set();
      for (let k = -VAGAS_N; k <= VAGAS_N; k++) looks[mod(c + k, total)].desfoque.forEach(s => set.add(s));
      return [...set];
    },
  };

  addEventListener('resize', () => api.redesenhar());
  celular.addEventListener('change', () => api.redesenhar());
  return api;
}
