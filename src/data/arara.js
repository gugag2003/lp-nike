// Arara: as peças de cima dos looks que são camiseta ou moletom (as jaquetas ficam de fora), na ordem do cano.
// Fotos em public/loja/arara/<chave>-frente|costas.webp; proporção e posição do gancho em arara-fotos.json
// (os dois saem de fonte/arara/exporta.mjs).
// 3D: malha em public/loja/arara/3d/<chave>.glb e atlas de cor <chave>-2048.webp (tela grande) / -1024.webp
// (celular); medidas da malha em arara-3d.json (saem de fonte/arara/3d/monta.mjs). Peça sem modelo fica na foto.
import { peca } from './loja.js';
import fotos from './arara-fotos.json';
import modelos from './arara-3d.json';

const ORDEM = ['01-1', '02-1', '04-1', '03-1', '05-1', '06-1']; // moletons, depois camisetas
const arq = nome => `${import.meta.env.BASE_URL}loja/arara/${nome}`;

export const pecasDaArara = () =>
  ORDEM.map(chave => ({
    ...peca(chave),
    ...fotos[chave],
    frente: arq(`${chave}-frente.webp`),
    costas: arq(`${chave}-costas.webp`),
    // corte: onde termina o gancho de arame (em alturas de peça, a partir do topo); caixa: extensão da malha
    ...(modelos[chave] && {
      modelo: arq(`3d/${chave}.glb`),
      atlas: { tela: arq(`3d/${chave}-2048.webp`), celular: arq(`3d/${chave}-1024.webp`) },
      corte: modelos[chave].corte,
      caixa: modelos[chave].caixa,
    }),
  }));
