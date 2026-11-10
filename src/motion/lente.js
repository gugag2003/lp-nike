// Lente (Three.js): a passagem entre as duas fotos da seção "Em movimento". Um círculo nasce num ponto do palco e
// cresce até tomar a tela; fora dele fica a foto A, dentro já está a foto B, vista por uma bola de vidro:
//   - dentro, a foto B aparece ampliada no meio e apertada junto à borda (a ampliação some conforme a lente cresce);
//   - junto à borda, por dentro, uma faixa pinta a foto com cores de câmera térmica pela luminância, com curvas de
//     nível; a faixa toma quase a lente inteira no começo, concentra de um lado e afina até sumir;
//   - na borda, os canais de cor se separam (aberração cromática), a foto de fora entorta um pouco e um fio de luz
//     marca a espessura do vidro.
// Ideia de referencias/lumina-slider; o sombreador foi escrito aqui, do zero.
//
// Este módulo só desenha: quem manda no centro, no raio e na hora de desenhar é src/secoes/movimento.js. Não tem
// laço próprio nem relógio: o quadro é função só de (centro, raio, crescimento), então parado custa zero.
// Chega por import() quando a seção está a uma tela de distância (o Three fica fora do bundle inicial).
//
// Um plano de tela cheia e duas texturas, sem antialias, sem profundidade, sem mipmaps: é o contexto WebGL mais
// leve que dá para ter. As fotos entram no quadro como object-fit: cover, com o mesmo ponto de foco do CSS, para a
// lente cair exatamente em cima das <img> que ficam embaixo (a reserva).
import {
  WebGLRenderer, Scene, OrthographicCamera, Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2, Vector4,
  LinearFilter, ClampToEdgeWrapping,
} from 'three';

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tA;
  uniform sampler2D tB;
  uniform vec2 uTela;    // tamanho do canvas, em px do aparelho
  uniform vec4 uCaixaA;  // onde a foto A cai no canvas (x, y, largura, altura), como object-fit: cover
  uniform vec4 uCaixaB;
  uniform vec2 uCentro;  // centro da lente, a partir do canto de cima à esquerda
  uniform float uRaio;
  uniform float uG;      // crescimento: raio / raio que cobre a tela (0 a 1)
  uniform float uPx;     // px do aparelho por px de CSS

  // paleta de câmera térmica: do frio ao quente, com o verde e o branco no topo
  vec3 termica(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c = mix(vec3(0.02, 0.02, 0.2), vec3(0.42, 0.0, 0.78), smoothstep(0.0, 0.18, t));
    c = mix(c, vec3(0.95, 0.05, 0.22), smoothstep(0.15, 0.36, t));
    c = mix(c, vec3(1.0, 0.45, 0.0), smoothstep(0.34, 0.52, t));
    c = mix(c, vec3(1.0, 0.92, 0.1), smoothstep(0.5, 0.68, t));
    c = mix(c, vec3(0.2, 0.95, 0.38), smoothstep(0.66, 0.83, t));
    return mix(c, vec3(0.98, 1.0, 0.95), smoothstep(0.84, 1.0, t));
  }
  vec2 uvDe(vec4 caixa, vec2 p) { return clamp((p - caixa.xy) / caixa.zw, 0.0, 1.0); }
  // uma leitura por canal, afastadas ao longo do raio da lente
  vec3 ler(sampler2D t, vec4 caixa, vec2 p, vec2 dir, float ca) {
    return vec3(
      texture2D(t, uvDe(caixa, p + dir * ca)).r,
      texture2D(t, uvDe(caixa, p)).g,
      texture2D(t, uvDe(caixa, p - dir * ca)).b
    );
  }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, uTela.y - gl_FragCoord.y);
    float r = uRaio;
    if (r < 0.5) { gl_FragColor = vec4(texture2D(tA, uvDe(uCaixaA, p)).rgb, 1.0); return; }
    if (uG >= 1.0) { gl_FragColor = vec4(texture2D(tB, uvDe(uCaixaB, p)).rgb, 1.0); return; }

    vec2 v = p - uCentro;
    float d = length(v);
    vec2 dir = d > 0.0001 ? v / d : vec2(0.0);
    float s = min(d / r, 1.0);
    float calma = 1.0 - smoothstep(0.5, 1.0, uG);  // 1 com a lente pequena, 0 quando ela já é a tela
    float perto = exp(-pow((d - r) / max(0.045 * r, 5.0 * uPx), 2.0)); // 1 em cima da borda

    // fora: a foto A, puxada para dentro numa faixa estreita em volta da borda
    float e = 0.07 * r + 8.0 * uPx;
    float k = 1.0 - smoothstep(r, r + e, d);
    vec2 pf = p - dir * e * 0.9 * k * k * (0.35 + 0.65 * calma);
    vec3 fora = ler(tA, uCaixaA, pf, dir, (2.0 + 10.0 * calma) * uPx * perto);

    // dentro: a foto B pela bola de vidro (ampliada no meio, apertada na borda)
    float amp = 0.34 * calma + 0.05 * (1.0 - uG);
    float f = s * (1.0 - amp * (1.0 - s * s)) + 0.16 * calma * pow(s, 7.0);
    vec2 pd = uCentro + dir * r * f;
    float ca = ((2.0 + 12.0 * calma) * perto + 7.0 * calma * s * s * s) * uPx;
    vec3 dentro = ler(tB, uCaixaB, pd, dir, ca);

    // faixa térmica: larga no começo, mais cheia de um lado (que gira enquanto a lente cresce), e some no fim
    float larg = r * mix(0.92, 0.1, smoothstep(0.0, 0.6, uG));
    float tw = smoothstep(r - larg, r, d);
    float ang = atan(v.y, v.x);
    float lado = 0.62 + 0.38 * cos(ang + 0.5 - uG * 2.6);
    float forca = pow(tw, 1.4) * lado * (1.0 - smoothstep(0.62, 0.98, uG));
    float t = dot(dentro, vec3(0.299, 0.587, 0.114)) * 0.7 + 0.24 * tw + 0.06 * sin(ang * 3.0 + uG * 9.0);
    vec3 th = termica(t);
    th *= 0.82 + 0.18 * smoothstep(0.0, 0.07, abs(fract(t * 7.0) - 0.5)); // curvas de nível
    dentro = mix(dentro, th, clamp(forca * 1.15, 0.0, 1.0));

    // a borda: corte de 2 px e um fio de luz
    vec3 cor = mix(dentro, fora, smoothstep(r - uPx, r + uPx, d));
    cor += vec3(1.0, 0.96, 0.9) * exp(-pow((d - r) / (1.6 * uPx), 2.0)) * (0.18 + 0.3 * calma);
    gl_FragColor = vec4(cor, 1.0);
  }`;

const VERT = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// A textura sai da própria <img> da página (a que o navegador escolheu pelo srcset e pelo <picture>): nenhum
// download a mais. O ImageBitmap decodifica fora da thread principal e é solto depois de subir para a GPU; onde
// ele não existe ou falha, a <img> sobe direto.
const imagemDe = img => (typeof createImageBitmap === 'function' ? createImageBitmap(img).catch(() => img) : Promise.resolve(img));

/** onde uma foto de proporção `aspecto` cai num quadro w × h com object-fit: cover e object-position foco */
function caixaCover(alvo, w, h, aspecto, [fx, fy]) {
  let lw = w;
  let lh = w / aspecto;
  if (lh < h) { lh = h; lw = h * aspecto; }
  alvo.set((w - lw) * fx, (h - lh) * fy, lw, lh);
}

/**
 * criarLente({ canvas, celular, aoPerder }) → { carregar, dimensionar, desenhar, destruir } ou null sem WebGL
 *   celular: booleano ou função () => booleano (teto do DPR: 1,5 no celular, 2 na tela grande)
 *   carregar([a, b])            a/b: { img (HTMLImageElement já carregada), foco: [x, y] }; resolve com as duas
 *                               texturas na GPU
 *   dimensionar(largura, altura) em px de CSS
 *   desenhar({ x, y, raio, g })  centro e raio em px de CSS; g = crescimento de 0 a 1
 */
export function criarLente({ canvas, celular = false, aoPerder }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  const u = {
    tA: { value: null }, tB: { value: null },
    uTela: { value: new Vector2(1, 1) },
    uCaixaA: { value: new Vector4(0, 0, 1, 1) }, uCaixaB: { value: new Vector4(0, 0, 1, 1) },
    uCentro: { value: new Vector2() }, uRaio: { value: 0 }, uG: { value: 0 }, uPx: { value: 1 },
  };
  const material = new ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false });
  const cena = new Scene();
  cena.add(new Mesh(new PlaneGeometry(2, 2), material));
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let fotos = null; // [{ aspecto, foco }, ...] das texturas no ar
  let largura = 0;
  let altura = 0;
  let pr = 1;
  let viva = true;
  let pedido = 0; // só a última chamada de carregar() vale

  const texturaDe = img => {
    const t = new Texture(img);
    t.flipY = false; // a linha 0 da foto é o topo: o sombreador conta o y de cima para baixo
    t.wrapS = t.wrapT = ClampToEdgeWrapping;
    t.minFilter = t.magFilter = LinearFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    renderer.initTexture(t); // sobe já, não no primeiro quadro
    img.close?.();
    return t;
  };
  const caixas = () => {
    if (!fotos) return;
    caixaCover(u.uCaixaA.value, largura * pr, altura * pr, fotos[0].aspecto, fotos[0].foco);
    caixaCover(u.uCaixaB.value, largura * pr, altura * pr, fotos[1].aspecto, fotos[1].foco);
  };

  const perdeu = e => { e.preventDefault(); viva = false; aoPerder?.(); };
  canvas.addEventListener('webglcontextlost', perdeu);

  return {
    async carregar(par) {
      const meu = ++pedido;
      const imgs = await Promise.all(par.map(f => imagemDe(f.img)));
      if (!viva || meu !== pedido) { imgs.forEach(i => i.close?.()); return false; }
      const novas = imgs.map(texturaDe);
      u.tA.value?.dispose();
      u.tB.value?.dispose();
      [u.tA.value, u.tB.value] = novas;
      fotos = par.map(f => ({ aspecto: f.img.naturalWidth / f.img.naturalHeight, foco: f.foco }));
      caixas();
      return true;
    },
    dimensionar(w, h) {
      largura = w;
      altura = h;
      pr = Math.min(window.devicePixelRatio || 1, (typeof celular === 'function' ? celular() : celular) ? 1.5 : 2);
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      u.uTela.value.set(w * pr, h * pr);
      u.uPx.value = pr;
      caixas();
    },
    desenhar({ x, y, raio, g }) {
      if (!viva || !fotos) return;
      u.uCentro.value.set(x * pr, y * pr);
      u.uRaio.value = raio * pr;
      u.uG.value = g;
      renderer.render(cena, camera);
    },
    destruir() {
      viva = false;
      canvas.removeEventListener('webglcontextlost', perdeu);
      u.tA.value?.dispose();
      u.tB.value?.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
