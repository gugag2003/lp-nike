// "Fora do provador": foto de rua larga com pílulas de vidro presas às peças, legenda no canto e paginação 01 / 04
// (referencias/halden, "selos-no-produto"). A pílula põe a peça na mesma sacola do provador.
// No desktop a foto inteira (21:9) aparece na largura do conteúdo; no celular, um recorte 4:5 em volta do modelo, e as
// pílulas viram só o ponto: o primeiro toque abre o nome e o preço, o segundo põe na sacola; legenda e setas descem
// para baixo da foto (por cima dela, cobririam o ponto do calçado).
// Entrada: a foto abre de uma tira horizontal até a altura cheia; as pílulas entram uma a uma depois.
import { marca } from '../data/marca.js';
import { reais } from '../data/looks.js';
import { peca } from '../data/loja.js';
import { fotosDaRua } from '../data/rua.js';
import { $, $$, esc, pad, MAIS, CHECK, SETA_DIR, SETA_ESQ, celular, menosMovimento } from '../dom.js';
import { adicionarPeca } from '../estado.js';
import { embaralhar } from '../motion/letras.js';

const FEITO_MS = 1600;
const SAIDA_MS = 450;

// região da foto inteira que o arquivo mostrado cobre (fração da largura): o recorte do celular é 4:5 em volta do
// centro do modelo, com a mesma conta de fonte/loja/exporta.mjs
function regiao(foto) {
  if (!celular.matches) return { x0: 0, largura: 1 };
  const w = Math.round(foto.altura * 0.8);
  const left = Math.min(foto.largura - w, Math.max(0, Math.round(foto.largura * foto.centro - w / 2)));
  return { x0: left / foto.largura, largura: w / foto.largura };
}

const figuraHTML = (f, i) => `
  <figure class="rua-foto" data-foto="${i}">
    <picture>
      <source media="(max-width: 899px)" srcset="${f.retrato}" />
      <img src="${f.src}" srcset="${f.srcset}" sizes="(max-width: 899px) 100vw, min(100vw - 160px, 1280px)" alt="${esc(f.alt)}" width="${f.largura}" height="${f.altura}" decoding="async" ${i ? 'loading="lazy"' : ''} />
    </picture>
  </figure>`;

const pontoHTML = (ponto, i) => {
  const p = peca(ponto.peca);
  return `
    <button class="ponto" type="button" style="--i:${i}" data-ponto="${p.chave}" data-lado="${ponto.lado}" aria-label="${esc(`${marca.loja.vitrine.adicionar}: ${p.nome}, ${reais(p.preco)}`)}">
      <span class="ponto-mais"><span class="mais-icone">${MAIS}</span><span class="mais-feito">${CHECK}</span></span>
      <span class="ponto-texto"><span class="ponto-nome">${esc(p.nome)}</span><span class="ponto-preco" data-preco="${esc(reais(p.preco))}">${reais(p.preco)}</span></span>
    </button>`;
};

