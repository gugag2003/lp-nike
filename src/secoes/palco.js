// Palco: título e frase, a fila de 9 vagas, o cabeçalho e a legenda do foco, e os pinos do modelo do centro.
// Quem posiciona as figuras e escolhe o look de cada uma é o laço da fila (src/motion/fila.js); aqui fica o HTML,
// os cliques e a ligação com o estado.
import { marca } from '../data/marca.js';
import { looks } from '../data/looks.js';
import { $, $$, esc, pad, toque, celular, menosMovimento, X } from '../dom.js';
import { assinar, ler, mudar, total, andar, abrirFoco, fecharFoco, ativarPino } from '../estado.js';
import { VAGAS_N } from '../motion/anel.js';
import { criarFila } from '../motion/fila.js';
import { ligarArrasto } from '../motion/arrasto.js';

// três versões do recorte por figura: nítida, desfoque 1 e desfoque 2 (o laço mistura as duas da vez)
const figuraHTML = () => `
  <figure class="fig" aria-hidden="true">
    <span class="sombra"></span>
    <div class="fig-caixa">
      <img class="fig-img" alt="" decoding="async" draggable="false" />
      <img class="fig-img" alt="" decoding="async" draggable="false" />
      <img class="fig-img" alt="" decoding="async" draggable="false" />
    </div>
    <span class="fig-alvo"></span>
  </figure>`;

// a camada do centro: pinos e o botão de abrir; fica sempre na vaga 0, acima das figuras
const sobreHTML = () => `
  <div class="fig fig-sobre" data-sobre>
    <div class="fig-caixa"><div class="pinos" data-pinos></div></div>
    <button class="fig-alvo" type="button" data-abrir></button>
  </div>`;

const pinoHTML = p => `
  <button class="pino" type="button" data-pino="${p.n}" data-lado="${p.pino.x > 50 ? 'esq' : 'dir'}" style="--px:${p.pino.x}%;--py:${p.pino.y}%;--i:${p.n - 1}"
    aria-label="Peça ${p.n}: ${esc(p.nome)}">
    <span class="pino-halo" aria-hidden="true"></span>
    <span class="pino-disco" aria-hidden="true">${p.n}</span>
    <span class="pino-etiqueta" aria-hidden="true">${esc(p.nome)}</span>
  </button>`;

