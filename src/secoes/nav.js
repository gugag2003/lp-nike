// Nav: logo, quatro links (todos estados desta mesma tela) e a sacola com contador.
// Desde a loja (2026-11-09) a nav fica fixa sobre a página inteira: os links, o logo e a sacola continuam agindo no
// provador, então, com a página rolada, ela volta ao topo antes.
import { marca } from '../data/marca.js';
import { looks } from '../data/looks.js';
import { $, esc, menosMovimento } from '../dom.js';
import { assinar, ler, mudar, irPara, abrirFoco, fecharFoco, pecasNaSacola, lookAtual } from '../estado.js';

const SACOLA = '<svg class="sacola-svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8.25 8.25V6a3.75 3.75 0 1 1 7.5 0v2.25M3.75 8.25h16.5v12H3.75z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

// próximo look (a partir do seguinte ao centro) que tem uma peça do tipo; devolve [índice, número do pino]
function proximoCom(tipo) {
  const { centro } = ler();
  for (let d = 1; d <= looks.length; d++) {
    const i = (centro + d) % looks.length;
    const p = looks[i].pecas.find(p => p.tipo === tipo);
    if (p) return [i, p.n];
  }
  return [centro, 1];
}

const acoes = {
  looks: () => mudar({ foco: false, pino: null, painel: 'look', folha: false }),
  moletom: () => { const [i, n] = proximoCom('moletom'); irPara(i); mudar({ painel: 'look' }); abrirFoco(n); },
  jeans: () => { const [i, n] = proximoCom('jeans'); irPara(i); mudar({ painel: 'look' }); abrirFoco(n); },
  // o look atual, se ele está de tênis; de bota, o próximo que está de tênis
  tenis: () => {
    const p = lookAtual().pecas.find(p => p.tipo === 'tenis');
    if (p) { mudar({ painel: 'look' }); abrirFoco(p.n); return; }
    const [i, n] = proximoCom('tenis'); irPara(i); mudar({ painel: 'look' }); abrirFoco(n);
  },
};

// volta ao provador (topo da página) se a página está rolada
export const subirAoProvador = () => {
  if (scrollY > 2) scrollTo({ top: 0, behavior: menosMovimento.matches ? 'auto' : 'smooth' });
};

export function montarNav(raiz) {
  raiz.innerHTML = `
    <a class="logo" href="#" data-logo aria-label="${esc(marca.nome)}, voltar ao primeiro look">
      <svg class="logo-svg" viewBox="${marca.logo.viewBox}" role="img" aria-label="${esc(marca.nome)}"><path d="${marca.logo.d}" fill="currentColor"/></svg>
    </a>
    <nav class="nav-links" aria-label="Looks e peças">
      ${marca.nav.map(l => `<a href="#${l.acao}" data-acao="${l.acao}">${esc(l.rotulo)}</a>`).join('')}
    </nav>
    <button class="nav-sacola" type="button" data-sacola aria-label="Abrir a sacola">
      ${SACOLA}<span class="nav-contador" data-contador>0</span>
    </button>`;

  raiz.addEventListener('click', e => {
    const link = e.target.closest('[data-acao]');
    if (link) { e.preventDefault(); subirAoProvador(); acoes[link.dataset.acao](); return; }
    if (e.target.closest('[data-logo]')) {
      e.preventDefault();
      subirAoProvador();
      fecharFoco();
      irPara(0); // pelo caminho mais curto do anel; conta como interação e pausa o autoplay
      mudar({ painel: 'look', autoplay: false });
      return;
    }
    if (e.target.closest('[data-sacola]')) {
      subirAoProvador();
      const aberta = ler().painel === 'sacola';
      mudar({ painel: aberta ? 'look' : 'sacola', folha: !aberta });
    }
  });

  const contador = $('[data-contador]', raiz);
  const botao = $('[data-sacola]', raiz);
  let antes = 0;
  assinar((s, mudou) => {
    if (mudou && !mudou.has('sacola') && !mudou.has('painel')) return;
    const n = pecasNaSacola();
    contador.textContent = n;
    // peça nova na sacola: a sacola da nav dá um pulo (é o retorno do + da loja, longe do painel)
    if (n > antes && mudou && !menosMovimento.matches) {
      botao.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(0.34, 1.4, 0.64, 1)' });
    }
    antes = n;
    botao.setAttribute('aria-label', `${s.painel === 'sacola' ? 'Fechar' : 'Abrir'} a sacola, ${n} ${n === 1 ? 'peça' : 'peças'}`);
    botao.setAttribute('aria-expanded', s.painel === 'sacola');
  });
}
