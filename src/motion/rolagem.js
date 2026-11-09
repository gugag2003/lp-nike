// Efeitos presos à rolagem (o manifesto que acende): um laço só, que roda num quadro depois de cada evento de
// scroll e só para os elementos perto da tela. fn recebe o progresso de 0 a 1 entre dois pontos:
//   inicio/fim: funções (alturaDaTela) -> posição do topo do elemento em px, contada do topo da tela.
//   p = 0 quando o topo do elemento está em inicio(vh); p = 1 quando está em fim(vh).
const itens = new Set();
let pedido = 0;

function quadro() {
  pedido = 0;
  const vh = innerHeight;
  for (const it of itens) {
    if (!it.perto) continue;
    const topo = it.el.getBoundingClientRect().top;
    const a = it.inicio(vh);
    const b = it.fim(vh);
    const p = Math.min(1, Math.max(0, (a - topo) / (a - b)));
    if (p !== it.p) {
      it.p = p;
      it.fn(p);
    }
  }
}
const pedir = () => { if (!pedido) pedido = requestAnimationFrame(quadro); };
addEventListener('scroll', pedir, { passive: true });
addEventListener('resize', pedir);

export function acompanhar(el, fn, { inicio, fim }) {
  const it = { el, fn, inicio, fim, p: -1, perto: false };
  itens.add(it);
  // só calcula quando o elemento está a menos de uma tela de distância
  new IntersectionObserver(([e]) => {
    it.perto = e.isIntersecting;
    if (it.perto) pedir();
  }, { rootMargin: '100% 0px 100% 0px' }).observe(el);
  pedir();
  return () => itens.delete(it);
}
