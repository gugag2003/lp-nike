// Exporta os cenários aprovados para public/cenarios/: fundo do palco em 3 larguras (WebP) e a textura da esfera
// (quadrado do meio da cena, 384 px). Rodar da raiz do repo: node templates/prega/fonte/cenarios/exporta.mjs
//
// O fundo sai com a profundidade de campo embutida (o modelo em foco, a cena um pouco fora). Em CSS (filter: blur) o
// Safari corta a foto dentro da lente olho de peixe (src/motion/camera.js); embutido no arquivo, vale em todo
// navegador e não custa nada na hora de desenhar. desfoque = raio em px de CSS com o palco de ~1100 de largura,
// onde a foto aparece com ~1400 (passa 14 % de cada lado); a esfera usa a foto nítida.
//
// 2026-11-09, "borrado e triste": o desfoque caiu para pouco mais de um terço (de 2–2,5 para 0,75–0,9: só o que separa o modelo
// da cena; o Corcovado lia como fora de foco), e a foto ganhou presença no próprio arquivo: contraste local
// (máscara de nitidez de raio largo, a "clareza" dos editores), +8 % de saturação, +4 % de brilho e +5 % de
// contraste em torno do cinza médio. WebP q80, como antes: com a foto nítida o arquivo já triplica (2880w: 209 a 441 KB, eram 81 a 141), e
// q85 passava de 520 KB sem diferença visível em tela 2x. A receita antiga continua saindo em public/cenarios/antes/, só para o
// ?ajuste=antes da página comparar; pode ser apagada junto com a chave.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const saida = join(aqui, '../../public/cenarios');
mkdirSync(join(saida, 'antes'), { recursive: true });

// [id, fonte, desfoque, desfoque de antes]
const cenarios = [
  ['cristo', '05-cristo-a-gpt-image-2-6.png', 0.75, 2],
  ['minhocao', '02-minhocao-gpt-image-2-6.png', 0.75, 2],
  ['loja', '03-loja-fechada-gpt-image-2-6.png', 0.75, 2],
  ['cobertura', '04-cobertura-gpt-image-2-6.png', 0.9, 2.5],
];
const LARGURA_NA_TELA = 1400;
const QUALIDADE = 80;
const CLAREZA = 0.35;      // força do contraste local
const SATURACAO = 1.08;
const BRILHO = 1.04;       // o grão de 35 % em overlay clareava o palco em ~8 % (névoa); sem ele, a foto repõe metade
const CONTRASTE = 1.05;    // em torno do cinza médio: linear(a, 128 × (1 − a))

for (const [nome, arquivo, desfoque, desfoqueAntes] of cenarios) {
  const fonte = join(aqui, arquivo);
  for (const largura of [1280, 1920, 2880]) {
    const escala = largura / LARGURA_NA_TELA; // px do arquivo por px de CSS
    const sigma = Math.max(0.3, desfoque * escala); // o valor de blur() no CSS já é o sigma
    const info = await sharp(fonte)
      .resize({ width: largura })
      .blur(sigma)
      .sharpen({ sigma: Math.min(10, 4.4 * escala), m1: CLAREZA, m2: CLAREZA })
      .modulate({ saturation: SATURACAO, brightness: BRILHO })
      .linear(CONTRASTE, 128 * (1 - CONTRASTE))
      .webp({ quality: QUALIDADE, effort: 6 })
      .toFile(join(saida, `${nome}-${largura}.webp`));
    const antes = await sharp(fonte)
      .resize({ width: largura })
      .blur(Math.max(0.3, desfoqueAntes * escala))
      .webp({ quality: 80, effort: 6 })
      .toFile(join(saida, 'antes', `${nome}-${largura}.webp`));
    console.log(nome, largura, `${Math.round(info.size / 1024)} KB`, `(antes: ${Math.round(antes.size / 1024)} KB)`);
  }
  const { width, height } = await sharp(fonte).metadata();
  const lado = Math.round(height * 0.86);
  await sharp(fonte)
    .extract({ left: Math.round((width - lado) / 2), top: Math.round((height - lado) * 0.35), width: lado, height: lado })
    .resize(384, 384)
    .webp({ quality: 80 })
    .toFile(join(saida, `${nome}-esfera.webp`));
}
