// Intro de carregamento: o Swoosh em 3D gira em loop enquanto a tela carrega, acelera, freia de frente, toma
// impulso e atravessa a tela; o site aparece por trás no meio da travessia.
//
// Este módulo é leve (fica no bundle principal): segura a cobertura (.intro, já no index.html com o Swoosh plano) e
// carrega o Three.js à parte (intro-3d.js), para o site não esperar o 3D baixar.
// Sem WebGL, com movimento reduzido ou com ?intro=0: a cobertura só some quando a tela carrega.
//
// rodarIntro(el, { carregado }) → { revelada }
//   carregado  promessa: a tela pronta para entrar (imagens da fila decodificadas)
//   revelada   promessa: hora de a tela entrar (o 3D abriu a passagem, ou a cobertura saiu)

export function rodarIntro(el, { carregado, menosMovimento }) {
  let revelar;
  const revelada = new Promise(r => (revelar = r));
  if (!el) {
    carregado.then(revelar);
    return { revelada };
  }

  const remover = () => el.remove();
  const simples = () => {
    // sem 3D: a cobertura sai em fade quando a tela carrega
    carregado.then(() => {
      revelar();
      const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'cubic-bezier(0.5, 1, 0.89, 1)', fill: 'forwards' });
      a.onfinish = remover;
    });
  };

  const pular = new URLSearchParams(location.search).get('intro') === '0';
  if (pular) {
    carregado.then(() => (revelar(), remover()));
    return { revelada };
  }
  if (menosMovimento || !temWebGL()) {
    simples();
    return { revelada };
  }

  import('./intro-3d.js')
    .then(({ criarIntro3d }) => criarIntro3d(el, { carregado, revelar, fim: remover }))
    .catch(e => {
      console.warn('[intro]', e);
      simples();
    });
  return { revelada };
}

function temWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
