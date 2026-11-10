// Exporta as peças da arara para public/loja/arara/: frente e costas recortadas rente à peça (com o cabide), em
// WebP com transparência, e src/data/arara-fotos.json com a proporção e a posição do gancho de cada uma.
// Rodar da raiz do repo: node templates/prega/fonte/arara/exporta.mjs
// Fonte: <NN>-frente.png e <NN>-costas.png (Higgsfield, GPT Image 2.6, fundo transparente; prompts ao lado).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(aqui, '../../../../package.json'));
const sharp = require('sharp');
const saida = join(aqui, '../../public/loja/arara');
mkdirSync(saida, { recursive: true });

const ALTURA = 900; // px do arquivo (a peça aparece com ~420 px de CSS no desktop: 2x)
const pecas = ['01', '02', '04', '03', '05', '06']; // moletons, depois camisetas

// caixa da parte opaca (alfa > 24)
async function caixa(arquivo) {
  const { data, info } = await sharp(arquivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  // ponta do gancho: média do x opaco nas primeiras linhas da caixa
  let soma = 0, n = 0;
  for (let y = y0; y < y0 + Math.max(4, (y1 - y0) * 0.02); y++) for (let x = x0; x <= x1; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 128) { soma += x; n++; }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, gancho: n ? (soma / n - x0) / (x1 - x0 + 1) : 0.5 };
}

const medidas = {};
for (const id of pecas) {
  const f = await caixa(join(aqui, `${id}-frente.png`));
  const c = await caixa(join(aqui, `${id}-costas.png`));
  const largura = Math.round((ALTURA * f.width) / f.height);
  await sharp(join(aqui, `${id}-frente.png`)).extract(f).resize(largura, ALTURA).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(join(saida, `${id}-1-frente.webp`));
  // as costas na mesma caixa da frente: o giro troca uma pela outra sem a peça mudar de tamanho
  await sharp(join(aqui, `${id}-costas.png`)).extract(c).resize(largura, ALTURA, { fit: 'fill' }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(join(saida, `${id}-1-costas.webp`));
  medidas[`${id}-1`] = { w: largura, h: ALTURA, gancho: Math.round(f.gancho * 1000) / 1000, ganchoCostas: Math.round(c.gancho * 1000) / 1000 };
  console.log(id, medidas[`${id}-1`]);
}
writeFileSync(join(aqui, '../../src/data/arara-fotos.json'), JSON.stringify(medidas, null, 2) + '\n');
