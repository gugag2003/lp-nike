// Painel: as três peças do look do centro (linha N = pino N), o fecho com o preço do conjunto e o botão.
// A sacola troca o conteúdo do painel pelo estado "Na sacola", no mesmo formato das linhas. No celular, o painel é
// uma folha presa ao pé da tela, que abre para cima.
import { marca } from '../data/marca.js';
import { looks, soma, precoConjunto, reais } from '../data/looks.js';
import { $, $$, esc, MAIS, MENOS, CHECK, SETA_DIR, SETA_CIMA, X, menosMovimento } from '../dom.js';
import { cascata, entradaSacola } from '../motion/cascata.js';
import {
  assinar, ler, mudar, lookAtual, ativarPino, adicionarPeca, adicionarConjunto, tirar, pecasNaSacola,
} from '../estado.js';

const FEITO_MS = 1600;
const porId = id => looks.find(l => l.id === id);

const fotoHTML = (p, { num = true } = {}) => `
  <div class="foto foto--${p.fundo}">
    <img src="${p.foto}" alt="${esc(p.fotoAlt)}" decoding="async" loading="lazy" width="84" height="105" />
    ${num ? `<span class="num" aria-hidden="true">${p.n}</span>` : ''}
    ${p.selo ? `<span class="selo">${esc(p.selo)}</span>` : ''}
  </div>`;

const linhaHTML = (l, p) => `
  <li class="linha" data-linha="${p.n}">
    ${fotoHTML(p)}
    <div class="linha-texto">
      <p class="nome">${esc(p.nome)}</p>
      <p class="rotulo">${esc(marca.painel.rotulos[p.n - 1])}</p>
      <p class="preco">${reais(p.preco)}</p>
    </div>
    <button class="mais icone-redondo" type="button" data-mais="${p.n}" aria-label="${esc(marca.painel.adicionar)}: ${esc(p.nome)}">
      <span class="mais-icone">${MAIS}</span><span class="mais-feito">${CHECK}</span>
    </button>
  </li>`;

function itemHTML(item) {
  const l = porId(item.look);
  const conjunto = item.tipo === 'conjunto';
  const p = conjunto ? l.pecas[0] : l.pecas[item.n - 1];
  const preco = conjunto ? precoConjunto(l) : p.preco;
  return `
    <li class="linha" data-item="${item.chave}">
      ${fotoHTML(p, { num: false })}
      <div class="linha-texto">
        <p class="nome">${esc(conjunto ? l.nome : p.nome)}</p>
        <p class="rotulo">${esc(conjunto ? marca.sacola.conjunto : l.nome)}</p>
        <p class="preco">${item.qtd > 1 ? `${item.qtd} × ` : ''}${reais(preco)}</p>
      </div>
      <button class="mais icone-redondo" type="button" data-tirar="${item.chave}" aria-label="${esc(marca.sacola.remover)}: ${esc(conjunto ? `${marca.sacola.conjunto} ${l.nome}` : p.nome)}">
        <span class="mais-icone">${MENOS}</span>
      </button>
    </li>`;
}

const totalSacola = s => s.sacola.reduce((t, i) => {
  const l = porId(i.look);
  return t + i.qtd * (i.tipo === 'conjunto' ? precoConjunto(l) : l.pecas[i.n - 1].preco);
}, 0);

