// Nome e textos da tela num lugar só: trocar a marca é trocar este arquivo.
export const marca = {
  nome: 'Nike',
  // Swoosh oficial (arquivo nike.svg, viewBox 24 × 24 recortado na altura do desenho: 24 × 8,4)
  logo: {
    viewBox: '0 7.8 24 8.401',
    d: 'M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z',
  },
  titulo: 'A rua é sua',
  apoio: {
    mouse: 'Oito looks, peça por peça. Clique no do meio.',
    toque: 'Oito looks, peça por peça. Toque no do meio.',
  },
  foco: {
    sobretitulo: (n, total) => `${n} / ${total}`,
    legenda: 'CADA NÚMERO, UMA PEÇA',
    fechar: 'Fechar o look',
  },
  painel: {
    titulo: 'Compre o look',
    // categoria de cada linha, abaixo do nome, como na vitrine da nike.com
    rotulos: ['Roupa de cima', 'Roupa de baixo', 'Calçado'],
    adicionar: 'Adicionar à sacola',
    fechoTitulo: 'Leve o look completo',
    fechoFrase: 'Economize 10%',
    botao: 'Adicionar o look',
    botaoFeito: 'Adicionado',
  },
  sacola: {
    titulo: 'Sacola',
    vazia: 'Sua sacola está vazia. Toque no + de uma peça para adicionar.',
    total: 'Total',
    pecas: n => (n === 1 ? '1 item' : `${n} itens`),
    conjunto: 'Look completo',
    voltar: 'Voltar ao look',
    remover: 'Remover da sacola',
  },
  nav: [
    { rotulo: 'Looks', acao: 'looks' },
    { rotulo: 'Moletom', acao: 'moletom' },
    { rotulo: 'Jeans', acao: 'jeans' },
    { rotulo: 'Tênis', acao: 'tenis' },
  ],
  cursor: { ver: 'VER', arrastar: 'ANDA' },
  trilho: { anterior: 'Look anterior', proximo: 'Próximo look', pausar: 'Pausar', tocar: 'Tocar' },

  // A loja, abaixo do provador (2026-11-09). Textos em caixa normal: o CSS põe em caixa alta o que é título.
  loja: {
    // manifesto: pedaços de texto, o Swoosh, o trecho sublinhado e os recortes (public/loja/manifesto/<img>.webp)
    manifesto: [
      { swoosh: true },
      ' Pra quem faz da rua ',
      { sublinhado: 'o próprio campo' },
      ': a várzea ',
      { img: 'bola-futebol', alt: 'bola de futebol Nike gasta de terra' },
      ' de domingo, o garrafão ',
      { img: 'bola-basquete', alt: 'bola de basquete Nike de couro gasto' },
      ' da quadra, o último busão e a laje no fim da tarde. Roupa que aguenta o dia ',
      { img: 'tenis-af1', alt: 'tênis Nike Air Force 1 Low branco' },
      ' e ainda volta pro rolê.',
    ],
    categorias: {
      rotulo: '(01) — Categorias',
      frase: 'Sete categorias e vinte e quatro peças, todas vestidas nos looks lá de cima. Escolha uma e a vitrine logo abaixo mostra só ela.',
      lista: 'Categorias da loja',
    },
    vitrine: {
      titulo: 'Pronto pro rolê',
      frase: 'Tudo o que aparece nos looks, em estoque. Pedido feito até as 14h sai no mesmo dia.',
      filtros: 'Filtrar a vitrine',
      anterior: 'Peças anteriores',
      proximo: 'Próximas peças',
      adicionar: 'Adicionar à sacola',
      adicionado: 'Adicionado à sacola',
      verNoLook: 'Ver no look',
      doLook: nome => `look ${nome}`,
    },
    rua: {
      titulo: 'Fora do provador',
      frase: 'Os looks nos lugares que dão nome a eles. Toque num ponto para levar a peça.',
      anterior: 'Foto anterior',
      proximo: 'Próxima foto',
      adicionado: 'Adicionado',
    },
    rodape: {
      titulo: 'Par novo?\nVocê sabe antes.', // \n: quebra de linha
      frase: 'Um e-mail por lançamento, e só.',
      campo: 'Seu e-mail',
      botao: 'Assinar',
      feito: 'Pronto. Até o próximo par.',
      erro: 'Confira o e-mail: falta alguma coisa nele.',
      colunas: [
        { titulo: 'Loja', links: ['Lançamentos', 'Tênis', 'Roupas', 'Looks'] },
        { titulo: 'Ajuda', links: ['Status do pedido', 'Entrega', 'Trocas e devoluções', 'Fale com a gente'] },
        { titulo: 'Por aí', links: ['Instagram', 'TikTok', 'YouTube', 'Strava'] },
      ],
      legal: '© 2026 Nike · Conceito de loja, fora do ar',
      cidade: 'Feito em São Paulo',
      topo: 'Voltar ao topo',
    },
  },
};
