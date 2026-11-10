// Vitrine: título, frase, chips de filtro em pílula e quatro cards 4:5 por página, com setas (referencias/halden,
// "loja-grade": lá também são quatro numa linha; no celular, 2 × 2, e o arraste para o lado também vira a página).
// Cada card: número, "+" que põe a peça na mesma sacola do provador, nome, categoria e look, etiqueta de prazo e
// preço. A foto leva ao provador, com a peça aberta no corpo.
// Entrada: chips em fade, cards em cortina de cima para baixo, um depois do outro. Trocar filtro ou página refaz a
// cortina. Página em vez de fileira rolável: nenhum card fica fora da tela (tools/escala.mjs mede a largura).
import { marca } from '../data/marca.js';
import { reais } from '../data/looks.js';
import { categorias, pecasDa, contagem } from '../data/loja.js';
import { $, $$, esc, pad, MAIS, CHECK, SETA_DIR, SETA_ESQ, SETA_CIMA, menosMovimento } from '../dom.js';
import { assinar, mudar, adicionarPeca } from '../estado.js';
import { embaralhar } from '../motion/letras.js';

const FEITO_MS = 1600;
const POR_PAGINA = 4;
const SAIDA_MS = 160; // fade da página que sai
const ESPERA_FOTOS_MS = 420; // teto de espera pelas fotos da página nova

// foto decodificada antes de a cortina abrir: sem isto, a página nova abria no cinza e a foto pipocava depois
const decodificadas = new Map();
const decodificar = src => {
  if (!decodificadas.has(src)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    decodificadas.set(src, img.decode().catch(() => {}));
  }
  return decodificadas.get(src);
};
const espera = ms => new Promise(r => setTimeout(r, ms));

const cardHTML = (p, i) => {
  const t = marca.loja.vitrine;
  const cat = categorias.find(c => c.id === p.categoria);
  return `
    <li class="card" style="--i:${i}" data-peca="${p.chave}">
      <div class="card-foto">
        <button class="card-ver" type="button" data-ver="${p.chave}" aria-label="${esc(`${t.verNoLook}: ${p.nome}, ${t.doLook(p.lookNome)}`)}">
          <img src="${p.card}" alt="${esc(p.alt)}" width="720" height="900" decoding="async" loading="lazy" />
          <span class="card-ver-rotulo" aria-hidden="true">${esc(t.verNoLook)} ${SETA_CIMA}</span>
        </button>
        <span class="card-num" aria-hidden="true">(${pad(i + 1)})</span>
        <button class="card-mais" type="button" data-mais-loja="${p.chave}" aria-label="${esc(`${t.adicionar}: ${p.nome}`)}">
          <span class="mais-icone">${MAIS}</span><span class="mais-feito">${CHECK}</span>
        </button>
      </div>
      <div class="card-texto">
        <p class="card-nome">${esc(p.nome)}</p>
        <p class="card-sub">${esc(cat?.singular || '')} · ${esc(t.doLook(p.lookNome))}</p>
        <div class="card-pe">
          ${p.etiqueta ? `<span class="card-etiqueta${p.selo ? ' card-etiqueta--selo' : ''}">${esc(p.etiqueta)}</span>` : '<span></span>'}
          <span class="card-preco">${reais(p.preco)}</span>
        </div>
      </div>
    </li>`;
};

