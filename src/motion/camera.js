// "Câmera" do palco com lente olho de peixe (barrel distortion), como a das filmagens de skate.
//
// O palco é HTML (fotos, recortes em <img>, sombras em gradiente), não um canvas: a lente é um filtro SVG
// (feDisplacementMap) num invólucro .camera que contém o fundo e a fila. O mapa de deslocamento é gerado aqui, no
// tamanho do palco: cada ponto amostra a cena um pouco mais longe do centro, proporcional a r², então o meio fica
// quase 1:1 (pinos e área de clique do modelo do centro no lugar) e as bordas se comprimem e curvam.
//
// força: deslocamento nos cantos, em fração da meia-diagonal do palco.

const NS = 'http://www.w3.org/2000/svg';
const RES = 1; // resolução do mapa em relação ao palco
// Safari (e todo navegador do iOS) posiciona o feImage de um filtro em HTML pela página, não pelo elemento: o mapa
// sai deslocado pela altura da nav. Lá, o mapa é posto na posição do palco na página.
const WEBKIT = /AppleWebKit/.test(navigator.userAgent) && !/Chrome\/|Chromium|Edg\/|Android/.test(navigator.userAgent);

export function ligarCamera(palco, { forca = 0.16 } = {}) {
  const camera = document.createElement('div');
  camera.className = 'camera';
  // a fila entra na câmera; título, trilho e cabeçalho do foco ficam fora (interface não passa pela lente)
  camera.append(palco.querySelector('.fila'));
  palco.prepend(camera);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <filter id="olho-de-peixe" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feImage result="mapa" preserveAspectRatio="none" />
      <feDisplacementMap in="SourceGraphic" in2="mapa" xChannelSelector="R" yChannelSelector="G" />
    </filter>`;
  document.body.append(svg);
  const filtro = svg.querySelector('filter');
  const imagem = svg.querySelector('feImage');
  const desloca = svg.querySelector('feDisplacementMap');

  const tela = document.createElement('canvas');
  const ctx = tela.getContext('2d');

  let medida = '';
  const montar = () => {
    const { width: W, height: H } = palco.getBoundingClientRect();
    if (!W || !H) return;
    const { top, left } = palco.getBoundingClientRect();
    const chave = `${Math.round(W)}x${Math.round(H)}@${Math.round(left)},${Math.round(top + scrollY)}`;
    if (chave === medida) return;
    medida = chave;

    const R = Math.hypot(W, H) / 2;
    const max = forca * R; // deslocamento nos cantos, em px
    const escala = Math.ceil(max * 2 + 4);
    const w = Math.max(2, Math.round(W * RES));
    const h = Math.max(2, Math.round(H * RES));
    tela.width = w;
    tela.height = h;
    const dados = ctx.createImageData(w, h);
    const px = dados.data;
    for (let y = 0; y < h; y++) {
      const dy = ((y + 0.5) / h - 0.5) * H;
      for (let x = 0; x < w; x++) {
        const dx = ((x + 0.5) / w - 0.5) * W;
        const r2 = (dx * dx + dy * dy) / (R * R);
        const k = forca * r2;
        const i = (y * w + x) * 4;
        px[i] = Math.round((0.5 + (dx * k) / escala) * 255);
        px[i + 1] = Math.round((0.5 + (dy * k) / escala) * 255);
        px[i + 2] = 128;
        px[i + 3] = 255;
      }
    }
    ctx.putImageData(dados, 0, 0);

    // região do filtro maior que o palco: a lente puxa cena de fora da borda. No WebKit, região e mapa contam da
    // página (não do elemento): os dois vão para a posição do palco na página. A região fica justa (folga m), porque
    // o WebKit desiste de desenhar filtros muito grandes (no iPhone, com tela 3x, uma região de 3 palcos já passa).
    const caixa = palco.getBoundingClientRect();
    const ox = WEBKIT ? caixa.left + scrollX : 0;
    const oy = WEBKIT ? caixa.top + scrollY : 0;
    const m = Math.ceil(max + 8);
    const regiao = [ox - m, oy - m, W + 2 * m, H + 2 * m];
    ['x', 'y', 'width', 'height'].forEach((a, i) => filtro.setAttribute(a, regiao[i]));
    for (const [a, v] of [['x', ox], ['y', oy], ['width', W], ['height', H]]) imagem.setAttribute(a, v);
    imagem.setAttribute('href', tela.toDataURL('image/png'));
    desloca.setAttribute('scale', escala);
    camera.style.filter = 'url(#olho-de-peixe)';
  };

  let espera;
  new ResizeObserver(() => {
    clearTimeout(espera);
    espera = setTimeout(montar, medida ? 150 : 0);
  }).observe(palco);

  return { camera };
}
