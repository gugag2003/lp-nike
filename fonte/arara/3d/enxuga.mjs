// Enxuga o .glb bruto do Tripo (1,4 M de triângulos, ~45 MB) antes do Blender, que com a malha inteira leva
// minutos e gigabytes: lê posição e índices direto do arquivo, solda os vértices pela posição (o bruto vem
// cortado nas costuras do UV dele) e simplifica com o meshoptimizer em duas malhas, só de posição:
//   saida/<NN>-alta.glb   ~300 mil triângulos: de onde o Blender assa a luz (dobras, frestas, oclusão)
//   saida/<NN>-leve.glb   a malha do site (30 mil; 22 mil nas camisetas), ainda com o gancho de arame
// e guarda a cor que o Tripo deu a cada vértice (lida da textura dele pelo UV), que o prepara.py usa só como mapa
// de "que parte da peça é esta" nas laterais que as fotos não veem:
//   saida/<NN>-tripo-pos.f32 (x, y, z por vértice, no referencial do glTF) e <NN>-tripo-cor.u8 (r, g, b em sRGB)
//
// Rodar da raiz do repo: node templates/prega/fonte/arara/3d/enxuga.mjs <NN> [--tris 30000] [--so-cor]
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(aqui, '../../../../../package.json'));
const { MeshoptSimplifier } = require('meshoptimizer');
const sharp = require('sharp');
await MeshoptSimplifier.ready;

const args = process.argv.slice(2);
const id = args[0];
const TRIS = args.includes('--tris') ? Number(args[args.indexOf('--tris') + 1]) : 30000;
const ALTA = 300000;
mkdirSync(join(aqui, 'saida'), { recursive: true });

