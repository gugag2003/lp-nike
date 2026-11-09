<!--
Três leituras independentes do mesmo vídeo (Composição, Motion e Elenco), mais uma conferência a 60 fps (Parte 4).
A Parte 4 vale sobre as outras, e os trechos que ela desmentiu já foram corrigidos nelas.
O que vale na construção está em ../BRIEF.md, seção "Onde a decupagem se contradiz".
-->

# Parte 1: Composição

# Decupagem: provador-lookbook (tela única → `templates/prega/`)

**Fonte:** `raw/video.mp4`, 1098×624, 60 fps, 9,85 s. Medi nos quadros com script, à exceção do que está marcado como "est." (estimado a olho).

**Base de cálculo**
- A faixa preta do topo (y 0–6) e os cantos arredondados são da gravação, não da página.
- Área útil: **1098×617**. `y'` é `y − 7`. % W é sobre 1098 e % H sobre 617.
- Para 1440, multipliquei por 1,3115, o que dá 1440×809. O vídeo é reduzido e macio, com erro de ±1 px em 1098.
- Uma tela só, sem rolagem.

## Correções a `notas.md`

| Assunto | O que a medição mostra |
|---|---|
| Loop | O vídeo tem 6,93 s de material único. **Em t=6,93 há corte de volta para t≈0**, e 6,93–9,85 repete 0–2,92. A "volta" em 6,93 não é uma transição real. |
| Trocar de look | A fila leva **~0,95 s**, não ~0,4 s. O painel volta entre +0,37 s e ~+1,0 s. |
| Autoplay | Confirmado (ver Motion). |
| Cursor | Tem estados com texto (VIEW, DRAG), que as notas não registram. |
| Selo "NEW" | Existe na foto da peça no look 02. |
| Logo | O logo da nav está **escondido sob o círculo preto**, que não é da página. Só aparece uma lasca em (71, 31). |
| Elo pino ↔ linha (**defeito do original, não copiar**) | O pino 1 fica no peito e aponta para a linha 1, que é um tênis. As peças do painel também não são as que o modelo veste. Aqui: pino 1 no peito = peça de cima, pino 2 na coxa = calça, pino 3 no tênis = tênis, cada um sendo a peça que o modelo veste. |

## Composição em proporção

### Estrutura

| Bloco | Medida em 1098 | Proporção | Em 1440 |
|---|---|---|---|
| Nav | y' 0–60, fio em y=66–67 | 9,7 % H | 72 (o original daria 79; 72 mantém o site sóbrio) |
| Palco | x 0–838 | 76,3 % W | 1100 |
| Fio vertical | x=838, 1 px, de y=67 até a base | | 1 px |
| Painel | x 839–1098 (259 px) | 23,6 % W | 340 |
| Respiro interno do painel | 22 de cada lado | 2 % W | 29 |
| Conteúdo do painel | x 861–1076 (216 px) | 19,7 % W | 283 |

### Nav
- Links alinhados à direita, começando em x=789, com ~19 px entre itens (25 em 1440).
- Sacola de 15 px de largura + contador, terminando em x=1066 (margem direita de 32 px, 42 em 1440).
- Logo à esquerda, alinhado com o título em x=40 (suposição, porque está coberto).

### Título e frase (estado fila)
- Título: x=40 (3,64 % W), topo em y' 94 (15,2 % H). Largura de 172 px (15,7 % W), altura de maiúscula ~22 px.
- Frase: y' 133–140 (21,6–22,7 % H), largura de 202 px (18,4 % W).

### Palco: fila em profundidade

Eixo em % da largura do palco, cabeça e pés em % H.

| Vaga | Eixo x | Cabeça | Pés | Altura | Escala | Desfoque (1098 → 1440) | Opacidade |
|---|---|---|---|---|---|---|---|
| 0 | 50 % | 26,6 % | 86,7 % | 60,1 % | 1 | 0 | 1 |
| ±1 | 50 ± 29,2 % | 32,9 % | ~85,1 % | 52,2 % | 0,87 | ~2 → ~2,5 px | 1 |
| ±2 | 50 ± 45 % (cortado pela borda e pelo fio) | 33,9 % | 80,4 % | 46,4 % | 0,77 | ~2,7 → ~3,5 px | 1 |
| ±3 (escondida atrás de ±2) | 50 ± 45 % | 35,7 % | 75,5 % | 39,8 % | 0,66 | ~3,4 → ~4,5 px | 1 |
| fantasma ±4 | 50 ± 35,2 % (entre ±1 e ±2) | 37,3 % | 72,1 % | 34,8 % | 0,58 | ~3,4 → ~4,5 px | 0,16 |

- Ordem em z: 0 > ±1 > ±2 > ±3 > ±4, pela distância ao centro.
- ±3 mostra o look oposto ao centro, **opaco**. Só aparece como uma nesga azul em x≈12 e x≈765.
- A fila é um anel de 6 looks em **9 vagas** (−4 a +4). O fantasma a ±35 % é a vaga ±4, e é um look do anel: centro ± 4 mód 6. Ver Parte 4, seção 1.
- Largura do modelo na vaga 0: ~115 px (13,7 % do palco).

### Sombras elípticas

| Estado | Centro | Tamanho (1098) | Cor |
|---|---|---|---|
| Vaga 0 | x=435, y' 539 (87,4 % H) | visível 260×26 (2,3× a largura do modelo) | Núcleo `#c1c1c1` sob os pés, `#e8e8e8` a 100 px, some em ~150 px |
| ±1 | x=eixo+12, y≈534 | visível 230×24 | Núcleo `#c1c1c1` |
| ±2 | x=eixo+13, y≈508 | visível 195×24 | Núcleo `#c8c8c8` |
| Foco | x=437, y' 585 (94,8 % H) | visível 305×26 | Núcleo `#c0c0c0`, `#e1e1e1` a 100 px do centro, cinza neutro |

A sombra segue **os pés, não o eixo da cabeça**: fica +12 a +18 px à direita do eixo, conforme a vaga. Ela se move e escala junto com o modelo. Valores reconferidos na Parte 4, seção 6.

### Modo foco
- Modelo: eixo 50 % do palco, cabeça em y' 131 (21,2 % H), pés em y' 580 (94 % H), altura de 72,9 % H, escala 1,21.
- Sobretítulo: x=40, y' 84–88. Nome: y' 97–107, largura de 66 px.
- Botão X: círculo Ø33 (Ø43 em 1440), centro (799, 105), 23 px antes do fio, contorno 1 px `#d8d8d8`, X de ~8 px `#1e1e1e`.
- Legenda: centrada no palco (x 350–488, 139 px), y' 600–605 (97,6 % H), entre a sombra e a borda.

### Pinos (posição em % da altura do modelo no foco)

| Pino | Lugar | Posição | Relação com o eixo |
|---|---|---|---|
| 1 | Peito | 25,6 % | −6 px |
| 2 | Coxa | 57,6 % | −6 px |
| 3 | Tênis | 96,7 % | −13 px |

- Repouso: Ø16, branco, número escuro, halo de ~Ø28 nos pinos com halo.
- Ativo: Ø21, preto `#101010`, número branco, halo Ø40 com fio fino translúcido.
- Etiqueta: pílula ao lado do pino, altura de ~17 px, fundo `#e7e7e7` translúcido, começa colada ao pino e some em fade na direita.
- Número na linha do painel: Ø15, branco em repouso, preto com número branco quando ativo.

### Trilho de progresso (pé do palco)

| Elemento | Medida em 1098 | Proporção / em 1440 |
|---|---|---|
| Seta esquerda | x 38–54, centro y' 582 (94,3 % H) | 17 px |
| Linha dos segmentos | y=581–582, 2 px, y' 574 (93,1 % H) | |
| Segmentos | x 75–377 | 6,8–34,3 % W |
| Segmento ativo | 130 px | 11,9 % W, 172 em 1440 |
| Segmentos inativos | 30 px | 2,8 % W, 40 em 1440 |
| Espaço entre segmentos | 4 px | 5 em 1440 |
| Rótulos | y 590–596, alinhados ao início de cada segmento | |
| Pausa/play | centro x=748 | |
| Seta direita | x 785–801, 37 px antes do fio | Espelha a margem esquerda |

Só o ativo mostra número + nome. Os outros mostram só o número.

