// Cenários do palco: cada esfera de vidro do trilho troca o fundo atrás dos looks. Fotos geradas no Higgsfield
// (GPT Image 2.6, 3:2), fonte e prompts em fonte/cenarios/; os WebP saem de fonte/cenarios/exporta.mjs.
//
// public/cenarios/<id>-1280|1920|2880.webp   fundo do palco (object-fit: cover)
// public/cenarios/<id>-esfera.webp           textura da esfera (quadrado do meio da cena)
// foco: object-position do fundo (o celular só mostra a faixa do meio da foto)
//
// integração modelo × cena (src/styles/cenarios.css, "Integração"), sem gerar nada de novo:
//   modelo    filtro de cor nos recortes: tira a luz branca de estúdio e põe a da cena
//   luz       camada em soft-light sobre fundo e modelos juntos: cor e direção das luzes da cena
//   (a profundidade de campo vem embutida nos WebP: fonte/cenarios/exporta.mjs)
//   reflexo   opacidade do reflexo no chão (0 = chão seco)
//   contato   força da sombra de contato sob os pés (0 a 1)

const arq = nome => `${import.meta.env.BASE_URL}cenarios/${nome}`;

const cenario = ({ id, nome, foco = '50% 50%', modelo, luz, reflexo = 0, contato = 0.5 }) => ({
  id,
  nome,
  foco,
  integracao: { modelo, luz, reflexo, contato },
  esfera: arq(`${id}-esfera.webp`),
  srcset: [1280, 1920, 2880].map(w => `${arq(`${id}-${w}.webp`)} ${w}w`).join(', '),
});

export const cenarios = [
  // fim de tarde no mirante: sol baixo atrás da câmera, luz quente e de frente, pedra portuguesa seca; o Cristo no
  // Corcovado a 68 % da largura, no céu entre o modelo do meio e o da direita
  cenario({
    id: 'cristo',
    nome: 'Cristo Redentor, Rio',
    foco: '74% 50%', // no celular só a faixa do meio aparece: puxa o Cristo para dentro (no desktop quase não muda)
    modelo: 'brightness(0.97) contrast(1.04) saturate(1.02) sepia(0.12)',
    luz: 'radial-gradient(90% 70% at 50% 0%, rgb(255 196 140 / 0.45), rgb(255 196 140 / 0) 65%), linear-gradient(to bottom, rgb(40 28 20 / 0) 55%, rgb(40 28 20 / 0.35))',
    contato: 0.6,
  }),
  // noite, sódio laranja de cima, concreto úmido
  cenario({
    id: 'minhocao',
    nome: 'Baixo do Minhocão',
    modelo: 'brightness(0.8) contrast(1.08) saturate(0.88) sepia(0.28)',
    luz: 'radial-gradient(60% 55% at 58% 18%, rgb(255 160 70 / 0.65), rgb(255 160 70 / 0) 70%), linear-gradient(to bottom, rgb(20 12 5 / 0) 35%, rgb(20 12 5 / 0.55))',
    reflexo: 0.2,
    contato: 0.8,
  }),
  // noite, poste ciano em cima, neon vermelho no beco da direita, rua molhada
  cenario({
    id: 'loja',
    nome: 'Porta de aço, Centro',
    modelo: 'brightness(0.76) contrast(1.1) saturate(0.82) hue-rotate(-6deg)',
    luz: 'radial-gradient(45% 55% at 66% 14%, rgb(120 225 255 / 0.55), rgb(120 225 255 / 0) 70%), radial-gradient(38% 65% at 100% 58%, rgb(255 40 50 / 0.6), rgb(255 40 50 / 0) 70%), linear-gradient(to bottom, rgb(0 18 28 / 0) 35%, rgb(0 18 28 / 0.55))',
    reflexo: 0.3,
    contato: 0.85,
  }),
  // entardecer: céu rosa e violeta, luz quente da sala à esquerda, travertino polido
  cenario({
    id: 'cobertura',
    nome: 'Cobertura, Jardins',
    modelo: 'brightness(0.92) contrast(1.04) saturate(0.98) sepia(0.12)',
    luz: 'radial-gradient(70% 55% at 55% 32%, rgb(255 140 130 / 0.45), rgb(255 140 130 / 0) 70%), radial-gradient(55% 80% at 0% 55%, rgb(255 185 110 / 0.5), rgb(255 185 110 / 0) 70%)',
    reflexo: 0.14,
    contato: 0.6,
  }),
];
