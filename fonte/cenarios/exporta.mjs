// Exporta os cenários aprovados para public/cenarios/: fundo do palco em 3 larguras (WebP) e a textura da esfera
// (quadrado do meio da cena, 384 px). Rodar da raiz do repo: node templates/prega/fonte/cenarios/exporta.mjs
//
// O fundo sai já desfocado (profundidade de campo: o modelo em foco, a cena um pouco fora). Em CSS (filter: blur) o
// Safari corta a foto dentro da lente olho de peixe (src/motion/camera.js); embutido no arquivo, vale em todo
// navegador e não custa nada na hora de desenhar. desfoque = raio em px de CSS com o palco de ~1100 de largura,
// onde a foto aparece com ~1400 (passa 14 % de cada lado); a esfera usa a foto nítida.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const saida = join(aqui, '../../public/cenarios');
mkdirSync(saida, { recursive: true });

const cenarios = [
  ['beco', '01-beco-gpt-image-2-6.png', 1.5],
  ['minhocao', '02-minhocao-gpt-image-2-6.png', 2],
  ['loja', '03-loja-fechada-gpt-image-2-6.png', 2],
  ['cobertura', '04-cobertura-gpt-image-2-6.png', 2.5],
];
const LARGURA_NA_TELA = 1400;

for (const [nome, arquivo, desfoque] of cenarios) {
  const fonte = join(aqui, arquivo);
  for (const largura of [1280, 1920, 2880]) {
    const sigma = Math.max(0.3, (desfoque * largura) / LARGURA_NA_TELA); // o valor de blur() no CSS já é o sigma
    const info = await sharp(fonte).resize({ width: largura }).blur(sigma).webp({ quality: 80, effort: 6 }).toFile(join(saida, `${nome}-${largura}.webp`));
    console.log(nome, largura, `${Math.round(info.size / 1024)} KB`);
  }
  const { width, height } = await sharp(fonte).metadata();
  const lado = Math.round(height * 0.86);
  await sharp(fonte)
    .extract({ left: Math.round((width - lado) / 2), top: Math.round((height - lado) * 0.35), width: lado, height: lado })
    .resize(384, 384)
    .webp({ quality: 80 })
    .toFile(join(saida, `${nome}-esfera.webp`));
}