### Painel direito
- Título do painel: y 100–109. Fio em y=128 (19,6 % H), dentro do respiro.
- Fios em y=128, 232, 336 e 441. **Cada linha tem 104 px (16,9 % H, 136 em 1440).**
- Foto: x 861–924, y 245–324. Tamanho **64×80 (4:5)**, 84×105 em 1440, com respiro de ~12 px acima e abaixo.
- Texto: x=937 (13 px após a foto), bloco centrado na altura da linha. Rótulo y 164–168, nome y 176–181, preço y 190–196.
- "+": Ø10, traço de 1 px, centro a 25 px acima do fio inferior, 10 px antes da borda direita do conteúdo.
- Selo de novidade, quando há: ~25×12, preto, canto superior esquerdo da foto.
- Fundo da foto: tênis direto no branco com sombra própria; roupa no cabide em `#f3f3f3`.

### Fileira de produto (ordem de leitura)
Foto → rótulo em caixa alta → nome → preço, com o "+" isolado no canto inferior direito.

### Bloco "complete o look" (fecho do painel)
- Vão elástico entre o último fio e o fecho: y 441–519 (78 px, 12,6 % H). **É aqui que a altura extra da tela vai**, em 1440×900.
- Fio em y=519 (83 % H), **de borda a borda do painel**, diferente dos fios internos.
- À esquerda: título y 535–543, largura de 72 px; frase y 547–552, largura de 89 px.
- À direita, na mesma linha de base (y≈552): preço antigo riscado x 1003–1029; preço novo x 1038–1075.

### Botão
- x 861–1076 (largura total do conteúdo), y 566–603.
- Altura de **38 px** (50 em 1440), cantos retos, `#131110`.
- 20 px até a borda inferior.
- Texto + seta centrados como um conjunto (x 918–1019), seta de 16 px.

## Tipografia

**Família provável:** neo-grotesca tipo Helvetica/Arial. Ajustei o tamanho pela largura medida usando essas métricas, sem tracking. Entre as fontes livres, a mais próxima é Inter. Ela é ~5 % mais larga, então compensar com tracking.

Tamanhos "site" são para 1440 e 390, segundo `docs/escala.md`. Comprimento é o do texto de origem, para orientar a redação nova.

| Papel | Em 1098 | Em 1440 literal | Papel na escala | Site (1440) | Celular (390) | Peso / tracking | Compr. |
|---|---|---|---|---|---|---|---|
| Título da tela | 29,7 | 39 | Título de cena | **56** | 36–40 | 400, −0,03em, entrelinha 1 | 13 |
| Frase de apoio | 8,2 | 10,8 | Legenda de UI (uma linha) | 14 | 13–14 | 400 | 57 |
| Links da nav | 9,5 | 12,5 | Interface | 13 | 13 | 600 | |
| Contador da sacola | est. 7 | 9 | Rótulo | 12 | 12 | 500 | |
| Sobretítulo do foco | est. 7 | 9 | Rótulo | 12 | 11–12 | 400, caixa alta, +0,14em | 7 |
| Nome do look no foco | 11,5 | 15 | Subtítulo | 20 | 18 | 400, −0,01em | 13 |
| Legenda do foco | est. 8 | 10,5 | Rótulo | 12 | 11–12 | 400, caixa alta, +0,18em | 27 |
| Título do painel | 11,9 | 15,6 | Subtítulo | 20 | 18 | 400 | 12 |
| Rótulo da peça | est. 7,2 | 9,4 | Rótulo | 12 | 11–12 | 400, caixa alta, +0,12em | até 19 |
| Nome da peça | 8,8 | 11,5 | Interface (linha de lista, não nome de card) | 14 | 14 | 400 | até 19 |
| Preço da peça | 8 | 10,5 | Interface | 13 | 13 | 400, números tabulares | |
| Título do fecho | 8,9 | 11,7 | Interface | 14 | 14 | 400 | 17 |
| Frase do fecho | 7,5 | 9,8 | Rótulo | 12 | 12 | 400 | 25 |
| Preço antigo | 7,5 | 9,8 | Rótulo | 12 | 12 | 400, riscado | |
| Preço do conjunto | 10,5 | 13,8 | Número de UI (ver nota) | 18 | 18 | 400 | |
| Texto do botão | 9,3 | 12,2 | Botão | 15 | 15–16 | 400–500 | 20 |
| Número e nome no trilho | est. 7,5 | 9,8 | Rótulo | 12 | 11–12 | 400, +0,08em, tabular | até 18 |
| Número do pino e da linha | est. 8 | 10,5 | Rótulo | 12 | 12 | 600 | |
| Etiqueta do pino | est. 8 | 10,5 | Rótulo | 12 | 12 | 400 | até 19 |
| Selo de novidade | est. 6,5 | 8,5 | Rótulo | 12 | 11–12 | 600, caixa alta, +0,12em | 3–4 |
| Texto do cursor | est. 7 | 9 | Rótulo | 12 | não existe no toque | 400, caixa alta, +0,2em | 4–5 |

**Tamanhos dos elementos em 1440, ajustados aos rótulos de 12 px**

| Elemento | Tamanho |
|---|---|
| Pino em repouso | Ø24 |
| Pino ativo | Ø28 |
| Halo do pino ativo | Ø52 |
| Etiqueta | altura 28 |
| Número na linha | Ø20 |
| Selo de novidade | altura 20 |

### Conflitos entre fidelidade e escala
- **Título:** a referência tem 39 px em 1440 e a tabela pede 56–64. Usar 56, o piso. Ele ocupa ~22 % W em vez de 15,7 %, mas não encosta nas cabeças: termina acima de y' 203 e as vagas ±1 começam ali.
- **Preço do conjunto:** a tabela dá 44–52 para número de destaque, o que não cabe em 283 px ao lado do preço antigo e da frase. Fica 18, como detalhe de interface. É desvio consciente.
- **Foco a 72,9 % H:** passa do limite de 60 % da peça principal. A tela é cena, então a `<section>` leva `data-cena`.
- **Medidas do palco** em unidade de tela (`vh`, ou `--u`). **Textos** em `--su`, com os valores acima.

## Cores medidas

| Uso | Cor |
|---|---|
| Fundo de tudo | `#fdfdfd` |
| Fio da nav | `#f2f2f2` |
| Fio vertical e fecho | `#d3d3d3` |
| Fios internos | `#d3d3d3`–`#e2e2e2` (aliasing; usar `#dcdcdc`) |
| Trilho inativo | `#e2e2e2` |
| Trilho ativo | `#202020` |
| Trilho visitado | `#969696` |
| Título, nav | `#020202`–`#090909` |
| Nomes, preços | `#191919`–`#252525` |
| Frase de apoio | `#6b6b68` |
| Rótulos | `#767676`–`#838383` |
| Número inativo no trilho | `#979797` |
| Nome ativo no trilho | `#494949` |
| Botão | `#131110` |
| Fundo da foto | `#f3f3f3` |

Nenhuma cor de destaque na interface: a cor vem da roupa. **Bordas:** só fios de 1 px, sem raio no botão nem nas fotos. Círculos só em pino, X e cursor.

## Motion (t = desde o clique, medido a 60 fps)

**Fila → foco** (clique na vaga 0)

| Tempo | O que acontece |
|---|---|
| 0–0,20 s | Título, frase, trilho e outros modelos saem em fade |
| 0–0,50 s | Modelo cresce de 1 para 1,21 em ease-out. Metade em ~0,12 s, 90 % em ~0,30 s. Eixo x parado; cabeça sobe 33 px, pés descem 44 px (origem a ~43 % a partir da cabeça) |
| +0,35–0,65 s | Sobretítulo, nome e X entram em fade |
| +0,83 / +0,93 / +1,03 s | Pinos 1, 2 e 3 entram com escala a partir de um ponto + fade, ~0,35 s cada |
| +1,10–1,55 s | Legenda entra em fade |

**Passar o cursor no pino**
- O pino escurece e cresce, o halo abre, a etiqueta aparece em ~0,15 s e o número da linha acende junto.
- Enquanto a tela está em foco, o pino 1 fica ativo sem precisar de novo hover (visto em t≈3,0, com cursor já longe).

**Foco → fila** (clique no X)

| Tempo | O que acontece |
|---|---|
| 0–0,25 s | Pinos e legenda somem |
| 0–0,45 s | Modelo volta à escala 1 |
| 0–0,55 s | Título e frase voltam |
| 0–0,30 s | Trilho volta |
| +0,19–0,60 s | Vizinhos voltam em fade, saindo de desfoque maior que o de repouso |

