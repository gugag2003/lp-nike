// "Em movimento": duas fotos de tela cheia entre a arara e as categorias. A primeira é parada (a pessoa nítida, a
// cidade riscando atrás); a segunda é em movimento (panning). O palco fica preso à tela e a rolagem leva de uma à
// outra por uma lente de vidro que cresce (src/motion/lente.js, ideia de referencias/lumina-slider).
//
// Quem manda é a rolagem: o progresso do pino é o tamanho da lente, então dá para parar no meio, voltar e ver a
// faixa térmica com calma. Com mouse, a lente nasce onde o cursor está (e segue o cursor), e antes da rolagem
// começar já existe uma lente pequena sob o cursor espiando a segunda foto. Sem mouse (celular), ela nasce num
// ponto fixo, sobre a pessoa, e só a rolagem nativa a move: nenhum scrollTo, nada preso ao dedo.
//
// Camadas do palco, de baixo para cima: as duas <img> (com alt; a B recortada num círculo por clip-path), o canvas
// da lente, um véu para o texto e o texto. O canvas chega por import() quando a seção está a uma tela de distância;
// até lá, e sempre que não houver WebGL (ou com ?lente=css), o círculo de clip-path faz a passagem, sem o vidro.
// Movimento reduzido: sem pino e sem lente; as duas fotos ficam empilhadas, cada uma com a sua legenda.
//
// O laço dorme: só há quadro quando a rolagem anda, o mouse mexe ou a lente ainda está assentando, e só com o
// palco na tela.
import { movimento as dados } from '../data/movimento.js';
import { peca } from '../data/loja.js';
import { $, $$, esc, celular, toque, menosMovimento, SETA_CIMA } from '../dom.js';
import { acompanhar } from '../motion/rolagem.js';

const INICIO = 0.1; // fração do pino em que a lente começa a crescer
const FIM = 0.84; // e em que ela já tomou a tela (o resto é a segunda foto parada)
const CURVA = 1.5; // raio = progresso ^ CURVA: a lente demora pequena, onde a faixa térmica é mais bonita
const ESPIA = 0.12; // raio da lente sob o mouse antes da rolagem, em fração do menor lado do palco
const SEGUE = 0.14; // quanto do caminho até o cursor a lente anda por quadro

const temWebGL = () => !!(window.WebGL2RenderingContext || window.WebGLRenderingContext);
const pct = ([x, y]) => `${x * 100}% ${y * 100}%`;

const foto = (c, classe, extra = '') => `
  <picture class="mov-foto ${classe}" ${extra} style="--foco-tela:${pct(c.foco.tela)}; --foco-celular:${pct(c.foco.celular)}">
    <source media="(max-width: 899px)" srcset="${c.vertical.src}" width="${c.vertical.largura}" height="${c.vertical.altura}" />
    <img src="${c.larga.src}" srcset="${c.larga.src} 1920w, ${c.larga.grande} 2880w" sizes="100vw"
      width="${c.larga.largura}" height="${c.larga.altura}" alt="${esc(c.alt)}" loading="lazy" decoding="async" draggable="false" />
  </picture>`;

