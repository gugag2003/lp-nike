// A nav sobre a loja, como na referência: toma a cor da seção que passa embaixo dela. Sobre os blocos pretos
// (data-tema="escuro": manifesto e rodapé) ela fica preta, com o Swoosh e os links brancos, numa transição curta.
// Também ganha um fio embaixo quando a página rolou (no topo, o fio é a borda do provador).
export function ligarTemaNav(nav) {
  const escuras = [...document.querySelectorAll('[data-tema="escuro"]')];
  const sob = new Set();
  let io;
  const montar = () => {
    io?.disconnect();
    sob.clear();
    // a seção conta quando cobre a linha do meio da nav
    const linha = Math.round(nav.getBoundingClientRect().height / 2);
    io = new IntersectionObserver(entradas => {
      for (const e of entradas) e.isIntersecting ? sob.add(e.target) : sob.delete(e.target);
      nav.dataset.tema = sob.size ? 'escuro' : 'claro';
    }, { rootMargin: `-${linha}px 0px -${Math.max(0, innerHeight - linha - 1)}px 0px` });
    escuras.forEach(el => io.observe(el));
  };
  montar();
  let espera;
  addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(montar, 150); });

  const rolou = () => nav.classList.toggle('is-rolada', scrollY > 4);
  addEventListener('scroll', rolou, { passive: true });
  rolou();
}
