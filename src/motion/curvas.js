// Curvas e tempos do motion, num lugar só. Os valores são os do BRIEF.md ("Onde a decupagem se contradiz");
// as mesmas curvas estão em tokens.css (--c-fila, --c-suave, --c-trilho, --c-pino) para o CSS.

// cubic-bezier(x1, y1, x2, y2) como função de t (0 a 1), resolvido por Newton com bisseção de reserva
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const x = t => ((ax * t + bx) * t + cx) * t;
  const y = t => ((ay * t + by) * t + cy) * t;
  const dx = t => (3 * ax * t + 2 * bx) * t + cx;
  return p => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 6; i++) {
      const e = x(t) - p, d = dx(t);
      if (Math.abs(e) < 1e-5) return y(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = p;
    for (let i = 0; i < 24; i++) {
      if (x(t) < p) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return y(t);
  };
}

export const C = {
  fila: bezier(0.33, 1, 0.68, 1), // fila, foco, encaixe do arrasto
  suave: bezier(0.5, 1, 0.89, 1), // fades, fios, novo +4
  trilho: bezier(0.25, 1, 0.5, 1), // segmentos
  linear: p => p,
};

// tempos em segundos
export const T = {
  fila: 0.7, // troca de um look
  filaPorPasso: 0.1, // a mais por look quando a troca pula vários (segmento, logo, nav)
  encaixe: 0.4, // arrasto curto que volta
  focoAbre: 0.5,
  focoFecha: 0.45,
  vizinhosSaem: 0.23, // começa em +0,02, quase linear
  vizinhosVoltam: 0.5, // começa em +0,20, curva suave
  vizinhosVoltamAtraso: 0.2,
  novoQuarto: { inicio: 0.38, duracao: 0.52 }, // fade próprio do novo ±4
  entrada: 0.4, // modelos assentam saindo de um desfoque extra
  autoplay: 5, // por look
};

export const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a, b, t) => a + (b - a) * t;

// um valor animado no tempo, de a até b, com curva e atraso; quem lê chama valor(agora)
export function tween(de, para, { duracao, curva = C.fila, atraso = 0, inicio = performance.now() / 1000 }) {
  return {
    de, para, inicio: inicio + atraso, duracao, curva,
    valor(agora) {
      const p = duracao > 0 ? clamp01((agora - this.inicio) / duracao) : 1;
      return lerp(de, para, curva(p));
    },
    acabou(agora) { return agora >= this.inicio + duracao; },
  };
}
