// Arara: as camisetas e os moletons dos looks, cada um num cabide de madeira, pendurados num cano de ponta a ponta.
// Inspirado no hero "Product Rail Gallery" (21st.dev, MIT), refeito aqui em JS puro, sem o código de lá.
//
// Em repouso as peças ficam de lado, como numa loja. Passar o mouse (ou o foco do teclado) vira a peça de frente e
// abre espaço entre as vizinhas; arrastar desliza a peça pelo cano empurrando as outras, com o balanço do cabide
// (src/motion/arara.js). Clicar tira a peça da arara: ela sobe para um modal e gira para mostrar as costas.
// Toque: o primeiro toque vira, o segundo tira da arara. Teclado: setas, Home/End e Enter (tabindex móvel).
//
// As peças são 3D de verdade (src/motion/arara-3d.js, Three.js): um canvas atrás dos botões desenha as malhas com
// a pose que a física dá. O módulo chega por import() quando a seção está a uma tela de distância; até lá, e sempre
// que não houver WebGL (ou com ?arara=2d), valem as fotos com rotateY de CSS. Os botões continuam no DOM, por cima
// do canvas: cada um é a área de toque da sua peça e acompanha a posição dela.
import { marca } from '../data/marca.js';
import { pecasDaArara } from '../data/arara.js';
import { categorias } from '../data/loja.js';
import { reais } from '../data/looks.js';
import { $, $$, esc, pad, celular, toque, menosMovimento, X, CHECK, MAIS, SETA_CIMA } from '../dom.js';
import { adicionarPeca } from '../estado.js';
import { embaralhar } from '../motion/letras.js';
import { criarArara } from '../motion/arara.js';
import { pararRolagem } from '../motion/lenis.js';

const ARRASTO_MIN = 6; // px até o toque/clique virar arrasto
const GIRO_DE_LADO = -72; // graus: a foto (2D) em repouso
// 3D, por aparelho: giro = ângulo da peça em repouso (menos de lado que a foto: a malha tem espessura, e de lado
// demais só se veria a manga); achata = profundidade das malhas no cano (as roupas se apertam umas nas outras);
// saida = quanto a peça virada vem para a frente das vizinhas, em alturas de peça; deLado = fração da largura que
// a peça ocupa no cano em repouso
const POSE = {
  tela: { giro: 60, achata: 0.6, saida: 0.12, deLado: 0.46 },
  celular: { giro: 64, achata: 0.42, saida: 0.5, deLado: 0.25 },
};

