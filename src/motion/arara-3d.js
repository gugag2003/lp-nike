// Arara em 3D (Three.js): as peças de src/data/arara.js como malhas de verdade, cada uma num cabide de madeira com
// gancho de arame, penduradas no cano. Este módulo só desenha: quem manda na posição, no balanço e no virar é a
// física de src/motion/arara.js (os mesmos x / balanco / abertura do 2D), e quem cuida de mouse, toque, teclado e
// modal é src/secoes/arara.js. Chega por import() quando a seção está perto (o Three fica fora do bundle inicial).
//
// Modelos: public/loja/arara/3d/<chave>.glb (posição, normal e UV, com meshopt) + atlas de cor <chave>-<lado>.webp.
// A malha sai de uma foto da peça passada no Tripo (imagem → 3D) e preparada no Blender; a frente e as costas do
// atlas são as fotos de verdade projetadas na malha (fonte/arara/3d/prepara.py). A luz já vem assada no atlas: o
// sombreador só modula (luz de cima e da frente, um brilho de tecido na borda), sem luzes do Three nem sombras.
//
// Unidade da cena do cano = px de CSS no plano do cano (z = 0), com y para cima: o x da física entra direto.
//
//   criarPalco3d({ canvas, pecas, celular, aoCarregar, aoFalhar })   o cano: um renderer só, desenha sob demanda
//   criarVitrine3d({ canvas, celular })                              o modal: a peça fora do cano, girando
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, ShaderMaterial, MeshBasicMaterial, CylinderGeometry,
  TubeGeometry, SphereGeometry, CatmullRomCurve3, Vector3, Texture, SRGBColorSpace,
  LinearMipmapLinearFilter, LinearFilter, ClampToEdgeWrapping,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const LENTE = 4.3; // distância da câmera, em alturas de peça: perspectiva de lente longa
const COMPENSA = 0.72; // quanto do ângulo de visão cada peça desconta do giro (1 = todas iguais, como no 2D)
const DESALINHO = [-0.05, 0.035, -0.02, 0.05, -0.035, 0.02]; // rad: em repouso nenhuma peça fica igual à outra

// ---------- arquivos ----------
const cache = new Map();
let carregador = null;

function geometria(url) {
  carregador ??= new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  return carregador.loadAsync(url).then(gltf => {
    let malha = null;
    gltf.scene.traverse(o => { if (o.isMesh && !malha) malha = o; });
    if (!malha) throw new Error(`sem malha em ${url}`);
    malha.updateWorldMatrix(true, false);
    malha.material?.dispose?.();
    // a posição vem quantizada: a matriz do nó desfaz a quantização (fica com a malha, não entra na geometria)
    return { geo: malha.geometry, matriz: malha.matrixWorld.clone() };
  });
}

// O atlas fica guardado como veio da rede (o Blob do WebP, dezenas de KB): cada renderer decodifica a sua textura
// dele, sobe para a GPU e solta a imagem decodificada (4 MB por atlas no celular, 16 MB na tela grande, que
// ficariam presos na memória só para o modal poder subir a mesma textura de novo).
function texturaDe(blob) {
  const pronta = img => {
    const t = new Texture(img);
    t.colorSpace = SRGBColorSpace;
    t.flipY = false; // UV do glTF
    t.wrapS = t.wrapT = ClampToEdgeWrapping;
    t.minFilter = LinearMipmapLinearFilter;
    t.magFilter = LinearFilter;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  };
  const porImg = () => new Promise((ok, erro) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => { URL.revokeObjectURL(url); ok(pronta(img)); };
    img.onerror = () => { URL.revokeObjectURL(url); erro(new Error('atlas não decodificou')); };
    img.src = url;
  });
  // ImageBitmap decodifica fora da thread principal; onde não existe ou falha (Safari antigo), cai no <img>
  if (typeof createImageBitmap !== 'function') return porImg();
  return createImageBitmap(blob).then(pronta).catch(porImg);
}

