// Rodapé: bloco preto com a newsletter, três colunas de links, a linha legal e o Swoosh gigante de borda a borda,
// cortado pela base da página (referencias/halden, "footer-gigante": lá é o nome da marca espaçado; aqui, o Swoosh).
// Entrada: título com as letras fora de ordem, colunas em fade e o Swoosh se desenhando da ponta grossa para o rabo.
import { marca } from '../data/marca.js';
import { $, esc, SETA_DIR, SETA_CIMA, menosMovimento } from '../dom.js';
import { embaralhar } from '../motion/letras.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function montarRodape(raiz) {
  const t = marca.loja.rodape;
  raiz.innerHTML = `
    <div class="rod-miolo">
      <div class="rod-topo" data-revela="0.3">
        <div class="rod-news">
          <h2 class="rod-titulo" id="rodape-titulo">${esc(t.titulo)}</h2>
          <p class="rod-frase">${esc(t.frase)}</p>
          <form class="rod-form" data-news novalidate>
            <label class="visualmente-oculto" for="rod-email">${esc(t.campo)}</label>
            <input class="rod-campo" id="rod-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="${esc(t.campo)}" required />
            <button class="rod-botao" type="submit">${esc(t.botao)} ${SETA_DIR}</button>
          </form>
          <p class="rod-aviso" data-aviso aria-live="polite"></p>
        </div>
        <nav class="rod-colunas" aria-label="Rodapé">
          ${t.colunas.map((c, i) => `
            <div class="rod-coluna" style="--i:${i}">
              <p class="rod-coluna-titulo">${esc(c.titulo)}</p>
              <ul>${c.links.map(l => `<li><a href="#" data-sem-destino>${esc(l)}</a></li>`).join('')}</ul>
            </div>`).join('')}
        </nav>
      </div>
      <div class="rod-legal">
        <p>${esc(t.legal)}</p>
        <p>${esc(t.cidade)}</p>
        <a class="rod-topo-link" href="#" data-topo>${esc(t.topo)} ${SETA_CIMA}</a>
      </div>
    </div>
    <div class="rod-swoosh" data-revela="0.2" aria-hidden="true">
      <svg viewBox="${marca.logo.viewBox}" preserveAspectRatio="xMidYMin meet"><path d="${marca.logo.d}" fill="currentColor"/></svg>
    </div>`;
  raiz.setAttribute('aria-labelledby', 'rodape-titulo');
  embaralhar($('.rod-titulo', raiz), { janela: 0.6 });

  const form = $('[data-news]', raiz);
  const aviso = $('[data-aviso]', raiz);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const campo = form.elements.email;
    const ok = EMAIL.test(campo.value.trim());
    form.classList.toggle('is-erro', !ok);
    aviso.textContent = ok ? t.feito : t.erro;
    if (ok) { form.classList.add('is-feito'); campo.value = ''; campo.blur(); }
    else campo.focus();
  });
  form.addEventListener('input', () => form.classList.remove('is-erro', 'is-feito'));

  // links sem página de destino neste conceito: não pulam a página para o topo
  raiz.addEventListener('click', e => {
    if (e.target.closest('[data-sem-destino]')) e.preventDefault();
    if (e.target.closest('[data-topo]')) {
      e.preventDefault();
      scrollTo({ top: 0, behavior: menosMovimento.matches ? 'auto' : 'smooth' });
    }
  });
}