export function montarRua(raiz) {
  const t = marca.loja.rua;
  raiz.innerHTML = `
    <div class="secao-miolo">
      <header class="secao-cabeca" data-revela="0.6">
        <h2 class="secao-titulo" id="rua-titulo">${esc(t.titulo)}</h2>
        <p class="secao-frase">${esc(t.frase)}</p>
      </header>
      <div class="rua-quadro" data-revela="0.35">
        <div class="rua-janela">
          <div class="rua-fotos">${figuraHTML(fotosDaRua[0], 0)}</div>
          <div class="rua-pontos" data-pontos></div>
        </div>
        <div class="rua-pe">
          <p class="rua-legenda" data-legenda aria-live="polite">${esc(fotosDaRua[0].legenda)}</p>
          <div class="rua-paginas">
            <span class="rua-n" data-n>${pad(1)} / ${pad(fotosDaRua.length)}</span>
            <button class="rua-seta" type="button" data-rua-passo="-1" aria-label="${esc(t.anterior)}">${SETA_ESQ}</button>
            <button class="rua-seta" type="button" data-rua-passo="1" aria-label="${esc(t.proximo)}">${SETA_DIR}</button>
          </div>
        </div>
      </div>
    </div>`;
  raiz.setAttribute('aria-labelledby', 'rua-titulo');
  embaralhar($('.secao-titulo', raiz));

  const quadro = $('.rua-quadro', raiz);
  const janela = $('.rua-janela', raiz);
  const fotos = $('.rua-fotos', raiz);
  const camada = $('[data-pontos]', raiz);
  const legenda = $('[data-legenda]', raiz);
  const numero = $('[data-n]', raiz);
  let atual = 0;
  let vez = 0;

  // põe cada pílula no ponto da peça, pela conta do object-fit: cover; a pílula vira de lado se não cabe
  function posicionar() {
    const f = fotosDaRua[atual];
    const { width: W, height: H } = janela.getBoundingClientRect();
    if (!W || !H) return;
    const r = regiao(f);
    const iw = r.largura * f.largura;
    const ih = f.altura;
    const escala = Math.max(W / iw, H / ih);
    const ox = (W - iw * escala) / 2;
    const oy = (H - ih * escala) / 2;
    for (const [i, el] of $$('.ponto:not(.is-saindo)', camada).entries()) {
      const ponto = f.pontos[i];
      const x = ox + (ponto.x / 100 - r.x0) * f.largura * escala;
      const y = oy + (ponto.y / 100) * f.altura * escala;
      el.style.left = `${x.toFixed(1)}px`;
      el.style.top = `${y.toFixed(1)}px`;
      el.hidden = x < 6 || x > W - 6 || y < 6 || y > H - 6;
      // pílula aberta (desktop, ou tocada no celular): cabe do lado pedido? senão, do outro
      el.dataset.lado = ponto.lado;
      const largura = el.querySelector('.ponto-texto').scrollWidth + 40;
      if (ponto.lado === 'direita' && x + largura > W - 8) el.dataset.lado = 'esquerda';
      if (ponto.lado === 'esquerda' && x - largura < 8) el.dataset.lado = 'direita';
    }
  }

  function mostrarPontos({ entrar }) {
    const f = fotosDaRua[atual];
    for (const velho of $$('.ponto', camada)) {
      velho.classList.add('is-saindo');
      setTimeout(() => velho.remove(), SAIDA_MS);
    }
    const tmp = document.createElement('div');
    tmp.innerHTML = f.pontos.map(pontoHTML).join('');
    const novos = [...tmp.children];
    for (const el of novos) {
      if (entrar) el.classList.add('is-antes');
      camada.append(el);
    }
    posicionar();
    if (entrar) requestAnimationFrame(() => requestAnimationFrame(() => novos.forEach(el => el.classList.remove('is-antes'))));
  }

  function irPara(i) {
    const n = fotosDaRua.length;
    const alvo = ((i % n) + n) % n;
    if (alvo === atual) return;
    const minha = ++vez;
    let fig = $(`.rua-foto[data-foto="${alvo}"]`, fotos);
    if (!fig) {
      fotos.insertAdjacentHTML('beforeend', figuraHTML(fotosDaRua[alvo], alvo));
      fig = $(`.rua-foto[data-foto="${alvo}"]`, fotos);
    }
    const img = $('img', fig);
    img.loading = 'eager';
    const trocar = () => {
      if (minha !== vez) return;
      atual = alvo;
      for (const outra of $$('.rua-foto', fotos)) outra.classList.toggle('is-ativa', outra === fig);
      legenda.textContent = fotosDaRua[alvo].legenda;
      numero.textContent = `${pad(alvo + 1)} / ${pad(n)}`;
      mostrarPontos({ entrar: true });
    };
    (img.decode ? img.decode() : Promise.resolve()).then(trocar, trocar);
  }

  // primeira foto: ativa já; os pontos entram depois que a foto abriu
  $('.rua-foto', fotos).classList.add('is-ativa');
  mostrarPontos({ entrar: false });
  for (const el of $$('.ponto', camada)) el.classList.add('is-antes');
  quadro.addEventListener('revelou', () => {
    setTimeout(() => $$('.ponto', camada).forEach(el => el.classList.remove('is-antes')), menosMovimento.matches ? 0 : 950);
  });

  raiz.addEventListener('click', e => {
    const seta = e.target.closest('[data-rua-passo]');
    if (seta) { irPara(atual + Number(seta.dataset.ruaPasso)); return; }
    const ponto = e.target.closest('[data-ponto]');
    if (!ponto) return;
    // celular: o primeiro toque abre a pílula; com ela aberta, o toque põe na sacola
    if (celular.matches && !ponto.classList.contains('is-aberto')) {
      for (const outro of $$('.ponto', camada)) outro.classList.toggle('is-aberto', outro === ponto);
      posicionar();
      return;
    }
    const [look, n] = ponto.dataset.ponto.split('-');
    adicionarPeca(look, Number(n));
    ponto.classList.add('is-feito');
    const preco = $('.ponto-preco', ponto);
    preco.textContent = t.adicionado;
    clearTimeout(ponto._t);
    ponto._t = setTimeout(() => {
      ponto.classList.remove('is-feito');
      preco.textContent = preco.dataset.preco;
    }, FEITO_MS);
  });

  new ResizeObserver(posicionar).observe(janela);
  celular.addEventListener?.('change', () => {
    for (const el of $$('.ponto', camada)) el.classList.remove('is-aberto');
    posicionar();
  });
}