const VIRAR = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 0 1 9.6-3.7M13.5 8a5.5 5.5 0 0 1-9.6 3.7M12.6 1.8v2.9H9.7M3.4 14.2v-2.9h2.9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function montarArara(raiz, { verNoLook }) {
  const t = marca.loja.arara;
  const pecas = pecasDaArara();
  const fraseDe = () => (toque.matches ? t.fraseToque : t.frase);

  raiz.innerHTML = `
    <div class="secao-miolo">
      <header class="secao-cabeca" data-revela="0.6">
        <h2 class="secao-titulo" id="arara-titulo">${esc(t.titulo)}</h2>
        <p class="secao-frase" data-arara-frase>${esc(fraseDe())}</p>
      </header>
    </div>
    <div class="arara-palco" data-revela="0.3">
      <div class="arara-cano" aria-hidden="true"><span class="arara-suporte"></span><span class="arara-suporte"></span></div>
      <canvas class="arara-3d" data-arara-3d aria-hidden="true"></canvas>
      <ul class="arara-lista" aria-label="${esc(t.lista)}">
        ${pecas.map((p, i) => `
          <li class="cabide" style="--foto-w:${p.w}; --foto-h:${p.h}; --gancho:${p.gancho}; --i:${i}">
            <span class="cabide-visual" aria-hidden="true">
              <span class="cabide-balanco">
                <span class="cabide-giro">
                  <img src="${p.frente}" alt="" width="${p.w}" height="${p.h}" decoding="async" loading="lazy" draggable="false" />
                  <span class="cabide-luz" style="--mascara: url('${p.frente}')"></span>
                </span>
              </span>
            </span>
            <button class="cabide-botao" type="button" tabindex="${i === 0 ? 0 : -1}" data-cabide="${i}"
              aria-label="${esc(`${p.nome}, ${reais(p.preco)}. ${t.doLook(p.lookNome)}`)}" aria-describedby="arara-dica"></button>
            <span class="cabide-foco" aria-hidden="true"></span>
          </li>`).join('')}
      </ul>
      <div class="arara-pe secao-miolo">
        <p class="arara-n">(${pad(pecas.length)}) peças</p>
        <p class="arara-nome" data-arara-nome aria-hidden="true"></p>
        <p class="visualmente-oculto" id="arara-dica">${esc(t.dica)}</p>
      </div>
    </div>
    <dialog class="arara-modal" data-arara-modal aria-labelledby="arara-modal-nome" data-lenis-prevent>
      <div class="arara-modal-caixa">
        <div class="arara-modal-foto">
          <div class="arara-modal-giro" data-arara-giro>
            <img class="arara-modal-frente" alt="" />
            <img class="arara-modal-costas" alt="" />
          </div>
          <canvas class="arara-modal-3d" data-arara-modal-3d role="img"></canvas>
          <button class="arara-virar" type="button" data-arara-virar>${VIRAR}<span data-arara-virar-texto>${esc(t.frente)}</span></button>
        </div>
        <div class="arara-modal-info">
          <p class="arara-modal-look" data-arara-look></p>
          <h3 class="arara-modal-nome" id="arara-modal-nome" data-arara-modal-nome></h3>
          <p class="arara-modal-sub" data-arara-sub></p>
          <p class="arara-modal-preco" data-arara-preco></p>
          <div class="arara-modal-acoes">
            <button class="arara-adicionar" type="button" data-arara-adicionar>
              <span class="mais-icone">${MAIS}</span><span class="mais-feito">${CHECK}</span>
              <span data-arara-adicionar-texto>${esc(t.adicionar)}</span>
            </button>
            <button class="arara-ver" type="button" data-arara-ver>${esc(t.verNoLook)} ${SETA_CIMA}</button>
          </div>
        </div>
        <button class="arara-fechar icone-redondo" type="button" data-arara-fechar aria-label="${esc(t.fechar)}">${X}</button>
      </div>
    </dialog>`;
  embaralhar($('.secao-titulo', raiz));
  toque.addEventListener?.('change', () => { $('[data-arara-frase]', raiz).textContent = fraseDe(); });

  const palco = $('.arara-palco', raiz);
  const cano = $('.arara-cano', raiz);
  const itens = $$('.cabide', raiz);
  const botoes = $$('[data-cabide]', raiz);
  const nomeVisivel = $('[data-arara-nome]', raiz);
  const tela3d = $('[data-arara-3d]', raiz);
  const n = pecas.length;

  // 3D: pretendido desde o começo (as larguras no cano já saem da espessura das malhas); cada peça troca a foto
  // pela malha quando o modelo dela chega. Se o WebGL faltar ou cair, tudo volta para as fotos.
  let quer3d = new URLSearchParams(location.search).get('arara') !== '2d' && temWebGL();
  let cena = null; // criarPalco3d, quando o módulo chega
  let modulo3d = null;
  const em3d = pecas.map(() => false);

  // tamanho da peça na tela: altura fixa por aparelho, largura pela proporção do recorte
  let altura = 0;
  let larguraPalco = 0;
  let alturaPalco = 0;
  const medidas = pecas.map(() => ({ largura: 0, alturaPendulo: 0, fechada: undefined, aberta: undefined, minima: undefined, margemAberta: undefined, deLado: 0 }));
  const dimensionar = () => {
    altura = itens[0].offsetHeight || 400; // o cabide tem a altura da peça (--peca-altura)
    larguraPalco = palco.clientWidth;
    alturaPalco = palco.clientHeight;
    const pose = celular.matches ? POSE.celular : POSE.tela;
    const giro = pose.giro * Math.PI / 180;
    pecas.forEach((p, i) => {
      const md = medidas[i];
      md.largura = altura * (p.w / p.h);
      md.alturaPendulo = altura * 0.45;
      md.deLado = md.largura * (celular.matches ? 0.3 : 0.36); // largura à vista com a peça de lado (foto)
      md.fechada = md.aberta = md.minima = md.margemAberta = undefined;
      if (!quer3d || !p.caixa) return;
      // de lado, a peça ocupa no cano pelo menos a espessura dela (as malhas não se atravessam); empurrada por
      // outra, é até aí que ela cede
      const espessura = (p.caixa.z1 - p.caixa.z0) * altura * pose.achata;
      md.minima = espessura / Math.sin(giro) + 2;
      md.fechada = Math.max(md.largura * pose.deLado, md.minima + 2);
      if (celular.matches) {
        // o cano tem a largura da tela: a peça virada vem para a frente das vizinhas em vez de empurrá-las (só
        // pede um respiro, e a largura dela até a ponta do cano)
        md.aberta = md.fechada + altura * 0.07;
        md.margemAberta = md.largura * 0.56; // metade da peça, que cresce ~12 % ao vir para a frente
      } else md.aberta = md.largura * 1.06;
      md.deLado = md.fechada; // área de toque em repouso: a vaga da peça no cano
    });
    cena?.medir({
      largura: larguraPalco,
      altura: alturaPalco,
      alturaPeca: altura,
      canoY: cano.offsetTop + cano.offsetHeight / 2,
      canoRaio: cano.offsetHeight / 2,
      canoInicio: cano.offsetLeft,
      canoFim: cano.offsetLeft + cano.offsetWidth,
      giro: -giro,
      achata: pose.achata,
      saida: pose.saida,
    });
  };
  dimensionar();

  const fisica = criarArara({
    pecas: medidas,
    medir: () => {
      // pelo layout (offset*), não pelo retângulo: na entrada o cano está em scaleX(0)
      return { inicio: cano.offsetLeft + 8, fim: cano.offsetLeft + cano.offsetWidth - 8 };
    },
    // por quadro: só transform (o li e a área de toque) e, no 3D, a pose da malha; nenhuma leitura de layout
    desenhar: (i, { x, balanco, abertura }) => {
      const el = itens[i];
      const w = medidas[i].largura;
      el.style.transform = `translate3d(${(x - w * pecas[i].gancho).toFixed(2)}px, 0, 0)`;
      el.style.zIndex = abertura > 0.5 ? 3 : 1;
      // área de toque: centrada no gancho, da largura da peça à vista agora (de lado → de frente)
      const faixa = Math.max(44, medidas[i].deLado + (w - medidas[i].deLado) * abertura);
      botoes[i].style.transform = `translate3d(${(-w / 2).toFixed(2)}px, 0, 0) scaleX(${(faixa / w).toFixed(4)})`;
      el.style.setProperty('--toque', `${faixa.toFixed(1)}px`);
      if (em3d[i]) {
        cena.posar(i, { x, balanco, abertura });
      } else {
        el.style.setProperty('--balanco', `${balanco.toFixed(4)}rad`);
        el.style.setProperty('--giro', `${(GIRO_DE_LADO * (1 - abertura)).toFixed(2)}deg`);
        el.style.setProperty('--de-lado', (1 - abertura).toFixed(3));
      }
      if (cena && i === n - 1) cena.desenhar(); // fecha o quadro do 3D junto com o da física
    },
  });
  const configurar = () => fisica.configurar({ deLado: celular.matches ? 0.3 : 0.36, vao: celular.matches ? 2 : 6, semMovimento: menosMovimento.matches });
  configurar();
  fisica.posicionar();

  let entrou = false;
  palco.addEventListener('revelou', () => {
    entrou = true;
    if (menosMovimento.matches) return;
    fisica.entrar({ duracao: celular.matches ? 1200 : 1500 });
  }, { once: true });

  const remontar = () => {
    dimensionar();
    configurar();
    if (entrou) fisica.remedir(); else fisica.posicionar();
  };
  new ResizeObserver(() => {
    // no toque, a barra do navegador muda só a altura da janela: o palco não depende dela, mas por garantia uma
    // mudança pequena só de altura não refaz o canvas (regra 4 do /celular)
    const w = palco.clientWidth;
    const h = palco.clientHeight;
    if (toque.matches && w === larguraPalco && Math.abs(h - alturaPalco) < 120) return;
    remontar();
  }).observe(palco);

  // ---------- 3D ----------
  const voltarPara2d = erro => {
    if (!quer3d) return;
    console.warn('[arara] 3D indisponível, seguem as fotos:', erro?.message || erro);
    quer3d = false;
    em3d.fill(false);
    itens.forEach(el => el.classList.remove('is-3d'));
    palco.classList.remove('tem-3d');
    cena?.destruir();
    cena = null;
    vitrine?.destruir();
    vitrine = null;
    remontar();
  };
  if (quer3d) {
    // o Three e os modelos só descem quando a seção está a uma tela de distância
    new IntersectionObserver((entradas, io) => {
      if (!entradas.some(e => e.isIntersecting)) return;
      io.disconnect();
      import('../motion/arara-3d.js').then(m => {
        if (!quer3d) return;
        modulo3d = m;
        cena = m.criarPalco3d({
          canvas: tela3d,
          // o atlas do tamanho do aparelho; peça sem modelo (null) fica na foto
          pecas: pecas.map(p => (p.modelo ? { chave: p.chave, modelo: p.modelo, atlas: celular.matches ? p.atlas.celular : p.atlas.tela, corte: p.corte, caixa: p.caixa } : null)),
          celular: () => celular.matches,
          aoCarregar: i => {
            em3d[i] = true;
            itens[i].classList.add('is-3d');
            palco.classList.add('tem-3d');
            cena.posar(i, { x: fisica.x(i), balanco: 0, abertura: fisica.abertura(i) });
            cena.pedir();
          },
          // um modelo que não chega deixa só aquela peça na foto; sem contexto WebGL, voltam todas
          aoFalhar: (e, i) => (i == null ? voltarPara2d(e) : console.warn(`[arara] ${pecas[i].chave} sem 3D, fica a foto:`, e?.message || e)),
        });
        dimensionar();
        new IntersectionObserver(([e]) => cena?.naTela(e.isIntersecting), { rootMargin: '10% 0px' }).observe(palco);
      }).catch(voltarPara2d);
    }, { rootMargin: '100% 0px' }).observe(raiz);
  }

  // virar: só uma peça de frente de cada vez; o nome dela aparece embaixo do cano
  const virar = i => {
    fisica.abrir(i);
    nomeVisivel.textContent = i >= 0 ? `${pecas[i].nome} · ${reais(pecas[i].preco)}` : '';
    nomeVisivel.classList.toggle('is-visivel', i >= 0);
  };

  // tabindex móvel
  const focar = i => {
    botoes.forEach((b, j) => { b.tabIndex = j === i ? 0 : -1; });
    botoes[i].focus({ preventScroll: true });
  };

  // ponteiro: hover vira (só mouse); arrastar desliza; clique (sem arrasto) tira da arara
  let gesto = null;
  let viradaAntes = -1;
  let ultimoTipo = '';
  palco.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || gesto?.arrastando) return;
    const b = e.target.closest('[data-cabide]');
    if (b) virar(Number(b.dataset.cabide));
  });
  palco.addEventListener('pointerleave', e => {
    if (e.pointerType === 'mouse' && !gesto && !palco.contains(document.activeElement)) virar(-1);
  });
  palco.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-cabide]');
    if (!b || e.button > 0) return;
    const i = Number(b.dataset.cabide);
    const base = palco.getBoundingClientRect().left;
    ultimoTipo = e.pointerType;
    viradaAntes = fisica.aberta(); // o foco do toque vira a peça antes do click: o click decide pelo estado de antes
    gesto = { i, x0: e.clientX, y0: e.clientY, desvio: fisica.x(i) - (e.clientX - base), base, arrastando: false, id: e.pointerId, tipo: e.pointerType };
  });
  palco.addEventListener('pointermove', e => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const dx = e.clientX - gesto.x0;
    const dy = e.clientY - gesto.y0;
    if (!gesto.arrastando) {
      if (Math.abs(dx) < ARRASTO_MIN || Math.abs(dx) < Math.abs(dy)) return;
      gesto.arrastando = true;
      palco.setPointerCapture(e.pointerId);
      palco.classList.add('is-arrastando');
    }
    fisica.segurar(gesto.i, e.clientX - gesto.base + gesto.desvio);
  });
  const terminar = e => {
    if (!gesto || e.pointerId !== gesto.id) return;
    const g = gesto;
    gesto = null;
    palco.classList.remove('is-arrastando');
    if (g.arrastando) {
      fisica.soltar();
      g.clique = false;
      palco.dataset.semClique = '1'; // o click que vem logo depois do arrasto não abre o modal
      setTimeout(() => delete palco.dataset.semClique, 0);
    }
  };
  palco.addEventListener('pointerup', terminar);
  palco.addEventListener('pointercancel', e => { if (gesto?.arrastando) fisica.soltar(); terminar(e); });

  palco.addEventListener('click', e => {
    const b = e.target.closest('[data-cabide]');
    if (!b || palco.dataset.semClique) return;
    const i = Number(b.dataset.cabide);
    // toque: o primeiro toque vira a peça; o segundo, na mesma, tira da arara
    if (toque.matches && ultimoTipo === 'touch' && viradaAntes !== i) { viradaAntes = i; virar(i); focar(i); return; }
    abrirModal(i);
  });

  palco.addEventListener('focusin', e => {
    const b = e.target.closest('[data-cabide]');
    if (b) virar(Number(b.dataset.cabide));
  });
  palco.addEventListener('focusout', e => {
    if (!palco.contains(e.relatedTarget) && !modal.open) virar(-1);
  });
  palco.addEventListener('keydown', e => {
    const b = e.target.closest('[data-cabide]');
    if (!b) return;
    const i = Number(b.dataset.cabide);
    const ir = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: pecas.length - 1 }[e.key];
    if (ir == null) return;
    e.preventDefault();
    const j = Math.max(0, Math.min(pecas.length - 1, ir));
    if (j === i) { fisica.cutucar(i, (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'Home' ? -1 : 1) * 260); return; }
    focar(j);
  });

  // ---------- modal: a peça sai da arara, sobe e gira para as costas ----------
  const modal = $('[data-arara-modal]', raiz);
  const caixaFoto = $('.arara-modal-foto', modal);
  const giro = $('[data-arara-giro]', modal);
  const frente = $('.arara-modal-frente', modal);
  const costas = $('.arara-modal-costas', modal);
  const tela3dModal = $('[data-arara-modal-3d]', modal);
  const textoVirar = $('[data-arara-virar-texto]', modal);
  const adicionar = $('[data-arara-adicionar]', modal);
  const textoAdicionar = $('[data-arara-adicionar-texto]', modal);
  let vitrine = null; // criarVitrine3d: o renderer pequeno do modal, criado na primeira vez
  let modal3d = false; // o modal aberto agora está em 3D
  let deCostas = false;
  let atual = -1;
  let deVolta = null;
  let tempoCostas = 0;
  let tempoFeito = 0;

  const mostrarCostas = sim => {
    deCostas = sim;
    textoVirar.textContent = sim ? t.frente : t.costas;
    const p = pecas[atual];
    if (modal3d) {
      if (p) tela3dModal.setAttribute('aria-label', sim ? `${p.nome}, de costas.` : `${p.alt} De frente.`);
      return;
    }
    giro.classList.toggle('is-costas', sim);
    frente.setAttribute('aria-hidden', String(sim));
    costas.setAttribute('aria-hidden', String(!sim));
  };
  // no 3D o giro segue sempre no mesmo sentido: meia-volta a cada toque no botão
  const girar3d = sim => {
    const voltas = Math.round(vitrine.alvo() / Math.PI);
    const jaDeCostas = Math.abs(voltas) % 2 === 1;
    if (jaDeCostas !== sim) vitrine.girarPara((voltas + 1) * Math.PI);
    mostrarCostas(sim);
  };

  // onde a peça está no cano, na tela (centro e altura), para o voo até o modal
  const lugarNoCano = i => {
    const r = palco.getBoundingClientRect();
    return { x: r.left + fisica.x(i), y: r.top + cano.offsetTop + altura / 2, altura };
  };

  function abrirModal(i, so2d = false) {
    const p = pecas[i];
    atual = i;
    deVolta = botoes[i];
    $('[data-arara-look]', modal).textContent = t.doLook(p.lookNome);
    $('[data-arara-modal-nome]', modal).textContent = p.nome;
    $('[data-arara-sub]', modal).textContent = categorias.find(c => c.id === p.categoria)?.singular || '';
    $('[data-arara-preco]', modal).textContent = reais(p.preco);
    adicionar.classList.remove('is-feito');
    textoAdicionar.textContent = t.adicionar;

    // 3D se a malha desta peça já está no cano e o renderer do modal sobe; senão, as duas fotos
    modal3d = false;
    if (em3d[i] && cena && !so2d) {
      try {
        vitrine ??= modulo3d.criarVitrine3d({ canvas: tela3dModal, celular: () => celular.matches });
        modal3d = !vitrine.morto();
      } catch (e) {
        console.warn('[arara] modal sem 3D:', e?.message || e);
        vitrine = null;
      }
    }
    modal.classList.toggle('tem-3d', modal3d);
    if (!modal3d) {
      frente.src = p.frente;
      frente.alt = `${p.alt} De frente.`;
      costas.src = p.costas;
      costas.alt = `${p.nome}, de costas.`;
    }
    mostrarCostas(false);
    giro.classList.add('sem-transicao');
    void giro.offsetWidth;
    giro.classList.remove('sem-transicao');

    const origem = modal3d ? lugarNoCano(i) : itens[i].querySelector('.cabide-giro').getBoundingClientRect();
    const giro0 = modal3d ? cena.giro(i) : 0;
    // o cabide some do cano enquanto a peça está no modal
    itens[i].classList.add('is-fora');
    cena?.esconder(i, true);
    modal.showModal();
    pararRolagem(true);
    document.documentElement.classList.add('arara-aberta');
    $('[data-arara-fechar]', modal).focus({ preventScroll: true });
    clearTimeout(tempoCostas);

    if (modal3d) {
      vitrine.medir({ largura: caixaFoto.clientWidth, altura: caixaFoto.clientHeight });
      modal3d = vitrine.mostrar(cena.dados(i), { corte: p.corte, caixa: p.caixa }, { giro0: menosMovimento.matches ? Math.PI : giro0, semMovimento: menosMovimento.matches });
      if (!modal3d) { devolver(i); abrirModal(i, true); return; } // o renderer do modal caiu: abre com as fotos
      if (menosMovimento.matches) { mostrarCostas(true); return; }
      // do lugar no cano até o modal, subindo (o canvas inteiro voa, com a peça dentro); no caminho ela vira de
      // frente e, ao chegar, gira para as costas
      const q = vitrine.quadro();
      const r = tela3dModal.getBoundingClientRect();
      const dx = origem.x - (r.left + q.cx);
      const dy = origem.y - (r.top + q.cy);
      const k = origem.altura / q.altura;
      tela3dModal.style.transformOrigin = `${q.cx}px ${q.cy}px`;
      tela3dModal.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${k})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 40}px) scale(${(k + 1) / 2})`, offset: 0.45 },
        { transform: 'none' },
      ], { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      vitrine.girarPara(0);
      vitrine.balancar(dx > 0 ? -0.5 : 0.5);
      tempoCostas = setTimeout(() => girar3d(true), 560);
      return;
    }

    if (!menosMovimento.matches) {
      // FLIP: do lugar no cano até o modal, subindo; depois gira para as costas
      const destino = giro.getBoundingClientRect();
      const dx = origem.left + origem.width / 2 - (destino.left + destino.width / 2);
      const dy = origem.top + origem.height / 2 - (destino.top + destino.height / 2);
      const k = origem.height / destino.height;
      giro.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${k})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 40}px) scale(${(k + 1) / 2})`, offset: 0.45 },
        { transform: 'none' },
      ], { duration: 720, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      tempoCostas = setTimeout(() => mostrarCostas(true), 620);
    } else mostrarCostas(true);
  }

  // a peça volta para o cano
  const devolver = i => {
    modal.close();
    itens[i]?.classList.remove('is-fora');
    if (i >= 0) cena?.esconder(i, false);
    vitrine?.limpar();
    pararRolagem(false);
    document.documentElement.classList.remove('arara-aberta');
  };

  function fecharModal() {
    if (!modal.open) return;
    clearTimeout(tempoCostas);
    const i = atual;
    const sair = () => {
      devolver(i);
      deVolta?.focus({ preventScroll: true });
      if (i >= 0) { focar(i); virar(i); fisica.cutucar(i, 0.001); }
    };
    if (menosMovimento.matches) { sair(); return; }
    modal.classList.add('is-saindo');
    setTimeout(() => { modal.classList.remove('is-saindo'); sair(); }, 260);
  }

  // girar a peça no dedo (ou no mouse): arrasta para o lado, solta e ela para na face mais próxima
  let giroNoDedo = null;
  tela3dModal.addEventListener('pointerdown', e => {
    if (!modal3d || e.button > 0 || menosMovimento.matches) return;
    clearTimeout(tempoCostas);
    giroNoDedo = { id: e.pointerId, x: e.clientX, girou: false };
  });
  tela3dModal.addEventListener('pointermove', e => {
    if (!giroNoDedo || e.pointerId !== giroNoDedo.id) return;
    const dx = e.clientX - giroNoDedo.x;
    if (!giroNoDedo.girou) {
      if (Math.abs(dx) < ARRASTO_MIN) return;
      giroNoDedo.girou = true;
      tela3dModal.setPointerCapture(e.pointerId);
      tela3dModal.classList.add('is-girando');
      vitrine.segurar();
    }
    vitrine.mover((dx / Math.max(1, caixaFoto.clientWidth)) * Math.PI * 1.6);
    giroNoDedo.x = e.clientX;
  });
  const soltarGiro = e => {
    if (!giroNoDedo || e.pointerId !== giroNoDedo.id) return;
    const g = giroNoDedo;
    giroNoDedo = null;
    tela3dModal.classList.remove('is-girando');
    if (g.girou && vitrine) mostrarCostas(vitrine.soltar());
  };
  tela3dModal.addEventListener('pointerup', soltarGiro);
  tela3dModal.addEventListener('pointercancel', soltarGiro);

  modal.addEventListener('cancel', e => { e.preventDefault(); fecharModal(); });
  modal.addEventListener('click', e => {
    if (e.target === modal) { fecharModal(); return; } // clique fora da caixa
    if (e.target.closest('[data-arara-fechar]')) fecharModal();
    else if (e.target.closest('[data-arara-virar]')) {
      clearTimeout(tempoCostas);
      if (modal3d) girar3d(!deCostas); else mostrarCostas(!deCostas);
    } else if (e.target.closest('[data-arara-adicionar]')) {
      const [look, numero] = pecas[atual].chave.split('-');
      adicionarPeca(look, Number(numero));
      adicionar.classList.add('is-feito');
      textoAdicionar.textContent = t.adicionado;
      clearTimeout(tempoFeito);
      tempoFeito = setTimeout(() => { adicionar.classList.remove('is-feito'); textoAdicionar.textContent = t.adicionar; }, 1800);
    } else if (e.target.closest('[data-arara-ver]')) {
      const chave = pecas[atual].chave;
      clearTimeout(tempoCostas);
      devolver(atual);
      verNoLook(chave);
    }
  });
}

// sem criar contexto só para perguntar: se o WebGL existir mas não subir, o renderer acusa e a seção cai nas fotos
const temWebGL = () => !!(window.WebGL2RenderingContext || window.WebGLRenderingContext);