export function montarMovimento(raiz, { verNoLook }) {
  const [a, b] = dados.cenas;
  const botao = (c, extra = '') => `<button class="mov-ver" type="button" ${extra}><span data-mov-ver-texto>${esc(dados.verLook(c.nome))}</span> ${SETA_CIMA}</button>`;

  // movimento reduzido: as duas fotos empilhadas, sem pino nem lente
  if (menosMovimento.matches) {
    raiz.classList.add('movimento--parada');
    raiz.innerHTML = `
      <div class="mov-cabeca">
        <p class="mov-rotulo">${esc(dados.rotulo)}</p>
        <h2 class="mov-titulo">${esc(dados.titulo)}</h2>
      </div>
      ${dados.cenas.map(c => `
        <figure class="mov-figura">
          ${foto(c, '')}
          <figcaption class="mov-pe"><span class="mov-legenda">${esc(c.legenda)}</span>${botao(c, `data-mov-ver="${c.peca}"`)}</figcaption>
        </figure>`).join('')}`;
    for (const el of $$('[data-mov-ver]', raiz)) el.addEventListener('click', () => verNoLook(el.dataset.movVer));
    return;
  }

  raiz.innerHTML = `
    <div class="mov-palco" data-mov-palco>
      ${foto(a, 'mov-foto--a')}
      ${foto(b, 'mov-foto--b', 'data-mov-b')}
      <canvas class="mov-lente" data-mov-lente aria-hidden="true"></canvas>
      <div class="mov-veu" aria-hidden="true"></div>
      <div class="mov-texto">
        <p class="mov-rotulo">${esc(dados.rotulo)}</p>
        <h2 class="mov-titulo">${esc(dados.titulo)}</h2>
      </div>
      <div class="mov-pe">
        <p class="mov-passo" aria-hidden="true"><span>01</span><span class="mov-passo-fio"><span data-mov-fio></span></span><span>02</span></p>
        <p class="mov-legenda" aria-hidden="true"><span>${esc(a.legenda)}</span><span>${esc(b.legenda)}</span></p>
        ${botao(a, 'data-mov-ver')}
      </div>
    </div>`;

  const palco = $('[data-mov-palco]', raiz);
  const fotoB = $('[data-mov-b]', raiz);
  const canvas = $('[data-mov-lente]', raiz);
  const fio = $('[data-mov-fio]', raiz);
  const ver = $('[data-mov-ver]', raiz);
  const verTexto = $('[data-mov-ver-texto]', ver);

  // a foto da vez (a que a lente já passou do meio): legenda, botão e rótulo do botão
  let naB = false;
  const cenaDaVez = () => (naB ? b : a);
  ver.addEventListener('click', () => verNoLook(cenaDaVez().peca));
  const rotular = () => {
    const c = cenaDaVez();
    verTexto.textContent = dados.verLook(c.nome);
    ver.setAttribute('aria-label', `${dados.verLook(c.nome)}: ${peca(c.peca).nome}`);
  };
  rotular();

  // ---------- estado da lente ----------
  let L = 0; // largura e altura do palco, px de CSS
  let A = 0;
  let pl = 0; // progresso da lente, 0 a 1
  let cx = 0; let cy = 0; // centro atual
  let ax = 0; let ay = 0; // centro pretendido (cursor, ou o ponto fixo)
  let espia = 0; let espiaAlvo = 0; // lente pequena sob o mouse antes da rolagem
  let comMouse = false;
  let naTela = false;
  let lente = null; // src/motion/lente.js, quando chega
  let comLente = false;
  let rafId = 0;

  const repouso = () => {
    const [fx, fy] = celular.matches ? dados.lente.celular : dados.lente.tela;
    return [L * fx, A * fy];
  };

  function quadro() {
    rafId = 0;
    if (!naTela || !L) return;
    cx += (ax - cx) * SEGUE;
    cy += (ay - cy) * SEGUE;
    espia += (espiaAlvo - espia) * 0.12;
    const assentou = Math.abs(ax - cx) < 0.3 && Math.abs(ay - cy) < 0.3 && Math.abs(espiaAlvo - espia) < 0.004;
    if (assentou) { cx = ax; cy = ay; espia = espiaAlvo; }

    // o raio que cobre a tela a partir do centro atual: até o canto mais distante, com folga para a borda sair
    const cobre = Math.hypot(Math.max(cx, L - cx), Math.max(cy, A - cy)) * 1.06;
    const raio = Math.max(cobre * Math.pow(pl, CURVA), espia * ESPIA * Math.min(L, A));
    const g = pl >= 1 ? 1 : Math.min(raio / cobre, 0.999);

    if (comLente) lente.desenhar({ x: cx, y: cy, raio, g });
    else fotoB.style.clipPath = g >= 1 ? 'none' : `circle(${raio.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
    if (!assentou) pedir();
  }
  const pedir = () => { if (!rafId) rafId = requestAnimationFrame(quadro); };

  // ---------- tamanho ----------
  // o palco é svh: não muda com a barra do navegador. Mesmo assim, no toque, mudança só de altura e pequena não
  // refaz o canvas (regra 4 do /celular).
  let pinoTopo = 0;
  let curso = 1;
  const medir = () => {
    const w = palco.clientWidth;
    const h = palco.clientHeight;
    pinoTopo = parseFloat(getComputedStyle(palco).top) || 0;
    curso = Math.max(1, raiz.offsetHeight - h);
    if (toque.matches && w === L && Math.abs(h - A) < 120) return;
    const primeira = !L;
    L = w;
    A = h;
    if (!comMouse) [ax, ay] = repouso();
    if (primeira) { cx = ax; cy = ay; }
    lente?.dimensionar(L, A);
    pedir();
  };
  new ResizeObserver(medir).observe(palco);
  medir();

  // ---------- rolagem ----------
  acompanhar(raiz, p => {
    pl = Math.min(1, Math.max(0, (p - INICIO) / (FIM - INICIO)));
    fio.style.transform = `scaleX(${pl.toFixed(4)})`;
    const agoraB = pl > 0.5;
    if (agoraB !== naB) {
      naB = agoraB;
      raiz.classList.toggle('is-b', naB);
      rotular();
    }
    pedir();
  }, { inicio: () => pinoTopo, fim: () => pinoTopo - curso });

  new IntersectionObserver(([e]) => {
    naTela = e.isIntersecting;
    if (naTela) pedir();
  }).observe(palco);

  // ---------- mouse (só onde existe): a lente nasce no cursor e o segue ----------
  palco.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = palco.getBoundingClientRect();
    ax = e.clientX - r.left;
    ay = e.clientY - r.top;
    comMouse = true;
    espiaAlvo = 1;
    pedir();
  });
  palco.addEventListener('pointerleave', () => {
    comMouse = false;
    espiaAlvo = 0;
    [ax, ay] = repouso();
    pedir();
  });

  // ---------- a lente em WebGL, quando a seção chega perto ----------
  // as texturas saem das próprias <img> (a larga ou a vertical, a que o navegador escolheu): nenhum download a mais
  const imgs = $$('.mov-foto img', palco);
  const carregada = img => new Promise((ok, erro) => {
    img.loading = 'eager';
    if (img.complete && img.naturalWidth) { ok(); return; }
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', erro, { once: true });
  });
  const par = async () => {
    await Promise.all(imgs.map(carregada));
    return dados.cenas.map((c, i) => ({ img: imgs[i], foco: celular.matches ? c.foco.celular : c.foco.tela }));
  };
  const semLente = () => {
    comLente = false;
    raiz.classList.remove('tem-lente');
    pedir();
  };
  const quer = new URLSearchParams(location.search).get('lente') !== 'css' && temWebGL();
  if (quer && 'IntersectionObserver' in window) {
    new IntersectionObserver((entradas, io) => {
      if (!entradas.some(e => e.isIntersecting)) return;
      io.disconnect();
      import('../motion/lente.js').then(async m => {
        lente = m.criarLente({ canvas, celular: () => celular.matches, aoPerder: semLente });
        if (!lente) return;
        lente.dimensionar(L, A);
        const trocar = async () => {
          if (await lente.carregar(await par())) {
            comLente = true;
            raiz.classList.add('tem-lente');
            pedir();
          }
        };
        // virou de celular para tela grande (ou o contrário): o <picture> troca a foto e a textura vai atrás
        celular.addEventListener?.('change', () => requestAnimationFrame(() => trocar().catch(() => {})));
        await trocar();
      }).catch(() => { lente = null; semLente(); });
    }, { rootMargin: '100% 0px' }).observe(raiz);
  }
}
