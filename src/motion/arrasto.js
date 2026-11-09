// Arrasto da fila com inércia e encaixe (decupagem, Parte 2, seção 3: SUPOSIÇÃO; o vídeo não mostra).
// - O ponteiro leva a fila junto: um passo de vaga (29,3 % do palco) é um look.
// - Ao soltar, projeta a posição pela velocidade (inércia) e encaixa no look mais perto, no máximo 3 de distância.
// - Soltar depois de 60 px ou 15 % do passo já anda um look; abaixo disso e sem velocidade, volta (0,4 s).
// - Começar a arrastar pausa o autoplay. Um arrasto engole o clique que viria depois dele.
const LIMIAR_PX = 6; // abaixo disso é clique, não arrasto
const INERCIA_S = 0.22; // quanto da velocidade vira distância extra
const MAX_PASSOS = 3;

export function ligarArrasto({ alvo, fila, aoComecar, aoSoltar, ignorar }) {
  let ini = null; // { id, x, y, P0, alvo0, amostras, arrastou, passo }

  alvo.addEventListener('pointerdown', e => {
    if (e.button !== 0 || ignorar(e)) return;
    ini = { id: e.pointerId, x: e.clientX, y: e.clientY, P0: null, alvo0: fila.alvo, amostras: [], arrastou: false, passo: fila.passoPx() };
  });

  alvo.addEventListener('pointermove', e => {
    if (!ini || e.pointerId !== ini.id) return;
    const dx = e.clientX - ini.x, dy = e.clientY - ini.y;
    if (!ini.arrastou) {
      if (Math.abs(dx) < LIMIAR_PX || Math.abs(dx) < Math.abs(dy)) {
        if (Math.abs(dy) > LIMIAR_PX * 2) ini = null; // gesto vertical: não é nosso
        return;
      }
      ini.arrastou = true;
      ini.x = e.clientX; // começa do ponto em que virou arrasto, sem salto
      ini.P0 = fila.segurar();
      alvo.setPointerCapture?.(e.pointerId);
      alvo.classList.add('is-arrastando');
      aoComecar();
    }
    const d = e.clientX - ini.x;
    fila.mover(ini.P0 - d / ini.passo);
    ini.amostras.push({ t: e.timeStamp, x: e.clientX });
    if (ini.amostras.length > 6) ini.amostras.shift();
  });

  function fim(e) {
    if (!ini || e.pointerId !== ini.id) return;
    const s = ini;
    ini = null;
    if (!s.arrastou) return;
    alvo.classList.remove('is-arrastando');
    alvo.releasePointerCapture?.(e.pointerId);

    // velocidade em looks por segundo, pelas últimas amostras (a mais velha com até 100 ms)
    const recentes = s.amostras.filter(a => e.timeStamp - a.t < 100);
    let vel = 0;
    if (recentes.length >= 2) {
      const a = recentes[0], b = recentes[recentes.length - 1];
      const dt = (b.t - a.t) / 1000;
      if (dt > 0) vel = -((b.x - a.x) / s.passo) / dt;
    }
    const P = fila.posicao;
    const dxTotal = e.clientX - s.x;
    let destino = Math.round(P + vel * INERCIA_S);
    // arrasto curto que passou do limiar anda um look no sentido do gesto
    const passou = Math.abs(dxTotal) > Math.min(60, 0.15 * s.passo) || Math.abs(vel) > 0.6;
    if (destino === s.alvo0 && passou) destino = s.alvo0 - Math.sign(dxTotal || -vel);
    destino = Math.max(s.alvo0 - MAX_PASSOS, Math.min(s.alvo0 + MAX_PASSOS, destino));

    // engole o clique que o navegador dispara depois do pointerup
    const engolir = ev => { ev.stopPropagation(); ev.preventDefault(); };
    addEventListener('click', engolir, { capture: true, once: true });
    setTimeout(() => removeEventListener('click', engolir, { capture: true }), 0);

    aoSoltar(destino - fila.alvo);
  }
  alvo.addEventListener('pointerup', fim);
  alvo.addEventListener('pointercancel', fim);
}
