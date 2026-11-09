// Trilho no pé do palco: seta, um segmento por look (o ativo com número e nome), play/pausa e seta.
import { marca } from '../data/marca.js';
import { looks } from '../data/looks.js';
import { $, $$, esc, pad, SETA_ESQ, SETA_DIR } from '../dom.js';
import { assinar, ler, mudar, andar, irPara } from '../estado.js';

const PAUSA = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3.5 2v8M8.5 2v8" stroke="currentColor" stroke-width="1.3"/></svg>';
const PLAY = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M3 1.8v8.4L10 6z" fill="currentColor"/></svg>';

export function montarTrilho(raiz) {
  raiz.innerHTML = `
    <button class="seta seta-ant" type="button" data-ant aria-label="${esc(marca.trilho.anterior)}">${SETA_ESQ}</button>
    <ol class="segmentos">
      ${looks.map((l, i) => `
        <li class="seg" data-seg="${i}">
          <button type="button" class="seg-botao" aria-label="Look ${pad(i + 1)}: ${esc(l.nome)}">
            <span class="seg-barra" aria-hidden="true"><span class="seg-cheio"></span></span>
            <span class="seg-rotulo" aria-hidden="true"><span class="seg-num">${pad(i + 1)}</span><span class="seg-nome">${esc(l.nome)}</span></span>
          </button>
        </li>`).join('')}
    </ol>
    <button class="tocar" type="button" data-tocar></button>
    <button class="seta seta-prox" type="button" data-prox aria-label="${esc(marca.trilho.proximo)}">${SETA_DIR}</button>`;

  // com o detalhe aberto o trilho está saindo (0,3 s de fade) e não responde: a fila não anda com o foco aberto
  const livre = () => !ler().foco;
  $('[data-ant]', raiz).addEventListener('click', () => livre() && andar(-1));
  $('[data-prox]', raiz).addEventListener('click', () => livre() && andar(1));
  raiz.addEventListener('click', e => {
    const seg = e.target.closest('[data-seg]');
    if (seg && livre()) irPara(Number(seg.dataset.seg));
  });
  const tocar = $('[data-tocar]', raiz);
  // o botão só troca o estado; o temporizador de 5 s por look é src/motion/autoplay.js
  tocar.addEventListener('click', e => livre() && mudar({ autoplay: !e.currentTarget.classList.contains('is-tocando') }));

  const segs = $$('[data-seg]', raiz);
  assinar((s, mudou) => {
    if (!mudou || mudou.has('centro')) {
      segs.forEach((seg, i) => {
        seg.classList.toggle('is-ativo', i === s.centro);
        seg.classList.toggle('is-visitado', i < s.centro);
        $('button', seg).setAttribute('aria-current', i === s.centro ? 'true' : 'false');
      });
    }
    if (!mudou || mudou.has('autoplay')) {
      tocar.classList.toggle('is-tocando', s.autoplay);
      tocar.innerHTML = s.autoplay ? PAUSA : PLAY;
      tocar.setAttribute('aria-label', s.autoplay ? marca.trilho.pausar : marca.trilho.tocar);
    }
  });
}
