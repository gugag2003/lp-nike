// Entradas da loja: cada elemento com data-revela ganha .is-visivel uma vez, quando entra na tela, e dispara o evento
// "revelou" (as seções que montam a entrada por JS escutam esse evento). O valor de data-revela é a fração do
// elemento que precisa estar à vista (padrão 0,25). Com movimento reduzido, tudo já nasce visível.
import { menosMovimento } from '../dom.js';

export function revelar(raiz = document) {
  const els = [...raiz.querySelectorAll('[data-revela]')];
  const marcar = el => {
    el.classList.add('is-visivel');
    el.dispatchEvent(new CustomEvent('revelou'));
  };
  if (menosMovimento.matches || !('IntersectionObserver' in window)) {
    els.forEach(marcar);
    return;
  }
  const porLimiar = new Map();
  for (const el of els) {
    const limiar = Number(el.dataset.revela) || 0.25;
    if (!porLimiar.has(limiar)) {
      porLimiar.set(limiar, new IntersectionObserver((entradas, io) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          marcar(e.target);
        }
      }, { threshold: limiar, rootMargin: '0px 0px -6% 0px' }));
    }
    porLimiar.get(limiar).observe(el);
  }
}
