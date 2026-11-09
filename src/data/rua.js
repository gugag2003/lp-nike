// "Fora do provador": os looks nos lugares que dão nome a eles. Fotos do Higgsfield (GPT Image 2.6, 21:9, 3840 × 1648)
// em fonte/rua/, exportadas por fonte/loja/exporta.mjs para public/loja/rua/.
//
// centro: x do meio do modelo em fração da largura; é o centro do recorte 4:5 do celular (o mesmo valor do exporta.mjs).
// pontos: peça (look-n), posição em % da foto inteira (x da borda esquerda, y do topo) e o lado para onde a pílula abre.
const img = arquivo => `${import.meta.env.BASE_URL}loja/rua/${arquivo}`;

const foto = ({ id, ...resto }) => ({
  id,
  ...resto,
  srcset: [1280, 1920, 2880].map(w => `${img(`${id}-${w}.webp`)} ${w}w`).join(', '),
  src: img(`${id}-1920.webp`),
  retrato: img(`${id}-retrato.webp`),
  largura: 3840,
  altura: 1648,
});

export const fotosDaRua = [
  foto({
    id: 'varzea',
    look: '03',
    centro: 0.492,
    legenda: 'Várzea · Zona Norte, domingo, 16h',
    alt: 'Rapaz de camisa amarela retrô da Nike, bermuda jeans preta e Killshot 2, com uma bola de futebol gasta debaixo do braço, num campo de terra batida com casas de tijolo no morro atrás.',
    pontos: [
      { peca: '03-1', x: 51.7, y: 28, lado: 'direita' },
      { peca: '03-2', x: 45.7, y: 66.8, lado: 'esquerda' },
      { peca: '03-3', x: 51.3, y: 92.4, lado: 'direita' },
    ],
  }),
  foto({
    id: 'garrafao',
    look: '04',
    centro: 0.5,
    legenda: 'Garrafão · quadra embaixo do elevado, 18h',
    alt: 'Rapaz de gorro NIKE, óculos escuros, moletom preto, calça de sarja preta larga e Air Force 1 High trigo, com uma bola de basquete na mão, numa quadra pública com grafite e prédios ao entardecer.',
    pontos: [
      { peca: '04-1', x: 52.7, y: 31.1, lado: 'direita' },
      { peca: '04-2', x: 46.7, y: 63.7, lado: 'esquerda' },
      { peca: '04-3', x: 53, y: 89.3, lado: 'direita' },
    ],
  }),
  foto({
    id: 'busao',
    look: '02',
    centro: 0.493,
    legenda: 'Último busão · avenida, 23h40',
    alt: 'Rapaz de capuz cinza sobre durag preto, moletom mescla aberto, jeans índigo cru largo e botas Nike trigo, num ponto de ônibus de vidro numa avenida molhada à noite, com um ônibus passando borrado.',
    pontos: [
      { peca: '02-1', x: 52.7, y: 29.5, lado: 'direita' },
      { peca: '02-2', x: 46, y: 66.8, lado: 'esquerda' },
      { peca: '02-3', x: 53, y: 90.1, lado: 'direita' },
    ],
  }),
  foto({
    id: 'laje',
    look: '05',
    centro: 0.49,
    legenda: 'Laje · Zona Sul, fim de tarde',
    alt: 'Rapaz de camiseta branca larga com Swoosh azul desbotado, bermuda jeans clara com correntes e Nike Shox TL, numa laje com caixa-d’água azul e cadeira de plástico, com o morro de casas e os prédios ao pôr do sol.',
    pontos: [
      { peca: '05-1', x: 53.3, y: 32.6, lado: 'direita' },
      { peca: '05-2', x: 45, y: 66.8, lado: 'esquerda' },
      { peca: '05-3', x: 52.7, y: 91.7, lado: 'direita' },
    ],
  }),
];
