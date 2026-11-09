// Manifesto: bloco preto de borda a borda, preso à tela enquanto o texto acende letra a letra com a rolagem
// (referencias/halden, "manifesto"). Abre com o Swoosh no lugar do nome da marca, tem um trecho sublinhado e três
// recortes (bola de várzea, bola de basquete, Air Force 1) no meio da frase. As letras ainda apagadas são
// transparentes, como na referência; a borda que acende tem ~9 letras de degradê.
import { marca } from '../data/marca.js';
import { esc, menosMovimento } from '../dom.js';
import { letrasEm } from '../motion/letras.js';
import { acompanhar } from '../motion/rolagem.js';

const BORDA = 9; // largura da borda suave, em letras
const imgSrc = id => `${import.meta.env.BASE_URL}loja/manifesto/${id}.webp`;

export function montarManifesto(raiz) {
  const pedacos = marca.loja.manifesto;
  // texto inteiro para leitor de tela (o Swoosh é a marca); as letras e os recortes ficam aria-hidden
  const lido = pedacos.map(t => (typeof t === 'string' ? t : t.sublinhado ?? (t.swoosh ? marca.nome : ''))).join('').replace(/\s+/g, ' ').trim();
  raiz.innerHTML = `
    <div class="manifesto-palco">
      <p class="manifesto-texto"><span class="visualmente-oculto">${esc(lido)}</span><span class="manifesto-letras" aria-hidden="true" data-letras></span></p>
    </div>`;
  const caixa = raiz.querySelector('[data-letras]');

  // itens na ordem de leitura: letras (acendem pela cor) e objetos (Swoosh e recortes, acendem pela opacidade)
  const itens = [];
  for (const t of pedacos) {
    if (typeof t === 'string') {
      for (const el of letrasEm(caixa, t)) itens.push({ el, letra: true, a: 0 });
    } else if (t.sublinhado) {
      for (const el of letrasEm(caixa, t.sublinhado, { classe: 'sub' })) itens.push({ el, letra: true, a: 0 });
    } else {
      const obj = document.createElement('span');
      obj.className = t.swoosh ? 'm-obj m-swoosh' : `m-obj m-img m-img--${t.img}`;
      obj.innerHTML = t.swoosh
        ? `<svg viewBox="${marca.logo.viewBox}" aria-hidden="true"><path d="${marca.logo.d}" fill="currentColor"/></svg>`
        : `<img src="${imgSrc(t.img)}" alt="" decoding="async" loading="lazy" />`;
      caixa.append(obj);
      itens.push({ el: obj, letra: false, a: 0 });
    }
  }

  const N = itens.length;
  let cabeca = 0;
  const aplicar = p => {
    const h = p * (N + BORDA);
    // só mexe no trecho entre a cabeça antiga e a nova (mais a borda)
    const de = Math.max(0, Math.floor(Math.min(cabeca, h) - BORDA - 1));
    const ate = Math.min(N - 1, Math.ceil(Math.max(cabeca, h)));
    for (let i = de; i <= ate; i++) {
      const it = itens[i];
      const a = Math.min(1, Math.max(0, (h - i) / BORDA));
      if (a === it.a) continue;
      it.a = a;
      if (it.letra) it.el.style.color = a >= 1 ? 'var(--escuro-texto)' : `rgb(255 255 255 / ${a.toFixed(3)})`;
      else {
        it.el.style.opacity = a.toFixed(3);
        it.el.style.transform = `translateY(${((1 - a) * 0.18).toFixed(3)}em) scale(${(0.7 + 0.3 * a).toFixed(3)}) rotate(${((1 - a) * -10).toFixed(2)}deg)`;
      }
    }
    cabeca = h;
  };

  if (menosMovimento.matches) {
    aplicar(1);
    return;
  }
  // começa quando a primeira linha já está à vista e termina com o bloco preso, antes de ele soltar
  acompanhar(raiz, aplicar, { inicio: vh => vh * 0.55, fim: vh => vh * -0.45 });
}
