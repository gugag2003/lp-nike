// Estado da tela num objeto só. Cada parte (nav, palco, trilho, painel e as seções da loja) assina e redesenha o que
// é dela.
import { looks } from './data/looks.js';
import { CATEGORIA_INICIAL } from './data/loja.js';
import { caminho } from './motion/anel.js';

const estado = {
  centro: 0, // índice do look no meio da fila
  passo: 0, // última troca, de −4 a +4: é o que a fila anda (src/motion/fila.js)
  foco: false, // modelo do centro aberto, com os pinos
  pino: null, // número do pino ativo (1 a 3) no foco
  painel: 'look', // 'look' ou 'sacola'
  folha: false, // celular: folha do painel aberta
  autoplay: true,
  cenario: null, // índice do cenário de fundo (src/data/cenarios.js) ou null = estúdio branco
  sacola: [], // { chave, tipo: 'peca' | 'conjunto', look, n, qtd }
  categoria: CATEGORIA_INICIAL, // loja: categoria da faixa e filtro da vitrine (src/data/loja.js)
};

const ouvintes = new Set();
export const assinar = fn => (ouvintes.add(fn), fn(estado, null));
const avisar = (mudou) => ouvintes.forEach(fn => fn(estado, mudou));

export const ler = () => estado;

export function mudar(parcial, mudou = Object.keys(parcial)) {
  Object.assign(estado, parcial);
  avisar(new Set(mudou));
}

export const total = looks.length;
export const lookAtual = () => looks[estado.centro];

// troca de look; o passo (−4 a +4) é o que o laço da fila vai animar
export function irPara(indice, { pausar = true } = {}) {
  const alvo = ((indice % total) + total) % total;
  const passo = caminho(estado.centro, alvo, total);
  if (!passo) return 0;
  mudar({ centro: alvo, passo, pino: null, ...(pausar ? { autoplay: false } : {}) }, ['centro', 'pino', 'autoplay', 'passo']);
  return passo;
}
export const andar = (d, opcoes) => irPara(estado.centro + d, opcoes);

export const abrirFoco = (pino = null) => mudar({ foco: true, pino, autoplay: false });
export const fecharFoco = () => mudar({ foco: false, pino: null });
export const ativarPino = n => estado.pino !== n && mudar({ pino: n });

// sacola
export const pecasNaSacola = () => estado.sacola.reduce((t, i) => t + i.qtd * (i.tipo === 'conjunto' ? 3 : 1), 0);

function adicionar(item) {
  const existente = estado.sacola.find(i => i.chave === item.chave);
  const sacola = existente
    ? estado.sacola.map(i => (i === existente ? { ...i, qtd: i.qtd + 1 } : i))
    : [...estado.sacola, { ...item, qtd: 1 }];
  mudar({ sacola });
}
export const adicionarPeca = (look, n) => adicionar({ chave: `${look}-${n}`, tipo: 'peca', look, n });
export const adicionarConjunto = look => adicionar({ chave: `${look}-conjunto`, tipo: 'conjunto', look });
export function tirar(chave) {
  const sacola = estado.sacola
    .map(i => (i.chave === chave ? { ...i, qtd: i.qtd - 1 } : i))
    .filter(i => i.qtd > 0);
  mudar({ sacola });
}
