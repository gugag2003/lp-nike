// Esferas de vidro em WebGL: uma lente hemisférica sobre a foto do cenário (aumenta o meio, comprime a borda),
// dispersão de cor na borda, fresnel, reflexo de janela e aro. Ótica portada das glass-spheres do glass-portfolio
// (src/lib/glass-shaders.ts), só a passada nítida: aqui são quatro esferas pequenas, sem desfoque de profundidade.
//
// Um canvas só desenha as quatro. Cada esfera é um botão de verdade por cima (o canvas não recebe clique);
// o laço lê a posição de cada botão e anima o raio (hover e ativo). Sem WebGL, os botões mostram a foto num círculo.

const VERT = `
attribute vec2 a_pos;
uniform vec2 u_res;
uniform vec2 u_centro;
uniform float u_raio;
varying vec2 v_p;
void main() {
  v_p = a_pos * (1.0 + 2.0 / u_raio);
  vec2 p = (u_centro + v_p * u_raio) / u_res;
  gl_Position = vec4(p * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D u_img;
uniform float u_tempo;
uniform float u_raio;
uniform float u_giro;
uniform float u_lente;
varying vec2 v_p;

vec3 foto(vec2 uv) { return texture2D(u_img, clamp(uv, 0.001, 0.999)).rgb; }

void main() {
  vec2 p = v_p;
  float r = length(p);
  float alfa = 1.0 - smoothstep(1.0 - 1.5 / u_raio, 1.0, r);
  if (r >= 1.0) { gl_FragColor = vec4(0.0); return; }
  float z = sqrt(max(0.0, 1.0 - r * r));
  vec3 normal = vec3(p, z);
  float borda = smoothstep(0.62, 1.0, r);
  float ang = atan(p.y, p.x);
  float onda = sin(ang * 5.0 + u_tempo * 0.65) * sin(ang * 3.0 - u_tempo * 0.4);
  // lente: aumenta o meio e comprime a foto na borda; u_lente sobe no hover (o vidro "aproxima" a cena)
  vec2 lente = p / (1.0 + z * u_lente);
  lente += p * borda * onda * 0.045;
  float c = cos(u_giro), s = sin(u_giro);
  lente = mat2(c, -s, s, c) * lente;
  vec2 uv = lente * 0.5 + 0.5;
  float disp = borda * borda * 0.012;
  vec3 cor = vec3(foto(uv + p * disp).r, foto(uv).g, foto(uv - p * disp).b);
  float fresnel = pow(1.0 - z, 3.0);
  vec3 luz = normalize(vec3(-0.55, -0.65, 0.7));
  float brilho = pow(max(dot(normal, luz), 0.0), 70.0);
  vec2 h = mat2(0.82, -0.57, 0.57, 0.82) * (p - vec2(-0.43, -0.58));
  float janela = exp(-pow(abs(h.x) / 0.10, 4.0) - pow(abs(h.y) / 0.22, 4.0));
  float lado = exp(-pow(abs(r - 0.91) / 0.035, 2.0))
             * pow(max(dot(normalize(p + vec2(0.0001)), normalize(vec2(0.9, -0.3))), 0.0), 22.0);
  float aro = exp(-pow(abs(r - 0.963) / 0.018, 2.0));
  float aroDentro = exp(-pow(abs(r - 0.927) / 0.019, 2.0));
  cor *= 1.0 - (fresnel * 0.23 + aroDentro * 0.13);
  cor = mix(cor, vec3(0.96, 0.98, 1.0), fresnel * 0.24);
  cor += brilho * 0.24 + aro * 0.16;
  cor = mix(cor, vec3(1.0), janela * 0.38 + lado * 0.26);
  gl_FragColor = vec4(cor * alfa, alfa);
}`;

const LENTE = 1.4; // a das glass-spheres
const LENTE_HOVER = 0.75; // menos compressão: a cena aparece maior dentro do vidro

/**
 * @param {HTMLCanvasElement} canvas  cobre o grupo de botões (mesma caixa)
 * @param {HTMLElement[]} botoes      um por esfera, na ordem das texturas
 * @param {string[]} texturas         URL da foto de cada esfera
 * @param {{ parado: boolean }} opcoes parado = movimento reduzido (desenha só quando algo muda)
 * @returns {{ ok: boolean, marcar: (i: number|null) => void }}
 */
