import '@fontsource-variable/inter/wght.css';
import '@fontsource/anton/latin-400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/nav.css';
import './styles/palco.css';
import './styles/trilho.css';
import './styles/painel.css';
import './styles/cursor.css';
import './styles/loja.css';
import './styles/manifesto.css';
import './styles/arara.css';
import './styles/categorias.css';
import './styles/vitrine.css';
import './styles/rua.css';
import './styles/rodape.css';

import { $, $$, menosMovimento } from './dom.js';
import { marca } from './data/marca.js';
import { looks } from './data/looks.js';
import { peca } from './data/loja.js';
import { ler, mudar, andar, irPara, abrirFoco, fecharFoco, assinar } from './estado.js';
import { montarNav, subirAoProvador } from './secoes/nav.js';
import { montarPalco } from './secoes/palco.js';
import { montarTrilho } from './secoes/trilho.js';
import { montarPainel } from './secoes/painel.js';
import { montarManifesto } from './secoes/manifesto.js';
import { montarArara } from './secoes/arara.js';
import { montarCategorias } from './secoes/categorias.js';
import { montarVitrine } from './secoes/vitrine.js';
import { montarRua } from './secoes/rua.js';
import { montarRodape } from './secoes/rodape.js';
import { ligarCamera } from './motion/camera.js';
import { rodarIntro } from './motion/intro.js';
import { ligarAutoplay } from './motion/autoplay.js';
import { ligarCursor } from './motion/cursor.js';
import { revelar } from './motion/revela.js';
import { ligarTemaNav } from './motion/tema-nav.js';
import { ligarLenis, rolarPara } from './motion/lenis.js';

// movimento reduzido: sem autoplay desde o começo
if (menosMovimento.matches) mudar({ autoplay: false });
// a página abre sempre no provador (a intro cobre a primeira tela)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// rolagem suave (Lenis): parada até a intro sair, para a roda não rolar a página escondida atrás dela
const lenis = ligarLenis();
lenis?.stop();

const nav = $('[data-nav]');
montarNav(nav);
const tela = $('[data-cena].tela');
const palco = $('[data-palco]');
const fila = montarPalco(palco);
montarTrilho($('[data-trilho]'));
ligarCamera(palco); // a câmera envolve a fila
montarPainel($('[data-painel]'));

// o temporizador só começa quando a tela aparece (entrada, abaixo), não no carregamento
const autoplay = ligarAutoplay({ trilho: $('[data-trilho]'), assinar, avancar: () => andar(1, { pausar: false }) });

const cursor = ligarCursor({ palco, rotulos: marca.cursor, estaEmFoco: () => ler().foco });
assinar((s, mudou) => { if (mudou && (mudou.has('foco') || mudou.has('centro'))) requestAnimationFrame(cursor.reavaliar); });

// a loja, abaixo do provador. "Ver no look" (foto do card da vitrine) volta ao provador com a peça aberta no corpo.
const verNoLook = chave => {
  const p = peca(chave);
  subirAoProvador();
  if (ler().foco && ler().centro !== p.indice) fecharFoco();
  irPara(p.indice);
  mudar({ painel: 'look', autoplay: false });
  abrirFoco(p.n);
};
montarManifesto($('[data-manifesto]'));
montarArara($('[data-arara]'), { verNoLook });
montarCategorias($('[data-categorias]'), {
  aoEscolher: () => rolarPara($('[data-vitrine]')),
});
montarVitrine($('[data-vitrine]'), { verNoLook });
montarRua($('[data-rua]'));
montarRodape($('[data-rodape]'));
ligarTemaNav(nav);

// "Ir para a loja" (primeiro Tab da página): desce até a vitrine e deixa o foco no primeiro filtro. Sem mudar o
// endereço: com #vitrine na URL, um recarregar abriria a página no meio, atrás da intro.
$('.pular').addEventListener('click', e => {
  e.preventDefault();
  const vitrine = $('[data-vitrine]');
  rolarPara(vitrine);
  $('[data-filtro]', vitrine)?.focus({ preventScroll: true });
});

// provador na tela? Fora dela (a página rolou para a loja), o autoplay congela, as setas e o Enter não mexem na
// fila escondida e, no celular, a linha de links da nav recolhe.
let provadorNaTela = true;
new IntersectionObserver(([e]) => {
  provadorNaTela = e.intersectionRatio > 0.35;
  autoplay.suspender(!e.isIntersecting || e.intersectionRatio < 0.15);
  nav.classList.toggle('is-loja', !provadorNaTela);
}, { threshold: [0, 0.15, 0.35, 0.6] }).observe(tela);