export function montarPalco(raiz) {
  const textos = $('[data-textos]', raiz);
  const cabeca = $('[data-foco-cabeca]', raiz);
  const filaEl = $('[data-fila]', raiz);
  const legenda = $('[data-foco-legenda]', raiz);

  textos.innerHTML = `
    <h1 class="titulo">${esc(marca.titulo)}</h1>
    <p class="apoio" data-apoio></p>`;
  const apoio = $('[data-apoio]', textos);
  const frase = () => (apoio.textContent = toque.matches ? marca.apoio.toque : marca.apoio.mouse);
  frase();
  toque.addEventListener('change', frase);

  cabeca.innerHTML = `
    <p class="foco-sobre" data-foco-sobre></p>
    <h2 class="foco-nome" data-foco-nome></h2>
    <button class="foco-fechar" type="button" data-fechar aria-label="${esc(marca.foco.fechar)}">${X}</button>`;
  legenda.textContent = marca.foco.legenda;

  filaEl.innerHTML = Array.from({ length: VAGAS_N * 2 + 1 }, figuraHTML).join('') + sobreHTML();
  const figuras = $$('.fig:not([data-sobre])', filaEl);
  const sobre = $('[data-sobre]', filaEl);
  const pinos = $('[data-pinos]', sobre);
  const alvo = $('[data-abrir]', sobre);

  const fila = criarFila({ palco: raiz, figuras, sobre, looks, celular, menosMovimento });

  function preencher(centro) {
    const l = looks[centro];
    pinos.innerHTML = l.pecas.map(pinoHTML).join('');
    for (const p of $$('[data-pino]', pinos)) p.tabIndex = emFoco ? 0 : -1;
    alvo.setAttribute('aria-label', `Abrir o look ${l.nome}: ${l.alt}`);
    $('[data-foco-sobre]', cabeca).textContent = marca.foco.sobretitulo(pad(centro + 1), pad(total));
    $('[data-foco-nome]', cabeca).textContent = l.nome;
  }

  // arrasto no palco, fora dos botões e do foco
  ligarArrasto({
    alvo: raiz,
    fila,
    ignorar: e => ler().foco || !!e.target.closest('button:not([data-abrir]), a, .trilho, .foco-cabeca'),
    aoComecar: () => mudar({ autoplay: false }),
    aoSoltar: passo => {
      fila.soltar();
      if (passo) andar(passo);
    },
  });

  // cliques: centro abre o foco, vizinho anda a fila até ele
  filaEl.addEventListener('click', e => {
    const pino = e.target.closest('[data-pino]');
    if (pino) {
      ativarPino(Number(pino.dataset.pino));
      if (celular.matches) mudar({ folha: true }); // no celular, o toque no pino sobe a folha
      return;
    }
    if (ler().foco) return;
    if (e.target.closest('[data-abrir]')) { abrirFoco(); return; }
    const f = e.target.closest('.fig.is-alcance');
    if (!f) return;
    const k = fila.vagaDe(f);
    if (k === 0) abrirFoco();
    else if (k) andar(k);
  });
  // o pino ativa por hover e por foco de teclado, e o estado persiste
  filaEl.addEventListener('pointerover', e => {
    const pino = e.target.closest('[data-pino]');
    if (pino && e.pointerType === 'mouse') ativarPino(Number(pino.dataset.pino));
  });
  filaEl.addEventListener('focusin', e => {
    const pino = e.target.closest('[data-pino]');
    if (pino) ativarPino(Number(pino.dataset.pino));
  });
  // o botão redondo do canto é o X: fecha o foco e devolve a fila ao estado em que estava (Esc faz o mesmo, em main.js)
  const fechar = $('[data-fechar]', cabeca);
  fechar.addEventListener('click', () => fecharFoco());

  // O foco visto na tela (classe, pinos, cabeçalho e o modelo crescido) segue o estado, mas só abre com a fila parada,
  // como no vídeo. Trocar de look com o foco aberto fecha, anda e reabre no look novo (links Moletom, Jeans e Tênis), e o
  // cabeçalho e os pinos só passam para o look novo na hora de abrir: nada dele aparece por cima dos que passam.
  let emFoco = false;
  let esperando = false;
  function desenharFoco(aberto) {
    const ativo = document.activeElement;
    const dentro = cabeca.contains(ativo) || pinos.contains(ativo);
    raiz.classList.toggle('is-foco', aberto);
    alvo.tabIndex = aberto ? -1 : 0;
    for (const p of $$('[data-pino]', pinos)) p.tabIndex = aberto ? 0 : -1;
    // o foco de teclado acompanha (depois da classe, que deixa o X visível): abrir leva ao X, e o Tab segue para
    // os pinos; fechar devolve ao modelo do centro, se o foco de teclado estava dentro do detalhe
    if (aberto && (ativo === alvo || ativo === document.body || !ativo)) fechar.focus({ preventScroll: true });
    if (!aberto && dentro) alvo.focus({ preventScroll: true });
  }
  function marcarPinos(s) {
    for (const p of $$('[data-pino]', pinos)) {
      const ativo = Number(p.dataset.pino) === s.pino;
      p.classList.toggle('is-ativo', ativo);
      p.setAttribute('aria-pressed', ativo);
    }
  }
  function abrirVisual() {
    if (emFoco) return;
    emFoco = true;
    preencher(ler().centro);
    marcarPinos(ler());
    desenharFoco(true);
    fila.abrirFoco();
  }
  function fecharVisual() {
    if (!emFoco) return;
    emFoco = false;
    desenharFoco(false);
    fila.fecharFoco();
  }
  // abre quando a fila assentar, se o estado ainda pedir o foco; fecha na hora
  function sincronizar() {
    if (!ler().foco) { fecharVisual(); return; }
    if (emFoco || esperando) return;
    esperando = true;
    fila.aoParar(() => {
      esperando = false;
      if (ler().foco) abrirVisual();
    });
  }

  assinar((s, mudou) => {
    if (!mudou) {
      preencher(s.centro);
      desenharFoco(false);
      marcarPinos(s);
      return;
    }
    let fechouAgora = false;
    if (mudou.has('centro') && s.passo) {
      fechouAgora = emFoco;
      fecharVisual(); // a fila só sai do lugar quando o foco quase fechou (fila.js)
      fila.irPara(s.passo);
    }
    // com o foco fechado, cabeçalho e pinos já acompanham o look do centro (estão invisíveis); se ele acabou de
    // fechar, o look antigo fica no cabeçalho até o fade de saída (0,19 s) terminar
    if (mudou.has('centro') && !emFoco) {
      if (fechouAgora) setTimeout(() => { if (!emFoco) preencher(ler().centro); }, 220);
      else preencher(s.centro);
    }
    if (mudou.has('foco') || mudou.has('centro')) sincronizar();
    if (mudou.has('pino') || mudou.has('centro') || mudou.has('foco')) marcarPinos(s);
  });

  return fila;
}