export function montarVitrine(raiz, { verNoLook }) {
  const t = marca.loja.vitrine;
  raiz.innerHTML = `
    <div class="secao-miolo">
      <header class="secao-cabeca" data-revela="0.6">
        <h2 class="secao-titulo" id="vitrine-titulo">${esc(t.titulo)}</h2>
        <p class="secao-frase">${esc(t.frase)}</p>
      </header>
      <div class="vit-barra" data-revela="0.5">
        <div class="vit-filtros" role="group" aria-label="${esc(t.filtros)}">
          ${categorias.map((c, i) => `
            <button class="chip" type="button" style="--i:${i}" data-filtro="${c.id}" aria-pressed="false">
              ${esc(c.rotulo)} <span class="chip-n">(${contagem(c.id)})</span>
            </button>`).join('')}
        </div>
        <div class="vit-setas">
          <p class="vit-faixa-n" data-faixa-n aria-live="polite"></p>
          <button class="seta-redonda" type="button" data-seta="-1" aria-label="${esc(t.anterior)}">${SETA_ESQ}</button>
          <button class="seta-redonda" type="button" data-seta="1" aria-label="${esc(t.proximo)}">${SETA_DIR}</button>
        </div>
      </div>
      <ul class="vit-trilho" data-trilho-vitrine data-revela="0.25" aria-labelledby="vitrine-titulo"></ul>
    </div>`;
  raiz.setAttribute('aria-labelledby', 'vitrine-titulo');
  embaralhar($('.secao-titulo', raiz));

  const trilho = $('[data-trilho-vitrine]', raiz);
  const chips = $$('[data-filtro]', raiz);
  const [antes, depois] = $$('[data-seta]', raiz);
  const faixaN = $('[data-faixa-n]', raiz);
  let atual = null;
  let pagina = 0;
  let troca = 0;

  function desenhar(id, { animar }) {
    const pecas = pecasDa(id);
    const paginas = Math.max(1, Math.ceil(pecas.length / POR_PAGINA));
    pagina = Math.min(Math.max(0, pagina), paginas - 1);
    const de = pagina * POR_PAGINA;
    const vez = ++troca;
    const fatia = pecas.slice(de, de + POR_PAGINA);
    const preencher = () => {
      if (vez !== troca) return;
      trilho.innerHTML = fatia.map((p, k) => cardHTML(p, de + k)).join('');
      // o número do card segue a lista inteira; a cortina recomeça do primeiro da página
      $$('.card', trilho).forEach((li, k) => li.style.setProperty('--i', k));
      antes.disabled = pagina === 0;
      depois.disabled = pagina >= paginas - 1;
      faixaN.textContent = `${de + 1}–${Math.min(de + POR_PAGINA, pecas.length)} de ${pecas.length}`;
      if (animar) {
        trilho.classList.remove('is-trocando');
        // .is-troca: a cortina curta das trocas (a longa é só a da primeira entrada, na rolagem)
        trilho.classList.add('is-entrando', 'is-troca');
        // a cortina roda de novo: o .is-entrando volta a esconder, e o quadro seguinte abre
        requestAnimationFrame(() => requestAnimationFrame(() => trilho.classList.remove('is-entrando')));
      }
      // a página seguinte já fica decodificada, para a seta responder na hora
      const proxima = pecas.slice(de + POR_PAGINA, de + 2 * POR_PAGINA);
      if (proxima.length) (window.requestIdleCallback || setTimeout)(() => proxima.forEach(p => decodificar(p.card)));
    };
    if (animar && !menosMovimento.matches && trilho.children.length) {
      // a página antiga sai em fade enquanto as fotos da nova decodificam; a nova só entra com as duas coisas prontas
      trilho.classList.add('is-trocando');
      const fotos = Promise.race([Promise.all(fatia.map(p => decodificar(p.card))), espera(ESPERA_FOTOS_MS)]);
      Promise.all([espera(SAIDA_MS), fotos]).then(preencher);
    } else preencher();
  }

  assinar((s, mudou) => {
    if (mudou && !mudou.has('categoria')) return;
    for (const c of chips) c.setAttribute('aria-pressed', String(c.dataset.filtro === s.categoria));
    if (s.categoria === atual) return;
    atual = s.categoria;
    pagina = 0;
    desenhar(s.categoria, { animar: Boolean(mudou) && trilho.classList.contains('is-visivel') });
  });

  const virar = d => {
    pagina += d;
    desenhar(atual, { animar: true });
  };
  // celular: arrastar a página para o lado também vira (o vertical continua sendo a rolagem da página)
  let inicio = null;
  trilho.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') inicio = { x: e.clientX, y: e.clientY }; });
  trilho.addEventListener('pointerup', e => {
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    inicio = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    const d = dx < 0 ? 1 : -1;
    if ((d > 0 && !depois.disabled) || (d < 0 && !antes.disabled)) virar(d);
  });
  trilho.addEventListener('pointercancel', () => { inicio = null; });

  raiz.addEventListener('click', e => {
    const chip = e.target.closest('[data-filtro]');
    if (chip) {
      mudar({ categoria: chip.dataset.filtro });
      return;
    }
    const seta = e.target.closest('[data-seta]');
    if (seta) {
      if (!seta.disabled) virar(Number(seta.dataset.seta));
      return;
    }
    const mais = e.target.closest('[data-mais-loja]');
    if (mais) {
      const [look, n] = mais.dataset.maisLoja.split('-');
      adicionarPeca(look, Number(n));
      mais.classList.add('is-feito');
      mais.setAttribute('aria-label', `${t.adicionado}: ${mais.closest('.card').querySelector('.card-nome').textContent}`);
      clearTimeout(mais._t);
      mais._t = setTimeout(() => {
        mais.classList.remove('is-feito');
        mais.setAttribute('aria-label', `${t.adicionar}: ${mais.closest('.card').querySelector('.card-nome').textContent}`);
      }, FEITO_MS);
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) verNoLook(ver.dataset.ver);
  });
}
