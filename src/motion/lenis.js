// Rolagem suave da página inteira (Lenis). Só na roda e no trackpad: no toque a rolagem continua a nativa do
// aparelho (sem syncTouch, regra 2 do /celular), e com movimento reduzido o Lenis nem liga.
// rolarPara() é o único caminho para o código mover a página: com o Lenis ligado, vai por ele (scrollTo nativo
// brigaria com a inércia dele); sem, cai no scrollTo/scrollIntoView do navegador.
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { menosMovimento } from '../dom.js';

let lenis = null;

export function ligarLenis() {
  if (menosMovimento.matches || lenis) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    // dentro de [data-lenis-prevent] (lista do painel, sacola, modal da arara) a roda rola o próprio elemento
  });
  return lenis;
}

export const pararRolagem = sim => (sim ? lenis?.stop() : lenis?.start());

/** alvo: número (px a partir do topo) ou elemento */
export function rolarPara(alvo, { imediato = false } = {}) {
  const sem = imediato || menosMovimento.matches;
  if (lenis) {
    lenis.scrollTo(alvo, { immediate: sem, duration: 1.1, easing: t => 1 - Math.pow(1 - t, 4) });
    return;
  }
  const behavior = sem ? 'auto' : 'smooth';
  if (typeof alvo === 'number') scrollTo({ top: alvo, behavior });
  else alvo.scrollIntoView({ behavior, block: 'start' });
}
