// A loja abaixo do provador vende as mesmas 24 peças que os oito modelos vestem (src/data/looks.js). Aqui fica só como
// ela organiza essas peças: categorias, ordem da vitrine, etiqueta de cada card e as fotos da faixa de categorias.
// Uma peça é "<look>-<n>": o look (01 a 08) e o número da peça nele (1 = parte de cima, 2 = parte de baixo, 3 = pés).
import { looks } from './looks.js';

const img = arquivo => `${import.meta.env.BASE_URL}loja/pecas/${arquivo}`;

// fotos: as duas peças nas pontas da faixa quando a categoria está ativa (esquerda, direita)
export const categorias = [
  { id: 'tudo', rotulo: 'Tudo', singular: 'Peça', fotos: ['08-3', '07-1'] },
  { id: 'tenis', rotulo: 'Tênis', singular: 'Tênis', fotos: ['05-3', '04-3'] },
  { id: 'botas', rotulo: 'Botas', singular: 'Bota', fotos: ['07-3', '02-3'] },
  { id: 'moletons', rotulo: 'Moletons', singular: 'Moletom', fotos: ['01-1', '04-1'] },
  { id: 'jaquetas', rotulo: 'Jaquetas', singular: 'Jaqueta', fotos: ['08-1', '07-1'] },
  { id: 'camisetas', rotulo: 'Camisetas', singular: 'Camiseta', fotos: ['03-1', '06-1'] },
  { id: 'calcas', rotulo: 'Calças', singular: 'Calça', fotos: ['01-2', '02-2'] },
  { id: 'bermudas', rotulo: 'Bermudas', singular: 'Bermuda', fotos: ['05-2', '03-2'] },
];
// a categoria que a faixa e a vitrine mostram ao abrir
export const CATEGORIA_INICIAL = 'tenis';

// ordem dos cards em "Tudo": alterna categoria e cor para a primeira tela da vitrine não repetir tipo de peça.
// etiqueta: pílula do card (prazo ou estoque). Peça com selo em looks.js ("Novo") mostra o selo no lugar.
export const vitrine = [
  { peca: '08-3', categoria: 'tenis', etiqueta: 'Envio em 24 h' },
  { peca: '07-1', categoria: 'jaquetas', etiqueta: 'Últimas unidades' },
  { peca: '03-1', categoria: 'camisetas', etiqueta: 'Envio em 24 h' },
  { peca: '02-2', categoria: 'calcas', etiqueta: 'Envio em 24 h' },
  { peca: '05-3', categoria: 'tenis', etiqueta: 'Últimos pares' },
  { peca: '01-1', categoria: 'moletons', etiqueta: 'Envio em 24 h' },
  { peca: '06-2', categoria: 'bermudas', etiqueta: 'Envio em 48 h' },
  { peca: '07-3', categoria: 'botas', etiqueta: 'Envio em 24 h' },
  { peca: '08-1', categoria: 'jaquetas', etiqueta: 'Envio em 48 h' },
  { peca: '04-3', categoria: 'tenis', etiqueta: 'Envio em 24 h' },
  { peca: '04-1', categoria: 'moletons', etiqueta: 'Envio em 24 h' },
  { peca: '01-2', categoria: 'calcas', etiqueta: 'Envio em 24 h' },
  { peca: '06-3', categoria: 'tenis', etiqueta: 'Envio em 24 h' },
  { peca: '05-1', categoria: 'camisetas', etiqueta: 'Envio em 24 h' },
  { peca: '03-2', categoria: 'bermudas', etiqueta: 'Envio em 24 h' },
  { peca: '01-3', categoria: 'botas', etiqueta: 'Últimos pares' },
  { peca: '02-1', categoria: 'moletons', etiqueta: 'Envio em 48 h' },
  { peca: '04-2', categoria: 'calcas', etiqueta: 'Envio em 24 h' },
  { peca: '03-3', categoria: 'tenis', etiqueta: 'Envio em 24 h' },
  { peca: '06-1', categoria: 'camisetas', etiqueta: 'Envio em 24 h' },
  { peca: '07-2', categoria: 'calcas', etiqueta: 'Últimas unidades' },
  { peca: '02-3', categoria: 'botas', etiqueta: 'Envio em 24 h' },
  { peca: '05-2', categoria: 'bermudas', etiqueta: 'Envio em 24 h' },
  { peca: '08-2', categoria: 'calcas', etiqueta: 'Envio em 48 h' },
];

// a peça completa: dados de looks.js + organização da loja
export function peca(chave) {
  const [id, n] = chave.split('-');
  const indice = looks.findIndex(l => l.id === id);
  const look = looks[indice];
  const p = look.pecas[Number(n) - 1];
  const item = vitrine.find(v => v.peca === chave);
  return {
    chave,
    look: id,
    indice, // posição do look no anel do provador
    lookNome: look.nome,
    n: p.n,
    nome: p.nome,
    preco: p.preco,
    alt: p.fotoAlt,
    selo: p.selo,
    categoria: item?.categoria,
    etiqueta: p.selo || item?.etiqueta || '',
    card: img(`${chave}.webp`),
    // calçado também tem a versão deitada (3:2), para a moldura da faixa
    largo: p.n === 3 ? img(`${chave}-largo.webp`) : null,
  };
}

export const pecasDa = id => vitrine.filter(v => id === 'tudo' || v.categoria === id).map(v => peca(v.peca));
export const contagem = id => pecasDa(id).length;
