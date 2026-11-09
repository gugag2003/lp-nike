// Geometria do anel: 9 vagas (−4 a +4) para os 8 looks. A vaga k mostra o look (centro + k) mod 8,
// então ±4 caem no mesmo look: o anel é de vagas, não de looks.
//
// vaga(v) recebe a posição contínua v (vaga menos o progresso da fila) e devolve tudo o que a figura precisa.
// O laço da fila (fila.js) chama a cada quadro com v fracionário.

export const VAGAS_N = 4; // de −4 a +4

// medidas em 1440 (BRIEF.md, "Tela: valores que valem"): eixo em % do palco a partir do meio, pés em % da tela
const DESKTOP = [
  { eixo: 0, pes: 86.7, escala: 1, desfoque: 0 },
  { eixo: 29.3, pes: 85.1, escala: 0.875, desfoque: 2.5 },
  { eixo: 45, pes: 80.4, escala: 0.775, desfoque: 4 },
  { eixo: 45, pes: 75.5, escala: 0.66, desfoque: 4.5 },
  { eixo: 35, pes: 72.1, escala: 0.58, desfoque: 4.5 },
];

// celular (BRIEF.md, "Celular"): só o centro e ±1, cortados nas bordas; ±2 a ±4 ficam invisíveis
const CELULAR = [
  { eixo: 0, pes: 83, escala: 1, desfoque: 0 },
  { eixo: 42, pes: 81.8, escala: 0.875, desfoque: 2.5 },
  { eixo: 50, pes: 79, escala: 0.775, desfoque: 4 },
  { eixo: 50, pes: 79, escala: 0.775, desfoque: 4 },
  { eixo: 50, pes: 79, escala: 0.775, desfoque: 4 },
];

const lerp = (a, b, t) => a + (b - a) * t;

// Catmull-Rom pelos eixos das vagas: dá o arco de ~14 px para fora entre ±2 e ±3 sem valor próprio
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function eixo(tabela, a) {
  // pontos com simetria ímpar em 0 (P[−1] = −P[1]) e constantes além de ±4
  const P = i => (i < 0 ? -tabela[-i].eixo : tabela[Math.min(i, VAGAS_N)].eixo);
  const i = Math.floor(a), t = a - i;
  return catmull(P(i - 1), P(i), P(i + 1), P(i + 2), t);
}

function linear(tabela, a, chave) {
  const i = Math.min(Math.floor(a), VAGAS_N), j = Math.min(i + 1, VAGAS_N);
  return lerp(tabela[i][chave], tabela[j][chave], Math.min(a - i, 1));
}

// opacidade pela distância ao centro: 1 até 3,5, .16 em 4, 0 em 4,15
function opacidade(a, celular) {
  if (celular) return a <= 1 ? 1 : a >= 1.6 ? 0 : 1 - (a - 1) / 0.6;
  if (a <= 3.5) return 1;
  if (a <= 4) return lerp(1, 0.16, (a - 3.5) / 0.5);
  if (a <= 4.15) return lerp(0.16, 0, (a - 4) / 0.15);
  return 0;
}

export function vaga(v, celular = false) {
  const tabela = celular ? CELULAR : DESKTOP;
  const a = Math.min(Math.abs(v), VAGAS_N);
  const lado = Math.sign(v);
  return {
    x: 50 + lado * eixo(tabela, a), // % do palco
    pes: linear(tabela, a, 'pes'), // % da tela
    escala: linear(tabela, a, 'escala'),
    desfoque: linear(tabela, a, 'desfoque'), // px em 1440; fila.js mistura as versões já desfocadas do recorte
    opacidade: opacidade(Math.abs(v), celular),
    z: Math.round((VAGAS_N + 1 - Math.abs(v)) * 10),
  };
}

// look de cada vaga
export const lookDaVaga = (centro, k, total) => (((centro + k) % total) + total) % total;

// caminho mais curto no anel, de a até b (positivo = avançar)
export function caminho(a, b, total) {
  let d = (((b - a) % total) + total) % total;
  if (d > total / 2) d -= total;
  return d;
}
