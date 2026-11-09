// Cenários: quatro esferas de vidro no trilho, entre os segmentos e o play. Cada uma troca o fundo do palco por uma
// foto de São Paulo; clicar na ativa volta ao estúdio branco. O fundo é uma pilha de <img> (uma por cenário, criada
// no primeiro uso) com fade cruzado; as cores do palco viram claras sobre a foto (.palco.is-cenario, palco.css).
import { cenarios } from '../data/cenarios.js';
import { $, $$, esc, menosMovimento } from '../dom.js';
import { assinar, mudar } from '../estado.js';
import { criarVidro } from '../motion/vidro.js';

// largura com que a foto aparece (cover num palco ~3:2 no desktop; no celular, a altura do palco manda)
const SIZES = '(max-width: 899px) 160svh, calc(100vw - 340px)';

export function montarCenarios({ palco, trilho }) {
  // fundo: atrás da fila, acima do branco do palco
  const fundo = document.createElement('div');
  fundo.className = 'fundo';
  fundo.setAttribute('aria-hidden', 'true');
  fundo.innerHTML = '<div class="fundo-veu"></div>';
  palco.prepend(fundo);
  const veu = $('.fundo-veu', fundo);

  const fotos = new Map();
  const foto = c => {
    if (fotos.has(c.id)) return fotos.get(c.id);
    const img = new Image();
    img.className = 'fundo-foto';
    img.alt = '';
    img.decoding = 'async';
    img.sizes = SIZES;
    img.srcset = c.srcset;
    img.style.objectPosition = c.foco;
    fundo.insertBefore(img, veu);
    fotos.set(c.id, img);
    return img;
  };

  // integração modelo × cena: luz em soft-light sobre fundo e fila (dentro da câmera, acima das figuras e abaixo
  // dos pinos) e grão por cima de tudo; o resto são variáveis lidas pelo CSS. ?integracao=0 desliga, para comparar.
  const luz = document.createElement('div');
  luz.className = 'luz';
  luz.setAttribute('aria-hidden', 'true');
  palco.querySelector('.fila').after(luz);
  const grao = document.createElement('div');
  grao.className = 'grao';
  grao.setAttribute('aria-hidden', 'true');
  palco.append(grao);
  if (new URLSearchParams(location.search).get('integracao') === '0') palco.classList.add('sem-integracao');
  const integrar = cfg => {
    const v = (nome, valor) => palco.style.setProperty(nome, valor);
    v('--modelo-filtro', cfg?.modelo ?? 'none');
    v('--reflexo', cfg?.reflexo ?? 0);
    v('--contato', cfg?.contato ?? 0);
    if (cfg?.luz) luz.style.backgroundImage = cfg.luz;
  };

  // seletor
  const grupo = document.createElement('div');
  grupo.className = 'cenarios';
  grupo.setAttribute('role', 'group');
  grupo.setAttribute('aria-label', 'Cenário');
  grupo.innerHTML = `
    <canvas class="cenarios-vidro" aria-hidden="true"></canvas>
    ${cenarios.map((c, i) => `
      <button class="esfera" type="button" data-cenario="${i}" aria-pressed="false" aria-label="Cenário: ${esc(c.nome)}"
        style="--foto: url('${c.esfera}'); --i: ${i}">
        <span class="esfera-nome" aria-hidden="true">${esc(c.nome)}</span>
      </button>`).join('')}`;
  trilho.append(grupo);
  const botoes = $$('[data-cenario]', grupo);

  const vidro = criarVidro($('.cenarios-vidro', grupo), botoes, cenarios.map(c => c.esfera), { parado: menosMovimento.matches });
  if (!vidro.ok) grupo.classList.add('sem-vidro'); // sem WebGL: a foto num círculo, pelo CSS

  // passar o mouse já baixa a foto, para o clique trocar sem espera
  botoes.forEach((b, i) => b.addEventListener('pointerenter', () => foto(cenarios[i]), { once: true }));

  grupo.addEventListener('click', e => {
    const b = e.target.closest('[data-cenario]');
    if (!b) return;
    const i = Number(b.dataset.cenario);
    mudar({ cenario: b.getAttribute('aria-pressed') === 'true' ? null : i });
  });

  assinar((s, mudou) => {
    if (mudou && !mudou.has('cenario')) return;
    const i = s.cenario;
    botoes.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    vidro.marcar(i);
    const alvo = i == null ? null : foto(cenarios[i]);
    const mostrar = () => {
      for (const img of fotos.values()) img.classList.toggle('is-ativa', img === alvo);
      palco.classList.toggle('is-cenario', i != null);
      palco.dataset.fundo = i == null ? '' : cenarios[i].id; // não data-cenario: esse é o dos botões (main.js e o clique procuram por ele)
      integrar(i == null ? null : cenarios[i].integracao);
    };
    // troca só com a foto decodificada (sem fundo pela metade); se demorar, troca assim mesmo em 1,5 s
    if (alvo && !alvo.complete) Promise.race([alvo.decode().catch(() => {}), new Promise(r => setTimeout(r, 1500))]).then(() => s.cenario === i && mostrar());
    else mostrar();
  });
}
