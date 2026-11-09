// Intro em 3D (Three.js): o Swoosh do logo (src/data/marca.js) extrudado com chanfro, preto com verniz, num estúdio
// escuro. Roteiro (tempos em s), uma curva contínua, sem paradas entre as partes:
//
//   volta      0,85  uma volta inteira até ficar de frente, numa curva de partida firme e freio longo
//                    (cubic-bezier 0,5 0 0,15 1): acelera e freia sozinha. Na primeira, o logo nasce durante a volta.
//                    Se a tela ainda está carregando, vem outra volta igual (o loop), sem disparar.
//   atravessa  0,6   começa nos últimos 22 % da volta (o freio e o avanço se misturam): um respiro para trás e o logo
//                    vem na direção da câmera, com a distância caindo em escala exponencial e mirando o vão entre
//                    gancho e corpo (passa em volta da câmera, pelas bordas). Quando passa da largura da tela, o
//                    branco some e a tela entra por trás.
//
// Total, com a tela já carregada: ~1,1 s. Rastro leve (o quadro anterior clareia por baixo do atual), só onde a
// velocidade é alta.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { marca } from '../data/marca.js';

const VOLTA_T = 0.85; // duração de uma volta
const SOLTA = 0.78; // fração da volta a partir da qual a travessia pode começar
const ATRAVESSA_T = 0.6;
const ZOOM_REVELA = 2.6; // tamanho aparente (× o inicial) em que o branco começa a sair: o logo já passa da tela
const ZOOM_FIM = 20; // tamanho aparente final: o corpo já saiu da tela (perto disso, o verniz enche a tela de reflexo)
const VOLTA = Math.PI * 2;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a + (b - a) * t;
// cubic-bezier(x1, y1, x2, y2) como no CSS: resolve x por Newton e devolve y
const bezier = (x1, y1, x2, y2) => {
  const c = (a1, a2, t) => 3 * a1 * t * (1 - t) ** 2 + 3 * a2 * t * t * (1 - t) + t ** 3;
  const dc = (a1, a2, t) => 3 * a1 * (1 - t) ** 2 + 6 * (a2 - a1) * t * (1 - t) + 3 * (1 - a2) * t * t;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) t -= (c(x1, x2, t) - x) / (dc(x1, x2, t) || 1e-6);
    return c(y1, y2, clamp(t));
  };
};
const curvaVolta = bezier(0.5, 0, 0.15, 1); // partida firme, freio longo
const easeInCubic = t => t * t * t;
const easeOutCubic = t => 1 - (1 - t) ** 3;
const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;