**Trocar de look** (seta)

| Tempo | O que acontece |
|---|---|
| 0 | **Em um quadro**, somem linhas, total, botão e os 4 fios internos. Ficam o título do painel e o fio do fecho, sem fade |
| 0–~0,95 s | Fila anda inteira em **easeOutQuart** (`cubic-bezier(.25,1,.5,1)`), interpolando eixo, escala e desfoque. Progresso medido: 20 % em 0,07 s, 52 % em 0,17 s, 75 % em 0,27 s, 88 % em 0,37 s, 97 % em 0,52 s |
| +0,03–~0,55 s | Trilho: o segmento antigo encolhe e o novo alarga, com rótulo trocando. Ver Parte 4, seção 5 |
| +0,37 / +0,40 / +0,47 s | Linhas 1, 2 e 3 entram de desfoque (est. ~8 px → 0) + fade, ~0,5 s cada, sem deslocamento perceptível |
| +0,40–0,85 s | Bloco do total entra |
| +0,47–1,05 s | Botão vai de branco a preto, passando por cinza. Metade em ~+0,60 s |
| +0,50 / +0,58 / +0,64 / +0,70 s | Os 4 fios internos voltam em fade, ~0,5 s cada. Ver Parte 4, seção 4 |

**Entrada da tela** (visível em t=0–0,6 e logo após o corte; pode ser só efeito do loop, mas serve como entrada)
- Modelos com desfoque extra assentam em ~0,4 s.
- Título do painel sai do desfoque em ~0,25 s.
- Trilho e setas entram em fade em ~0,35 s.
- Botão vai de cinza a preto em ~0,6 s.

**Autoplay e pausa**
- Com play, o segmento ativo enche a ~28 px/s em 130 px, o que dá **~4,6 s por look** (arredondar para 5 s).
- Ao clicar em qualquer coisa, para: o segmento fica cheio e o ícone vira ▶ (visto em t=4,0 e t=6,0). Antes era ‖ (t=0,5).

**Cursor próprio** (só com mouse; o vídeo não decide se é site ou gravação, mas os textos sugerem site)

| Situação | Aparência |
|---|---|
| Solto, com atraso em relação à seta | Ponto Ø21 `#101010` |
| Sobre a vaga 0 | Anel Ø58, fio fino, texto "ver" |
| Sobre o palco vazio | Anel Ø42, texto de arrastar (visto em t=7,0) |
| Sobre as setas | Anel Ø~26 em volta da seta |

## Elenco das fotos (o que precisa bater)
- Mesma lente, altura de câmera, luz e linha de pés em todos os recortes. A sombra é separada ou consistente.
- O olhar vai para a câmera, com poses variadas: braços cruzados, mãos no bolso, braço solto.
- Cada look é um bloco de cor distinto: tricô cinza-escuro `#525256` + jeans `#445767`, camiseta branca + jeans lavado `#7e7b6c`, tricô oliva `#5e5b43` + sarja marrom, além de preto, ferrugem e cinza-azulado claro.
- Estampas e marcas das peças não entram.
- O vídeo só mostra 2 dos 6 painéis. Os looks 03–06 têm que ser criados por analogia.

## O que o vídeo não mostra
Ficar claro para a construção que tudo isto é decisão nossa, não medição:
- clique no "+" ou no botão e reação do contador da sacola;
- seta de voltar e clique em segmento;
- arrastar de verdade e clique em vizinho;
- destino dos links da nav (no escopo aprovado: estados desta tela);
- celular.

**Não levar da referência:** círculo preto com seta no canto superior esquerdo, faixa preta da gravação, os textos, marcas e estampas vistos no vídeo, e os itens de nav para outras páginas.

---

# Parte 2: Motion

# Decupagem: tela do provador (lookbook)

**Medição:** vídeo de 1098×624, 60 fps, 9,85 s, extraído a 30 fps (1 quadro = 33 ms, erro de ±20 a 30 ms). Posição, escala, desfoque e opacidade vêm de ajuste de template quadro a quadro, e a opacidade de UI vem do contraste por região.

**Unidades:** "px" é px do vídeo. Para uma tela de 1440, multiplicar por 1,31 (assumido, porque o título de 30 px vira ~40 px).

**Easings usados:**
- `power2.out` = `cubic-bezier(.5,1,.89,1)`
- `power3.out` = `cubic-bezier(.33,1,.68,1)`
- `power4.out` = `cubic-bezier(.25,1,.5,1)`

## 0. Armadilhas do vídeo (não reproduzir)

- **Corte em 6,92 s:** o vídeo recomeça o mesmo trecho.
  - Provas: o ponto do cursor volta a (770,200) em 7,13 s, igual a t=0, e a abertura do detalhe se repete com 7,03 s de defasagem.
  - O que parece "entrada da página" entre 6,93 e 7,40 s (textos finos sumindo e voltando, UI a ~85 %) é compressão depois do corte. O mesmo acontece no quadro 1. **Não é animação.** Só existem ~6,9 s de material único.
- **Faixa preta, cantos arredondados e círculo preto com seta (canto superior esquerdo):** são da gravação.
- **Seta nativa grande:** também é da gravação. Ela aparece junto com o ponto personalizado. O vídeo não mostra se o site esconde o cursor nativo.
- **Pino 1 errado na referência:** o pino 1 fica no peito, mas o tooltip e a linha 1 são do tênis. Aqui, cada pino fica sobre a própria peça.
- **Não aparecem no vídeo:** arrasto real, seta "anterior", fim do temporizador, clique em pino, hover na linha do painel. O que depende disso está marcado como **SUPOSIÇÃO**.

## 1. Layout de referência

| Elemento | Medida |
|---|---|
| Palco | x 0–838 (76,3 %), centro em x=419 |
| Fio vertical | x=838, 1 px |
| Painel | x 839–1098 (23,7 %), miolo x 861–1077 |
| Nav | altura ~68. Sem fio visível: só uma faixa de 8 px a `#fdfdfd`, quase imperceptível |
| Título | x=40, ~30 px, y≈114 |
| Frase | y≈146 |
| Controles | y≈589: seta esq. x=46, trilho x 75–379, pausa x=748, seta dir. x=793 |
| Linhas do painel | fios em y=128, 233, 337, 441 (~104 px cada) |
| Fecho do painel | fio em y=519; botão y 566–604 (38 px), `#14130f` |
| Cores | fundo `#fff`, texto quase preto |

**Planos da fila**, com escala relativa ao centro:

| Plano | Δx do centro | Escala | Altura | Pés (y) | Desfoque σ | Opacidade |
|---|---|---|---|---|---|---|
| 0 | 0 | 1,00 | 371 px (59,5 % da tela) | 543 | 0 | 1 |
| ±1 | ±247 (29,5 % do palco) | 0,88 | 326 | ~532 | ~1,5 px (2 em 1440) | 1 |
| ±2 | ±377 (45 %) | 0,78 | 288 | ~503 | ~3 px (4 em 1440) | 1 |
| ±3 | ±377 (45 %) | 0,66 | ~245 | ~473 | ~3,4 px (4,5 em 1440) | 1 |
| ±4 fantasma | ±288 (34 %) | ~0,58 | ~215 | ~452 | ~3,4 px (4,5 em 1440) | 0,16 |

- O fantasma ±4 fica **mais perto do centro que o ±2** e por trás dele. Essa dobra dá a sensação de fila que continua.
- Ordem de empilhamento: 0, depois ±1, ±2, ±3, ±4.
- A sombra elíptica anda e escala junto com o modelo, como parte da imagem.
- Os desfoques vêm do ajuste de template, inclusive ±3 e ±4 (Parte 4, seção 2). O fantasma parece mais desfocado do que é porque tem pouco contraste.

**Detalhe:**
- Escala 1,205, altura ~447 px (71,6 % da tela), pés em ~586.
- Cabeçalho em x=40, y≈93/108.
- X em (799,105), Ø≈32.
- Legenda centrada no palco, y≈610.
- Pinos em % da altura do modelo: 25,5 %, 57,7 % e 97 %. Ficam 5 a 13 px à esquerda do centro.

## 2. Troca de look (clique na seta, t₀ = 4,47 s)

