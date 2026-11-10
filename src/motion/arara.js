// Física da arara (src/secoes/arara.js): uma simulação em uma dimensão, como um cabide de verdade num cano.
//
// Cada peça tem uma posição x no cano (o gancho), uma velocidade e um balanço (ângulo do cabide em torno do gancho).
//   - arrastar: a peça segura segue o dedo/mouse e empurra as vizinhas (nenhuma passa pela outra);
//   - soltar: a peça continua com a velocidade do arrasto e o atrito do gancho no cano a para;
//   - balanço: pêndulo amortecido movido pela aceleração do gancho (θ'' = −ω²·θ − 2ζω·θ' − a/L), então a peça
//     balança para trás quando arranca e para a frente quando freia;
//   - virar: a peça "aberta" gira de lado para de frente (rotateY), e a largura que ela ocupa no cano cresce junto,
//     abrindo espaço entre as vizinhas.
// Um laço de requestAnimationFrame só, que dorme quando tudo para. Só transform (composição) por quadro.
// Quem desenha é a seção: em 3D (src/motion/arara-3d.js) ou, sem WebGL, com as fotos e rotateY de CSS.

const ATRITO = 3.2; // 1/s: quanto da velocidade o gancho perde por segundo
const AMORTECE = 0.14; // ζ do pêndulo
const GIRO_MOLA = 11; // 1/s: rapidez com que a peça vira
const LIMITE_BALANCO = 0.42; // rad
const QUIQUE = 0.25; // fração da velocidade devolvida no batente do cano
const G = 5900; // px/s²: g com 1 m ≈ 600 px (uma peça de ~0,7 m tem ~420 px no desktop)
const EMPURRA = 0.45; // quanto da aceleração do gancho vira balanço

