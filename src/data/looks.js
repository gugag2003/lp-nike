// Os 8 looks da fila, na ordem do anel (o 01 abre no centro). Editar peça, preço ou pino é aqui e só aqui.
//
// Imagens em public/looks/NN/:
//   recorte.webp             modelo de corpo inteiro, recortado em alfa, 1024 × 1536 (2:3)
//   recorte-desfoque-1.webp  o mesmo, desfocado para as vagas ±1
//   recorte-desfoque-2.webp  o mesmo, mais desfocado para as vagas ±2 a ±4
//   produto-1/2/3.webp       foto de cada peça no painel (1 = parte de cima, 2 = parte de baixo, 3 = tênis)
// Todos os recortes têm o mesmo enquadramento: topo da cabeça a 8 % da altura e sola a 93,9 %.
//
// pino: posição em % da imagem do recorte (x da borda esquerda, y do topo da imagem). O pino N é a peça da linha N.
// sombra: centro dos pés em relação ao meio da imagem, em fração da largura (+ = para a direita). A elipse segue os pés.
// selo: texto curto sobre a foto da peça (ou null).
// tipo: o que os links da nav procuram ('moletom', 'jeans', 'tenis'; a bota é 'bota' e não entra em Tênis).

const img = (id, arquivo) => `${import.meta.env.BASE_URL}looks/${id}/${arquivo}`;

const look = ({ id, nome, alt, sombra, pecas }) => ({
  id,
  nome,
  alt,
  sombra,
  recorte: img(id, 'recorte.webp'),
  desfoque: [img(id, 'recorte.webp'), img(id, 'recorte-desfoque-1.webp'), img(id, 'recorte-desfoque-2.webp')],
  pecas: pecas.map((p, i) => ({ ...p, n: i + 1, foto: img(id, `produto-${i + 1}.webp`), fundo: i === 2 ? 'branco' : 'cabide' })),
});