/** sobe a textura para a GPU já (não no primeiro quadro em que a peça aparece) e solta a imagem decodificada */
function subir(renderer, tex) {
  renderer.initTexture(tex);
  tex.source.data?.close?.();
}

const baixar = url => fetch(url).then(r => { if (!r.ok) throw new Error(`${r.status} em ${url}`); return r.blob(); });

/** p: { chave, modelo, atlas } → { geo, matriz, atlas (Blob) }, uma vez por peça; o cano e o modal dividem */
export function carregarPeca(p) {
  if (!cache.has(p.chave)) {
    const promessa = Promise.all([geometria(p.modelo), baixar(p.atlas)]).then(([g, atlas]) => ({ ...g, atlas }));
    promessa.catch(() => cache.delete(p.chave));
    cache.set(p.chave, promessa);
  }
  return cache.get(p.chave);
}

// ---------- materiais ----------
const VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalMatrix * normal;
    vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;

// tecido: o atlas já tem a luz do estúdio; aqui só entra o que muda quando a peça gira (a face que olha para a luz
// clareia, a que foge escurece um pouco) e o brilho rasante da fibra na borda
// some: a cópia que entra e sai por cima das vizinhas (ver "por cima" em criarPalco3d), com opacidade
const tecido = (tex, some = false) => new ShaderMaterial({
  uniforms: { mapa: { value: tex }, opacidade: { value: 1 } },
  transparent: some,
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
    uniform sampler2D mapa; uniform float opacidade;
    varying vec2 vUv; varying vec3 vN; varying vec3 vV;
    const vec3 LUZ = vec3(-0.348, 0.497, 0.795); // de cima, da frente e um pouco da esquerda (espaço da câmera)
    void main() {
      vec3 n = normalize(vN);
      vec3 v = normalize(vV);
      vec3 cor = texture2D(mapa, vUv).rgb;
      float chave = max(dot(n, LUZ), 0.0);
      float ceu = 0.5 + 0.5 * n.y;
      float luz = 0.56 + 0.14 * ceu + 0.47 * chave;
      float borda = pow(1.0 - max(dot(n, v), 0.0), 3.0);
      cor = cor * luz + vec3(0.05) * borda;
      gl_FragColor = vec4(cor, opacidade);
      #include <colorspace_fragment>
    }`,
});

// arame cromado do gancho: um "matcap" de conta (claro em cima, escuro embaixo) e um ponto de brilho
const arame = (some = false) => new ShaderMaterial({
  uniforms: { opacidade: { value: 1 } },
  transparent: some,
  vertexShader: VERT,
  fragmentShader: /* glsl */ `
    uniform float opacidade;
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec3 n = normalize(vN);
      vec3 v = normalize(vV);
      float m = 0.5 + 0.5 * n.y;
      vec3 cor = mix(vec3(0.10, 0.105, 0.115), vec3(0.80, 0.82, 0.84), smoothstep(0.1, 0.9, m));
      cor = mix(cor, vec3(0.18, 0.19, 0.2), smoothstep(0.35, 0.0, abs(n.y)) * 0.55); // faixa escura do horizonte
      float brilho = pow(max(dot(n, normalize(vec3(-0.35, 0.6, 0.72) + v)), 0.0), 48.0);
      gl_FragColor = vec4(cor + brilho * 0.9, opacidade);
      #include <colorspace_fragment>
    }`,
});

// ---------- gancho ----------
// Em px, no plano da peça, com a origem no centro do cano (o gancho se apoia nele): sobe a haste desde a madeira,
// faz a volta por cima do cano e desce do outro lado com a ponta virada.
//   base   y da ponta de baixo da haste (negativo: abaixo do cano)
//   raio   raio do cano
//   fio    raio do arame
//   folga  quanto a volta é mais larga que o cano (gancho de cabide de verdade sobra em volta do cano)
const voltaDoGancho = (raio, fio, folga) => raio + fio + folga; // raio da linha de centro da volta
function geometriaDoGancho({ base, raio, fio, folga }) {
  const R = voltaDoGancho(raio, fio, folga);
  const cy = raio + fio - R; // centro da volta: a parte de cima encosta no cano
  // a haste sobe reta desde dentro da madeira e abre para a direita antes de entrar na volta
  const entrada = cy - R * 1.28;
  const pts = [new Vector3(0, base - fio * 2, 0), new Vector3(0, base + (entrada - base) * 0.45, 0), new Vector3(R * 0.18, entrada, 0)];
  // a volta: da direita de baixo (onde a haste chega), pela direita e por cima, até a ponta à esquerda
  const de = -62 * Math.PI / 180;
  const ate = 208 * Math.PI / 180;
  const N = 13;
  for (let k = 0; k <= N; k++) {
    const a = de + (ate - de) * (k / N);
    pts.push(new Vector3(Math.cos(a) * R, cy + Math.sin(a) * R, 0));
  }
  const curva = new CatmullRomCurve3(pts, false, 'centripetal');
  const tubo = new TubeGeometry(curva, 56, fio, 8, false);
  const ponta = pts[pts.length - 1];
  const bola = new SphereGeometry(fio * 1.02, 8, 6);
  bola.translate(ponta.x, ponta.y, ponta.z);
  return [tubo, bola];
}

// ---------- uma peça montada ----------
// grupo (no centro do cano; balanço em z) → giro (em y, pela haste) → corpo (a malha, em escala) + gancho
// A textura é de quem monta (cada renderer decodifica a sua do atlas guardado): soltar() a devolve.
function montarPeca(dados, medidas, tex) {
  const grupo = new Group();
  const giro = new Group();
  const corpo = new Group();
  const matTecido = tecido(tex);
  const malha = new Mesh(dados.geo, matTecido);
  malha.matrixAutoUpdate = false;
  malha.matrix.copy(dados.matriz);
  corpo.add(malha);
  const ferro = new Group();
  giro.add(corpo, ferro);
  grupo.add(giro);
  const matArame = arame();
  let pecasDoGancho = [];
  // materiais da cópia "por cima" (só o cano usa; nascem na primeira vez)
  let tecidoSome = null;
  let arameSome = null;

  /** opacidade < 1: troca para os materiais com transparência; soProfundidade: desenha só no buffer de
      profundidade (a passada de cor que vem depois pinta só a casca de fora, sem a de dentro vazar) */
  const camada = (opacidade, soProfundidade = false) => {
    const some = opacidade < 0.999;
    if (some && !tecidoSome) { tecidoSome = tecido(tex, true); arameSome = arame(true); }
    const mt = some ? tecidoSome : matTecido;
    const ma = some ? arameSome : matArame;
    mt.uniforms.opacidade.value = ma.uniforms.opacidade.value = some ? opacidade : 1;
    mt.colorWrite = ma.colorWrite = !soProfundidade;
    malha.material = mt;
    for (const g of pecasDoGancho) g.material = ma;
  };

  /** altura: px da peça inteira (do topo do gancho da foto à barra); raio: do cano; achata: escala em z */
  const medir = ({ altura, raio, achata = 1 }) => {
    const fio = Math.max(1.05, altura * 0.0031);
    const folga = Math.max(1.6, altura * 0.0062);
    const volta = 2 * voltaDoGancho(raio, fio, folga) + 2 * fio; // altura da volta do gancho
    const haste = Math.max(medidas.corte * altura, volta + 3 + fio); // do topo da volta até a madeira
    const topo = raio + 2 * fio; // topo do gancho acima do centro do cano
    // a malha tem y = 0 no topo do gancho da foto e a madeira em y = -corte
    corpo.scale.set(altura, altura, altura * achata);
    corpo.position.y = topo - haste + medidas.corte * altura;
    for (const g of pecasDoGancho) { ferro.remove(g); g.geometry.dispose(); }
    pecasDoGancho = geometriaDoGancho({ base: topo - haste, raio, fio, folga }).map(g => new Mesh(g, matArame));
    ferro.add(...pecasDoGancho);
    return { topo, haste };
  };

  const soltar = () => {
    tex.dispose();
    matTecido.dispose();
    matArame.dispose();
    tecidoSome?.dispose();
    arameSome?.dispose();
    for (const g of pecasDoGancho) g.geometry.dispose();
  };
  return { grupo, giro, corpo, medir, camada, soltar };
}

function novoRenderer(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

const teto = celular => Math.min(window.devicePixelRatio || 1, celular ? 1.5 : 2);

// ---------- o cano ----------
export function criarPalco3d({ canvas, pecas, celular, aoCarregar, aoFalhar }) {
  const renderer = novoRenderer(canvas);
  const cena = new Scene();
  const camera = new PerspectiveCamera(20, 1, 10, 10000);
  const n = pecas.length;
  const montadas = new Array(n).fill(null);
  const dados = new Array(n).fill(null);
  const poses = Array.from({ length: n }, () => ({ x: 0, balanco: 0, abertura: 0, fora: false }));
  // giro: ângulo da peça em repouso (rad, negativo: a frente olha para a esquerda); achata: profundidade das malhas
  // no cano (as roupas se apertam); saida: quanto a peça virada vem para a frente das vizinhas, em alturas de peça
  let m = { largura: 1, altura: 1, alturaPeca: 400, canoY: 60, canoRaio: 4, canoInicio: 0, canoFim: 1, giro: -1.05, achata: 0.6, saida: 0.12 };
  let dist = 1000;
  let naTela = false;
  let sujo = true;
  let pedido = 0;
  let morto = false;

  // o cano de verdade é o de CSS, por baixo do canvas; aqui ele só entra na profundidade (sem cor), para a parte
  // de trás da volta do gancho sumir atrás dele
  const cano = new Mesh(new CylinderGeometry(1, 1, 1, 16, 1, true), new MeshBasicMaterial({ colorWrite: false }));
  cano.rotation.z = Math.PI / 2;
  cano.renderOrder = -1;
  cena.add(cano);

  const posar = i => {
    const p = montadas[i];
    if (!p) return;
    const s = poses[i];
    const cx = m.largura / 2;
    const cy = -m.altura / 2;
    const y = -m.canoY;
    // a peça virada vem para a frente pela linha de visão: o gancho continua em cima do cano na tela
    const f = (m.saida * m.alturaPeca / dist) * s.abertura;
    p.grupo.position.set(s.x + (cx - s.x) * f, y + (cy - y) * f, dist * f);
    p.grupo.rotation.z = -s.balanco;
    p.giro.rotation.y = (m.giro + DESALINHO[i % DESALINHO.length]) * (1 - s.abertura)
      + Math.atan2(cx - s.x, dist) * COMPENSA * (1 - s.abertura * 0.5);
    p.grupo.visible = !s.fora;
  };

  // Por cima: a peça virada (ou virando) é desenhada de novo depois de todas, com a profundidade zerada. No cano
  // do celular as peças ficam coladas e não há como girar uma delas sem atravessar as vizinhas; desenhada por
  // cima, ela nunca aparece cortada por uma vizinha nem cortando uma. Nos primeiros 22 % do virar essa cópia entra
  // em transparência (e sai assim na volta), para a parte que estava atrás da vizinha não surgir de um quadro
  // para o outro. A cópia de baixo continua no lugar dela: onde aparece, coincide com a de cima.
  renderer.autoClear = false;
  const porCima = [];
  const pintar = () => {
    renderer.clear();
    renderer.render(cena, camera);
    porCima.length = 0;
    for (let i = 0; i < n; i++) if (montadas[i] && !poses[i].fora && poses[i].abertura > 0.002) porCima.push(i);
    if (!porCima.length) return;
    porCima.sort((a, b) => poses[a].abertura - poses[b].abertura); // a mais virada por último, na frente
    for (const p of montadas) if (p) p.grupo.visible = false;
    for (const i of porCima) {
      const p = montadas[i];
      const t = Math.min(1, poses[i].abertura / 0.22);
      const opacidade = t * t * (3 - 2 * t);
      p.grupo.visible = true;
      renderer.clearDepth();
      if (opacidade < 0.999) {
        p.camada(opacidade, true);
        renderer.render(cena, camera);
        p.camada(opacidade);
        renderer.render(cena, camera);
        p.camada(1);
      } else renderer.render(cena, camera);
      p.grupo.visible = false;
    }
    for (let i = 0; i < n; i++) if (montadas[i]) montadas[i].grupo.visible = !poses[i].fora;
  };
  const desenhar = () => {
    if (morto) return;
    if (!naTela) { sujo = true; return; }
    sujo = false;
    pintar();
  };
  const pedir = () => {
    sujo = true;
    if (pedido || morto) return;
    pedido = requestAnimationFrame(() => { pedido = 0; if (sujo) desenhar(); });
  };

  const medirTudo = () => {
    const dpr = teto(celular());
    // teto de pixels: telas muito largas não pagam um canvas gigante
    const escala = Math.min(1, Math.sqrt(5.5e6 / (m.largura * m.altura * dpr * dpr)));
    renderer.setPixelRatio(dpr * escala);
    renderer.setSize(m.largura, m.altura, false);
    dist = m.alturaPeca * LENTE;
    camera.fov = 2 * Math.atan(m.altura / 2 / dist) * 180 / Math.PI;
    camera.aspect = m.largura / m.altura;
    // perto e longe justos em volta das peças: a malha é uma casca fina (frente e avesso a menos de 1 px), e com a
    // profundidade folgada um buffer de 16 bits (WebKit em software, GPUs antigas) mistura as duas
    camera.near = dist - m.alturaPeca * (1 + m.saida);
    camera.far = dist + m.alturaPeca * 1.1;
    camera.position.set(m.largura / 2, -m.altura / 2, dist);
    camera.updateProjectionMatrix();
    cano.scale.set(m.canoRaio, m.canoFim - m.canoInicio, m.canoRaio);
    cano.position.set((m.canoInicio + m.canoFim) / 2, -m.canoY, 0);
    for (let i = 0; i < n; i++) {
      montadas[i]?.medir({ altura: m.alturaPeca, raio: m.canoRaio, achata: m.achata });
      posar(i);
    }
    pedir();
  };

  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); morto = true; aoFalhar?.(new Error('contexto WebGL perdido')); });

  // cada peça entra quando o modelo e o atlas dela chegam
  pecas.forEach((p, i) => {
    if (!p) return; // peça sem modelo: a seção deixa a foto
    carregarPeca(p).then(d => texturaDe(d.atlas).then(tex => {
      if (morto) { tex.dispose(); tex.source.data?.close?.(); return; }
      const peca = montarPeca(d, p, tex);
      dados[i] = d;
      montadas[i] = peca;
      peca.medir({ altura: m.alturaPeca, raio: m.canoRaio, achata: m.achata });
      cena.add(peca.grupo);
      subir(renderer, tex);
      posar(i);
      // um desenho já, mesmo fora da tela: compila o sombreador e sobe a malha agora, não quando a seção aparece
      pintar();
      aoCarregar?.(i);
    })).catch(e => { if (!morto) aoFalhar?.(e, i); });
  });

  return {
    /** medidas do palco em px de CSS: { largura, altura, alturaPeca, canoY (centro), canoRaio, canoInicio, canoFim }
        e os ajustes por aparelho: { giro, achata, saida } */
    medir(novas) { m = { ...m, ...novas }; medirTudo(); },
    /** a física escreve a pose de cada peça; desenhar() fecha o quadro */
    posar(i, { x, balanco, abertura }) {
      const s = poses[i];
      s.x = x; s.balanco = balanco; s.abertura = abertura;
      posar(i);
      sujo = true;
    },
    desenhar,
    pedir,
    /** a peça saiu do cano (está no modal) */
    esconder(i, sim) { poses[i].fora = sim; posar(i); pedir(); },
    pronta: i => !!montadas[i],
    /** o ângulo com que a peça está agora (o modal recebe a peça nesse ângulo) */
    giro: i => montadas[i]?.giro.rotation.y ?? 0,
    /** geometria e textura da peça, para o modal montar a dele */
    dados: i => dados[i],
    /** fora da tela não desenha; ao voltar, desenha o que ficou pendente */
    naTela(sim) { naTela = sim; if (sim && sujo) pedir(); },
    destruir() {
      morto = true;
      cancelAnimationFrame(pedido);
      for (const p of montadas) p?.soltar();
      cano.geometry.dispose();
      cano.material.dispose();
      renderer.dispose();
    },
  };
}

// ---------- o modal ----------
// Um renderer pequeno só para a peça fora do cano (o <dialog> fica na camada de cima do navegador: o canvas do
// cano não passa por cima dele). Geometria e textura são as mesmas do cano (carregarPeca guarda).
// O giro é uma mola: girarPara(ângulo) leva a um ângulo; girarSozinha(vel) faz o alvo andar devagar (a peça gira
// sozinha enquanto o modal está aberto); segurar/mover/soltar deixam girar no dedo, e ao soltar a peça segue o
// impulso e volta a girar sozinha no sentido do arrasto.
export function criarVitrine3d({ canvas, celular }) {
  const renderer = novoRenderer(canvas);
  const cena = new Scene();
  const camera = new PerspectiveCamera(20, 1, 10, 10000);
  const RAIO = 4; // px: o cano de onde a peça saiu (dá o tamanho da volta do gancho)
  let peca = null;
  let medidas = null;
  let tam = { largura: 1, altura: 1 };
  let quadro = { cx: 0, cy: 0, altura: 1 };
  let ang = 0, vel = 0, alvo = 0; // giro (rad)
  let sozinha = 0, sentido = 1; // giro sozinho (rad/s) e o sentido dele (o do último arrasto)
  let th = 0, w = 0; // balanço (rad)
  let seguro = false;
  let rodando = 0;
  let ultimo = 0;
  let parado = false;
  let morto = false;

  // a cena do modal também é em px de CSS (como a do cano): o gancho sai com a mesma espessura de arame
  const enquadrar = () => {
    if (!medidas) return;
    renderer.setPixelRatio(teto(celular()));
    renderer.setSize(tam.largura, tam.altura, false);
    // a peça (com o gancho) cabe em 84 % da largura da caixa e em 86 % da altura
    const largPeca = (medidas.caixa.x1 - medidas.caixa.x0) * 1.04;
    const px = Math.min(tam.altura * 0.86, (tam.largura * 0.84) / largPeca); // px por altura de peça
    const dist = LENTE * px;
    camera.fov = 2 * Math.atan(tam.altura / 2 / dist) * 180 / Math.PI;
    camera.aspect = tam.largura / tam.altura;
    camera.near = dist - px * 0.9;
    camera.far = dist + px * 0.9;
    quadro = { cx: tam.largura / 2, cy: tam.altura / 2, altura: px };
    if (!peca) return; // a malha ainda está chegando: o enquadramento já vale para o voo
    const { topo } = peca.medir({ altura: px, raio: RAIO, achata: 1 });
    // a câmera olha para o meio da peça: do topo do gancho (topo) até a barra (topo - px)
    const cx = (medidas.caixa.x0 + medidas.caixa.x1) / 2 * px;
    camera.position.set(cx, topo - px / 2, dist);
    camera.updateProjectionMatrix();
  };

  const pintar = () => {
    if (!peca || morto) return;
    peca.giro.rotation.y = ang;
    peca.grupo.rotation.z = th;
    renderer.render(cena, camera);
  };

  const passo = t => {
    rodando = 0;
    const dt = Math.min(0.033, (t - ultimo) / 1000 || 0.016);
    ultimo = t;
    let mexe = false;
    if (!seguro) {
      if (sozinha && !parado) { alvo += sozinha * sentido * dt; mexe = true; }
      // mola do giro: firme, quase sem passar do ponto
      const k = 46, c = 11.5;
      vel += (-k * (ang - alvo) - c * vel) * dt;
      ang += vel * dt;
      if (Math.abs(ang - alvo) > 0.0015 || Math.abs(vel) > 0.01) mexe = true; else { ang = alvo; vel = 0; }
    } else mexe = true;
    if (!parado) {
      w += (-38 * th - 3.4 * w) * dt;
      th += w * dt;
      if (Math.abs(th) > 0.0006 || Math.abs(w) > 0.004) mexe = true; else { th = 0; w = 0; }
    }
    pintar();
    if (mexe) acordar();
  };
  const acordar = () => {
    if (rodando || morto) return;
    if (!rodando) ultimo = performance.now();
    rodando = requestAnimationFrame(passo);
  };

  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); morto = true; });

  let vez = 0; // a peça pedida por último: uma textura que chega depois de fechar ou trocar é descartada
  const soltarPeca = () => {
    vez++;
    if (!peca) return;
    cena.remove(peca.grupo);
    peca.soltar();
    peca = null;
    renderer.clear();
  };

  return {
    /** troca a peça; giro0 = ângulo com que ela chega do cano. Devolve false se o 3D não está de pé. */
    mostrar(dados, p, { giro0 = 0, semMovimento = false } = {}) {
      if (morto) return false;
      soltarPeca();
      medidas = p;
      parado = semMovimento;
      ang = alvo = giro0;
      vel = 0; th = 0; w = 0;
      sozinha = 0; sentido = 1;
      enquadrar();
      // a textura do modal sai do mesmo atlas guardado (decodifica em poucos ms, atrás da entrada do modal); o
      // giro e o balanço já correm enquanto isso
      const esta = ++vez;
      texturaDe(dados.atlas).then(tex => {
        if (esta !== vez || morto) { tex.dispose(); tex.source.data?.close?.(); return; }
        peca = montarPeca(dados, p, tex);
        cena.add(peca.grupo);
        enquadrar();
        subir(renderer, tex);
        pintar();
      }).catch(() => { morto = true; });
      return true;
    },
    medir(novo) { tam = novo; enquadrar(); pintar(); },
    /** onde a peça fica dentro do canvas, em px de CSS: { cx, cy, altura } (para o voo desde o cano) */
    quadro: () => quadro,
    girarPara(a, { jaJa = false } = {}) {
      alvo = a;
      if (jaJa || parado) { ang = a; vel = 0; pintar(); return; }
      acordar();
    },
    /** gira sozinha a vel rad/s (0 para) */
    girarSozinha(v) { sozinha = v; acordar(); },
    /** empurrão no balanço (a peça chega do cano e balança um pouco) */
    balancar(v) { if (!parado) { w += v; acordar(); } },
    segurar() { seguro = true; vel = 0; acordar(); },
    mover(dAng) { if (seguro) { ang += dAng; vel = dAng * 60; } },
    /** solta: a peça segue um pouco o impulso e o giro sozinho continua no sentido do arrasto */
    soltar() {
      seguro = false;
      alvo = ang + vel * 0.12;
      if (Math.abs(vel) > 0.3) sentido = Math.sign(vel);
      acordar();
    },
    angulo: () => ang,
    alvo: () => alvo,
    limpar() {
      cancelAnimationFrame(rodando);
      rodando = 0;
      sozinha = 0;
      soltarPeca();
    },
    morto: () => morto,
    destruir() { morto = true; cancelAnimationFrame(rodando); peca?.soltar(); renderer.dispose(); },
  };
}
