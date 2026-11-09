// Exporta as imagens da loja (as seções abaixo do provador) para public/loja/. Rodar da raiz do repo:
//   node templates/prega/fonte/loja/exporta.mjs
//
// pecas/<look>-<n>.webp        card da vitrine e foto da faixa de categorias, 4:5, 720 × 900, fundo #f5f5f5
// pecas/<look>-3-largo.webp    calçado também em 3:2 (720 × 480), para a moldura deitada da faixa
// rua/<id>-1280|1920|2880.webp foto de rua inteira (21:9), para o desktop
// rua/<id>-retrato.webp        recorte 4:5 em volta do modelo (900 × 1125), para o celular
// manifesto/<id>.webp          recorte com alfa, sem margem, 300 de altura
//
// Fontes: as fotos de peça do elenco (fonte/nike/<NN-nome>/produto-N-gpt-image-2-6[-v2].png), as fotos de rua
// (fonte/rua/) e os recortes do manifesto (fonte/manifesto/), todos do Higgsfield, GPT Image 2.6.
import sharp from 'sharp';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const fonte = join(aqui, '..');
const saida = join(aqui, '../../public/loja');
for (const p of ['pecas', 'rua', 'manifesto']) mkdirSync(join(saida, p), { recursive: true });

const FUNDO = { r: 245, g: 245, b: 245 }; // --superficie da nike.com
const kb = info => `${Math.round(info.size / 1024)} KB`;

// média de cor de um canto (fundo da foto), lida numa versão pequena da imagem
async function corDoFundo(arquivo) {
  const { data, info } = await sharp(arquivo).resize(64, 64, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const soma = [0, 0, 0];
  let n = 0;
  for (const [x0, y0] of [[1, 1], [56, 1]]) {
    for (let y = y0; y < y0 + 6; y++) for (let x = x0; x < x0 + 6; x++) {
      const i = (y * info.width + x) * 3;
      soma[0] += data[i]; soma[1] += data[i + 1]; soma[2] += data[i + 2];
      n++;
    }
  }
  return soma.map(v => v / n);
}

// 1. peças: roupa no cabide (4:5, fundo cinza-claro) e calçado (3:2, fundo branco)
const pastas = readdirSync(join(fonte, 'nike')).filter(d => /^\d\d-/.test(d)).sort();
for (const pasta of pastas) {
  const look = pasta.slice(0, 2);
  for (const n of [1, 2, 3]) {
    let arquivo = join(fonte, 'nike', pasta, `produto-${n}-gpt-image-2-6-v2.png`);
    if (!existsSync(arquivo)) arquivo = join(fonte, 'nike', pasta, `produto-${n}-gpt-image-2-6.png`);
    const destino = join(saida, 'pecas', `${look}-${n}.webp`);
    if (n < 3) {
      // o fundo da foto vai para o #f5f5f5 do card com um ganho por canal (o tecido clareia junto, ~2 %)
      const fundo = await corDoFundo(arquivo);
      const ganho = fundo.map((v, i) => [FUNDO.r, FUNDO.g, FUNDO.b][i] / Math.max(1, v));
      const info = await sharp(arquivo)
        .resize(720, 900, { fit: 'cover' })
        .linear(ganho, [0, 0, 0])
        .webp({ quality: 82, effort: 6 })
        .toFile(destino);
      console.log(`${look}-${n}`, kb(info));
    } else {
      // calçado no branco: multiplicado sobre o #f5f5f5, o branco vira o fundo do card e a sombra fica
      // tira a margem branca da foto antes, para o par ocupar a largura do card
      const justo = await sharp(arquivo).trim({ background: '#ffffff', threshold: 12 }).png().toBuffer();
      const par = await sharp(justo).resize({ width: 640 }).png().toBuffer();
      const { height: alturaPar } = await sharp(par).metadata();
      const info = await sharp({ create: { width: 720, height: 900, channels: 3, background: FUNDO } })
        .composite([{ input: par, left: 40, top: Math.round((900 - alturaPar) * 0.54), blend: 'multiply' }])
        .webp({ quality: 82, effort: 6 })
        .toFile(destino);
      const largo = await sharp(justo).resize({ width: 640, height: 400, fit: 'inside' }).png().toBuffer();
      const { height: alturaLargo } = await sharp(largo).metadata();
      const info2 = await sharp({ create: { width: 720, height: 480, channels: 3, background: FUNDO } })
        .composite([{ input: largo, left: Math.round((720 - (await sharp(largo).metadata()).width) / 2), top: Math.round((480 - alturaLargo) / 2), blend: 'multiply' }])
        .webp({ quality: 82, effort: 6 })
        .toFile(join(saida, 'pecas', `${look}-3-largo.webp`));
      console.log(`${look}-3`, kb(info), 'largo', kb(info2));
    }
  }
}

// 2. fotos de rua: inteiras para o desktop e um recorte 4:5 em volta do modelo para o celular.
// centro = x do meio do modelo em fração da largura (o mesmo valor de src/data/rua.js, campo "centro")
const rua = [
  ['varzea', '01-varzea-gpt-image-2-6.png', 0.492],
  ['garrafao', '02-garrafao-gpt-image-2-6.png', 0.5],
  ['busao', '03-busao-gpt-image-2-6.png', 0.493],
  ['laje', '04-laje-gpt-image-2-6.png', 0.49],
];
for (const [id, arquivo, centro] of rua) {
  const caminho = join(fonte, 'rua', arquivo);
  for (const largura of [1280, 1920, 2880]) {
    const info = await sharp(caminho).resize({ width: largura }).webp({ quality: 78, effort: 6 }).toFile(join(saida, 'rua', `${id}-${largura}.webp`));
    console.log(id, largura, kb(info));
  }
  const { width, height } = await sharp(caminho).metadata();
  const w = Math.round(height * 0.8);
  const left = Math.min(width - w, Math.max(0, Math.round(width * centro - w / 2)));
  const info = await sharp(caminho)
    .extract({ left, top: 0, width: w, height })
    .resize(900, 1125)
    .webp({ quality: 78, effort: 6 })
    .toFile(join(saida, 'rua', `${id}-retrato.webp`));
  console.log(id, 'retrato', kb(info), `(x de ${(left / width).toFixed(4)} a ${((left + w) / width).toFixed(4)})`);
}

// 3. recortes do manifesto: sem margem transparente, 300 de altura
for (const id of ['bola-futebol', 'bola-basquete', 'tenis-af1']) {
  const info = await sharp(join(fonte, 'manifesto', `${id}-gpt-image-2-6.png`))
    .trim({ threshold: 1 })
    .resize({ height: 300 })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(join(saida, 'manifesto', `${id}.webp`));
  console.log(id, `${info.width}×${info.height}`, kb(info));
}
