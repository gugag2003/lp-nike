// Cursor próprio, só com mouse (BRIEF.md, "Cursor"). O nativo continua visível; o próprio é uma camada que segue
// atrás dele, com lerp de 0,2 por quadro a 60 Hz (corrigido pelo tempo do quadro).
//   rápido               ponto Ø18 --pino
//   devagar, no centro   bolha Ø64 --cursor-bolha translúcida, fio fino, "VER"
//   devagar, no palco    a mesma bolha, "ANDA"
//   sobre botão          a bolha clareia até sumir
//   no foco, fora do palco   sem cursor próprio
// O morph (0,3–0,35 s, diâmetro e cor juntos, rótulo no último terço) é CSS, em palco.css.
const RAPIDO = 420; // px/s: acima disso vira ponto
const DEVAGAR = 140; // px/s: abaixo disso por um instante, vira bolha
const ESPERA_BOLHA = 0.04; // s devagar antes de virar bolha
// sem pointermove por este tempo, o ponteiro parou: a velocidade vai a zero na hora. Com a espera acima, a bolha
// começa ~0,1 s depois de parar, a qualquer velocidade (decupagem, Parte 2, seção 4); antes, a velocidade caía aos
// poucos e a bolha levava de 0,36 a 0,73 s.
const PAROU = 0.06; // acima do intervalo entre pointermoves mesmo a 30 quadros por segundo (33 ms)

export function ligarCursor({ palco, rotulos, estaEmFoco }) {
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor-bolha"></span><span class="cursor-rotulo"></span>';
  document.body.append(el);
  const rotulo = el.querySelector('.cursor-rotulo');

  let mx = -100, my = -100; // ponteiro
  let x = -100, y = -100; // camada
  let vel = 0; // px/s, suavizada
  let ultimoMove = 0;
  let devagarDesde = 0;
  let forma = 'ponto';
  let zona = 'fora';
  let raf = 0;
  let ultimoQuadro = 0;
  let visto = false;

  function zonaDe(alvo) {
    if (!alvo || !palco.contains(alvo) || estaEmFoco()) return 'fora';
    if (alvo.closest('[data-abrir]')) return 'ver';
    if (alvo.closest('button, a')) return 'botao';
    return 'arrastar';
  }

  function aplicar() {
    el.dataset.zona = zona;
    el.dataset.forma = forma;
    const r = zona === 'ver' ? rotulos.ver : zona === 'arrastar' ? rotulos.arrastar : '';
    if (r && rotulo.textContent !== r) rotulo.textContent = r;
  }

  function quadro(ms) {
    raf = 0;
    const dt = ultimoQuadro ? Math.min(0.05, (ms - ultimoQuadro) / 1000) : 1 / 60;
    ultimoQuadro = ms;
    const k = 1 - Math.pow(0.8, dt * 60);
    x += (mx - x) * k;
    y += (my - y) * k;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

    // ponteiro parado: a velocidade cai a zero
    const t = ms / 1000;
    if (t - ultimoMove > PAROU) vel = 0;
    if (vel > RAPIDO) { forma = 'ponto'; devagarDesde = 0; }
    else if (vel < DEVAGAR) {
      if (!devagarDesde) devagarDesde = t;
      if (t - devagarDesde > ESPERA_BOLHA) forma = 'bolha';
    } else devagarDesde = 0; // entre os dois limiares a forma fica, mas a espera recomeça
    aplicar();

    const longe = Math.abs(mx - x) + Math.abs(my - y) > 0.3;
    if (longe || vel > 1 || forma !== 'bolha') raf = requestAnimationFrame(quadro);
    else ultimoQuadro = 0;
  }
  const pedir = () => { if (!raf) raf = requestAnimationFrame(quadro); };

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const t = e.timeStamp / 1000;
    const dt = Math.max(0.004, t - ultimoMove);
    const inst = Math.hypot(e.clientX - mx, e.clientY - my) / dt;
    vel = visto ? vel * 0.6 + inst * 0.4 : 0;
    ultimoMove = t;
    mx = e.clientX;
    my = e.clientY;
    if (!visto) { visto = true; x = mx; y = my; }
    zona = zonaDe(e.target);
    pedir();
  }, { passive: true });

  // o estado da fila muda sem o mouse andar (foco abre, troca de look): reavalia a zona no lugar
  const reavaliar = () => { if (visto) { zona = zonaDe(document.elementFromPoint(mx, my)); aplicar(); } };
  document.addEventListener('pointerleave', () => { zona = 'fora'; aplicar(); });
  palco.addEventListener('pointerdown', () => el.classList.add('is-pressionado'));
  addEventListener('pointerup', () => el.classList.remove('is-pressionado'));
  aplicar();
  return { reavaliar };
}