| t relativo | Quem | O quê |
|---|---|---|
| +0,03 (1 quadro) | Painel | Linhas, fecho, botão e os 4 fios internos somem **secos**. Ficam só o título do painel e o fio do fecho |
| +0,03 | Trilho | Rótulo antigo some seco, segmentos começam a andar |
| +0,03 → +0,75 | Fila | Todos os planos interpolam x, y, escala e desfoque: `power3.out`, **0,7 s** |
| +0,28 → +0,80 | Linha 1 | Entra saindo do desfoque |
| +0,36 → +0,90 | Linha 2 | Idem |
| +0,44 → +1,00 | Linha 3 | Idem |
| +0,43 → +0,95 | "Complete o look" e preço | Fade |
| +0,48 → +1,10 | Botão | Vai do branco ao preto passando por cinza, 50 % em +0,59 |
| +0,50 → ~+1,20 | 4 fios internos | Voltam em cascata, só fade (Parte 4, seção 4) |

**Fila:**
- Progresso de x do modelo central: 10 % em +0,07, 35 % em +0,13, 58 % em +0,20, 80 % em +0,30, 90 % em +0,40, 100 % em ~+0,80.
- Há um atraso sutil de ~25 ms por plano, da esquerda para a direita. O ponto de 50 % cai em +0,15 no −1→−2, +0,17 no 0→−1, +0,19 no +1→0 e +0,23 no +2→+1. Com oclusão, a medida é incerta. Pode ser só uma leitura.
- Movimentos medidos:
  - 0→−1: x −248, escala 1→0,885, centro desce 10 px.
  - +1→0: x −246, escala ×1,135.
  - +2→+1: x −130, escala ×1,125.
  - −1→−2: x −130, escala ×0,89.

**Fundo da fila:** o caminho de +4, +3, −2, −3, −4 e do novo +4 está na Parte 4, seção 3. A leitura antiga ("fantasma→±2") juntava dois elementos: o +3 que sai de trás e vira +2, e o +4 que ganha opacidade e entra atrás dele. O "desfoque extra" que ela citava era a olho e não se confirmou: o ajuste de template dá ~3,3 px ao longo do caminho, sem pico.

**Cascata do painel:**
- Intervalo entre linhas: **~80 ms**, não 120 ms como está em `notas.md`.
- Cada linha: opacidade 0→1, desfoque ~4 px→0 e y **+8 a 10 px→0**, ~0,5 s, `power2.out`. A centroide do texto da linha 1 sobe de 186 para 178.
- Imagem e texto da linha entram praticamente juntos.

## 3. Arrasto

**Não aparece no vídeo.** Só a bolha DRAG, em t=0.

**SUPOSIÇÃO para construir:**
- Arrasto horizontal no palco desloca a fila com o ponteiro.
- Soltar além de ~60 px ou 15 % do Δx anda um look. Abaixo disso, volta com `power3.out` 0,4 s.
- Pausa o autoplay.
- Depois de andar, o painel segue a mesma sequência da troca de look.

## 4. Cursor personalizado

- **Seguimento:** atraso de ~55 px a ~690 px/s, τ≈0,07–0,08 s. Equivale a lerp de **~0,2 por quadro a 60 Hz**.
- **Ponto:** Ø 13–15 px (~18 em 1440), preto. Luminância (L) medida: L≈25–30.
- **Bolha:** Ø ~40 px (~52 em 1440), `#e8e8e8` translúcida (L≈233 sobre branco, some sobre a camiseta branca). Rótulo em caixa alta espaçada, ~5 px (~7 em 1440), cinza.
- **DRAG e VIEW:** mesma bolha, só muda o rótulo. VIEW aparece sobre o modelo central e DRAG fora dele (a t=0, à direita do palco).
- **Morph ponto ↔ bolha:** ~0,3–0,35 s, interpolando diâmetro e cor juntas. O preto passa por cinza médio até o claro. O rótulo só fica legível no último terço.
  - Bolha→ponto: Ø 40, 31, 29, 24, 20, 19, 15 em 0,00 → 0,37 s.
  - Ponto→bolha: Ø 16, 22, 29 em 5,80 → 5,87 s, cinza cheio em 5,90, claro com rótulo em 5,97 a 6,07.

**Gatilho (medido em parte):** o tamanho acompanha a velocidade. Rápido vira ponto; ao desacelerar ou parar, vira bolha.
- O rótulo depende da zona.
- Ao chegar sobre o modelo, o morph leva ~0,1 s para começar (0,77 s; o clique em 0,85 s interrompe).
- Há um pico sem explicação entre 0,40 e 0,47 s (Ø 29–34 em velocidade constante). **Ignorar.**

**Outros estados:**
- **Em botões:** a bolha clareia até sumir (4,37→4,47 s sobre a seta).
- **No detalhe:** nenhum ponto visível de 2,8 s a 3,9 s, só a seta nativa.
- **Volta à fila:** reaparece como bolha clara em ~4,00 s, quando o ponteiro volta a se mover, e encolhe para ponto até ~4,17 s.

## 5. Abrir o detalhe (clique no modelo central, t₀ = 0,85 s)

| t relativo | Quem | O quê |
|---|---|---|
| +0,02 | Autoplay | Pausa **no mesmo quadro**: ícone vira play, barra salta para 100 % |
| +0,02 → +0,25 | Título, frase, planos ±1 a ±4 | Só opacidade, sem mover, sem escalar, sem mudar desfoque. Curva quase linear: .94, .73, .59, .34, .13, .05 (a cada 33 ms) |
| +0,05 → +0,30 | Setas, trilho, pausa | Fade um pouco mais lento |
| +0,00 → +0,50 | Modelo central | Escala 1→**1,205**, `power3.out` 0,5 s. Origem no centro do palco, ~47 % da altura do palco (y≈330). Topo sobe ~32 px, pés descem ~43 px |
| +0,36 → +0,85 | Sobretítulo, nome, X | Fade, ~0,45 s, `power2.out`: .15, .33, .49, .63, .73, .82 |
| +0,78 → +1,05 | Pino 1 | Ver seção 6 |
| +0,90 → +1,25 | Pino 2 | Ver seção 6 |
| +1,03 → +1,35 | Pino 3 | Ver seção 6 |
| +1,15 → +1,45 | Legenda | Fade: 18, 31, 43, 53, 67, 72 (de 77) |

**O painel não muda nada.** A linha do painel continua igual até um pino ativar. `notas.md` diz +22 % e "~0,2 s" para o cabeçalho; o medido é +20,5 % e +0,36 s.

## 6. Pinos em cascata

- **Intervalo:** **~125 ms**. Atraso do primeiro: 0,78 s depois do clique, ou seja, ~0,28 s depois de o modelo assentar.
- **Entrada de cada pino:** ~0,3 s. Começa como ponto de ~3 px e cresce até o disco branco Ø≈15 px (~20 em 1440), com halo fino Ø≈22 (~29 em 1440).
- **Fim da entrada:** o halo tem um pico em ~+0,35 e recua até ~+0,70. Reproduzir com escala em `back.out` leve no disco e pulso único no halo.
- **Número:** escuro no disco. Os pinos andam presos ao modelo.

## 7. Sincronia pino ↔ produto

Hover no pino 1 em 1,88 s (o ponteiro já estava ali, então o pino pegou o hover assim que ficou ativo).

| t | Evento |
|---|---|
| 1,88 → 2,03 | Disco branco→preto, número branco (~0,15 s) |
| 1,88 → 2,10 | Tooltip branco em pílula à direita (altura ~18, gap ~8): fade + desfoque ~4 px→0, ~0,25 s |
| 2,11 → 2,37 | **~0,22 s depois do pino**, o selo da linha 1 do painel vai de número pequeno sem fundo para disco preto Ø≈14 com número branco, passando por cinza. ~0,25 s |

- **O estado persiste.** Quando o ponteiro sai do pino (2,75 s), pino preto, tooltip e selo continuam ativos até fechar o detalhe. É estado ativo, não só hover.
- **SUPOSIÇÃO:** hover na linha acende o pino de volta, com o mesmo tempo; ativar outro pino apaga o anterior.

## 8. Fechar o detalhe (clique no X, t₀ = 3,31 s)

- **Hover no X, antes do clique (3,17 → 3,27):** contorno escurece de ~L250 para cinza médio, e o X gira até virar "+" (~45°), ~0,1 s.

