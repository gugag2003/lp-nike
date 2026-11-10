// Monta os modelos 3D da arara para o site, a partir do que o Blender deixou em saida/ (prepara.py):
//   public/loja/arara/3d/<NN>-1.glb         malha com meshopt (posição, normal e UV quantizados; sem material)
//   public/loja/arara/3d/<NN>-1-2048.webp   atlas de cor da tela grande
//   public/loja/arara/3d/<NN>-1-1024.webp   atlas de cor do celular
//   src/data/arara-3d.json                  medidas de cada peça (onde termina o gancho, caixa da malha)
//
// Rodar da raiz do repo:
//   node templates/prega/fonte/arara/3d/monta.mjs            só empacota o que já está em saida/
//   node templates/prega/fonte/arara/3d/monta.mjs --blender  refaz antes cada peça desde o bruto: enxuga.mjs (malhas
//                                                            de 300 mil e de 30 mil triângulos) e prepara.py (Blender:
//                                                            UV, assados e atlas; alguns minutos por peça)
//   node templates/prega/fonte/arara/3d/monta.mjs --mistura  refaz só o atlas (assados guardados em saida/) e empacota
//   ... [NN ...]                                             só essas peças
//
// Os .glb brutos (bruto/<NN>-tripo.glb, ~45 MB cada) saem do Tripo H3.1 pelo Higgsfield, a partir de
// fonte/arara/<NN>-frente.png; os pedidos e o custo de cada um estão em <NN>-tripo.job.json e em LEIAME.md.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, '../../../../..');
const require = createRequire(join(raiz, 'package.json'));
const sharp = require('sharp');
const saida = join(aqui, 'saida');
const destino = join(aqui, '../../../public/loja/arara/3d');
const json = join(aqui, '../../../src/data/arara-3d.json');
mkdirSync(destino, { recursive: true });

const args = process.argv.slice(2);
const comBlender = args.includes('--blender');
const pedidas = args.filter(a => /^\d\d$/.test(a));
const pecas = pedidas.length ? pedidas : ['01', '02', '04', '03', '05', '06'];
const kb = arq => `${Math.round(statSync(arq).size / 1024)} KB`;
const TRIS = { '03': 22000, '05': 22000, '06': 22000 }; // camisetas: forma mais simples que a dos moletons (30 mil)
// ajustes do prepara.py por peça:
//   06 (cinza de recortes brancos): as laterais se dividem em 2 cores chapadas, com a divisa nítida (--classes 2), e
//      a foto só manda no que está mais de frente (--foto): em ombro e manga o recorte projetado escorria em riscos
//   02 (moletom mescla): alisa o relevo de costura que o Tripo inventou ao longo das mangas (--alisa)
const AJUSTES = {
  '06': ['--classes', '2', '--foto', '0.3,0.5'],
  '02': ['--alisa', '0.23,0.29,-0.15,-0.09,-0.9,-0.84,0.045'],
};
const soMistura = args.includes('--mistura'); // refaz só o atlas de cada peça (assados guardados) e empacota

const medidas = existsSync(json) ? JSON.parse(readFileSync(json, 'utf8')) : {};
for (const id of pecas) {
  if (comBlender) {
    execFileSync('node', [join(aqui, 'enxuga.mjs'), id, '--tris', String(TRIS[id] ?? 30000)], { cwd: raiz, stdio: 'inherit' });
    execFileSync('node', [join(raiz, 'tools/blender.mjs'), join(aqui, 'prepara.py'), '--', id, ...(AJUSTES[id] ?? [])], { cwd: raiz, stdio: 'inherit' });
  } else if (soMistura) {
    execFileSync('node', [join(raiz, 'tools/blender.mjs'), join(aqui, 'prepara.py'), '--', id, '--mistura', ...(AJUSTES[id] ?? [])], { cwd: raiz, stdio: 'inherit' });
  }
  const glb = join(saida, `${id}.glb`);
  if (!existsSync(glb)) { console.log(id, 'sem saida/ (rode com --blender)'); continue; }
  const chave = `${id}-1`;
  const tmp = join(saida, `${id}-solda.glb`);
  const gt = (...a) => execFileSync('npx', ['--yes', '@gltf-transform/cli@4.5.1', ...a], { cwd: raiz, stdio: ['ignore', 'ignore', 'inherit'] });
  gt('weld', glb, tmp);
  gt('meshopt', tmp, join(destino, `${chave}.glb`), '--level', 'high', '--quantize-position', '14', '--quantize-normal', '10', '--quantize-texcoord', '12');
  const atlas = join(saida, `${id}-atlas.png`);
  await sharp(atlas).resize(2048, 2048).webp({ quality: 80, effort: 6 }).toFile(join(destino, `${chave}-2048.webp`));
  await sharp(atlas).resize(1024, 1024, { kernel: 'lanczos3' }).webp({ quality: 80, effort: 6 }).toFile(join(destino, `${chave}-1024.webp`));
  const m = JSON.parse(readFileSync(join(saida, `${id}.json`), 'utf8'));
  medidas[chave] = { corte: m.corte, caixa: m.caixa, tris: m.tris };
  console.log(chave, `${m.tris} triângulos`, 'glb', kb(join(destino, `${chave}.glb`)), '| atlas 2048', kb(join(destino, `${chave}-2048.webp`)), '| 1024', kb(join(destino, `${chave}-1024.webp`)));
}
writeFileSync(json, JSON.stringify(medidas, null, 2) + '\n');
