// Autoplay e o preto do segmento ativo do trilho.
// - Ligado: o segmento ativo enche linear em 5 s; cheio, a fila anda um look (sem pausar) e o novo começa vazio.
// - Pausa: o ativo vai a 100 % no mesmo quadro, sem transição. Trocar de look pausado enche o novo para a direita
//   até ~+0,65 (decupagem, Parte 4, seção 5).
// - Play retoma o look do zero. Aba oculta congela o tempo, e ele continua do mesmo ponto ao voltar.
// - O tempo só começa a contar em liberar(), chamado quando a tela aparece (main.js): com imagens lentas, o primeiro
//   look não surge com o segmento já pela metade.
// - Na troca, só a animação de encher (nossa) é cancelada; a transição CSS de opacidade do .seg-cheio antigo fica,
//   porque é ela que leva o preto ao cinza de visitado.
import { T } from './curvas.js';

const ENCHE_PAUSADO = { duration: 620, delay: 30, easing: 'cubic-bezier(0.33, 1, 0.68, 1)' };

export function ligarAutoplay({ trilho, assinar, avancar }) {
  const segs = [...trilho.querySelectorAll('[data-seg]')];
  const cheio = i => segs[i].querySelector('.seg-cheio');
  let ativo = -1;
  let ligado = false;
  let p = 0; // progresso do look atual, 0 a 1
  let ultimo = 0;
  let raf = 0;
  let liberado = false;
  let suspenso = false; // provador fora da tela (a página rolou para a loja): o tempo para, sem contar como pausa
  const enchendo = new Map(); // segmento -> animação de encher (pausado)

  const escrever = (i, v) => cheio(i).style.setProperty('--progresso', v.toFixed(4));

  function quadro(ms) {
    raf = 0;
    if (!ligado) return;
    // no máximo 100 ms por quadro: aba oculta para o rAF, e a volta não pula o tempo que passou fora
    const dt = Math.min(0.1, Math.max(0, (ms - ultimo) / 1000));
    ultimo = ms;
    p = Math.min(1, p + dt / T.autoplay);
    escrever(ativo, p);
    if (p >= 1) {
      p = 0;
      avancar();
    }
    if (ligado && !raf) raf = requestAnimationFrame(quadro);
  }
  function rodar() {
    if (raf || !liberado || suspenso) return;
    raf = requestAnimationFrame(ms => { ultimo = ms; raf = requestAnimationFrame(quadro); });
  }

  assinar((s, mudou) => {
    const trocou = s.centro !== ativo;
    const religou = s.autoplay && !ligado;
    const anterior = ativo;
    if (trocou) {
      ativo = s.centro;
      if (anterior >= 0 && enchendo.has(anterior)) { enchendo.get(anterior).cancel(); enchendo.delete(anterior); }
    }
    ligado = s.autoplay;

    if (ligado) {
      if (trocou || religou || !mudou) { p = 0; escrever(ativo, 0); }
      rodar();
    } else {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      escrever(ativo, 1);
      // pausado, o novo segmento enche para a direita junto com a troca
      if (trocou && anterior >= 0) {
        const i = ativo;
        const a = cheio(i).animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { ...ENCHE_PAUSADO, fill: 'backwards' });
        enchendo.set(i, a);
        a.finished.then(() => enchendo.get(i) === a && enchendo.delete(i), () => {});
      }
    }
  });

  return {
    // a tela apareceu: o look do centro começa do zero
    liberar() {
      if (liberado) return;
      liberado = true;
      if (ligado) { p = 0; escrever(ativo, 0); rodar(); }
    },
    // provador fora da tela: congela o tempo no ponto em que está (como a aba oculta) e continua ao voltar
    suspender(sim) {
      if (suspenso === sim) return;
      suspenso = sim;
      if (sim) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
      else if (ligado) rodar();
    },
  };
}