| t relativo | Quem | O quê |
|---|---|---|
| +0,02 → +0,19 | Cabeçalho, X, legenda | Fade: .85, .73, .40, .18, .10, .03 |
| +0,02 → +0,16 | Tooltip e pinos | Fade, tooltip com desfoque, junto com o encolhimento do modelo |
| +0,05 → +0,20 | Selo do painel | Preto→número pequeno |
| +0,00 → +0,45 | Modelo | Escala 1,205→1, `power3.out` 0,5 s |
| +0,16 → +0,45 | Setas, trilho, ícone | Fade |
| **+0,20** → +0,70 | Título, frase, fila | Fade, sem mexer em x, escala ou desfoque, `power2.out` ~0,5 s. Vizinhos: .2, .4, .5, .6, .7, .8, .9, 1 em +0,22, +0,26, +0,29, +0,32, +0,36, +0,39, +0,46, +0,66 |

- A sensação "mais pálidos" dos vizinhos é só opacidade: os planos surgem nas posições finais.
- **O autoplay não volta depois de fechar:** ícone continua play, barra continua cheia.

## 9. Autoplay e trilho

**Geometria:**
- Trilho x 75–379, em y=582, com 1–2 px.
- Trilho inativo ~`#f2f2f2`.
- Ativo ~L238 (quase preto).
- Visitado: `#969696` (ver Parte 4, seção 5).
- Segmento ativo: 129 px, com número + nome.
- Inativo: 35 px (30 + 5 de gap), só número.

**Temporizador:**
- Enche linear, ~28 px/s: 23 px em 0,30 s e 38 px em 0,83 s. Isso dá **~4,5 s por look** (4,2 a 5 s).
- O fim nunca aparece no vídeo.
- **SUPOSIÇÃO:** ao encher, dispara a troca de look da seção 2.

**Pausa:**
- Ao interagir, o ícone troca e a barra do ativo vai a 100 % sem transição, em 1 quadro.
- Clicar na seta "próximo" com autoplay pausado **não retoma**: o look 2 fica com barra cheia e ícone play.
- **SUPOSIÇÃO:** clicar no play retoma o look do zero.

**Troca de segmento:**
- Fim do seg. 1, em x: 204, 180, 159, 143, 129, 119, 114, 112, 110 (+0,03 → +0,30).
- Largura final em ~+0,55: `power4.out` ~0,45 s.
- O seg. 2 cresce no mesmo tempo, com o início indo para x=110 e o fim para x=239.
- Os segmentos 03–06 não se mexem.
- A borda direita do segmento novo não se move: só o início dele anda para a esquerda.
- Rótulo novo: número em +0,16, nome em fade + desfoque de +0,16 a +0,45.
- Reticências antes do "03" de +0,03 a +0,16. Detalhes na Parte 4, seção 5.

## 10. Roteiro observado, para conferir a montagem

| t | Evento |
|---|---|
| 0,00–0,85 | Fila rodando, ponteiro vai ao centro |
| 0,85 | Abre detalhe |
| 1,63–2,20 | Pinos |
| 1,88 | Pino 1 ativo |
| 3,31 | Fecha |
| 4,47 | Seta próximo |
| 5,50 | Tudo assentado no look 2 |
| 5,80–6,07 | Ponto vira bolha VIEW sobre o novo centro |
| 6,92 | Corte, o trecho recomeça |

---

# Parte 3: Elenco

# Decupagem dos looks: provador em uma tela

**Base da medição:** quadros de 0 s, 2,5 s e 6 s do vídeo (1098×624). Altura e posição foram medidas nos pixels. As cores são a média de uma área da peça e, nas figuras desfocadas, servem só de indicação.

**Limite da fonte:** a gravação tem 9,8 s e só mostra os looks 01 e 02 no centro, e só o 01 em foco. Os looks 03 a 06 aparecem sempre desfocados, então cabelo, tecido e tênis deles são leitura aproximada. A numeração de 03 a 06 é deduzida da ordem da fila: com o 01 no centro, à direita ficam 02 e 03, à esquerda 06 e 05, e o 04 entra à direita quando a fila anda.

Os nomes reais e as estampas ficam de fora de propósito. Este texto vai para a pasta da template.

## 1. Geometria da fila

Palco com 838 px de largura (76,3 % da tela). Em cada linha, o X é a distância do centro da figura ao centro do palco.

| Posição | Topo da cabeça (y) | Sola (y) | Altura | Escala | X | Tratamento |
|---|---|---|---|---|---|---|
| Foco | 139 (22,3 %) | 587 (94,1 %) | 448 px (71,8 % da tela) | 1,21 | 0 | nítido, sozinho |
| Centro | 172–177 (27,6–28,4 %) | 542–545 (86,9–87,3 %) | 368–370 px (59 %) | 1,00 | 0 | nítido |
| Vizinho | 204–209 | 529–532 | 320–327 px (52 %) | 0,88 | ±245 px (±29 % do palco) | desfoque leve |
| Segundo | ~216 | ~503 | ~288 px (46 %) | 0,78 | ±375 px (±45 %), cortado pela borda ou pelo painel | desfoque médio |
| Atrás do segundo (±3) | ~227 | ~473 | ~245 px (39 %) | 0,66 | ±377 px (±45 %), escondido | opaco, desfoque médio, só uma nesga aparece |
| Fantasma (±4) | ~237 | ~450 | ~213 px (34 %) | 0,58 | ±290 px (±35 %), atrás dos outros | desfoque médio, opacidade 0,16 |

- **Fantasmas:** há dois visíveis ao mesmo tempo, e são looks do anel: centro ± 4 mód 6. Com o 01 no centro, 03 à esquerda e 05 à direita; com o 02, 04 à esquerda e 06 à direita.
- **Proporção do corpo:** largura/altura de 0,28 a 0,33 (01: 0,295; 02: 0,32; 06: 0,28; 03: 0,325).
- **Altura entre modelos:** quase não varia (368 a 370 px no centro). O elenco foi normalizado, e a variação fica em ombro e volume de roupa.
- **Fundo:** `#fcfcfc` a `#fdfdfd`.

**Sombra**

| | Centro | Foco |
|---|---|---|
| Largura visível | 260 px (2,4× o corpo) | 305 px (2,15× o corpo) |
| Altura visível | 26 px | 26 px |
| Miolo mais escuro | cinza 198 | cinza 189 |
| Distância abaixo da sola | ~4 px | ~5 px |

A sombra tem borda muito difusa. Não há sombra de contato dura, e os pés parecem flutuar um pouco.

**Luz:** frontal, alta e suave, sem sombra dura no corpo. Fica só um volume leve no tecido.

## 2. Os 6 looks do vídeo

**Comum a todos:** homem adulto, de frente, olhar na câmera, boca fechada, expressão neutra. Corpo inteiro, pés afastados na largura do quadril, e as peças não têm logo visível no corpo.

### Look 01 (o único visto em foco)
- **Tipo físico:** magro e alongado, pele clara a oliva, rosto anguloso, cabelo preto cacheado curto com volume no topo.
- **Pose:** braços cruzados na altura do peito, com o antebraço esquerdo da tela por cima. Um pé aponta para a frente e o outro abre uns 45° para fora.
- **Tricô:** grafite (`#56565a`), gola careca canelada, costura raglan, ombro caído, barra canelada larga.
- **Camiseta:** branca, aparecendo 2 a 3 % da altura abaixo da barra e um filete na gola.
- **Cinto:** couro preto com fivela prateada.
- **Jeans:** azul médio acinzentado (`#465866`), lavagem stone leve com bigodes discretos no alto da coxa. Corte baggy reto, cintura média, bainha empilhada cobrindo metade do tênis.
- **Tênis:** corrida retrô, cinza e prata, em camadas, com entressola grossa.

### Look 02 (centro nítido, sem foco)
- **Tipo físico:** magro atlético, pele preta retinta, locs até a clavícula.
- **Pose:** duas mãos nos bolsos da frente até o pulso, cotovelos abertos, ombros soltos.
- **Camiseta:** branca (`#f0f0f3`), malha pesada, caixa larga, ombro bem caído, manga até acima do cotovelo. Vai de 15 a 50 % da altura.
- **Jeans:** base azul-acinzentada escura, com desbotado areia e ocre forte em coxas e joelhos (média `#85877f`) e vincos horizontais no quadril. Muito largo, bainha escura cobrindo quase todo o tênis.
- **Tênis:** só a ponta aparece, creme e preto, com sola creme.

