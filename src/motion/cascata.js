// Entrada do painel a cada troca de look (BRIEF.md, "Onde a decupagem se contradiz", e decupagem, Partes 2 e 4).
// Em +0,03 somem, secos, as linhas, o fecho, o botão e os 4 fios internos; ficam o título e o fio do fecho. Depois:
//   linhas 1, 2, 3   +0,28 / +0,36 / +0,44   0,5 s   opacidade, desfoque 4 px → 0 e y +9 → 0
//   total            +0,43 → +0,95            fade
//   botão            +0,48 → +1,10            de branco a preto, passando por cinza
//   fios internos    +0,50 / +0,58 / +0,64 / +0,70   ~0,5 s   só fade
// O sumiço seco vem de graça: o painel é redesenhado na troca, e o fill: backwards segura tudo escondido até o
// próprio início. O desfoque aqui é filter em três linhas pequenas, não nos modelos.
const SUAVE = 'cubic-bezier(0.5, 1, 0.89, 1)';
const SAIDA = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Abrir a sacola: a lista trocava seca. Entrada curta, sem desfoque: cada item sobe 8 px em fade, 45 ms entre eles
// (no máximo 5 de atraso), e o total em fade. Tirar ou somar um item com a sacola aberta não reanima.
export function entradaSacola(raiz, { menosMovimento = false } = {}) {
  const linhas = raiz.querySelector('[data-linhas]');
  const fecho = raiz.querySelector('[data-fecho]');
  const botao = raiz.querySelector('[data-botao]');
  const itens = [...linhas.querySelectorAll('.linha')];
  for (const el of [linhas, fecho, botao, ...itens, ...fecho.children]) el.getAnimations().forEach(a => a.cancel());
  if (menosMovimento) {
    for (const el of [linhas, fecho]) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'backwards' });
    return;
  }
  itens.forEach((li, i) => li.animate(
    [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
    { delay: 40 + Math.min(i, 5) * 45, duration: 420, easing: SAIDA, fill: 'backwards' },
  ));
  for (const filho of fecho.children) filho.animate([{ opacity: 0 }, { opacity: 1 }], { delay: 140, duration: 320, easing: SUAVE, fill: 'backwards' });
}

export function cascata(raiz, { menosMovimento = false } = {}) {
  const linhas = raiz.querySelector('[data-linhas]');
  const fecho = raiz.querySelector('[data-fecho]');
  const botao = raiz.querySelector('[data-botao]');
  const itens = [...linhas.querySelectorAll('.linha')];
  for (const el of [linhas, fecho, botao, ...itens]) el.getAnimations().forEach(a => a.cancel());

  if (menosMovimento) {
    for (const el of [linhas, fecho, botao]) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'backwards' });
    return;
  }

  const anim = (el, quadros, inicio, duracao, easing = SUAVE) =>
    el.animate(quadros, { delay: inicio * 1000, duration: duracao * 1000, easing, fill: 'backwards' });

  // conteúdo de cada linha (foto, texto, +): a linha em si fica, porque o fio dela tem o próprio tempo
  itens.forEach((li, i) => {
    for (const filho of li.children) {
      anim(filho, [
        { opacity: 0, filter: 'blur(4px)', transform: 'translateY(9px)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'none' },
      ], 0.28 + 0.08 * i, 0.5);
    }
  });

  // fios: o de cima das linhas e o de baixo de cada linha (o 4º fio é o de baixo da 3ª)
  const fio = getComputedStyle(raiz).getPropertyValue('--fio-linha').trim() || '#e5e5e5';
  anim(linhas, [{ borderTopColor: 'transparent' }, { borderTopColor: fio }], 0.5, 0.5);
  itens.forEach((li, i) => anim(li, [{ borderBottomColor: 'transparent' }, { borderBottomColor: fio }], 0.58 + [0, 0.06, 0.12][i], 0.5));

  // o fio do fecho não muda: o fade vai no conteúdo dele, não na borda
  for (const filho of fecho.children) anim(filho, [{ opacity: 0 }, { opacity: 1 }], 0.43, 0.52);

  const fundo = getComputedStyle(raiz).getPropertyValue('--fundo').trim() || '#ffffff';
  const cinza = getComputedStyle(raiz).getPropertyValue('--botao-entrada').trim() || '#9e9ea0';
  anim(botao, [
    { backgroundColor: fundo, color: fundo },
    { backgroundColor: cinza, color: 'rgb(255 255 255 / 0.6)', offset: 0.18 },
    { backgroundColor: getComputedStyle(botao).backgroundColor, color: getComputedStyle(botao).color },
  ], 0.48, 0.62, 'cubic-bezier(0.33, 1, 0.68, 1)');
}