export function montarPainel(raiz) {
  raiz.innerHTML = `
    <div class="painel-cabeca">
      <h2 class="painel-titulo" data-titulo></h2>
      <button class="painel-alternar" type="button" data-alternar>
        <span class="painel-resumo" data-resumo></span>
        <span class="painel-seta" aria-hidden="true">${SETA_CIMA}</span>
      </button>
      <button class="painel-fechar icone-redondo" type="button" data-fechar-sacola aria-label="Fechar a sacola">${X}</button>
    </div>
    <div class="painel-corpo" data-lenis-prevent>
      <ul class="linhas" data-linhas data-lenis-prevent></ul>
      <div class="vao" aria-hidden="true"></div>
      <div class="fecho" data-fecho></div>
      <button class="botao" type="button" data-botao></button>
    </div>`;

  const titulo = $('[data-titulo]', raiz);
  const linhas = $('[data-linhas]', raiz);
  const fecho = $('[data-fecho]', raiz);
  const botao = $('[data-botao]', raiz);
  const resumo = $('[data-resumo]', raiz);
  const alternar = $('[data-alternar]', raiz);
  let timerBotao;

  // O painel é redesenhado a cada troca; quem está com o foco de teclado num botão da lista não pode cair no body.
  // Guarda qual botão era (o + da peça N, ou o − de um item da sacola) e devolve o foco ao equivalente depois.
  function lembrarFoco() {
    const ativo = document.activeElement;
    if (!ativo || !linhas.contains(ativo)) return null;
    const botaoMais = ativo.closest('[data-mais]');
    if (botaoMais) return { mais: botaoMais.dataset.mais };
    const botaoTirar = ativo.closest('[data-tirar]');
    if (botaoTirar) return { tirar: botaoTirar.dataset.tirar, indice: $$('[data-tirar]', linhas).indexOf(botaoTirar) };
    return null;
  }
  function devolverFoco(guardado) {
    if (!guardado) return;
    let alvo = null;
    if (guardado.mais) alvo = $(`[data-mais="${guardado.mais}"]`, linhas);
    else if (guardado.tirar) {
      // o mesmo item, se ainda está lá; senão o que ficou no lugar dele, o de cima, ou o X da sacola
      const todos = $$('[data-tirar]', linhas);
      alvo = todos.find(b => b.dataset.tirar === guardado.tirar) || todos[guardado.indice] || todos[guardado.indice - 1] || $('[data-fechar-sacola]', raiz);
    }
    alvo?.focus({ preventScroll: true });
  }

  function desenharLook() {
    const guardado = lembrarFoco();
    const l = lookAtual();
    raiz.dataset.estado = 'look';
    titulo.textContent = marca.painel.titulo;
    linhas.innerHTML = l.pecas.map(p => linhaHTML(l, p)).join('');
    fecho.innerHTML = `
      <div class="fecho-texto">
        <p class="fecho-titulo">${esc(marca.painel.fechoTitulo)}</p>
        <p class="fecho-frase">${esc(marca.painel.fechoFrase)}</p>
      </div>
      <p class="fecho-precos">
        <s class="preco-antigo"><span class="visualmente-oculto">De </span>${reais(soma(l))}</s>
        <span class="preco-conjunto"><span class="visualmente-oculto">por </span>${reais(precoConjunto(l))}</span>
      </p>`;
    resumo.textContent = reais(precoConjunto(l));
    clearTimeout(timerBotao);
    botao.classList.remove('is-feito');
    botao.innerHTML = `<span>${esc(marca.painel.botao)}</span>${SETA_DIR}`;
    botao.dataset.acao = 'conjunto';
    marcarPino(ler());
    devolverFoco(guardado);
  }

  function desenharSacola(s) {
    const guardado = lembrarFoco();
    raiz.dataset.estado = 'sacola';
    titulo.textContent = marca.sacola.titulo;
    const n = pecasNaSacola();
    linhas.innerHTML = s.sacola.length
      ? s.sacola.map(itemHTML).join('')
      : `<li class="linha linha--vazia"><p class="apoio-painel">${esc(marca.sacola.vazia)}</p></li>`;
    fecho.innerHTML = `
      <div class="fecho-texto">
        <p class="fecho-titulo">${esc(marca.sacola.total)}</p>
        <p class="fecho-frase">${esc(marca.sacola.pecas(n))}</p>
      </div>
      <p class="fecho-precos"><span class="preco-conjunto">${reais(totalSacola(s))}</span></p>`;
    resumo.textContent = reais(totalSacola(s));
    botao.classList.remove('is-feito');
    botao.innerHTML = `<span>${esc(marca.sacola.voltar)}</span>${SETA_DIR}`;
    botao.dataset.acao = 'voltar';
    devolverFoco(guardado);
  }

  // número da linha acende com o pino ativo, no foco
  function marcarPino(s) {
    for (const li of $$('[data-linha]', linhas)) li.classList.toggle('is-ativa', s.foco && Number(li.dataset.linha) === s.pino);
  }

  raiz.addEventListener('click', e => {
    const mais = e.target.closest('[data-mais]');
    if (mais) {
      adicionarPeca(lookAtual().id, Number(mais.dataset.mais));
      mais.classList.add('is-feito');
      clearTimeout(mais._t);
      mais._t = setTimeout(() => mais.classList.remove('is-feito'), FEITO_MS);
      return;
    }
    const tira = e.target.closest('[data-tirar]');
    if (tira) { tirar(tira.dataset.tirar); return; }
    if (e.target.closest('[data-fechar-sacola]')) { mudar({ painel: 'look' }); return; }
    if (e.target.closest('[data-alternar]')) { mudar({ folha: !ler().folha }); return; }
    if (e.target.closest('[data-botao]')) {
      if (botao.dataset.acao === 'voltar') { mudar({ painel: 'look' }); return; }
      adicionarConjunto(lookAtual().id);
      botao.classList.add('is-feito');
      botao.innerHTML = `<span>${esc(marca.painel.botaoFeito)}</span>${CHECK}`;
      clearTimeout(timerBotao);
      timerBotao = setTimeout(() => {
        botao.classList.remove('is-feito');
        botao.innerHTML = `<span>${esc(marca.painel.botao)}</span>${SETA_DIR}`;
      }, FEITO_MS);
    }
  });
  // o inverso do pino: passar o mouse, tocar ou chegar pelo Tab na linha acende o pino da peça (só no foco)
  const pinoDaLinha = e => {
    const li = e.target.closest('[data-linha]');
    if (li && ler().foco) ativarPino(Number(li.dataset.linha));
  };
  linhas.addEventListener('pointerover', e => { if (e.pointerType === 'mouse') pinoDaLinha(e); });
  linhas.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') pinoDaLinha(e); });
  linhas.addEventListener('focusin', pinoDaLinha);

  assinar((s, mudou) => {
    const tudo = !mudou;
    if (s.painel === 'sacola') {
      if (tudo || mudou.has('sacola') || mudou.has('painel')) desenharSacola(s);
      if (!tudo && mudou.has('painel')) entradaSacola(raiz, { menosMovimento: menosMovimento.matches });
    } else if (tudo || mudou.has('centro') || mudou.has('painel')) {
      desenharLook();
      // a cada troca de look (e na volta da sacola), o painel entra em cascata
      if (!tudo) cascata(raiz, { menosMovimento: menosMovimento.matches });
    }
    if (tudo || mudou.has('pino') || mudou.has('foco')) marcarPino(s);
    if (tudo || mudou.has('folha') || mudou.has('painel')) {
      raiz.classList.toggle('is-aberta', s.folha);
      alternar.setAttribute('aria-expanded', s.folha);
      alternar.setAttribute('aria-label', s.folha ? 'Fechar o painel' : 'Abrir o painel');
    }
  });
}