### Look 03 (desfocado)
- **Tipo físico:** magro médio, pele clara, rosto fino, cabelo preto curto com franja.
- **Pose:** braços soltos ao lado do corpo, mão visível abaixo da barra, pés próximos.
- **Tricô:** oliva (`#5f5f4b`), grosso, raglan, punhos com volume até os nós dos dedos. Algo azul-claro aparece na barra.
- **Calça:** sarja marrom (`#57483d`), larga e reta, com costura curva na altura do joelho.
- **Calçado:** camurça caramelo, baixo.

### Look 04 (bastante desfocado)
- **Tipo físico:** o mais encorpado, pele preta, cabelo bem curto, barba e óculos escuros.
- **Pose:** mão esquerda da tela erguida na altura do peito, mão direita da tela no bolso.
- **Camiseta:** preta (`#0a0a0d`), ampla, com um filete claro na gola, talvez corrente.
- **Jeans:** azul-claro lavado (média `#627588`, mais clara nas coxas), largo, com bainha mais escura.
- **Tênis:** branco, pelo que se vê.

### Look 05 (desfocado, sempre cortado na borda)
- **Tipo físico:** magro, pele clara, cabelo preto até o queixo com franja. Os traços do rosto não dão para ler.
- **Pose:** braços soltos, uma mão à frente da cintura e a outra caída.
- **Tricô:** marrom-tijolo (`#634030`), com filete claro abaixo da barra.
- **Calça:** cinza-chumbo (`#535454`), muito larga, formando pregas sobre o pé.
- **Tênis:** preto.

### Look 06 (desfocado)
- **Tipo físico:** magro, pele parda, cabelo castanho-escuro curto e ondulado.
- **Pose:** braços soltos, com as mãos sumindo para trás.
- **Tricô:** cinza-gelo (`#b1b7b9`), fino, com camiseta branca aparecendo na gola e na barra.
- **Jeans:** azul-gelo (média `#7c868c`, mais claro no alto), largo, com tom mais escuro na bainha.
- **Tênis:** branco.

## 3. Defeitos a não copiar

- **Número e peça não batem:** no look 01, o pino 1 está no tricô, mas a etiqueta mostra o nome de um tênis. Pela numeração do painel, o pino 2 (jeans) leva a uma camiseta preta e o pino 3 (tênis) leva a um moletom.
- **Peças fora do corpo:**
  - No look 01, o painel lista camiseta preta estampada e moletom creme, e nenhum dos dois está no modelo.
  - No look 02, lista moletom preto estampado e camiseta preta, mas o modelo veste camiseta branca.
- **Preços iguais:** o total é o mesmo nos dois looks, e o rótulo da primeira linha tem texto sem sentido.

**Regra nova:** a linha N do painel é a peça do pino N.
- 1 = peça de cima, no peito
- 2 = calça, na coxa
- 3 = tênis

## 4. Elenco novo

Todos são adultos e pessoas fictícias. Só a variedade de corpos e tons vem do vídeo: nenhum modelo repete a combinação de tipo físico, cabelo e pose do look de mesmo número, nem de outro look do vídeo. O corpo magro em roupa larga é do estilo da fila e pode repetir; o que muda é a pessoa.

| Look | Modelo novo | Longe de quem no vídeo |
|---|---|---|
| 01 | 27 anos, magro, ombros estreitos, pescoço fino e cabeça proporcional, um rapaz comum com a roupa sobrando no corpo, pele parda escura, crespo curto com degradê baixo, cavanhaque curto | 01: pele clara a oliva, cacheado com volume, braços cruzados |
| 02 | 22 anos, comprido e magro, pele morena clara, ascendência indígena, cabelo preto liso preso em coque pequeno no alto | 02: pele retinta, locs |
| 03 | 23 anos, magro médio, pele clara com sardas, cabelo ruivo-acobreado curto e ondulado | 03: cabelo preto com franja |
| 04 | 34 anos, o mais encorpado, pele oliva, ascendência árabe, cabeça raspada, barba curta grisalha | 04: pele preta, óculos escuros |
| 05 | 25 anos, nipo-brasileiro, magro, cabelo preto curto e liso, risca lateral | 05: até o queixo, com franja |
| 06 | 24 anos, ombros definidos, pele preta retinta, black power arredondado de ~8 cm, sem barba | 06: pardo, castanho ondulado |

## 5. Looks novos

**Atualização de 2026-11-07:** são 8 looks com tênis reais. Os looks 07 e 08, os tênis e os nomes atuais estão no `BRIEF.md`. O texto abaixo vale para a roupa e a pose dos looks 02 a 06.

Os nomes são sugestão e podem mudar com o brief. Todas as peças são lisas, sem estampa, logo, texto ou faixa lateral. O estilo é o do vídeo (tricô largo, camiseta ampla, jeans baggy lavado, sarja larga, tênis retrô robusto); a combinação, a cor e a pose de cada look são outras. **Nenhum cinto e nenhuma camiseta aparecendo na barra:** eram marcas dos looks do vídeo.

### Look 01: Feira de Sábado
- **Pose:** Peso na perna do lado esquerdo da tela, o outro joelho solto, ombros um pouco desnivelados. Braço esquerdo da tela solto, com a mão junto da coxa e o dorso para a câmera; na foto os dedos saíram juntos, e só dois dedos e o polegar se distinguem. Mão direita da tela dentro do bolso da frente até o punho, sem dedo à vista. Pés um pouco abertos, quase de frente (cerca de 15 graus), solas na mesma linha.
- **Tricô:** vinho desbotado (~`#4a2329`), malha fina a média, levemente felpuda, com canelado vertical muito fino, que lê como grão. Mole, uma numeração larga e curto: termina na cintura (0,47 da altura) em faixa canelada solta, com o cós à vista. Gola em pé canelada e solta, com base em banda sobre o peito, zíper de metal fosco em carcela de fundo reto, ombro caído só um pouco, manga reta sem balão, punho canelado no pulso. Na foto o zíper abriu em V e ficou longo (até ~30 % da altura da imagem), embora pedido fechado e curto; a foto do cabide acompanha.
- **Jeans:** carvão lavado em cinza frio (~`#3b3a3e` no quadril, ~`#535154` no meio da coxa), sarja diagonal fina, lavagem desbotada e irregular, baggy com gancho baixo, dobras longas, barra quebrando sobre o tênis. Sai da edição de `_edicao-roupa.txt`, não da geração. Ressalvas: faixas horizontais no quadril, e a barra cobre boa parte da língua e do colarinho.
- **Tênis:** camurça areia (~`#c2a58b`), cadarço largo com ilhós à vista, sola grossa de borracha cor de mel (~`#ae7e4d`). Na foto a parede da sola é reta, com poucos painéis e a língua quase coberta: mais retrô que a sola branca de antes, mas não chega ao skate retrô pedido.

### Look 02: Último Ônibus
- **Pose:** mãos juntas à frente, baixas, na altura da braguilha: a mão do lado esquerdo da imagem segura o pulso da outra, que cai solta com o dorso para a câmera; cotovelos junto ao corpo, bolsos da frente vazios. Pés afastados, um aberto 20°. (Até 2026-11-07 eram polegares nos passantes; a geração pôs os polegares nos bolsos, e as duas mãos nos bolsos repetiam o modelo 02 do vídeo.)
- **Camiseta:** cobalto desbotado (~`#3f5f9e`), malha pesada, caixa larga, manga até o cotovelo, barra reta até o meio do quadril.
- **Jeans:** cinza-cimento lavado (~`#9a9a96`), sem bigodes, bem largo, bainha reta sobre o tênis.
- **Tênis:** basquete retrô de cano médio, couro café e creme, sola creme.

### Look 03: Fim de Tarde
- **Pose:** mão direita da tela no bolso de trás, braço esquerdo da tela solto, peso numa perna.
- **Cardigã:** ocre-mel (~`#b08a3e`), trama arroz, fechado em botões de chifre até o alto, ombro caído, punho justo no pulso.
- **Jeans:** índigo médio (~`#35527a`), clareado só nos joelhos, reto e largo, com barra dobrada larga.
- **Tênis:** corrida retrô verde-musgo e creme, entressola creme.

### Look 04: Quadra Coberta
- **Pose:** mão direita da tela na cintura, cotovelo aberto, braço esquerdo da tela solto, pés bem afastados.
- **Camiseta:** lilás acinzentado tingido em peça (~`#8b829a`), desbotada nas costuras, gola canelada, manga até o cotovelo, barra abaixo do quadril.
- **Calça:** sarja verde-garrafa (~`#2f4438`), reta e bem larga, bolso faca, bainha dobrada uma vez.
- **Tênis:** retrô baixo de couro cru, recortes em verde-garrafa, sola de borracha caramelo.