export const looks = [
  look({
    id: '01',
    nome: 'Baile',
    alt: 'Rapaz de pele morena escura e cavanhaque, de capuz sobre gorro creme com strass, moletom creme com zíper, correntes douradas, cinto branco de ilhós, calça cargo camuflada bem larga e botas Nike trigo.',
    sombra: -0.008,
    pecas: [
      { tipo: 'moletom', nome: 'Moletom Nike Zip Creme', preco: 499, pino: { x: 59, y: 30 }, selo: null, fotoAlt: 'Moletom creme de capuz com zíper, curto e quadrado, no cabide' },
      { tipo: 'cargo', nome: 'Calça Cargo Nike Camuflada', preco: 449, pino: { x: 42, y: 60 }, selo: null, fotoAlt: 'Calça cargo larga em camuflado verde e bege, no cabide' },
      { tipo: 'bota', nome: 'Bota Nike Trigo', preco: 899, pino: { x: 39, y: 91.3 }, selo: null, fotoAlt: 'Par de botas Nike de nobuck trigo com solado tratorado, de lado e de frente' },
    ],
  }),
  look({
    id: '02',
    nome: 'Último Busão',
    alt: 'Rapaz de pele clara com capuz cinza sobre durag preto, moletom mescla aberto sobre camiseta branca, uma mão no bolso, jeans índigo cru bem largo e botas Nike trigo de cano alto.',
    sombra: -0.014,
    pecas: [
      { tipo: 'moletom', nome: 'Moletom Nike Zip Mescla', preco: 449, pino: { x: 60, y: 29 }, selo: null, fotoAlt: 'Moletom cinza mescla de capuz com zíper, no cabide' },
      { tipo: 'jeans', nome: 'Jeans Nike Índigo Cru', preco: 399, pino: { x: 42, y: 60 }, selo: 'Novo', fotoAlt: 'Calça jeans índigo cru, larga, com pesponto caramelo, no cabide' },
      { tipo: 'bota', nome: 'Bota Nike Trigo Cano Alto', preco: 949, pino: { x: 38.5, y: 91.3 }, selo: null, fotoAlt: 'Par de botas Nike de nobuck trigo, cano alto, de lado e de frente' },
    ],
  }),
  look({
    id: '03',
    nome: 'Várzea',
    alt: 'Rapaz magro de pele clara e cabelo cacheado sob gorro azul, de camisa de futebol amarela retrô com o número 9, bermuda jeans preta lavada com corrente, meias brancas e Nike Killshot 2 com sola de borracha.',
    sombra: -0.01,
    pecas: [
      { tipo: 'camisa', nome: 'Camisa Nike Retrô Amarela', preco: 349, pino: { x: 58, y: 30 }, selo: null, fotoAlt: 'Camisa de futebol amarela com gola e frisos verdes e o número 9, no cabide' },
      { tipo: 'jeans', nome: 'Bermuda Jeans Nike Preta', preco: 299, pino: { x: 43, y: 63 }, selo: null, fotoAlt: 'Bermuda jeans preta lavada, longa e larga, com corrente, no cabide' },
      { tipo: 'tenis', nome: 'Nike Killshot 2', preco: 599, pino: { x: 38.5, y: 91.5 }, selo: null, fotoAlt: 'Par de Nike Killshot 2 branco com Swoosh preto e sola de borracha, de lado e de frente' },
    ],
  }),
  look({
    id: '04',
    nome: 'Garrafão',
    alt: 'Rapaz de pele clara com tatuagens no pescoço, gorro preto NIKE e óculos escuros estreitos, de moletom canguru preto sobre camiseta branca, cinto preto, calça de sarja preta bem larga e Air Force 1 High trigo.',
    sombra: -0.006,
    pecas: [
      { tipo: 'moletom', nome: 'Moletom Nike Canguru Preto', preco: 449, pino: { x: 57, y: 31 }, selo: 'Novo', fotoAlt: 'Moletom preto de capuz com bolso canguru, no cabide' },
      { tipo: 'sarja', nome: 'Calça Nike Sarja Preta', preco: 399, pino: { x: 43, y: 62 }, selo: null, fotoAlt: 'Calça de sarja preta bem larga, no cabide' },
      { tipo: 'tenis', nome: 'Nike Air Force 1 High Trigo', preco: 999, pino: { x: 38.5, y: 91.3 }, selo: null, fotoAlt: 'Par de Nike Air Force 1 High de nobuck trigo com tira no tornozelo, de lado e de frente' },
    ],
  }),
  look({
    id: '05',
    nome: 'Laje',
    alt: 'Rapaz de pele preta e cabelo crespo torcido, de camiseta branca larga com Swoosh azul desbotado, uma mão no bolso, bermuda jeans clara com correntes, meias brancas e Nike Shox TL prata.',
    sombra: -0.003,
    pecas: [
      { tipo: 'camiseta', nome: 'Camiseta Nike Swoosh Desbotado', preco: 229, pino: { x: 57, y: 32 }, selo: null, fotoAlt: 'Camiseta branca larga com Swoosh azul desbotado, no cabide' },
      { tipo: 'jeans', nome: 'Bermuda Jeans Nike Clara', preco: 299, pino: { x: 42, y: 64 }, selo: null, fotoAlt: 'Bermuda jeans azul-claro lavada, longa e larga, com correntes, no cabide' },
      { tipo: 'tenis', nome: 'Nike Shox TL', preco: 1199, pino: { x: 38.5, y: 91 }, selo: null, fotoAlt: 'Par de Nike Shox TL branco e prata com Swoosh lilás, de lado e de frente' },
    ],
  }),
  look({
    id: '06',
    nome: 'Calçadão',
    alt: 'Rapaz de pele preta e tranças curtas, com correntes douradas, de camiseta cinza com recortes brancos e NIKE no peito, bermuda jeans cinza desfiada com chaves no passante, meias brancas e Air Max Plus branco.',
    sombra: -0.014,
    pecas: [
      { tipo: 'camiseta', nome: 'Camiseta Nike Recortes Cinza', preco: 249, pino: { x: 57, y: 32 }, selo: null, fotoAlt: 'Camiseta cinza com recortes brancos nos ombros e nas laterais, no cabide' },
      { tipo: 'jeans', nome: 'Bermuda Jeans Nike Cinza', preco: 319, pino: { x: 42, y: 63 }, selo: null, fotoAlt: 'Bermuda jeans cinza manchada, com barra desfiada, no cabide' },
      { tipo: 'tenis', nome: 'Nike Air Max Plus', preco: 1099, pino: { x: 38.5, y: 91 }, selo: null, fotoAlt: 'Par de Nike Air Max Plus todo branco, de lado e de frente' },
    ],
  }),
  look({
    id: '07',
    nome: 'Garoa',
    alt: 'Rapaz de pele preta com balaclava preta até o nariz, gorro preto e óculos de neve, de jaqueta puffer preta aberta sobre moletom preto, calça de neve preta e botas Nike ACG pretas.',
    sombra: -0.009,
    pecas: [
      { tipo: 'jaqueta', nome: 'Jaqueta Puffer Nike Preta', preco: 1199, pino: { x: 59, y: 33 }, selo: null, fotoAlt: 'Jaqueta puffer preta com capuz e Swoosh na manga, no cabide' },
      { tipo: 'calca', nome: 'Calça de Neve Nike Preta', preco: 699, pino: { x: 44, y: 62 }, selo: null, fotoAlt: 'Calça de neve preta com bolso cargo e Swoosh na coxa, no cabide' },
      { tipo: 'bota', nome: 'Bota Nike ACG Preta', preco: 999, pino: { x: 39.5, y: 91.3 }, selo: null, fotoAlt: 'Par de botas Nike ACG pretas impermeáveis com solado tratorado, de lado e de frente' },
    ],
  }),
  look({
    id: '08',
    nome: 'Rolê',
    alt: 'Rapaz de pele preta e dreads até o ombro sob boné verde-oliva NIKE, de jaqueta bomber creme com Nike bordado e chamas nas mangas, mãos no cinto, calça cargo camuflada bem larga e Air Force 1 Low branco.',
    sombra: -0.012,
    pecas: [
      { tipo: 'jaqueta', nome: 'Jaqueta Bomber Nike Creme', preco: 899, pino: { x: 57, y: 36 }, selo: null, fotoAlt: 'Jaqueta bomber de lona creme com Nike bordado e chamas nas mangas, no cabide' },
      { tipo: 'cargo', nome: 'Calça Cargo Nike Camuflada Lavada', preco: 499, pino: { x: 43, y: 63 }, selo: null, fotoAlt: 'Calça cargo camuflada lavada, bem larga, franzida no tornozelo, no cabide' },
      { tipo: 'tenis', nome: 'Nike Air Force 1 Low Branco', preco: 799, pino: { x: 37.5, y: 92 }, selo: null, fotoAlt: 'Par de Nike Air Force 1 Low todo branco, de lado e de frente' },
    ],
  }),
];

// desconto do conjunto (as três peças juntas)
export const DESCONTO_CONJUNTO = 0.1;

export const soma = l => l.pecas.reduce((t, p) => t + p.preco, 0);
export const precoConjunto = l => Math.round(soma(l) * (1 - DESCONTO_CONJUNTO) * 100) / 100;

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const reais = v => moeda.format(v);
