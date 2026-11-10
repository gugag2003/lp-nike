// "Em movimento": as duas fotos de tela cheia entre a arara e as categorias, e os textos da seção.
// Fotos do Higgsfield (GPT Image 2.6) em fonte/movimento/, exportadas por fonte/movimento/exporta.mjs para
// public/loja/movimento/: a larga (16:9) em 2880 e 1920, e uma vertical própria do celular (9:16, 1200 × 2122).
//
// A primeira é a noite (ele andando, a cidade riscando junto); a segunda é a "em movimento" (panning).
// A lente (src/motion/lente.js) leva de uma à outra com a rolagem.
//
// foco: o ponto da foto que nunca sai do quadro quando a tela corta a imagem (object-position e o recorte do shader),
//       em fração da largura e da altura, para a larga e para a vertical.
// lente: onde a lente nasce quando não há mouse (fração do palco).
// peca: a peça que o botão abre no provador (look-n, como em src/data/loja.js).
const img = arquivo => `${import.meta.env.BASE_URL}loja/movimento/${arquivo}`;

const cena = ({ id, ...resto }) => ({
  id,
  ...resto,
  larga: { src: img(`${id}-1920.webp`), grande: img(`${id}-2880.webp`), largura: 2880, altura: 1620 },
  vertical: { src: img(`${id}-celular.webp`), largura: 1200, altura: 2122 },
});

export const movimento = {
  rotulo: 'Em movimento',
  titulo: 'A rua não para',
  secao: 'Em movimento: dois looks na rua',
  verLook: nome => `Ver o look ${nome}`,
  lente: { tela: [0.5, 0.42], celular: [0.5, 0.36] },
  cenas: [
    cena({
      id: 'garoa',
      peca: '07-1',
      nome: 'Garoa',
      legenda: 'Garoa · Avenida, 23h40',
      foco: { tela: [0.46, 0.3], celular: [0.5, 0.4] },
      alt: 'Rapaz de jaqueta puffer preta da Nike, balaclava, gorro e óculos de neve na testa, andando rápido por uma avenida molhada à noite, sob garoa, com as mãos e a jaqueta borradas pelo movimento. Atrás dele, um ônibus e os carros viram riscos de luz vermelhos, brancos e laranja.',
    }),
    cena({
      id: 'varzea',
      peca: '03-1',
      nome: 'Várzea',
      legenda: 'Várzea · Campo de terra, 17h50',
      foco: { tela: [0.5, 0.35], celular: [0.5, 0.45] },
      alt: 'Rapaz de camisa amarela retrô da Nike com o número 9, bermuda jeans preta e Killshot 2, correndo com a bola num campo de terra ao pôr do sol. O fundo corre em riscos e a poeira vermelha acende contra a luz.',
    }),
  ],
};
