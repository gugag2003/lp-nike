// Categorias: a lista centrada em Anton, cada uma com a contagem em sobrescrito, e a faixa preta de borda a borda atrás
// da ativa, com duas fotos de peça inclinadas nas pontas (referencias/halden, "tabs-visuais").
//
// A faixa é uma segunda cópia da lista, em branco sobre preto, recortada (clip-path) no retângulo da faixa: quando a
// faixa anda, a letra que passa por ela fica branca no ponto exato, sem trocar cor de item nenhum.
// Passar o mouse num item leva a faixa até ele (e troca as fotos); clicar filtra a vitrine e desce até ela.
import { marca } from '../data/marca.js';
import { categorias, peca, contagem } from '../data/loja.js';
import { $, $$, esc, menosMovimento } from '../dom.js';
import { assinar, ler, mudar } from '../estado.js';

const listaHTML = (clara = false) => `
  <ul class="cat-lista${clara ? ' cat-lista--clara' : ''}" ${clara ? 'aria-hidden="true"' : `aria-label="${esc(marca.loja.categorias.lista)}"`}>
    ${categorias.map((c, i) => `
      <li class="cat-item" style="--i:${i}">
        ${clara
          ? `<span class="cat-botao"><span class="cat-nome">${esc(c.rotulo)}</span><sup class="cat-n">${contagem(c.id)}</sup></span>`
          : `<button class="cat-botao" type="button" data-cat="${c.id}"><span class="cat-nome">${esc(c.rotulo)}</span><sup class="cat-n">${contagem(c.id)}<span class="visualmente-oculto"> peças</span></sup></button>`}
      </li>`).join('')}
  </ul>`;

// foto da ponta da faixa: calçado na moldura deitada, roupa em pé
function fotoDe(chave) {
  const p = peca(chave);
  return { src: p.largo || p.card, deitada: Boolean(p.largo), alt: p.alt };
}

export function montarCategorias(raiz, { aoEscolher }) {
  const t = marca.loja.categorias;
  raiz.innerHTML = `
    <div class="secao-miolo">
      <div class="cat-cabeca">
        <p class="cat-rotulo">${esc(t.rotulo)}</p>
        <p class="secao-frase">${esc(t.frase)}</p>
      </div>
    </div>
    <div class="cat-palco" data-revela="0.16">
      ${listaHTML()}
      <div class="cat-faixa" aria-hidden="true">${listaHTML(true)}</div>
      <div class="cat-fotos" aria-hidden="true">
        <div class="cat-foto cat-foto--esq"></div>
        <div class="cat-foto cat-foto--dir"></div>
      </div>
    </div>`;

  const palco = $('.cat-palco', raiz);
  const faixa = $('.cat-faixa', raiz);
  const fotos = $('.cat-fotos', raiz);
  const molduras = [$('.cat-foto--esq', raiz), $('.cat-foto--dir', raiz)];
  const botoes = $$('[data-cat]', raiz);
  let alvo = ler().categoria;
  let aberta = false; // a faixa só estica depois da entrada

  // troca a foto de uma moldura com um fade cruzado; a nova só entra decodificada
  function trocarFoto(moldura, chave) {
    if (moldura.dataset.peca === chave) return;
    moldura.dataset.peca = chave;
    const f = fotoDe(chave);
    moldura.classList.toggle('is-deitada', f.deitada);
    const img = new Image();
    img.decoding = 'async';
    img.alt = '';
    img.src = f.src;
    const entrar = () => {
      if (moldura.dataset.peca !== chave) return;
      for (const velha of $$('img', moldura)) {
        velha.classList.add('is-saindo');
        setTimeout(() => velha.remove(), 450);
      }
      moldura.append(img);
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('is-dentro')));
    };
    img.decode().then(entrar, entrar);
  }

  // leva a faixa (o recorte da lista clara) e as fotos até o item da categoria
  function mover(id, { semTransicao = false } = {}) {
    const botao = botoes.find(b => b.dataset.cat === id);
    if (!botao) return;
    const c = categorias.find(c => c.id === id);
    // posição de layout (offsetTop), que ignora o translate da entrada: medida no meio da entrada, a faixa ficaria
    // deslocada pelo que falta o item subir
    // (o item com translate vira o offsetParent do botão: soma a cadeia até o palco)
    let y = 0;
    for (let el = botao; el && el !== palco; el = el.offsetParent) y += el.offsetTop;
    const altura = botao.offsetHeight * 0.96;
    const topo = y + (botao.offsetHeight - altura) / 2;
    const fundo = palco.clientHeight - topo - altura;
    const lado = aberta ? '0px' : 'calc(50% - 15%)';
    if (semTransicao) faixa.style.transition = fotos.style.transition = 'none';
    faixa.style.clipPath = `inset(${topo.toFixed(1)}px ${lado} ${fundo.toFixed(1)}px ${lado})`;
    fotos.style.transform = `translateY(${(topo + altura / 2).toFixed(1)}px)`;
    if (semTransicao) { faixa.getBoundingClientRect(); faixa.style.transition = fotos.style.transition = ''; }
    trocarFoto(molduras[0], c.fotos[0]);
    trocarFoto(molduras[1], c.fotos[1]);
    for (const b of botoes) b.classList.toggle('is-ativa', b.dataset.cat === id);
  }

  palco.addEventListener('revelou', () => {
    // a faixa nasce estreita no meio e estica até as bordas, depois que os itens começam a entrar
    setTimeout(() => {
      palco.classList.add('is-abrindo');
      aberta = true;
      mover(alvo);
      setTimeout(() => palco.classList.remove('is-abrindo'), 1100);
    }, menosMovimento.matches ? 0 : 380);
  });

  for (const b of botoes) {
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && aberta) mover(b.dataset.cat); });
    b.addEventListener('focus', () => aberta && mover(b.dataset.cat));
    b.addEventListener('click', () => {
      mudar({ categoria: b.dataset.cat });
      aoEscolher?.(b.dataset.cat);
    });
  }
  // o mouse saiu da lista: a faixa volta para a categoria escolhida
  $('.cat-lista', raiz).addEventListener('pointerleave', () => aberta && mover(ler().categoria));
  $('.cat-lista', raiz).addEventListener('focusout', e => {
    if (!e.relatedTarget || !raiz.contains(e.relatedTarget)) aberta && mover(ler().categoria);
  });

  assinar((s, mudou) => {
    if (mudou && !mudou.has('categoria')) return;
    alvo = s.categoria;
    for (const b of botoes) b.setAttribute('aria-pressed', String(b.dataset.cat === s.categoria));
    mover(s.categoria, { semTransicao: !mudou });
  });

  // a faixa mede pela posição do item: refaz quando a lista muda de tamanho (fonte carregada, giro do celular)
  new ResizeObserver(() => mover(alvo, { semTransicao: true })).observe(palco);
  document.fonts?.ready.then(() => mover(alvo, { semTransicao: true }));
}