export function criarVidro(canvas, botoes, texturas, { parado = false } = {}) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true });
  if (!gl) return { ok: false, marcar() {} };

  const compilar = (tipo, fonte) => {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, fonte);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'a_pos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
  } catch (e) {
    console.warn('[vidro]', e);
    return { ok: false, marcar() {} };
  }
  gl.useProgram(prog);
  const u = Object.fromEntries(['res', 'centro', 'raio', 'img', 'tempo', 'giro', 'lente'].map(n => [n, gl.getUniformLocation(prog, `u_${n}`)]));
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  // estado de cada esfera: escala e lente animadas até o alvo (hover, ativo)
  const esferas = botoes.map((botao, i) => ({ botao, tex: null, escala: 1, lente: LENTE, hover: false, giro: i * 1.7 }));
  let ativo = null;
  let sujo = true;
  let redesenharAte = 0; // o scale do botão ativo é transição de CSS: segue redesenhando enquanto ela anda

  texturas.forEach((src, i) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      esferas[i].tex = tex;
      sujo = true;
    };
    img.src = src;
  });

  for (const e of esferas) {
    const entra = () => ((e.hover = true), (sujo = true));
    const sai = () => ((e.hover = false), (sujo = true));
    e.botao.addEventListener('pointerenter', entra);
    e.botao.addEventListener('pointerleave', sai);
    e.botao.addEventListener('focus', () => e.botao.matches(':focus-visible') && entra());
    e.botao.addEventListener('blur', sai);
  }

  let largura = 0;
  let altura = 0;
  const medir = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    largura = r.width;
    altura = r.height;
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    sujo = true;
  };
  new ResizeObserver(medir).observe(canvas);
  medir();

  let visivel = true;
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(canvas);

  const t0 = performance.now();
  let antes = t0;
  const quadro = agora => {
    requestAnimationFrame(quadro);
    const dt = Math.min(0.05, (agora - antes) / 1000);
    antes = agora;
    if (!visivel || document.hidden || !largura) return;

    // aproxima escala e lente do alvo (~0,25 s); com movimento reduzido, pula direto
    let andando = false;
    const k = parado ? 1 : 1 - Math.exp(-dt * 14);
    for (const [i, e] of esferas.entries()) {
      // a ativa já vem maior pelo CSS (scale no botão); o hover soma um pouco por cima
      const escalaAlvo = e.hover ? (i === ativo ? 1.04 : 1.1) : 1;
      const lenteAlvo = e.hover ? LENTE_HOVER : LENTE;
      e.escala += (escalaAlvo - e.escala) * k;
      e.lente += (lenteAlvo - e.lente) * k;
      if (Math.abs(escalaAlvo - e.escala) > 0.001 || Math.abs(lenteAlvo - e.lente) > 0.001) andando = true;
    }
    // a onda da borda anda sempre (é o que faz parecer vidro); parado = só quando algo muda
    if (parado && !andando && !sujo && agora > redesenharAte) return;
    sujo = false;

    const caixa = canvas.getBoundingClientRect();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.res, largura, altura);
    gl.uniform1f(u.tempo, parado ? 0 : (agora - t0) / 1000);
    for (const e of esferas) {
      if (!e.tex) continue;
      const r = e.botao.getBoundingClientRect();
      gl.uniform2f(u.centro, r.left - caixa.left + r.width / 2, r.top - caixa.top + r.height / 2);
      gl.uniform1f(u.raio, (r.width / 2) * e.escala);
      // a foto gira devagar dentro do vidro, cada esfera no seu tempo (parado: fica quieta)
      gl.uniform1f(u.giro, parado ? 0 : Math.sin((agora - t0) / 1000 * 0.45 + e.giro) * 0.16);
      gl.uniform1f(u.lente, e.lente);
      gl.bindTexture(gl.TEXTURE_2D, e.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };
  requestAnimationFrame(quadro);

  return {
    ok: true,
    marcar(i) {
      ativo = i;
      sujo = true;
      redesenharAte = performance.now() + 600;
    },
  };
}