// qualquer clique ou toque no provador pausa o autoplay (o play é o único que religa; trocar o cenário também não
// pausa, porque não mexe na fila); passar o mouse não pausa. Clique na loja não conta.
addEventListener('pointerdown', e => {
  if (!e.target.closest?.('.tela, .nav')) return;
  if (ler().autoplay && !e.target.closest('[data-tocar]')) mudar({ autoplay: false });
}, { capture: true });

// foco de teclado no painel (Tab até um + ou o botão) também pausa: senão, a cada 5 s, o + em que a pessoa parou
// passaria a ser de outra peça
addEventListener('focusin', e => {
  if (ler().autoplay && e.target.closest?.('[data-painel]') && e.target.matches?.(':focus-visible')) mudar({ autoplay: false });
});

// teclado: setas trocam de look, Enter abre o foco, Esc fecha (foco, sacola ou folha). Com o provador fora da tela,
// setas e Enter ficam para a página (rolar, botões da loja).
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const s = ler();
  const emControle = e.target.closest?.('button, a, input');
  if (!provadorNaTela && e.key !== 'Escape') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    if (s.foco) fecharFoco();
    andar(e.key === 'ArrowRight' ? 1 : -1);
    e.preventDefault();
  } else if (e.key === 'Enter' && !emControle && !s.foco) {
    // sem o preventDefault, a ativação do Enter cai no X, que recebe o foco de teclado neste mesmo evento, e fecha
    e.preventDefault();
    abrirFoco();
  } else if (e.key === 'Escape') {
    if (s.painel === 'sacola') mudar({ painel: 'look' });
    else if (s.folha) mudar({ folha: false });
    else if (s.foco) fecharFoco();
  } else if ((e.key === ' ' || e.key === 'Enter') && s.autoplay && !e.target.closest?.('[data-tocar]')) {
    mudar({ autoplay: false }); // tecla de ação também pausa
  }
});

// entrada da tela: decodifica as imagens da fila (e guarda as outras em cache), depois tudo entra junto.
// Modelos assentam em 0,4 s saindo de um desfoque extra; interface em fade de 0,35 s; botão de cinza a preto em 0,6 s.
const guardadas = [];
const decodificar = src => {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  guardadas.push(img);
  return img.decode().catch(() => {});
};
fila.esconder();
const primeiras = fila.imagensIniciais();
const pronto = Promise.race([
  Promise.all(primeiras.map(decodificar)),
  new Promise(r => setTimeout(r, 3000)),
]);
// intro: o Swoosh 3D gira enquanto a tela carrega e atravessa a tela; a entrada abaixo começa no meio da travessia
const intro = rodarIntro($('[data-intro]'), { carregado: pronto, menosMovimento: menosMovimento.matches });
intro.revelada.then(() => {
  // o resto dos recortes entra no cache depois, para a fila nunca trocar para uma imagem ainda não decodificada
  for (const l of looks) l.desfoque.forEach(src => primeiras.includes(src) || decodificar(src));
  document.documentElement.classList.remove('is-carregando');
  lenis?.start();
  document.documentElement.classList.add('is-pronto');
  fila.entrar();
  autoplay.liberar();
  revelar(); // entradas da loja: só depois da intro, para nenhuma acontecer escondida atrás dela
  if (menosMovimento.matches) return;
  const fade = { duration: 350, easing: 'cubic-bezier(0.5, 1, 0.89, 1)', fill: 'backwards' };
  for (const el of $$('.nav, .palco-textos, .trilho, .painel-cabeca, .linhas, .fecho')) el.animate([{ opacity: 0 }, { opacity: 1 }], fade);
  const botao = $('[data-botao]');
  const cinza = getComputedStyle(botao).getPropertyValue('--botao-entrada').trim();
  botao.animate([{ backgroundColor: cinza }, { backgroundColor: getComputedStyle(botao).backgroundColor }], { duration: 600, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' });
});

// só no npm run dev: expõe o estado para os prints de conferência
if (import.meta.env.DEV) window.__nike = { ler, mudar, andar, abrirFoco, fecharFoco, fila };