// ---------- lê o GLB ----------
const glb = readFileSync(join(aqui, 'bruto', `${id}-tripo.glb`));
const tamJson = glb.readUInt32LE(12);
const json = JSON.parse(glb.subarray(20, 20 + tamJson).toString('utf8'));
const bin = glb.subarray(20 + tamJson + 8);
const no = json.nodes.find(n => n.mesh != null);
const prim = json.meshes[no.mesh].primitives[0];
const acessor = (i, Tipo, porItem) => {
  const a = json.accessors[i];
  const v = json.bufferViews[a.bufferView];
  const ini = bin.byteOffset + (v.byteOffset || 0) + (a.byteOffset || 0);
  return new Tipo(bin.buffer.slice(ini, ini + a.count * porItem * Tipo.BYTES_PER_ELEMENT));
};
const pos = acessor(prim.attributes.POSITION, Float32Array, 3);
const ia = json.accessors[prim.indices];
const ind = ia.componentType === 5125 ? acessor(prim.indices, Uint32Array, 1) : Uint32Array.from(acessor(prim.indices, Uint16Array, 1));
// a matriz do nó (o Tripo gira a peça um pouco para alinhar com a foto) entra nos vértices
if (no.matrix) {
  const m = no.matrix;
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    pos[i] = m[0] * x + m[4] * y + m[8] * z + m[12];
    pos[i + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    pos[i + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
  }
}

// ---------- a cor do Tripo em cada vértice ----------
{
  const uv = acessor(prim.attributes.TEXCOORD_0, Float32Array, 2);
  const mat = json.materials[prim.material];
  const img = json.images[json.textures[mat.pbrMetallicRoughness.baseColorTexture.index].source];
  const v = json.bufferViews[img.bufferView];
  const { data, info } = await sharp(bin.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = pos.length / 3;
  const cor = new Uint8Array(n * 3);
  for (let i = 0; i < n; i++) {
    const x = Math.min(info.width - 1, Math.max(0, Math.floor(uv[i * 2] * info.width)));
    const y = Math.min(info.height - 1, Math.max(0, Math.floor(uv[i * 2 + 1] * info.height)));
    const o = (y * info.width + x) * 3;
    cor[i * 3] = data[o]; cor[i * 3 + 1] = data[o + 1]; cor[i * 3 + 2] = data[o + 2];
  }
  writeFileSync(join(aqui, 'saida', `${id}-tripo-pos.f32`), Buffer.from(pos.buffer, pos.byteOffset, pos.byteLength));
  writeFileSync(join(aqui, 'saida', `${id}-tripo-cor.u8`), Buffer.from(cor.buffer));
  console.log(id, `cor do Tripo em ${n} vértices (textura ${info.width}×${info.height})`);
}
if (args.includes('--so-cor')) process.exit(0);

// ---------- solda pela posição ----------
const mapa = new Map();
const novo = new Uint32Array(pos.length / 3);
const soldada = [];
for (let i = 0; i < pos.length / 3; i++) {
  const k = `${Math.round(pos[i * 3] * 2e5)},${Math.round(pos[i * 3 + 1] * 2e5)},${Math.round(pos[i * 3 + 2] * 2e5)}`;
  let j = mapa.get(k);
  if (j === undefined) { j = soldada.length / 3; mapa.set(k, j); soldada.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); }
  novo[i] = j;
}
const P = new Float32Array(soldada);
const I = new Uint32Array(ind.length);
let k = 0;
for (let t = 0; t < ind.length; t += 3) {
  const a = novo[ind[t]], b = novo[ind[t + 1]], c = novo[ind[t + 2]];
  if (a === b || b === c || a === c) continue; // triângulo que a solda achatou
  I[k++] = a; I[k++] = b; I[k++] = c;
}
const indices = I.subarray(0, k);
console.log(id, `bruto ${ind.length / 3} triângulos, ${pos.length / 3} vértices → soldados ${P.length / 3}`);

// ---------- simplifica e grava ----------
function gravar(nome, tris, erro) {
  const [simples] = MeshoptSimplifier.simplify(indices, P, 3, tris * 3, erro);
  // só os vértices usados
  const usado = new Int32Array(P.length / 3).fill(-1);
  const p2 = [];
  const i2 = new Uint32Array(simples.length);
  for (let t = 0; t < simples.length; t++) {
    const v = simples[t];
    if (usado[v] < 0) { usado[v] = p2.length / 3; p2.push(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]); }
    i2[t] = usado[v];
  }
  const pf = new Float32Array(p2);
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let v = 0; v < pf.length; v += 3) for (let c = 0; c < 3; c++) { mn[c] = Math.min(mn[c], pf[v + c]); mx[c] = Math.max(mx[c], pf[v + c]); }
  const corpo = Buffer.concat([Buffer.from(i2.buffer), Buffer.from(pf.buffer)]);
  const j = {
    asset: { version: '2.0', generator: 'enxuga.mjs' },
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: nome }],
    meshes: [{ primitives: [{ attributes: { POSITION: 1 }, indices: 0, mode: 4 }] }],
    buffers: [{ byteLength: corpo.length }],
    bufferViews: [{ buffer: 0, byteOffset: 0, byteLength: i2.byteLength, target: 34963 }, { buffer: 0, byteOffset: i2.byteLength, byteLength: pf.byteLength, target: 34962 }],
    accessors: [{ bufferView: 0, componentType: 5125, count: i2.length, type: 'SCALAR' }, { bufferView: 1, componentType: 5126, count: pf.length / 3, type: 'VEC3', min: mn, max: mx }],
  };
  let texto = Buffer.from(JSON.stringify(j));
  texto = Buffer.concat([texto, Buffer.alloc((4 - (texto.length % 4)) % 4, 0x20)]);
  const cab = Buffer.alloc(12);
  cab.writeUInt32LE(0x46546c67, 0); cab.writeUInt32LE(2, 4); cab.writeUInt32LE(12 + 8 + texto.length + 8 + corpo.length, 8);
  const c1 = Buffer.alloc(8); c1.writeUInt32LE(texto.length, 0); c1.writeUInt32LE(0x4e4f534a, 4);
  const c2 = Buffer.alloc(8); c2.writeUInt32LE(corpo.length, 0); c2.writeUInt32LE(0x004e4942, 4);
  writeFileSync(join(aqui, 'saida', `${id}-${nome}.glb`), Buffer.concat([cab, c1, texto, c2, corpo]));
  console.log(id, nome, `${i2.length / 3} triângulos, ${pf.length / 3} vértices`);
}
gravar('alta', ALTA, 0.0005);
gravar('leve', TRIS, 0.02);
