// Quebra texto em letras para as entradas da loja, sem perder a quebra de linha: cada palavra é um span que não
// quebra (.palavra), com uma span por letra (.letra) dentro; os espaços continuam texto, e é neles que a linha quebra.
// O texto original fica para leitores de tela num rótulo, e as letras ficam aria-hidden.

// letras de um texto dentro de um elemento pai; devolve as spans das letras, na ordem de leitura
export function letrasEm(pai, texto, { classe = '' } = {}) {
  const letras = [];
  const partes = texto.split(/(\s+)/);
  for (const [k, parte] of partes.entries()) {
    if (!parte) continue;
    // pontuação logo depois de outro pedaço (":" depois do trecho sublinhado) gruda na última palavra, senão a
    // linha pode quebrar antes dela
    const ultima = pai.lastChild;
    if (k === 0 && !/^\s/.test(parte) && ultima?.classList?.contains('palavra')) {
      for (const c of parte) {
        const s = document.createElement('span');
        s.className = 'letra';
        s.textContent = c;
        ultima.append(s);
        letras.push(s);
      }
      continue;
    }
    if (/^\s+$/.test(parte)) {
      // espaço dentro de um trecho com classe (sublinhado) vira letra também, para o traço não ter buraco
      if (classe) {
        const s = document.createElement('span');
        s.className = `letra ${classe}`;
        s.textContent = ' ';
        pai.append(s);
        letras.push(s);
      } else pai.append(document.createTextNode(' '));
      continue;
    }
    const palavra = document.createElement('span');
    palavra.className = 'palavra';
    for (const c of parte) {
      const s = document.createElement('span');
      s.className = classe ? `letra ${classe}` : 'letra';
      s.textContent = c;
      palavra.append(s);
      letras.push(s);
    }
    pai.append(palavra);
  }
  return letras;
}

// título que monta com as letras fora de ordem (entrada das seções vitrine, rua e rodapé): cada letra ganha um
// atraso sorteado em --d, e o CSS faz o fade quando o elemento recebe .is-visivel
// (uma quebra de linha "\n" no texto vira <br>)
export function embaralhar(el, { janela = 0.55 } = {}) {
  const texto = el.textContent.trim();
  el.setAttribute('aria-label', texto.replace(/\s*\n\s*/g, ' '));
  el.textContent = '';
  const caixa = document.createElement('span');
  caixa.setAttribute('aria-hidden', 'true');
  el.append(caixa);
  const letras = [];
  texto.split('\n').forEach((linha, i) => {
    if (i) caixa.append(document.createElement('br'));
    letras.push(...letrasEm(caixa, linha.trim()));
  });
  // sorteio com semente fixa por texto: a mesma montagem a cada visita, e nenhuma letra muito atrasada
  let semente = [...texto].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const sorte = () => ((semente = (semente * 1664525 + 1013904223) >>> 0) / 4294967296);
  letras.forEach(l => l.style.setProperty('--d', `${(sorte() * janela).toFixed(3)}s`));
  el.classList.add('embaralha');
  return letras;
}