### Look 05: Sebo da Esquina
- **Pose:** mão direita da tela no bolso lateral, braço esquerdo da tela solto, um pé levemente à frente.
- **Tricô:** azul-petróleo (~`#2c4f5a`), trança larga e discreta em relevo baixo, gola careca, barra canelada, um pouco curto. Malha média e mole, com o caimento do tricô do look 01 (seção 7).
- **Calça:** sarja cáqui (~`#b3a583`), bem larga, prega dupla, pregas caindo sobre o pé.
- **Tênis:** quadra retrô baixo, camurça vermelho-tijolo e creme, sola creme.

### Look 06: Sem Hora
- **Pose:** as duas mãos nos bolsos de trás, peito aberto, pés afastados, um aberto 25°.
- **Camiseta:** cru (~`#efe8da`), malha pesada, caixa larga, manga até acima do cotovelo. Precisa de sombra de dobra para se separar do fundo branco.
- **Jeans:** café lavado (~`#5a4638`), desfiado na bainha, largo.
- **Tênis:** corrida retrô preto e cinza, sola creme.

**Fila ao abrir, de −4 a +4:** 03 (fantasma), 04 (escondido), 05, 06, **01**, 02, 03, 04 (escondido), 05 (fantasma). Cada figura contrasta com a vizinha, e o vinho marca o centro.

## 6. Produtos e pinos

O preço do conjunto é a soma com 10 % de desconto. Os pinos são % da caixa do recorte (X da borda esquerda, Y do topo da cabeça até a sola). Como referência, no look 01 do vídeo os pinos caem em 39/25, 41/58 e 35/97.

| Look | Pino | Produto | Preço | X/Y | Onde cai |
|---|---|---|---:|---|---|
| 01 | 1 | Tricô Zíper Vinho | R$ 389,00 | 46/25 | peito, ao lado do fim do zíper (conferir no print) |
| 01 | 2 | Jeans Carvão Lavado | R$ 349,00 | 40/58 | coxa esquerda da tela |
| 01 | 3 | Tênis Skate Areia | R$ 599,00 | 33/96 | tênis esquerdo da tela |
| 02 | 1 | Camiseta Peso Cobalto | R$ 169,00 | 50/28 | centro do peito |
| 02 | 2 | Jeans Cimento Lavado | R$ 369,00 | 37/62 | coxa esquerda da tela |
| 02 | 3 | Tênis Cano Café | R$ 549,00 | 30/97 | tênis esquerdo da tela |
| 03 | 1 | Cardigã Arroz Ocre | R$ 409,00 | 50/30 | centro do peito |
| 03 | 2 | Jeans Índigo Clareado | R$ 329,00 | 38/63 | coxa esquerda da tela |
| 03 | 3 | Tênis Trote Musgo | R$ 579,00 | 34/97 | tênis esquerdo da tela |
| 04 | 1 | Camiseta Tinta Lilás | R$ 179,00 | 52/30 | centro do peito |
| 04 | 2 | Sarja Larga Garrafa | R$ 379,00 | 62/65 | coxa direita da tela, abaixo da mão |
| 04 | 3 | Tênis Couro Cru | R$ 569,00 | 66/97 | tênis direito da tela |
| 05 | 1 | Tricô Trança Petróleo | R$ 379,00 | 48/29 | centro do peito |
| 05 | 2 | Sarja Dupla Cáqui | R$ 319,00 | 40/60 | coxa esquerda da tela, longe da mão |
| 05 | 3 | Tênis Quadra Tijolo | R$ 599,00 | 31/97 | tênis esquerdo da tela |
| 06 | 1 | Camiseta Peso Cru | R$ 159,00 | 50/27 | centro do peito |
| 06 | 2 | Jeans Café Desfiado | R$ 359,00 | 62/60 | coxa direita da tela |
| 06 | 3 | Tênis Trote Preto | R$ 599,00 | 67/97 | tênis direito da tela |

| Look | Soma | Conjunto (−10 %) |
|---|---:|---:|
| 01 | R$ 1.337,00 | R$ 1.203,30 |
| 02 | R$ 1.087,00 | R$ 978,30 |
| 03 | R$ 1.317,00 | R$ 1.185,30 |
| 04 | R$ 1.127,00 | R$ 1.014,30 |
| 05 | R$ 1.297,00 | R$ 1.167,30 |
| 06 | R$ 1.117,00 | R$ 1.005,30 |

**Os pinos são provisórios.** Depois de gerar cada imagem, é preciso conferir em print que cada um cai na peça certa, sem mão ou braço por cima, e ajustar os números. A etiqueta abre para a direita do pino e não pode cobrir o rosto.

## 7. Para o elenco ficar coerente nas imagens

- **Enquadramento:** retrato 2:3, igual nos seis. Cabeça a ~8 % do topo, sola a ~94 %, corpo centrado, altura de 86 % da imagem em todos. Sem isso, a linha de pés quebra na fila.
- **Corpo:** o volume vem da roupa, nunca do corpo. Medido com `mede_corpo.swift` (faixa, depois look 01): 6,75 a 7,5 cabeças (7,47), largura ÷ altura de 0,285 a 0,337 (0,310), vão de 0,667 a 0,729 (0,695), cabeça com cabelo ÷ altura de 0,105 a 0,117 (0,110), barra de look curto de 0,46 a 0,50 (0,476 pela cor, 0,581 no medidor; a linha do medidor cai nos bolsos, vale a da cor), linha mais larga nas mangas ou no tronco (35,9 %). O prompt leva os blocos de `_estilo.txt` e anexa `_guia-proporcao.png`, com zonas de cor. O 04 e o 06 ficam no alto da faixa e ainda não foram gerados.
- **Rosto e pose:** rapaz comum, sem cara de campanha. Mão solta com o dorso para a câmera; mão no bolso só até o punho; pés quase de frente. Foi o que deu dedos contáveis e tirou o pé de pato na geração, e o texto está em `_estilo.txt`. A edição de roupa juntou os dedos do look 01: conferir a mão depois de editar.
- **Calça:** na geração, algodão tingido na peça, tom contínuo, sem lavagem no texto, o que limpa manchas e granulado à custa da cara de jeans lavado. No look 01, a lavagem veio depois, pela edição de `_edicao-roupa.txt`. Os jeans que dependem de lavagem visível (02 e 03) e o desfiado (06) ainda não foram testados.
- **Tênis, ainda aberto:** a edição trocou a sola branca por borracha cor de mel, mas a parede segue reta, e a barra cobre língua e colarinho.
- **Tricô:** malha fina a média, mole, ombro caído só um pouco, manga reta sem balão, volume no corpo da peça. Nos looks de barra curta, a barra fica em ~47 % da altura, em faixa canelada solta. O canelado grosso das primeiras tomadas alargava o tronco e fazia o modelo parecer forte (`look01-v3.png`: 7,94 cabeças e 0,353).
- **Câmera e luz:** câmera na altura da cintura, lente longa, sem perspectiva de cima. Luz frontal alta e suave, fundo branco puro.
- **Sombra:** a do vídeo tem 2,4× a largura do corpo e não cabe num retrato 2:3. Sugiro deixar na imagem só um contato muito suave e fazer a elipse larga em CSS, com os valores da Parte 4, seção 6.
- **Sempre proibido no prompt:** logo, texto, estampa, faixa lateral no tênis, óculos, acessório na mão.
- **Fotos do painel:** cada produto é a mesma peça do modelo. Roupa em cabide de madeira com fundo cinza-claro, tênis de lado direto no branco com sombra curta. Quando a ferramenta aceitar, gerar a partir da imagem do look para manter cor e lavagem.

---

# Parte 4: Conferência

**Medição:** quadros a 60 fps, em px de 1098×624, salvo indicação. Troca de look com t₀ = 4,47 s; p é o progresso da fila, com `cubic-bezier(.33,1,.68,1)`, 0,7 s, a partir de +0,03. Posição, escala, desfoque e opacidade saem de ajuste de template, usando o mesmo look em ±2 como molde. As vagas ±3 só aparecem em nesgas, então os valores delas combinam as nesgas com a extrapolação do caminho até p = 0 ou p = 1.

## 1. O anel