export function criarArara({ pecas, medir, desenhar }) {
  // pecas: [{ largura, alturaPendulo, fechada?, aberta?, minima?, margemAberta? }] em px; medir() → { inicio, fim }
  // do cano em px; desenhar(i, { x, balanco, abertura }) escreve a pose de cada peça
  const n = pecas.length;
  const s = pecas.map(() => ({ x: 0, v: 0, vAntes: 0, th: 0, w: 0, ab: 0, alvo: 0 }));
  let cano = medir();
  let LARGURA_DE_LADO = 0.36; // fração da largura de frente que a peça ocupa de lado (cos do giro + espessura)
  let VAO = 6;
  let segura = -1;
  let ponteiro = 0;
  let guia = null; // entrada: posições guiadas por uma função do tempo, até ela acabar
  let rodando = false;
  let ultimo = 0;
  let parado = false; // movimento reduzido: sem balanço nem deslizar (mantém o virar)

  // largura que a peça ocupa no cano: de lado (fechada) → de frente (aberta). Cada peça pode trazer as suas em px
  // (o 3D usa a espessura de verdade da malha); sem elas, vale a fração LARGURA_DE_LADO da largura de frente.
  const fechada = i => pecas[i].fechada ?? pecas[i].largura * LARGURA_DE_LADO;
  const ocupa = i => fechada(i) + ((pecas[i].aberta ?? pecas[i].largura) - fechada(i)) * s[i].ab;
  // arrastada contra as outras, a peça as aperta como roupa de verdade: cada uma cede da largura de repouso até a
  // mínima dela (no 3D, a espessura da malha; nas fotos, um quarto da largura de lado), e não mais que isso.
  // aperto = [à esquerda, à direita] da peça segura, de 0 a 1.
  const aperto = [0, 0];
  let pivo = -1;
  const cede = i => Math.max(0, fechada(i) - (pecas[i].minima ?? fechada(i) * 0.25)) * (1 - s[i].ab);
  const precisaCom = (i, a) => (ocupa(i) - a * cede(i) + ocupa(i + 1) - a * cede(i + 1)) / 2 + VAO;
  const precisa = i => precisaCom(i, pivo < 0 ? Math.max(aperto[0], aperto[1]) : aperto[i < pivo ? 0 : 1]);
  // distância mínima do gancho até a ponta do cano: metade do que a peça ocupa, ou a margem própria da peça
  // (quando a peça virada passa por cima das vizinhas, ocupa pouco do cano mas ainda precisa caber na tela)
  const margem = i => Math.max(ocupa(i) / 2, (pecas[i].margemAberta ?? 0) * s[i].ab);

  // quanto as outras precisam do cano de cada lado da peça i, com o aperto a (0 = à vontade, 1 = no limite)
  function lados(i, a) {
    let esq = margem(0);
    for (let j = 0; j < i; j++) esq += precisaCom(j, a);
    let dir = margem(n - 1);
    for (let j = i; j < n - 1; j++) dir += precisaCom(j, a);
    return [esq, dir];
  }
  // a peça segura vai até onde as outras, apertadas no limite, ainda cabem; e o aperto de cada lado sai de quanto
  // falta de cano para elas ficarem à vontade
  function segurarEm(i, x) {
    const [minEsq, minDir] = lados(i, 1);
    const de = cano.inicio + minEsq;
    const ate = cano.fim - minDir;
    const alvo = de <= ate ? Math.min(ate, Math.max(de, x)) : (de + ate) / 2;
    const [cheioEsq, cheioDir] = lados(i, 0);
    const falta = (cheio, minimo, tem) => (cheio > tem ? Math.min(1, (cheio - tem) / Math.max(1, cheio - minimo)) : 0);
    pivo = i;
    aperto[0] = falta(cheioEsq, minEsq, alvo - cano.inicio);
    aperto[1] = falta(cheioDir, minDir, cano.fim - alvo);
    return alvo;
  }

  function arrumar(segurada) {
    // peça virada com margem própria: fica dentro do cano pela margem dela e, se ninguém está sendo arrastado,
    // vira a âncora (as outras se arrumam em volta)
    let fixa = segurada;
    for (let i = 0; i < n; i++) {
      const m = (pecas[i].margemAberta ?? 0) * s[i].ab;
      if (m <= ocupa(i) / 2 || i === segurada) continue;
      s[i].x = Math.min(Math.max(s[i].x, cano.inicio + m), Math.max(cano.inicio + m, cano.fim - m));
      if (fixa < 0 && s[i].alvo === 1) fixa = i;
    }
    // empurra para a direita e para a esquerda a partir da peça fixa (a segura não cede)
    for (let volta = 0; volta < 3; volta++) {
      for (let i = 0; i < n - 1; i++) {
        const falta = precisa(i) - (s[i + 1].x - s[i].x);
        if (falta <= 0) continue;
        if (i === fixa) s[i + 1].x += falta;
        else if (i + 1 === fixa) s[i].x -= falta;
        else { s[i].x -= falta / 2; s[i + 1].x += falta / 2; }
        // choque inelástico: as duas seguem juntas
        if (i !== fixa && i + 1 !== fixa) { const m = (s[i].v + s[i + 1].v) / 2; s[i].v = s[i + 1].v = m; }
        else if (i === fixa) s[i + 1].v = Math.max(s[i + 1].v, s[i].v);
        else s[i].v = Math.min(s[i].v, s[i + 1].v);
      }
      // batentes nas pontas do cano; a fila inteira volta para dentro
      const a = cano.inicio + margem(0);
      if (s[0].x < a) { s[0].x = a; if (s[0].v < 0) s[0].v *= -QUIQUE; }
      const b = cano.fim - margem(n - 1);
      if (s[n - 1].x > b) { s[n - 1].x = b; if (s[n - 1].v > 0) s[n - 1].v *= -QUIQUE; }
    }
  }

  function passo(t) {
    const dt = Math.min(0.033, (t - ultimo) / 1000 || 0.016);
    ultimo = t;
    let mexendo = false;

    for (let i = 0; i < n; i++) {
      const p = s[i];
      const k = 1 - Math.exp(-dt * GIRO_MOLA);
      p.ab += (p.alvo - p.ab) * k;
      if (Math.abs(p.alvo - p.ab) > 0.002) mexendo = true; else p.ab = p.alvo;
    }

    if (guia) {
      const fim = guia(t, s);
      if (fim) guia = null;
      mexendo = true;
    } else {
      for (let i = 0; i < n; i++) {
        const p = s[i];
        if (i === segura) {
          const novo = p.x + (segurarEm(i, ponteiro) - p.x) * Math.min(1, dt * 28);
          p.v = (novo - p.x) / dt;
          p.x = novo;
          mexendo = true;
          continue;
        }
        p.x += p.v * dt;
        p.v *= Math.exp(-dt * ATRITO);
        if (Math.abs(p.v) < 4) p.v = 0; else mexendo = true;
      }
    }
    if (segura < 0 && (aperto[0] > 0 || aperto[1] > 0)) {
      // soltou: as peças voltam a se espalhar aos poucos
      pivo = -1;
      const k = Math.exp(-dt * 9);
      aperto[0] = aperto[0] * k < 0.004 ? 0 : aperto[0] * k;
      aperto[1] = aperto[1] * k < 0.004 ? 0 : aperto[1] * k;
      mexendo = true;
    }
    arrumar(segura);

    for (let i = 0; i < n; i++) {
      const p = s[i];
      if (parado) { p.th = 0; p.vAntes = p.v; continue; }
      const L = pecas[i].alturaPendulo;
      const w = Math.sqrt(G / L); // pêndulo de comprimento L (px) com g na escala da tela
      const acel = (p.v - p.vAntes) / dt;
      p.vAntes = p.v;
      p.w2 = (p.w2 || 0) + (-w * w * p.th - 2 * AMORTECE * w * (p.w2 || 0) - (acel / L) * EMPURRA) * dt;
      p.th += p.w2 * dt;
      if (p.th > LIMITE_BALANCO) { p.th = LIMITE_BALANCO; p.w2 = 0; }
      if (p.th < -LIMITE_BALANCO) { p.th = -LIMITE_BALANCO; p.w2 = 0; }
      if (Math.abs(p.th) > 0.0008 || Math.abs(p.w2) > 0.004) mexendo = true;
    }

    pintar();

    if (mexendo || segura >= 0) requestAnimationFrame(passo);
    else rodando = false;
  }

  const pintar = (comBalanco = true) => {
    for (let i = 0; i < n; i++) desenhar(i, { x: s[i].x, balanco: comBalanco ? s[i].th : 0, abertura: s[i].ab });
  };

  const acordar = () => {
    if (rodando) return;
    rodando = true;
    ultimo = performance.now();
    requestAnimationFrame(passo);
  };

  // posição de descanso: o grupo no meio do cano, todas de lado
  function arrumarNoMeio() {
    cano = medir();
    const total = s.reduce((t, _, i) => t + ocupa(i), 0) + VAO * (n - 1);
    let x = (cano.inicio + cano.fim) / 2 - total / 2;
    for (let i = 0; i < n; i++) { s[i].x = x + ocupa(i) / 2; x += ocupa(i) + VAO; }
  }

  return {
    configurar({ deLado, vao, semMovimento }) {
      LARGURA_DE_LADO = deLado;
      VAO = vao;
      parado = semMovimento;
    },
    medidas: pecas,
    posicionar() { arrumarNoMeio(); pintar(false); },
    remedir() { const antes = cano; cano = medir(); const d = (cano.inicio + cano.fim - antes.inicio - antes.fim) / 2; for (const p of s) p.x += d; arrumar(-1); pintar(); },
    // entrada: as peças chegam deslizando pela direita, uma atrás da outra, e balançam ao frear
    entrar({ duracao = 1500, atraso = 70 } = {}) {
      arrumarNoMeio();
      const destino = s.map(p => p.x);
      const longe = cano.fim - cano.inicio;
      const t0 = performance.now();
      const curva = u => 1 - Math.pow(1 - u, 4);
      guia = (t, est) => {
        let fim = true;
        for (let i = 0; i < n; i++) {
          const u = Math.min(1, Math.max(0, (t - t0 - i * atraso) / duracao));
          if (u < 1) fim = false;
          const x = destino[i] + longe * (1 - curva(u));
          est[i].v = (x - est[i].x) / 0.016;
          est[i].x = x;
        }
        if (fim) for (const p of est) p.v = 0;
        return fim;
      };
      acordar();
    },
    abrir(i) { s.forEach((p, j) => { p.alvo = j === i ? 1 : 0; }); acordar(); },
    aberta: () => s.findIndex(p => p.alvo === 1),
    segurar(i, x) { segura = i; ponteiro = x; guia = null; acordar(); },
    mover(x) { ponteiro = x; },
    soltar() { segura = -1; acordar(); },
    // empurrãozinho (teclado): a peça escorrega um pouco e balança
    cutucar(i, v) { s[i].v += v; acordar(); },
    x: i => s[i].x,
    abertura: i => s[i].ab,
  };
}