export function criarIntro3d(el, { carregado, revelar, fim }) {
  // ---------- palco ----------
  const canvas = document.createElement('canvas');
  el.append(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NoToneMapping;

  const cena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(estudioEscuro(), 0.02).texture;
  cena.environment = ambiente;
  // luz de recorte: desenha o chanfro e o volume no giro (o ambiente fica baixo, só para o brilho do verniz)
  // de lado e de cima, rasante: risca o chanfro sem acender a face plana quando o logo para de frente
  const chave = new THREE.DirectionalLight(0xffffff, 3);
  chave.position.set(-3.5, 4, 0.8);
  cena.add(chave);
  const contra = new THREE.DirectionalLight(0xffffff, 1.6);
  contra.position.set(3, -1, -2);
  cena.add(contra);

  const CAM_Z = 6;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  camera.position.z = CAM_Z;

  // ---------- Swoosh ----------
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${marca.logo.d}"/></svg>`;
  const formas = new SVGLoader().parse(svg).paths.flatMap(p => p.toShapes(true));
  let geo = new THREE.ExtrudeGeometry(formas, {
    depth: 1.15,
    bevelEnabled: true,
    bevelThickness: 0.26,
    bevelSize: 0.17,
    bevelSegments: 10,
    curveSegments: 72,
  });
  // normais suaves no chanfro e nas curvas (o ExtrudeGeometry sai facetado)
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  const caixa = geo.boundingBox;
  const centro = caixa.getCenter(new THREE.Vector3());
  geo.translate(-centro.x, -centro.y, -centro.z);
  const largura = caixa.max.x - caixa.min.x;
  // vão entre o gancho e o corpo (fora do sólido), por onde a câmera passa na travessia; em unidades do Swoosh
  // normalizado (coordenadas do SVG: y para baixo, por isso o sinal)
  const VAO = new THREE.Vector2((7.5 - centro.x) / largura, -(12.6 - centro.y) / largura);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x0c0c0c,
    roughness: 0.3,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    envMapIntensity: 1,
    side: THREE.DoubleSide, // se a lente encostar no sólido, a tela fica preta, não vazada
  });
  const swoosh = new THREE.Mesh(geo, material);
  swoosh.scale.set(1 / largura, -1 / largura, 1 / largura); // o SVG tem y para baixo: espelha (o Three inverte a face)
  const pivo = new THREE.Group();
  pivo.add(swoosh);
  cena.add(pivo);

  // sombra de contato: elipse macia embaixo, que some quando o logo sai do chão
  const sombraTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(0,0,0,0.5)');
    r.addColorStop(0.5, 'rgba(0,0,0,0.18)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const sombra = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: sombraTex, transparent: true, depthWrite: false, opacity: 0 }),
  );
  sombra.rotation.x = -Math.PI / 2;
  cena.add(sombra);

  // ---------- rastro (mistura de quadros) ----------
  const quad = new THREE.PlaneGeometry(2, 2);
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const alvo = (amostras = 0) => new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: amostras });
  const rtCena = alvo(4);
  let rtA = alvo();
  let rtB = alvo();
  const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const mistura = new THREE.ShaderMaterial({
    uniforms: { tNovo: { value: null }, tVelho: { value: null }, k: { value: 0 } },
    vertexShader: VERT,
    // rastro escuro: o quadro anterior clareia na direção do fundo e o atual fica por cima (min); o logo de agora
    // segue preto sólido, só o rastro esmaece. Em pré-multiplicado, o "branco" do fundo vale o alfa do quadro.
    fragmentShader: `uniform sampler2D tNovo, tVelho; uniform float k; varying vec2 vUv;
      void main(){ vec4 n = texture2D(tNovo, vUv); vec4 v = texture2D(tVelho, vUv);
        gl_FragColor = vec4(min(n.rgb, mix(vec3(n.a), v.rgb, k)), n.a); }`,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  // saída: o alvo é linear e pré-multiplicado; despremultiplica, codifica em sRGB e premultiplica de novo
  const saida = new THREE.ShaderMaterial({
    uniforms: { t: { value: null } },
    vertexShader: VERT,
    fragmentShader: `uniform sampler2D t; varying vec2 vUv;
      vec3 srgb(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
      void main(){ vec4 c = texture2D(t, vUv); vec3 rgb = c.a > 0.0001 ? c.rgb / c.a : vec3(0.0);
        gl_FragColor = vec4(srgb(clamp(rgb, 0.0, 1.0)) * c.a, c.a); }`,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  const telaMistura = new THREE.Mesh(quad, mistura);
  const telaSaida = new THREE.Mesh(quad, saida);
  const branco = new THREE.Color();

  // ---------- tamanho ----------
  let base = 1; // largura do Swoosh no loop, em unidades de cena (z = 0)
  let visW = 1;
  let visH = 1;
  let semRastro = true; // no primeiro quadro (e depois de redimensionar) o quadro anterior não vale
  const medir = () => {
    const w = innerWidth;
    const h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    visW = visH * camera.aspect;
    base = Math.min(visW * 0.56, visH * 0.46);
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    for (const rt of [rtCena, rtA, rtB]) rt.setSize(pw, ph);
    semRastro = true;
  };
  medir();
  addEventListener('resize', medir);

  // ---------- roteiro ----------
  let carregou = false;
  carregado.then(() => (carregou = true));

  let t = 0; // tempo total
  let tVolta = 0; // tempo dentro da volta atual
  let voltas = 0; // voltas completas (o ângulo de partida da volta atual)
  let tVoo = -1; // tempo dentro da travessia (−1 = ainda não começou)
  let theta = -VOLTA;
  let omega = 0;
  let escala = 0;
  let k = 0; // força do rastro
  let fundo = 1; // alfa do branco
  let revelou = false;

  const passo = dt => {
    t += dt;
    tVolta += dt;

    // volta: de −2π a 0 (e de 0 a 2π, ...) na curva; termina de frente, parada
    let u = clamp(tVolta / VOLTA_T);
    if (u >= 1 && tVoo < 0 && !carregou) {
      // ainda carregando: outra volta igual
      voltas += 1;
      tVolta -= VOLTA_T;
      u = clamp(tVolta / VOLTA_T);
    }
    const antes = theta;
    theta = (voltas - 1) * VOLTA + VOLTA * curvaVolta(u);
    omega = dt > 0 ? (theta - antes) / dt : 0;

    // o logo nasce na primeira volta e cresce um pouco nas seguintes
    escala = voltas === 0 ? easeOutCubic(clamp(tVolta / (VOLTA_T * 0.55))) : 1 + 0.04 * Math.min(voltas, 2);
    // inclinação pela aceleração: embica para a frente na partida e para trás no freio, de leve
    let rz = -0.07 * Math.sin(VOLTA * u);
    let rx = 0.05 * Math.sin(Math.PI * u);
    let z = 0;
    let dx = 0;
    let dy = 0;
    let chao = clamp(tVolta / 0.3 + voltas);

    if (tVoo < 0 && carregou && u >= SOLTA) tVoo = 0;
    if (tVoo >= 0) {
      tVoo += dt;
      const v = clamp(tVoo / ATRAVESSA_T);
      // respiro: recua um pouco no começo, enquanto a volta termina de frear
      const respiro = -0.35 * Math.sin(Math.PI * clamp(v / 0.32)) * (v < 0.32 ? 1 : 0);
      const d0 = CAM_Z;
      const dist = d0 * (1 / ZOOM_FIM) ** (v ** 2.3);
      z = CAM_Z - dist + respiro;
      const zoom = d0 / dist;
      rz += -0.18 * easeInCubic(v); // inclina na direção da ponta, como numa curva
      rx += -0.05 * v;
      const alcance = easeInOutSine(clamp(v * 1.4));
      dx = -VAO.x * base * escala * alcance;
      dy = -VAO.y * base * escala * alcance;
      chao *= 1 - clamp(v * 2.5);
      if (zoom > ZOOM_REVELA) {
        if (!revelou) {
          revelou = true;
          revelar();
          el.classList.add('is-aberta');
        }
        fundo = Math.max(0, fundo - dt / 0.2);
      }
      if (v >= 1) return false;
    }

    // pose
    pivo.rotation.set(rx, theta, rz, 'YXZ');
    const s = base * escala;
    pivo.scale.set(s, s, s);
    pivo.position.set(dx, dy, z);
    sombra.position.set(dx * 0.6, -base * escala * 0.42, z);
    sombra.scale.set(base * escala * 1.15, base * escala * 0.32, 1);
    sombra.material.opacity = chao * 0.9;

    // rastro leve: só no pico do giro e no fim da travessia
    const kGiro = clamp((Math.abs(omega) - 7) / 10) * 0.3;
    const kVoo = tVoo >= 0 ? clamp(tVoo / ATRAVESSA_T) ** 2 * 0.35 : 0;
    k = revelou || semRastro ? 0 : Math.max(kGiro, kVoo);
    semRastro = false;
    return true;
  };

  const desenhar = () => {
    // cena num alvo com fundo branco pré-multiplicado pelo alfa da cobertura
    renderer.setRenderTarget(rtCena);
    renderer.setClearColor(branco.setRGB(fundo, fundo, fundo, THREE.LinearSRGBColorSpace), fundo);
    renderer.clear();
    renderer.render(cena, camera);
    // mistura com o quadro anterior
    mistura.uniforms.tNovo.value = rtCena.texture;
    mistura.uniforms.tVelho.value = rtA.texture;
    mistura.uniforms.k.value = k;
    renderer.setRenderTarget(rtB);
    renderer.render(telaMistura, ortho);
    // tela
    saida.uniforms.t.value = rtB.texture;
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(telaSaida, ortho);
    [rtA, rtB] = [rtB, rtA];
  };

  let antes = performance.now();
  let primeiro = true;
  let trocou = false;
  const quadro = agora => {
    const dt = Math.min(0.05, (agora - antes) / 1000);
    antes = agora;
    const segue = passo(primeiro ? 0 : dt);
    desenhar();
    primeiro = false;
    // o Swoosh plano sai quando o 3D já tem corpo (ele nasce em escala zero: trocar no 1º quadro deixava a tela vazia)
    if (!trocou && escala > 0.45) {
      trocou = true;
      el.classList.add('is-3d');
    }
    if (segue) requestAnimationFrame(quadro);
    else encerrar();
  };
  requestAnimationFrame(quadro);

  function encerrar() {
    removeEventListener('resize', medir);
    geo.dispose();
    material.dispose();
    sombraTex.dispose();
    ambiente.dispose();
    pmrem.dispose();
    for (const rt of [rtCena, rtA, rtB]) rt.dispose();
    renderer.dispose();
    fim();
  }
}

// Estúdio de produto para os reflexos: sala preta com três softboxes em faixa (teto, lateral esquerda, contraluz à
// direita). No preto brilhante, a face plana reflete o escuro (fica preta de frente) e o giro faz os riscos de luz
// correrem pelo chanfro. O RoomEnvironment do Three é uma sala clara: tudo que refletia saía cinza.
function estudioEscuro() {
  const sala = new THREE.Scene();
  sala.background = new THREE.Color(0x000000);
  const faixa = (w, h, intensidade, pos, olhar) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(intensidade, intensidade, intensidade), side: THREE.DoubleSide }),
    );
    m.position.set(...pos);
    m.lookAt(...olhar);
    sala.add(m);
  };
  faixa(10, 1.2, 6, [0, 6, 1], [0, 0, 0]); // teto, comprida
  faixa(1.4, 7, 4, [-6, 1, 2], [0, 0, 0]); // lateral esquerda, alta
  faixa(1, 5, 3, [5, 0.5, -4], [0, 0, 0]); // contraluz à direita
  return sala;
}