São 6 looks em 9 vagas, de −4 a +4. Três looks aparecem duas vezes ao mesmo tempo, em elementos diferentes:

| Centro | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 |
|---|---|---|---|---|---|---|---|---|---|
| 01 | 03 | 04 | 05 | 06 | 01 | 02 | 03 | 04 | 05 |
| 02 | 04 | 05 | 06 | 01 | 02 | 03 | 04 | 05 | 06 |

Conferido nos dois centros que o vídeo mostra. Em t=0,40 e t=6,30 os fantasmas batem com a tabela (o 04 de mão erguida e óculos é o fantasma esquerdo com o 02 no centro). A nesga azul de t=0,40 (x 764–771, y 430–453, e x 10–17, y 386–449) é o jeans do 04 em ±3.

## 2. Vagas do fundo

| Vaga | Eixo | Cabeça (y) | Pés (y) | Escala | σ em 1098 → 1440 | Opacidade |
|---|---|---|---|---|---|---|
| ±2 (referência) | ±377 | 216–220 | 503 | 0,775 | ~3 → 4 | 1 |
| ±3 | ±377 (45 %) | ~227–232 | ~473 (75,5 % H) | 0,66 | ~3,4 → 4,5 | 1 |
| ±4 | ±288 (34,4 %) | ~237 | ~450 (72,1 % H) | 0,58 | ~3,4 → 4,5 | 0,16 |

- **Eixo de ±3:** as duas nesgas dão o mesmo eixo. O jeans do 04 começa 36 px à esquerda do eixo em ±2, o que dá 31 px em 0,66; 764 + 31 = 795 e 10 + 31 = 41, ou seja, ±377.
- **Escala de ±3:** do topo da cabeça à barra do jeans, o 04 mede 267 px em ±2 e 227 px em ±3. Razão 0,85. O 05 confirma pelo topo da cabeça: +11 px entre ±2 e ±3, contra +12 px no 04.
- **Opacidade de ±4:** 0,157, 0,162, 0,163 e 0,162 nas cabeças de 03, 05, 04 e 06. As pernas dão 0,159 a 0,169.
- **Desfoque de ±4:** σ de 3,0 a 3,8. O ~8–12 das Partes 1 e 2 era a olho: pouco contraste faz parecer mais borrado.

## 3. Caminho na troca (avançar)

Eixo em px do centro do palco, tempo relativo a t₀.

| Quem | Eixo | Escala | Opacidade | O que se vê |
|---|---|---|---|---|
| +4 → +3 | +288 → +377 | 0,58 → 0,66 | .16, .25 (+0,05), .33 (+0,07), .50 (+0,10), .73 (+0,13), ~1 em ~+0,17 | Escurece enquanto corre para trás do +2 |
| +3 → +2 | +377, abre até ~+390 em +0,13 a +0,23, volta a +377 | 0,66 → 0,775 | 1 | Aparece quando o antigo +2 sai da frente |
| −2 → −3 | −377, abre até ~−393 em +0,13 a +0,23, volta a −377 | 0,775 → 0,66 | 1 | Encolhe quase parado, e o novo −2 cobre |
| −3 → −4 | −377 → −288 | 0,66 → 0,58 | 1 até p≈0,5, depois .61 (p .71), .53 (p .77), .41 (p .86), .29 (p .92), .22 (p .98), .16 | Sai de trás do −2 opaco e desbota já em movimento |
| −4 some | parado, ~+5 px | 0,58 | .16 até +0,02; relativo .85 (+0,03), .35 (+0,05), .01 (+0,07) | Some em 50 ms, com o −1 passando por cima |
| novo +4 | parado em +288 | 0,58 | relativo .17 (+0,43), .37 (+0,50), .62 (+0,57), .78 (+0,63), .89 (+0,77), 1 em ~+0,90 | Entra por último, depois de os outros passarem |

- **Regra de opacidade pela vaga:** com v = distância ao centro, 1 até v = 3,5; linear até 0,16 em v = 4; linear até 0 em v = 4,15. Essa regra acerta o −3 → −4 com erro de 0,03 e o +4 → +3 com ~0,1 de adianto. O novo +4 fica fora dela: fade próprio de +0,38 a +0,90, `cubic-bezier(.5,1,.89,1)`, 50 % em +0,53. Antes de +0,43 a medida está coberta pelas figuras que passam, então o início é extrapolado.
- **O arco:** entre ±2 e ±3 o eixo sai ~14 px para fora e volta. O 04 chega a 807–809 com fim em 796, e o 05 a 26 com início em 38. Uma curva suave pelos eixos das vagas (Catmull-Rom por 0, 29,3, 45, 45 e 35 % do palco) dá 46,6 % no meio, ou +14 px, sem precisar de valor próprio.
- **Empilhamento:** pela distância ao centro, durante todo o caminho.

## 4. Fios internos

Os 4 fios internos somem em +0,03, em 1 quadro. O fio do fecho (y=519) e o título do painel não mudam em nenhum quadro.

| Fio | 50 % em | 100 % em |
|---|---|---|
| y=128, sob o título do painel | ~+0,58 | ~+1,10 |
| y=233 | ~+0,70 | ~+1,20 |
| y=337 | ~+0,74 | ~+0,85 |
| y=441 | ~+0,78 | ~+1,20 |

Só fade: a volta é igual em toda a largura, sem desenhar da esquerda para a direita. Fio de 1 px em vídeo comprimido anda em degraus, então os tempos valem ±0,1 s. Para construir: início em +0,50 / +0,58 / +0,64 / +0,70, ~0,5 s, `cubic-bezier(.5,1,.89,1)`.

## 5. Trilho na troca

| t relativo | Segmento 01 | Segmento 02 |
|---|---|---|
| +0,03 | Nome some em 1 quadro; fim em x=205 | Início em x=210; reticências no fim |
| +0,07 | Fim em 180, L28 | Início em 185 |
| +0,10 | Fim em 159, L44 | Início em 163, preto até ~191 |
| +0,13 | Fim em 142, L70 | Início em 147, preto até ~193 |
| +0,20 | Fim em 120, L108 | Início em 125, preto até ~203 |
| +0,30 | Fim em 107, L137 | Início em 111, preto até ~220 |
| +0,50 | Fim em 103, L148 | Início em 107, preto até ~235 |
| ~+0,65 | Fim em 105, L150 | Início em 109, preto até 239 |

- **Largura:** início e fim andam juntos, `cubic-bezier(.25,1,.5,1)`, 0,45 s a partir de +0,03. A diferença de 2 px depois de +0,50 é ruído.
- **Borda direita do segmento novo:** parada em x=239 o tempo todo. Só o início anda. Os segmentos 03 a 06 não se mexem.
- **Preto do segmento novo:** com autoplay pausado, enche para a direita até ~+0,65.
- **Cor do segmento antigo:** de L11 a L150 (`#969696`, "visitado"), `cubic-bezier(.5,1,.89,1)`, ~0,45 s. Em t=6,30: x 75–105 com L≈150, x 109–239 com L≈12, o resto com L≈222.
- **Rótulo:** "02" fica grudado ao início do segmento e escurece em +0,16. O nome entra em fade + desfoque de +0,16 a +0,45. O "01" clareia até +0,30.
- **Reticências:** três pontos cinza em x≈230–235, na linha do rótulo, de +0,03 a +0,16. Parecem `text-overflow: ellipsis` do nome ainda escondido.

## 6. Sombra

Medida em linhas horizontais e verticais sob os pés, cinza neutro (R=G=B). O centro fica abaixo da sola.

| Vaga | Largura visível (L<246) | Altura visível | Núcleo | Centro x | Centro y |
|---|---|---|---|---|---|
| 0 | 260 | 26 | L193 | eixo +16 | sola +3 |
| ±1 | 230 | 24 | L192 | eixo +12 | sola +2 |
| ±2 | 195 | 24 | L200 | eixo +13 | sola +5 |
| Foco | 305 | 26 | L192 | eixo +18 | sola +5 |

A largura segue a escala da vaga, e o núcleo muda pouco. Por isso a sombra é tratada como filha da figura: herda posição, escala, desfoque e opacidade. No foco a altura não cresce com o modelo.

Perfil da vaga 0 ao longo de x, em opacidade de preto, com raio total de 150 px: .24 no centro, .19 a 23 %, .14 a 43 %, .08 a 63 %, .035 a 83 %, 0 a 100 %.
