// Exporta as duas fotos da seção "Movimento" para public/loja/movimento/. Rodar da raiz do repo:
//   node templates/prega/fonte/movimento/exporta.mjs
//
// <id>-2880.webp     foto larga (16:9, 2880 × 1620), para telas de 2× e largas
// <id>-1920.webp     a mesma em 1920 × 1080, para telas de 1×
// <id>-celular.webp  a versão vertical (9:16, 1200 × 2122): outra foto, da mesma cena, enquadrada para o celular
//
// Fontes: <id>-1.png (3840 × 2160) e <id>-celular-1.png (1520 × 2688), do Higgsfield, GPT Image 2.6
// (prompts em *.prompt.txt, jobs em *.job.json).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const saida = join(aqui, '../../public/loja/movimento');
mkdirSync(saida, { recursive: true });
const kb = info => `${Math.round(info.size / 1024)} KB`;

for (const id of ['garoa', 'varzea']) {
  const larga = join(aqui, `${id}-1.png`);
  for (const [w, q] of [[2880, 84], [1920, 82]]) {
    const info = await sharp(larga).resize(w, Math.round(w * 9 / 16), { fit: 'cover' }).webp({ quality: q, effort: 6 }).toFile(join(saida, `${id}-${w}.webp`));
    console.log(`${id}-${w}`, `${info.width}×${info.height}`, kb(info));
  }
  const info = await sharp(join(aqui, `${id}-celular-1.png`)).resize(1200).webp({ quality: 78, effort: 6 }).toFile(join(saida, `${id}-celular.webp`));
  console.log(`${id}-celular`, `${info.width}×${info.height}`, kb(info));
}
