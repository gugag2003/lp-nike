# Prega: brief

Provador de streetwear em uma tela só. Recria de perto a composição e o motion de `referencias/provador-lookbook`, com outra marca, outros textos, outras roupas e outros modelos. Medidas completas em `fonte/decupagem.md`; quando as partes de lá discordam, vale a tabela "Onde a decupagem se contradiz" deste brief.

**Escopo aprovado (2026-11-05):** só esta tela. Sem outras seções e sem rodapé. Sem vídeo.

**Marca trocada para Nike em 2026-11-08** (decisão do usuário: projeto para a Nike, site fora do ar). Valem a seção "Marca Nike (2026-11-08)" e "Elenco Nike (2026-11-08)"; as seções Marca, Paleta, Tipografia e Textos abaixo descrevem a Prega e ficam como histórico.

## Marca

**Folga e Vinco têm conflito; ficou Prega (aprovado em 2026-11-05).**

| Nome | O que achei | Conclusão |
|---|---|---|
| Folga | [folga.shop](https://www.folga.shop/): marca "folga®" à venda em reais, com boxers e shorts, ativa na data da consulta | Conflito: mesmo nome, mesmo setor (roupa) |
| Vinco | A uma letra de [Vince](https://www.vince.com/vince-about-us/), marca real de roupa premium com linha masculina. Em busca por "Vinco" e roupa masculina, só vem Vince | Descartado: parecido o bastante para confundir, que o `CLAUDE.md` proíbe |
| Fiapo | [lojafiapo.com.br](https://lojafiapo.com.br): "FIAPO, camisetas e bonés de rua" | Descartado: mesmo nome, mesmo setor. A busca na web não achou; só o teste de domínio |
| Ourela | [ourela.com](https://www.ourela.com): loja ativa com esse nome. Não confirmei o que vende | Descartado na dúvida |
| Bainha | Linha e Bainha (franquia de costura), Bainha & Botões (ateliê) | Descartado: vizinho demais |
| Sobra | usesobra.com.br: finanças para MEI | Descartado: lembra sobra de tecido, e o nome já tem dono em outro setor |
| **Prega** | Sem marca de roupa nas buscas em português e inglês. prega.com é a Pregasistemas, de software. Sem DNS em prega.com.br, lojaprega.com.br, useprega.com.br, prega.store, prega.shop e prega.co | **Escolhido** |

**Limite da checagem:** foram buscas na web e testes de domínio. Fiapo mostrou que busca vazia prova pouco, e por isso testei também os formatos `loja<nome>` e `use<nome>`. Não consultei o INPI, e o Instagram não dá para conferir sem login. Marca fictícia não precisa de registro, mas uma olhada no INPI e no Instagram antes de publicar reduz a dúvida.

- **Nome:** Prega. É o detalhe que a calça larga ganha: fala de pano e de caimento e tem cinco letras na nav. Logo só em texto: "prega" em caixa baixa, Inter 500, −0,04em, 20 px.
- **Nicho:** moda / streetwear. `item.json`: `niche: "moda"`, `industry: "moda"`, `tone: "claro"`, `preview_mode: "cover"`, tags `streetwear`, `moda`, `provador`.
- **Público:** homem de 20 a 35 anos, de capital ou região metropolitana, que já compra streetwear nacional pela internet e paga de R$ 150 a R$ 600 por peça. Quer ver a roupa no corpo antes de comprar.
- **Tom:** de quem tem o dia livre. Frases curtas, fala de pano, corte e preço. Nada de "drop", "hype", "must-have" ou "estilo único".

## Paleta

Nenhuma cor de destaque: a cor vem da roupa. Só fios de 1 px, sem raio em botão ou foto; círculo só em pino, X e cursor.

| Token | Cor | Uso |
|---|---|---|
| `--fundo` | `#fdfdfd` | tudo |
| `--fio-nav` | `#f2f2f2` | fio da nav |
| `--fio` | `#d3d3d3` | fio vertical e fio do fecho |
| `--fio-linha` | `#dcdcdc` | fios entre as linhas |
| `--trilho` / `--trilho-visitado` / `--trilho-ativo` | `#e2e2e2` / `#969696` / `#202020` | segmentos: inativo, já visitado, ativo |
| `--tinta` | `#070707` | título, nav |
| `--texto` | `#1f1f1f` | nomes, preços |
| `--apoio` | `#6b6b68` | frase de apoio |
| `--rotulo` | `#767676` | rótulos e números inativos do trilho |
| `--trilho-nome` | `#494949` | nome ativo no trilho |
| `--botao` | `#131110` | botão, selo |
| `--pino` | `#101010` | pino ativo, número ativo, cursor |
| `--foto` | `#f3f3f3` | fundo da roupa no cabide |

## Tipografia

**Inter variável** (OFL, gratuita para uso comercial, `@fontsource-variable/inter` com versão travada), em todos os textos. É a livre mais próxima da neo-grotesca do vídeo. Ela sai ~5 % mais larga, então leva −0,01em a mais de tracking nos textos de interface; os tamanhos e os outros trackings estão na tabela de tipografia da decupagem. Título em 56 px (36–40 no celular), peso 400, −0,03em.

## Textos

Escritos do zero. Nada do vídeo entra traduzido: "LOOK", "NEW", "VIEW", "DRAG", "Add full look to bag" e "Bundle all 3 and save 10%" também foram trocados.

**Exceção declarada, só para microtexto funcional sem outra forma natural:** números de 01 a 08, preços, "+" e as setas.

| Papel | Texto | Caracteres (origem) |
|---|---|---|
| Título da tela | Sábado à toa | 12 (13) |
| Frase de apoio (mouse) | Sobra pano, sobra tempo. Clique em quem está no meio. | 53 (57) |
| Frase de apoio (toque) | Sobra pano, sobra tempo. Toque em quem está no meio. | 52 |
| Sobretítulo do foco | 01 DE 08 | 8 (7) |
| Legenda do foco | CADA NÚMERO É UMA PEÇA | 22 (27) |
| Título do painel | O que ele veste | 15 (12) |
| Rótulos da linha | PARTE DE CIMA / PARTE DE BAIXO / NOS PÉS | até 14 (19) |
| Selo | CHEGOU | 6 (3) |
| Título do fecho | Leve as três peças | 18 (17) |
| Frase do fecho | Junto sai mais barato | 21 (25) |
| Botão | Quero o conjunto → | 16 (20) |
| Botão depois do clique | Na sacola (por 1,6 s, depois volta) | 9 |
| Cursor | ABRE, ANDA | 4 |
| Nav | Looks, Moletom, Jeans, Tênis + sacola com contador (Tricô virou Moletom em 2026-11-08) | |

## Os 8 looks

**Substituído em 2026-11-08 pelo elenco Nike:** ver "Elenco Nike (2026-11-08)", logo abaixo. O que vem depois dela (tabelas, pinos, pose, corpo) é o elenco anterior, guardado em `fonte/public-looks-prega-v1/`.

## Marca Nike (2026-11-08)

**Decisão do usuário:** o site passa a ser da Nike e não vai ao ar. Com marca real, ele **não entra no catálogo da plataforma**: contraria a regra de marca fictícia do `CLAUDE.md` (nome, logo e produtos reais). Para voltar ao catálogo, a marca, o logo, os textos e o elenco precisam voltar a ser fictícios. A pasta continua `templates/prega/` (não renomeada); o `package.json` virou `nike-provador`. Composição, escala, motion (tempos, curvas, vagas da fila) e pinos não mudaram.

- **Logo:** Swoosh em SVG inline, desenhado à mão para esta tela (caminho em `src/data/marca.js`, viewBox 100 × 35, proporção ~2,86:1), em `--tinta` (#111), 21 de altura (`--logo-alt`, ~60 de largura), `aria-label` "Nike". A área de toque tem 41 de altura (padding vertical). O favicon é o mesmo Swoosh em SVG (data URI no `index.html`). Aba e meta tags: "Nike · A rua é sua".
- **Cores (escala de cinzas da nike.com):** texto e títulos `#111111`; secundário `#707072`; fios `#E5E5E5`; fundo `#FFFFFF`; superfície `#F5F5F5` (fundo das fotos de peça e da etiqueta do pino); botão `#111` com texto branco, pílula de raio 30 px (`--raio-pilula`), hover `#707072` (`--botao-hover`); trilho inativo `#E5E5E5`, visitado `#9E9EA0`, ativo `#111`, nome ativo `#39393B`; contorno do X `#CACACB`. Tudo em variável em `tokens.css`; os hex que estavam soltos no CSS e no JS (X do foco, hover do botão, cursor, etiqueta, cinza de entrada do botão) passaram para tokens.
- **Fontes:** a Nike usa fontes próprias (Futura condensada extra-negrito nos títulos, Helvetica Now no texto), sem licença livre.
  - Títulos (título da tela e nome do look no foco): **Anton**, `@fontsource/anton@5.3.0` (OFL 1.1, Google Fonts, gratuita para uso comercial), só o subconjunto latin 400 (~19 KB). Em caixa alta, entrelinha 1. Escolhida entre as três sugeridas porque é a única com o peso e a compressão do display da Nike: Bebas Neue é mais fina e só tem um peso leve-médio, e Oswald 700 é mais larga e mais leve; Anton tem hastes grossas, contraforma fechada e caixa alta alta, o que dá o bloco escuro dos títulos da nike.com.
  - Texto e interface: **Inter variável**, `@fontsource-variable/inter@5.3.0` (como antes), com 500 em links, nomes, preços, botão e rótulos, como a nike.com.
- **Escala:** título da tela de 56 para 64 (40 no celular): condensada em caixa alta lê menor que a Inter no mesmo corpo, e 64 é o teto da tabela de `docs/escala.md`. Nome do look no foco em Anton 32 (26 no celular). Links da nav de 13 para 14. Resto igual. `node tools/escala.mjs`: ok.
- **Componentes:** nav branca com links Inter 500 e sublinhado de 2 px no hover; sacola com ícone de traço 1,5 e contador ao lado. Painel na hierarquia do card da nike.com: nome (500, #111), categoria (#707072, abaixo do nome; antes era rótulo em caixa alta acima), preço (500, #111). Botão em pílula preta. Selo em preto, sem caixa alta.

| Papel | Antes (Prega) | Depois (Nike) |
|---|---|---|
| Logo | prega (texto) | Swoosh (SVG) |
| Título da aba | Prega · Sábado à toa | Nike · A rua é sua |
| Título da tela | Sábado à toa | A RUA É SUA |
| Apoio (mouse) | Sobra pano, sobra tempo. Clique em quem está no meio. | Oito looks, peça por peça. Clique no do meio. |
| Apoio (toque) | Sobra pano, sobra tempo. Toque em quem está no meio. | Oito looks, peça por peça. Toque no do meio. |
| Sobretítulo do foco | 01 DE 08 | 01 / 08 |
| Legenda do foco | CADA NÚMERO É UMA PEÇA | CADA NÚMERO, UMA PEÇA |
| Título do painel | O que ele veste | Compre o look |
| Categorias das linhas | PARTE DE CIMA / PARTE DE BAIXO / NOS PÉS | Roupa de cima / Roupa de baixo / Calçado |
| "+" (acessível) | Pôr na sacola | Adicionar à sacola |
| Título do fecho | Leve as três peças | Leve o look completo |
| Frase do fecho | Junto sai mais barato | Economize 10% |
| Botão | Quero o conjunto → | Adicionar o look → |
| Botão depois do clique | Na sacola | Adicionado |
| Selo | CHEGOU | Novo |
| Sacola: título | Na sacola | Sacola |
| Sacola vazia | A sacola está vazia. Toque no + de uma peça para trazer ela para cá. | Sua sacola está vazia. Toque no + de uma peça para adicionar. |
| Sacola: contagem | 1 peça / N peças | 1 item / N itens |
| Sacola: conjunto | Conjunto | Look completo |
| Sacola: "−" (acessível) | Tirar da sacola | Remover da sacola |
| Cursor | ABRE / ANDA | VER / ANDA |
| Look 01 | Feira de Sábado | Baile |
| Look 02 | Último Ônibus | Último Busão |
| Look 03 | Fim de Tarde | Várzea |
| Look 04 | Quadra Coberta | Garrafão |
| Look 05 | Sebo da Esquina | Laje |
| Look 06 | Sem Hora | Calçadão |
| Look 07 | Ponto do Trem | Garoa |
| Look 08 | Volta da Praça | Rolê |

Nav sem mudança de texto (Looks, Moletom, Jeans, Tênis + sacola) nem de comportamento. "Fechar o look", "Voltar ao look", "Total", "Look anterior", "Próximo look", "Pausar" e "Tocar" ficaram.

**Sem "Just Do It":** é slogan registrado, e a tela já assina com o Swoosh no topo; uma assinatura a mais não acrescenta nada e só aumentaria o uso de marca de terceiro. Os nomes dos looks são lugares e situações de rua e quadra do Brasil (baile, várzea, garrafão do basquete, laje, calçadão, garoa, rolê), curtos para caber no segmento ativo do trilho.

Prints antes e depois em `fonte/comparacao/nike-marca/` (1440 × 900, 1098 × 624 e 390 × 844: galeria, foco, pino ativo; e, só no depois, botão depois do clique e sacola).

## Elenco Nike (2026-11-08)

**Decisão do usuário:** o projeto agora é para a Nike, e o site não vai ao ar. Logo Nike na roupa e no calçado é pedido, não defeito; nenhuma outra marca. Por isso esta versão não entra no catálogo da plataforma sem trocar o elenco (regra de marca fictícia do repositório).

- **Origem:** Higgsfield, GPT Image 2.6. Modelos em `fonte/nike/<NN-nome>/modelo-gpt-image-2-6.png` (2336 × 3504); peças em `produto-N-gpt-image-2-6.png`. As peças do Enzo saíram primeiro no Nano Banana Pro (`produto-N.png`, de uma versão anterior do modelo) e foram refeitas no GPT Image 2.6 para bater com o modelo final; valem as refeitas. A bota do Gabriel é `produto-3-gpt-image-2-6-v2.png` (cano alto, como no modelo); a de cano curto saiu. Prompts em `*.prompt.txt`; folha com todos em `fonte/nike/elenco-nike.png`. O elenco anterior (oito looks da Prega, tênis de várias marcas) está em `fonte/public-looks-prega-v1/`.
- **Recorte:** modelo reduzido para 1024 × 1536 (`modelo-1024.png`), máscara do Vision, `fonte/recorte.py`. Comandos exatos, com os polígonos, em `fonte/nike/recorte-opcoes.sh`. Este elenco tem muito branco encostado no fundo (camiseta, meia, letras, relógio, tênis), e a regra do vão comia esse branco em retalhos; o script ganhou três opções: `--branco` (polígono sem vão nem fresta, vale a silhueta do Vision), `--claro` (painel quase branco colado num vão de verdade, como as laterais da camiseta do 06: o vão só no branco puro) e `--pe-vision` (do início da sola para baixo vale o Vision; usado nas botas trigo, no Killshot e nos AF1, em que a medida da sola comia solado e bico). `--manter` agora pode repetir. Nenhum pixel pintado à mão.
- **Recuo:** `--recuo: 0.89` em `tokens.css` multiplica `--recorte-alt`, então recorte, sombra elíptica e área de clique encolhem 11 % em todas as vagas e no foco. A figura pendura da sola, então os pés ficam na mesma linha e a cabeça desce. Foco em 1440 × 900: corpo de ~64,5 % da tela (era 72,4 %); no celular, ~55 % (era 62 %).
- **Nav:** "Moletom" no lugar de "Tricô" (moletons do 01, 02 e 04). "Jeans" leva aos jeans e às bermudas jeans (02, 03, 05, 06). "Tênis" abre o look atual no pino 3 se ele está de tênis; de bota (01, 02, 07), vai para o próximo de tênis. Calçado de bota tem `tipo: 'bota'`.
- **Pinos** conferidos no foco em 1440 × 900, 1098 × 624 e 390 × 844 (`fonte/comparacao/nike/`): pino 1 no peito, ao lado de colar e zíper, sem mão por cima; pino 2 na coxa esquerda da tela; pino 3 no calçado esquerdo da tela. `sombra` é o centro dos pés medido em cada recorte (de −0,003 a −0,014).

| Look | Nome (desde a marca Nike) | Peça 1 | Peça 2 | Peça 3 | Soma | Conjunto |
|---|---|---|---|---|---:|---:|
| 01 Enzo | Baile | Moletom Nike Zip Creme, R$ 499 | Calça Cargo Nike Camuflada, R$ 449 | Bota Nike Trigo, R$ 899 | R$ 1.847 | R$ 1.662,30 |
| 02 Gabriel | Último Busão | Moletom Nike Zip Mescla, R$ 449 | Jeans Nike Índigo Cru, R$ 399 (NOVO) | Bota Nike Trigo Cano Alto, R$ 949 | R$ 1.797 | R$ 1.617,30 |
| 03 Leo | Várzea | Camisa Nike Retrô Amarela, R$ 349 | Bermuda Jeans Nike Preta, R$ 299 | Nike Killshot 2, R$ 599 | R$ 1.247 | R$ 1.122,30 |
| 04 Luca | Garrafão | Moletom Nike Canguru Preto, R$ 449 (NOVO) | Calça Nike Sarja Preta, R$ 399 | Nike Air Force 1 High Trigo, R$ 999 | R$ 1.847 | R$ 1.662,30 |
| 05 Lucas | Laje | Camiseta Nike Swoosh Desbotado, R$ 229 | Bermuda Jeans Nike Clara, R$ 299 | Nike Shox TL, R$ 1.199 | R$ 1.727 | R$ 1.554,30 |
| 06 Miguel | Calçadão | Camiseta Nike Recortes Cinza, R$ 249 | Bermuda Jeans Nike Cinza, R$ 319 | Nike Air Max Plus, R$ 1.099 | R$ 1.667 | R$ 1.500,30 |
| 07 Nico | Garoa | Jaqueta Puffer Nike Preta, R$ 1.199 | Calça de Neve Nike Preta, R$ 699 | Bota Nike ACG Preta, R$ 999 | R$ 2.897 | R$ 2.607,30 |
| 08 Tai | Rolê | Jaqueta Bomber Nike Creme, R$ 899 | Calça Cargo Nike Camuflada Lavada, R$ 499 | Nike Air Force 1 Low Branco, R$ 799 | R$ 2.197 | R$ 1.977,30 |

**O que ficou imperfeito:**
- Bordas que seguem a silhueta do Vision (`--branco`, `--pe-vision`) são um pouco mais moles que as da regra de cor: o bico e o solado dos AF1 do 08 e o fim das botas têm 1 a 2 px de halo suave, e o contato escuro da foto entra junto sob o bico das botas trigo.
- Franjas das barras desfiadas (05 e 06) e fios soltos ficam semitransparentes; sobre o fundo do site não aparece, sobre cor aparece.
- Frestas finas de verdade continuam abertas (entre dedo e bermuda no 05, entre cotovelo e tronco no 02, entre braço e painel branco no 06): é fundo na foto.
- No 06, a borda do painel branco lateral encostada no vão é decidida pelo branco puro; 1 px de branco do fundo pode ficar no painel ou 1 px do painel pode sair.
- A bota do Enzo na foto de peça tem gola de couro marrom com NIKE, que no modelo fica escondida pela barra da calça.
- O foco ficou com mais ar em cima (cabeça mais baixa); no celular sobra ~120 px entre o cabeçalho e o gorro.

**Decisão do usuário, 2026-11-07:** são 8 modelos, cada um com um tênis real, com a marca visível, escolhido para o fit. A roupa continua sem logo. O site não vai ao ar; com marca real ele não entra no catálogo sem trocar os tênis, porque contraria a regra de marca fictícia do repositório. Look 01 aprovado: `fonte/look01.png`, tomada `look01-t7-1`. O elenco é gerado por `fonte/_base-elenco.txt`.

Fila ao abrir (decidida na construção, ver "Decidido sem aprovação"): o 01 no centro, de −4 a +4 **05** (fantasma), 06 (escondido), 07, 08, **01**, 02, 03, 04 (escondido), **05** (fantasma). Os nomes formam o mesmo sábado do título.

| Look | Nome | Modelo | Soma | Conjunto (−10 %) |
|---|---|---|---:|---:|
| 01 | Feira de Sábado | 27 anos, magro, ombros estreitos, pescoço fino e cabeça proporcional, um rapaz comum com a roupa sobrando no corpo, pele parda escura, crespo preto com volume, cavanhaque curto | R$ 1.337,00 | R$ 1.203,30 |
| 02 | Último Ônibus | 22 anos, comprido e magro, pele morena clara, ascendência indígena, cabelo preto liso em coque pequeno no alto | R$ 1.087,00 | R$ 978,30 |
| 03 | Fim de Tarde | 23 anos, magro médio, pele clara com sardas, cabelo ruivo-acobreado curto e ondulado | R$ 1.317,00 | R$ 1.185,30 |
| 04 | Quadra Coberta | 34 anos, o mais encorpado, pele oliva, ascendência árabe, cabeça raspada, barba curta grisalha | R$ 1.127,00 | R$ 1.014,30 |
| 05 | Sebo da Esquina | 25 anos, nipo-brasileiro, magro, cabelo preto curto e liso com risca lateral | R$ 1.297,00 | R$ 1.167,30 |
| 06 | Sem Hora | 24 anos, ombros definidos, pele preta retinta, black power arredondado, sem barba | R$ 1.117,00 | R$ 1.005,30 |
| 07 | Ponto do Trem | 31 anos, magro médio, pele clara, cabelo castanho-claro ondulado até as orelhas, barba cheia curta | R$ 1.157,00 | R$ 1.041,30 |
| 08 | Volta da Praça | 20 anos, magro, pele morena média, tranças nagô curtas, sem barba | R$ 1.007,00 | R$ 906,30 |

**A linha N do painel é a peça do pino N, e é a peça que o modelo veste.** Pino 1 no peito, pino 2 na coxa, pino 3 no tênis. **X/Y em % da imagem do recorte (1024 × 1536), desde 2026-11-07**: x da borda esquerda, y do topo da imagem. Antes eram % da caixa do corpo; os números abaixo foram convertidos pela caixa medida de cada recorte (topo da cabeça a 8 %, sola a 93,9 %) e conferidos em print do foco em 1440 × 900, com os oito recortes prontos. Só o 02/2 mudou depois do print (de 61,3 para 63,5, para sair de baixo das mãos). **Conferidos de novo em 2026-11-07, na construção, com o foco animado dos oito looks em 1456 × 840:** todos caem na peça certa, sem mão por cima, e a etiqueta não cobre rosto. Só o 01/1 mudou (de 48,2/29,5 para 54/30), porque caía em cima do puxador do zíper; agora fica no tricô, ao lado do fim dele. Valem os de `src/data/looks.js`, que são estes.

| Look | Pino | Peça | Preço | X/Y (% da imagem) | Selo |
|---|---|---|---:|---|---|
| 01 | 1 | Tricô Zíper Vinho | R$ 389,00 | 54/30 |  |
| 01 | 2 | Jeans Carvão Lavado | R$ 349,00 | 45,8/57,8 |  |
| 01 | 3 | Nike Zoom Vomero 5 | R$ 599,00 | 43/90,5 |  |
| 02 | 1 | Camiseta Peso Cobalto | R$ 169,00 | 50/32,1 |  |
| 02 | 2 | Jeans Cimento Lavado | R$ 369,00 | 45,2/63,5 | CHEGOU |
| 02 | 3 | Air Jordan 1 Retro High | R$ 549,00 | 42,6/91,3 |  |
| 03 | 1 | Cardigã Arroz Ocre | R$ 409,00 | 49,9/33,8 |  |
| 03 | 2 | Jeans Índigo Clareado | R$ 329,00 | 45/62,1 |  |
| 03 | 3 | New Balance 2002R | R$ 579,00 | 43,4/91,3 |  |
| 04 | 1 | Camiseta Tinta Lilás | R$ 179,00 | 51/33,8 | CHEGOU |
| 04 | 2 | Sarja Larga Garrafa | R$ 379,00 | 56/63,8 |  |
| 04 | 3 | Adidas Samba OG | R$ 569,00 | 58/91,3 |  |
| 05 | 1 | Tricô Trança Petróleo | R$ 379,00 | 49,1/32,9 |  |
| 05 | 2 | Sarja Dupla Cáqui | R$ 319,00 | 45,9/59,5 |  |
| 05 | 3 | Puma Suede Classic | R$ 599,00 | 42,2/91,3 |  |
| 06 | 1 | Camiseta Peso Cru | R$ 159,00 | 49,9/31,2 |  |
| 06 | 2 | Jeans Café Desfiado | R$ 359,00 | 55/59,5 |  |
| 06 | 3 | ASICS GEL-1130 | R$ 599,00 | 57,1/91,3 |  |
| 07 | 1 | Tricô Verde-Sálvia | R$ 359,00 | 49,1/32,9 |  |
| 07 | 2 | Jeans Preto Lavado | R$ 349,00 | 45,8/59,5 |  |
| 07 | 3 | Vans Old Skool | R$ 449,00 | 42,9/91,3 |  |
| 08 | 1 | Camiseta Peso Terracota | R$ 169,00 | 50/32,1 |  |
| 08 | 2 | Jeans Azul-Claro Lavado | R$ 339,00 | 54,9/59,5 |  |
| 08 | 3 | Converse Chuck 70 High | R$ 499,00 | 57/91,3 |  |

Descrição de cada peça (cor, tecido, corte, pose): `fonte/decupagem.md`, Parte 3, seção 5.

**Pose do look 01:** peso na perna do lado esquerdo da tela, o outro joelho solto, ombros um pouco desnivelados. Braço esquerdo da tela solto, com a mão junto da coxa, dorso para a câmera. Na foto os dedos saíram juntos: só dois dedos e o polegar se distinguem. Mão direita da tela dentro do bolso da frente até o punho, sem dedo à vista. Nada cobre a frente do jeans. Pés um pouco abertos, quase de frente (cerca de 15 graus), solas na mesma linha.

**Corpo e caimento dos seis looks (fixado na tomada `look01-t4-3`, hoje `fonte/look01-v5.png`, e mantido na edição `look01-t5-3`, hoje `fonte/look01.png`; a anterior, `look01-t3-1`, está em `fonte/look01-v4.png`):** o volume vem da roupa, nunca do corpo. Quem parecia grande e forte nas tomadas anteriores era o tricô grosso inflando o tronco e as mangas, e não o corpo pedido no texto.

| Medida (`fonte/mede_corpo.swift`) | Faixa | Look 01 |
|---|---|---|
| Altura em cabeças, queixo pelo Vision | 6,75 a 7,5 | 7,47 (silhueta 7,16) |
| Largura ÷ altura do corpo | 0,285 a 0,337 | 0,310 |
| Alto do vão das pernas ÷ altura | 0,667 a 0,729 | 0,695 |
| Largura da cabeça com cabelo ÷ altura | 0,105 a 0,117 | 0,110 |
| Ombros ÷ altura | sem faixa; só comparação | 0,239 (0,233 antes da edição) |
| Linha mais larga do corpo | nas mangas ou no tronco, nunca nos tênis | 35,9 % da altura, no tronco e nas mangas |
| Barra da peça de cima ÷ altura, só em look de barra curta como o 01 | 0,46 a 0,50 | 0,476 pela cor (y 755 da foto); 0,581 no medidor, cuja linha cai nos bolsos: vale a da cor |

Nos quadros do vídeo, com o mesmo medidor: modelo 01 com 6,84 cabeças e barra 0,448; modelo 02 com 7,76 e 0,478.

- **Como se chega nisso:** o prompt leva os blocos de `fonte/_estilo.txt` e anexa `fonte/_guia-proporcao.png`, agora com zonas de cor para tricô, calça, pele e tênis, que marcam a barra. Depois da geração, medir antes de recortar; fora da faixa, gera de novo. No look 01 veio depois a edição de `fonte/_edicao-roupa.txt`, que troca calça e tênis e mede-se de novo.
- **Tricô (looks 01 e 05):** malha fina a média, mole, que cai reta com o próprio peso. Ombro caído só um pouco, manga reta sem balão, poucas dobras acima do punho, volume no corpo da peça e não para os lados. Nada de canelado grosso ou ponto gordo: textura boa nele não compensa a silhueta. No look 01 ele é curto: termina na cintura, em faixa canelada solta, com o cós à vista.
- **Calça:** na geração, algodão pesado tingido na peça, tom contínuo, dobras longas abaixo do joelho, o que limpa a textura mas lê como sarja. A cara de jeans lavado do look 01 vem da edição: sarja diagonal fina, carvão desbotado, mais claro no meio das coxas e nos joelhos, barra quebrando sobre o tênis. Ressalva: faixas horizontais no quadril. Os jeans 02 e 03 e o desfiado 06 ainda não foram testados.
- **Tênis:** reais, com a marca visível: 01 Nike Zoom Vomero 5 cinza e prata; 02 Air Jordan 1 Retro High café e creme; 03 New Balance 2002R verde-musgo e creme; 04 Adidas Samba OG branco, verde e sola de borracha caramelo; 05 Puma Suede Classic vermelho-tijolo e creme; 06 ASICS GEL-1130 preto e cinza; 07 Vans Old Skool preto e branco; 08 Converse Chuck 70 High creme. Primeiro sai a foto do par, depois o modelo calçando esse par.
- **Recorte:** `fonte/recorte.py` abre sozinho as frestas de fundo entre dedos, manga e tronco. O polígono `--tirar` só valia para a foto `look01-t3-1` e não entra mais. A borda da sola sai limpa, sem fio transparente nem traço escuro, com o contato em camada à parte. Sola colorida, como a cor de mel do look 01, tem borda medida pela croma, porque a sombra do chão é neutra e virava retalho branco opaco nos calcanhares. O traço claro entre indicador e médio era da foto t4-3 e não existe na t5-3.
- **A variedade continua:** cada look mantém o corpo da tabela. O 04, o mais encorpado, e o 06, de ombros definidos, ficam no alto da faixa, sem sair dela. Nenhum dos dois foi gerado ainda, então esse limite não foi testado neles.

**Distância do vídeo:** fica o estilo (tricô largo, camiseta ampla, jeans baggy lavado, sarja larga, tênis retrô robusto, corpo inteiro no branco). Mudam a combinação, a cor, a pose e a pessoa. Nenhum cabelo ou par de cores repete um look do vídeo, nenhuma pose repete a de um look (a mão no bolso do 01 fica perto do modelo 02 do vídeo, que tem as duas nos bolsos), e nenhum look leva cinto ou camiseta aparecendo na barra.

## Imagens

- **Quantas:** 32. Oito looks (retrato 2:3, 1024×1536, com recorte em alfa) e 24 fotos de peça (exibidas em 84×105; roupa em cabide de madeira em `#f3f3f3`, tênis de lado no branco com sombra curta).
- **Tamanho:** o foco mostra o modelo com ~590 px de altura em 1440. Com o corpo em 86 % da imagem e tela 2×, 1536 px de altura bastam.
- **Ordem:** o look 01 primeiro. Ele fixa lente, luz, linha de pés e corpo e vai como referência dos outros cinco, junto de `fonte/_guia-proporcao.png`. Cada peça sai da imagem do look dela, para manter cor e lavagem.
- **Ferramenta:** Codex (`tools/codex-img.sh`), um job por vez. Só se o script desistir por crédito ou limite, Higgsfield, com modelo de imagem, conferindo `higgsfield generate cost` antes. O `.prompt.txt` de cada imagem anota a ferramenta e os créditos gastos.
- **Sempre proibido no prompt:** logo, texto ou estampa na roupa, óculos, acessório na mão. No tênis, a marca real é obrigatória.
- **Sombra:** na imagem, só um contato muito suave. A elipse larga é CSS (valores na seção "Tela"), porque segue os pés e não o eixo da cabeça.

## Stack

Vite sem framework, HTML, CSS e JS puros. **Sem GSAP e sem Lenis:** não há rolagem. Os movimentos são transições CSS e Web Animations com as curvas abaixo, e a fila usa um laço próprio (ver "Anel"). Tokens em variáveis CSS, motion em módulos próprios. Palco em unidade de tela, estrutura (painel, margens, linhas, botão, trilho, controles) em `--u`, textos em `--su`, `<section data-cena>`. Conferir com `tools/escala.mjs` e `tools/celular.mjs --webkit`.

## Onde a decupagem se contradiz

As partes Composição e Motion foram medidas em separado. Voltei ao vídeo a 60 fps nos pontos que mudam a construção; as linhas marcadas com "medi" têm esse dado novo.

| Assunto | Composição | Motion | Vale | Por quê |
|---|---|---|---|---|
| Fila ao trocar | Quart, ~0,95 s | Cubic, 0,7 s | **`cubic-bezier(.33,1,.68,1)`, 0,7 s** | Medi: as duas curvas descrevem os mesmos pontos (melhor ajuste: cubic 0,65 s e quart 0,85 s, ambas com erro de 0,03). Fica a mais curta |
| Nome das curvas | | `power3.out` = `(.33,1,.68,1)` | **Usar o `cubic-bezier`, nunca o nome** | Os nomes da Parte 2 estão um degrau acima dos do GSAP: lá, `(.33,1,.68,1)` é `power2.out` |
| Cascata do painel | Início +0,37 / +0,40 / +0,47, sem deslocamento, desfoque ~8 px | Início +0,28 / +0,36 / +0,44, y +8 a 10 px, desfoque ~4 px | **Motion** | Medi: a linha 1 começa em +0,28; 50 % em +0,51 / +0,58 / +0,64; o texto sobe ~8 px até assentar |
| Volta da fila ao fechar | Título em 0; vizinhos saem de desfoque maior | Tudo em +0,20, só fade | **Motion** | Medi: título e vizinhos começam juntos em +0,20, e a nitidez segue só a opacidade, sem desfoque extra |
| Total e botão | +0,40–0,85 / +0,47–1,05 | +0,43–0,95 / +0,48–1,10 | **Motion** | Medi: total em 50 % em +0,53; botão em 50 % em +0,60 |
| Entrada da tela | Serve como entrada | É compressão, não animação | **Não é medição.** Entrada nossa, curta | Ver "Decidido sem aprovação" |
| Pino 1 ativo sem hover | Fica ativo no foco | O cursor já estava lá; o estado persiste | **Só ativa por hover, foco de teclado ou toque, e persiste** | Motion explica o que a Composição viu |
| Etiqueta do pino | `#e7e7e7`, fade à direita | Pílula branca | **Composição** | Conferi no quadro: cinza-claro, somindo à direita |
| Número da linha | Disco branco | Sem fundo | **Disco branco Ø20**, no canto superior direito da foto | Conferi no quadro: sobre foto escura o disco aparece |
| Cursor | Ponto Ø21; anéis Ø58 e Ø42 | Ponto ~18; bolha ~52 única | **Motion**, com ajuste (abaixo) | Ø21 é um quadro no meio do morph |
| Desfoque ±1 / ±2 | 2,5 / 3,5 | 2 / 4 | **2,5 / 4 px em 1440**, a ajustar no print | Diferença abaixo do erro |
| Anel | 7 vagas; fantasma fora do anel | 7 vagas; ±3 é fantasma | **9 vagas; fantasma é ±4, e ±3 é opaco** | Medi: fantasma é centro ± 4 mód 6 em dois centros, e a nesga azul é o look oposto em ±3. Parte 4, seção 1 |
| Fantasma (±4) | ±35,2 %, ~0,2, ~10 px | ±34 %, 0,12–0,15, 8–12 px | **±35 %, opacidade .16, 4,5 px** | Medi: .157–.163 em quatro looks, e σ de 3,0–3,8 em 1098. O desfoque forte era a olho, a ajustar no print |
| Fios internos na troca | Só o fio do fecho fica | Ficam todos os fios | **Composição; os 4 internos voltam em cascata** | Medi: 0 de +0,03 a +0,23. Parte 4, seção 4 |
| Troca de segmento | +0,10–0,40 | +0,03–~0,55 | **Motion** | Medi: fim do segmento 01 já em x≈180 em +0,07, e em x≈103 em +0,50. Parte 4, seção 5 |
| Sombra | ~300×28; foco ~350×26 | Parte da imagem, sem medida | **Valores da seção "Tela"; em CSS, filha da figura** | Medi: 260×26 e foco 305×26, com L<246, perto dos 261 e 301 de largura da Parte 3. Parte 4, seção 6 |
| Escala do foco, pinos | 1,21; +0,83 / 0,93 / 1,03 | 1,205; +0,78 / 0,90 / 1,03 | **1,205; +0,78 / 0,905 / 1,03** | Intervalo de 125 ms |
| Autoplay | 4,6 s, arredonda 5 | 4,5 s | **5 s por look** | |
| Trilho inativo | `#e2e2e2` | ~`#f2f2f2` | **`#e2e2e2`** | No branco, `#f2f2f2` some |

## Tela: valores que valem (1440)

- **Estrutura:** nav 72; palco 1100; fio de 1 px; painel 340 com conteúdo de 283; linhas de 136 (16,9 % H); foto 84×105; botão de 50; vão elástico absorve a altura extra.
- **Fila (eixo em % do palco; pés em % H):**

| Vaga | Eixo | Pés | Escala | Desfoque | Opacidade |
|---|---|---|---|---|---|
| 0 | 50 | 86,7 | 1 | 0 | 1 |
| ±1 | 50 ± 29,3 | 85,1 | 0,875 | 2,5 | 1 |
| ±2 | 50 ± 45 | 80,4 | 0,775 | 4 | 1 |
| ±3 | 50 ± 45 | 75,5 | 0,66 | 4,5 | 1 |
| ±4 | 50 ± 35 | 72,1 | 0,58 | 4,5 | .16 |

- **Foco:** escala 1,205, pés em 94 % H. O resto em fade, sem mover nada.
- **Pinos:** repouso Ø24, ativo Ø28, halo Ø52, etiqueta com 28 de altura. Entrada de ~0,3 s com escala em `cubic-bezier(.34,1.4,.64,1)` e um pulso único no halo.
- **Sombra (elemento filho da figura, então herda posição, escala, desfoque e opacidade):** caixa de 432×48 na escala 1, visível ~375×37 (medidas do vídeo × 1,44: a figura escala pela altura da tela, e a sombra acompanha), centro em `--sombra-x` (padrão +21 do eixo, ajustado por look sob os pés; look 01: +3,5, pés de 371 a 669 no recorte de 1024) e 5 abaixo da sola. Gradiente radial de preto em opacidade: .24 no centro, .19 a 23 %, .14 a 43 %, .08 a 63 %, .035 a 83 %, 0 a 100 %. Cinza neutro. No foco: largura visível ~440, altura mantida em 37 (a altura não cresce com o modelo), 7 abaixo da sola; mesma conta, ainda sem conferir em print, porque o piloto não tem foco.
- **Trilho:** ativo 172, inativo 40, gap 5. Segmento antes do ativo: `--trilho-visitado`.
- **Fios internos:** somem com o conteúdo em +0,03, em 1 quadro. Só fade na volta, sem desenhar: início em +0,50 / +0,58 / +0,64 / +0,70 (de cima para baixo), ~0,5 s, `cubic-bezier(.5,1,.89,1)`. Título do painel e fio do fecho não mudam.
- **Troca de segmento:** início do novo e fim do antigo andam com `cubic-bezier(.25,1,.5,1)`, 0,45 s, a partir de +0,03. A borda direita do novo fica parada, e o nome antigo some em 1 quadro. O antigo vai de `--trilho-ativo` a `--trilho-visitado` em ~0,45 s. Com autoplay pausado, o preto do novo enche para a direita até ~+0,65; com autoplay ligado, ele começa vazio. Número novo escurece em +0,16; nome entra em fade + desfoque de +0,16 a +0,45. O rótulo leva `text-overflow: ellipsis`, o que dá as reticências cinza antes do próximo número de +0,03 a +0,16.
- **Tempos:** tabelas das seções 2, 5, 6, 7, 8 e 9 da Parte 2 da decupagem, com a curva da fila acima, e Parte 4 da decupagem, que vale sobre elas.

### Anel de 6 looks em 9 vagas

**Medido para 6 looks; com 8, valem as mesmas 9 vagas.** Posições, escalas, desfoques e opacidades não mudam. A vaga k mostra o look (centro + k) mod 8, então −4 e +4 caem no mesmo look (com o 01 no centro, os dois fantasmas são o 05) e ±3 mostram looks diferentes (04 à direita, 06 à esquerda). Os repetidos de antes (+2 = −4, −2 = +4) não existem mais. Código: `src/motion/anel.js`.

Vagas de −4 a +4, nove elementos. Com seis looks (o vídeo), +2 e −4 tinham o mesmo look, −2 e +4 também, e ±3 mostravam o oposto ao centro. Com oito, só ±4 repetem, e o repetido está nas duas pontas, no mesmo tamanho e na mesma opacidade, mas a ±35 % de cada lado: não lê como espelho porque é o fantasma de .16.

| Vaga | Papel | Na tela |
|---|---|---|
| ±3 | Look oposto, opaco, escondido atrás de ±2 | Só uma nesga, o que dá a sensação de que a fila continua |
| ±4 | Fantasma pálido a ±35 % | Entre ±1 e ±2, atrás dos dois |

**Caminho ao avançar** (ao voltar, o espelho disso). Tudo na curva da fila, salvo onde indicado:

| Quem | Movimento | Opacidade |
|---|---|---|
| +4 → +3 | Corre para trás do +2 | .16 a 1 até ~+0,17 |
| +3 → +2 | Sai de trás, quase parado no eixo | 1 |
| −2 → −3 | Encolhe quase parado, e o novo −2 cobre | 1 |
| −3 → −4 | Sai de trás do −2, indo para dentro | 1 até p≈0,5, depois até .16 |
| −4 | Parado | .16 a 0 de +0,03 a +0,07 |
| Novo +4 | Parado, na vaga | 0 a .16 de +0,38 a +0,90, `cubic-bezier(.5,1,.89,1)` |

**Como construir:** um laço único calcula, a cada quadro, a posição contínua v de cada elemento (vaga menos a curva da fila) e deriva tudo dela:

- **Eixo:** curva Catmull-Rom pelas vagas (0, 29,3, 45, 45, 35 %). Ela produz o arco medido entre ±2 e ±3, de ~14 px para fora em 1098, sem valor próprio.
- **Escala, pés e desfoque:** lineares entre as vagas.
- **Opacidade:** 1 até |v| = 3,5, linear até .16 em |v| = 4, linear até 0 em |v| = 4,15. O novo +4 fica fora dessa regra, com o fade da tabela.
- **Empilhamento:** por |v|.
- **Além de ±4:** mesma posição e escala de ±4.

O elemento que sai por −4 é reaproveitado como o novo +4, com o look seguinte.

### Cursor (só com mouse)

Cursor nativo continua visível; o próprio é uma camada que segue atrás dele (lerp 0,2 a 60 Hz).

| Situação | Aparência |
|---|---|
| Em movimento rápido | Ponto Ø18 `#101010` |
| Devagar ou parado, sobre a vaga 0 | Bolha Ø64 `#e8e8e8` translúcida com fio fino, "ABRE" |
| Devagar ou parado, fora dela no palco | A mesma bolha, "ANDA" |
| Sobre botão | Bolha clareia até sumir |
| No foco | Sem cursor próprio |

Morph de 0,3–0,35 s, diâmetro e cor juntos; rótulo só no último terço.

## Celular (390): decisão nossa, o vídeo não mostra

Abaixo de 900 px de largura, a tela continua sem rolagem (`100svh`).

- **Nav:** 56 de altura, logo e sacola; os quatro links ficam numa linha rolável logo abaixo.
- **Palco:** tela inteira. Título 38, frase em 13, à esquerda.
- **Fila:** centro + ±1 cortados nas bordas (eixo 50 ± 42 %). Sem as vagas de ±2 a ±4, para aliviar desfoque e memória. Arrasto com o dedo (`touch-action: pan-y`).
- **Trilho:** no pé, seta e seta nas pontas.
- **Painel:** folha fixa no pé com 64 de altura mostrando "O que ele veste", o preço do conjunto e uma seta. Abre para cima com as três linhas e o botão de 50 em largura cheia.
- **Foco:** modelo a ~62 % H, acima da folha. Tocar no pino ativa, mostra a etiqueta e sobe a folha até a linha da peça. Etiqueta abre para a esquerda quando não cabe à direita.
- **Sem:** cursor próprio. Autoplay continua.
- **Rótulos:** nunca abaixo de 11 px.

## Acessibilidade e movimento reduzido

- Teclado: setas trocam de look; Enter abre o foco; Esc fecha; Tab passa pelos pinos, e o foco de teclado ativa o pino.
- `prefers-reduced-motion`: sem autoplay; troca por fade curto; sem desfoque animado.
- Aba oculta congela o temporizador, e ele continua do mesmo ponto ao voltar. Não conta como a pausa de autoplay da seção "Decidido sem aprovação".

## Decidido sem aprovação

- **Nome Prega no lugar de Folga e de Vinco**, pelos conflitos acima (aprovado em 2026-11-05). O nome fica num lugar só do código.
- **Título "Sábado à toa", não "Dia de folga":** em loja de roupa, com folga.shop vendendo roupa, o título gigante repetiria o nome em conflito. O novo dá nome ao dia que os oito looks contam.
- **"Beira-Rio" virou "Fim de Tarde":** Beira Rio é uma fabricante brasileira de calçados, e a tela vende tênis.
- **Rótulos das linhas:** no lugar de marca, "Parte de cima", "Parte de baixo", "Nos pés".
- **Links da nav, todos estados desta tela:** "Looks" fecha o foco e volta à fila; "Moletom" (era "Tricô" até 2026-11-08) e "Jeans" levam ao próximo look que tem a peça, abrem o foco e ativam o pino dela; "Tênis" abre o foco do look atual no pino 3 (desde 2026-11-08, se o look atual está de bota, vai ao próximo de tênis). Logo volta ao look 01, pelo caminho mais curto do anel, e conta como interação: pausa o autoplay e não o religa.
- **"+" e botão:** "+" põe a peça na sacola, o contador sobe e o "+" gira para virar ✓ por 1,6 s. O botão põe as três.
- **Sacola:** o clique troca o painel pelo estado "Na sacola", no mesmo formato das linhas, com o total. Fechar devolve o look. Sem checkout.
- **Autoplay:** ao encher, dispara a troca, e o play retoma o look do zero. O vídeo não mostra nenhum dos dois. Medido: um clique pausa no mesmo quadro, com a barra cheia e o ícone ▶, e nada além do play religa. Hover não pausa: no vídeo a barra segue enchendo com o cursor sobre o palco, até o clique. Por analogia, também pausam toque, início de arrasto e tecla de ação.
- **Seta de voltar e clique em segmento:** mesma troca da seta de avançar, indo pelo caminho mais curto do anel. Clique em vizinho anda a fila até ele.
- **Arrasto:** conforme a suposição da Parte 2, seção 3. Hover na linha acende o pino, e ativar outro apaga o anterior.
- **Entrada da tela:** nossa, depois de decodificar as imagens: modelos assentam em 0,4 s saindo de um desfoque extra, interface em fade de 0,35 s, botão de cinza a preto em 0,6 s. O vídeo não prova que exista.
- **Sem atraso entre planos na fila:** os ~25 ms medidos podem ser leitura, e a própria medição diz isso.
- **Números inativos do trilho em `#767676`:** o `#979797` medido fica ilegível em 12 px.
- **Bolha do cursor Ø64 em vez de ~52:** com texto em 12 px (o piso da escala), "ANDA" não cabe em 52. Rótulos curtos pelo mesmo motivo.
- **Preço do conjunto em 18 px:** abaixo dos 44–52 da escala, porque não cabe em 283 px. `fonte/decupagem.md` já registra o desvio.
- **Título em 56 px, e não os ~39 do vídeo:** é o piso da escala. Ocupa ~22 % da largura em vez de 15,7 %.
- **Nomes de peça até 23 caracteres** (origem até 19): cabem nos ~182 px da coluna de texto; a etiqueta do pino cresce junto.
- **Nova pose do look 01 e tricô curto (tomada `look01-t4-3`):** na `look01-t3-1`, a mão segurando a barra saiu com o polegar defeituoso e um objeto entre os dedos, e a barra no quadril (0,536) alongava o tronco. Ficaram mão no bolso até o punho, a outra solta com o dorso para a câmera, pés quase de frente e tricô na cintura (barra 0,468 pela cor). Peças, nomes e preços não mudaram. Uma mão no bolso fica perto do modelo 02 do vídeo, que tem as duas nos bolsos.
- **Edição do look 01 no Higgsfield, não no Codex:** o look 01 passou por edição de roupa no CLI higgsfield (`nano_banana_pro`, 2k, 2 créditos por imagem), como exceção à regra de Codex primeiro. Foram 5 tomadas, **10 créditos no total** (saldo de 1814,57 para 1804,57). A escolhida, `look01-t5-3`, custou 2. O motivo é a calça, que não saía como jeans lavado pelo texto do Codex. O prompt está em `fonte/_edicao-roupa.txt`. `fonte/produto-01-1.png` foi refeita no Codex para bater com a gola e o zíper novos, sem crédito.
- **Ressalvas abertas da foto do look 01 (revisão de 2026-11-06), todas pedem outra geração; nenhuma se resolve no recorte:**
  - **Tênis (bloqueia):** lê como bloco minimalista, não como skate retrô. Sola de parede reta, sem recorte nem subida no calcanhar, sem biqueira sobre o bico, poucos painéis, língua e colarinho não aparecem. Vai como referência dos outros cinco looks, então vem antes deles.
  - **Curva lateral do tênis:** duas costuras curvas e paralelas da sola ao colarinho nos dois pés; o brief proíbe curva e faixa lateral. Camurça areia, cadarço largo e sola mel também são receita comum: conferir o par novo contra modelos reais.
  - **Mão solta:** a edição encolheu a mão (cerca de 10 % na parte visível; borda externa recuou 8 px em y=870 e 16 px em y=900) e colou anelar e mínimo: não dá para contar quatro dedos. O recorte segue a foto nessa região; o defeito não vem da máscara.
  - **Jeans:** faixas horizontais quase simétricas no quadril (y 810-920); costura ondulada na entreperna abaixo do joelho (x 500-560, y 1190-1300); barra que lê como punho franzido de moletom e calça que afina no fim (339 px em y=1280, 282 px em y=1370).
  - **Conjunto:** lê só em parte como streetwear oversized; tricô curto e arrumado com esse tênis puxa para o casual arrumado. Reavaliar depois de trocar o tênis.
  - **Foto de produto:** `produto-01-1.png` tem a cor certa, mas não a construção: gola bem maior (~57 % dos ombros contra ~43 %), zíper mais longo (~36 % da peça contra ~28 %), V mais aberto, dentes de metal evidentes e canelado no peito que o modelo não tem. Estimativas a olho.
  - **Zíper no modelo:** aberto em V e quase duas vezes mais longo que o da tomada anterior, embora pedido fechado e curto. O pino 1 (46/25) cai perto do fim do zíper: conferir no print.
  - **Fundo:** padrão muito fraco (mínimo 252), visível só com contraste forçado 16×, que o recorte remove.
- **Sombra refeita em 432×48 na escala 1:** a de 394×44 vinha da escala pela largura (1,31), mas a figura escala pela altura (1,44), e ela ficava 9 % estreita e clara demais perto da borda. Só em CSS; opacidades e posição não mudaram.
- **Recorte: limiar de luz da fresta de 110 para 140:** a 110, a fresta seguia pelo pesponto claro do bolso, ao lado do punho, e o deixava translúcido.
- **Tela de altura curta (até ~720):** o vão elástico zera primeiro; as linhas seguem em 16,9 % H (`--linha: min(16.9svh, 136u)`).
- **Fila ao abrir com 8 looks (2026-11-07):** a ordem do anel é a numeração (01 a 08), porque o trilho mostra os números em sequência e cada segmento tem que ser vizinho do seguinte na fila. A escolha é o centro: o 01, que já era a casa (o logo volta a ele). Com ele, de −2 a +2 ficam 07 sálvia/preto, 08 terracota/azul-claro, **01 vinho/carvão**, 02 cobalto/cimento e 03 ocre/índigo, e os fantasmas ±4 são o 05 petróleo/cáqui. Medi a cor média de cima e de baixo de cada recorte: todo par vizinho troca a cor de cima e a de baixo. O par mais fraco do anel é 08–01 (terracota `#9d5238` e vinho `#461319`, os dois puxando para o vermelho), que se separa pela luz (terracota bem mais clara) e pela calça (azul-claro `#8598a7` contra carvão `#484847`). Se um dia ele incomodar, abrir no 04 tira o par da vista, mas o logo deixa de voltar para o primeiro.
- **Pinos em % da imagem, não da caixa do corpo:** o cliente edita um número só, sem medir a caixa de cada recorte. Conversão e conferência em "Os 8 looks".
- **Área de clique da figura:** o corpo (27 % da largura da imagem, do topo da cabeça à sola), não a caixa transparente do recorte, que no centro cobre a metade dos vizinhos.
- **Sombra em fração do recorte** (0,686 × 0,076 da altura do recorte, 0,8 % abaixo da sola): dá os 432 × 48 em 1440 × 900 e acompanha o celular, onde a escala da tela é outra. `sombra` de cada look em `looks.js` é o centro dos pés medido no recorte (01 +2, 04 −19, 06 +7 px em 1024).
- **Fecho com os preços empilhados** (antigo em cima, conjunto embaixo): lado a lado com o conjunto em 18 px, o título quebrava em duas linhas em 283 px.
- **Sacola:** peça repetida vira "2 ×" na mesma linha; o conjunto entra como uma linha ("Conjunto", nome do look, preço com o desconto) e conta 3 no contador. O "−" no lugar do "+" tira um. O botão vira "Voltar ao look". Texto da sacola vazia: "A sacola está vazia. Toque no + de uma peça para trazer ela para cá."
- **Nav:** "Tricô" conta o cardigã do 03 (é malha). "Jeans" só os jeans; as sarjas do 04 e do 05 ficam de fora. (Elenco anterior; no elenco Nike, ver "Elenco Nike (2026-11-08)".)
- **Celular, versão da construção (o passo `/celular` revê):** corpo a 54 % da tela com os pés a 83 %, foco ×1,15 (62 %) com os pés a 87,5 %, trilho de 8 segmentos (ativo 96, inativo 15) só com o rótulo do ativo, e o toque no pino abre a folha inteira, não só até a linha da peça.
- **Motion da construção (2026-11-07), `src/motion/`:**
  - **Desfoque sem filter:** cada figura empilha as três versões do recorte (nítida, desfoque 1 = 2,5 px, desfoque 2 = 4 px) com `mix-blend-mode: plus-lighter` numa caixa com `isolation: isolate`. O laço dá pesos que somam 1 às duas versões vizinhas do desfoque da vaga, então a mistura é exata e a figura não fica translúcida no meio da troca. O 4,5 px de ±3 e ±4 usa o desfoque 2 (4 px): o ±3 fica quase todo atrás do ±2 e o ±4 tem opacidade .16, e meio pixel não aparece em nenhum dos dois.
  - **Anel por elemento:** o elemento i guarda o número n ≡ i (mod 9) mais perto do centro; só quem sai por uma ponta troca de imagem, e todas as imagens são decodificadas antes de entrar. A camada dos pinos e do clique do centro é um elemento à parte, sempre na vaga 0.
  - **Duração da troca:** 0,7 s por um look, +0,1 s por look a mais quando o salto é maior (segmento, logo, nav), até 1,1 s. O encaixe de um arrasto curto vai de 0,4 a 0,7 s pela distância.
  - **Arrasto:** a partir de 6 px na horizontal; um passo de vaga (29,3 % do palco; 42 % no celular) é um look. Ao soltar, a posição é projetada pela velocidade (×0,22 s) e encaixa no look mais perto, até 3 de distância; passou de 60 px (ou 15 % do passo) ou de 0,6 look/s, anda pelo menos um. Um arrasto engole o clique que viria depois.
  - **Cursor:** vira ponto acima de 420 px/s e bolha depois de 0,1 s abaixo de 140 px/s. "ABRE" sobre o corpo do centro, "ANDA" no resto do palco, inclusive sobre os vizinhos; some sobre botões, no painel, na nav e no foco. Ao pressionar, a bolha encolhe para 86 %.
  - **Volta da fila ao fechar o foco:** cada vizinho entra com a própria opacidade, então dois vizinhos sobrepostos se veem um através do outro durante o fade (+0,20 a +0,70). O vídeo é pequeno demais para dizer se lá a fila entra como um bloco só.
  - **Entrada do painel:** linhas, total, botão e fios com Web Animations; o desfoque de 4 px das três linhas é `filter`, porque são elementos pequenos e a regra do desfoque por troca de imagem vale para os modelos.
- **Detalhe (foco), construção de 2026-11-07:**
  - **Botão redondo = o X.** É um botão só, o círculo Ø43 de contorno 1 px `#d8d8d8` com o X de ~8 px, no canto superior direito do palco (decupagem, Parte 1, "Modo foco"), alinhado ao cabeçalho. No hover o contorno escurece e o X gira 45° em ~0,1 s (Parte 2, seção 8). Não há segundo botão: o círculo preto com seta do canto esquerdo é da gravação e não entra. Fechar pelo X, pelo Esc ou pelo link "Looks" faz a mesma volta da Parte 2, seção 8, e a fila volta ao mesmo estado (mesmo centro, mesmas vagas, painel igual). O autoplay fica pausado, como no vídeo.
  - **Cabeçalho do foco:** o "look 01 / nome" da referência vira "01 DE 08" + nome do look, pela tabela de "Textos" ("LOOK" não entra traduzido).
  - **Crescimento sem medir o DOM:** o modelo do centro vai da vaga 0 para escala 1,205 com os pés em 94 % H pelo laço da fila, que interpola o transform de origem e o de destino (o mesmo efeito de um FLIP, mas sem ler layout), com a sombra achatada na altura. A camada dos pinos acompanha a mesma conta.
  - **Inverso do pino também no toque e no teclado:** além do hover, tocar numa linha do painel ou chegar nela pelo Tab (no "+") acende o pino da peça, no foco.
  - **Foco de teclado:** abrir pelo Enter leva o foco ao X, e o Tab segue para os pinos 1, 2 e 3 (cada um ativa ao receber o foco). Fechar devolve o foco ao modelo do centro. O cabeçalho fica `visibility: visible` já em 0, ainda transparente, para o X poder receber o foco antes do fade.
  - **Pinos conferidos de novo nesta construção** (print do foco dos oito looks em 1456 × 840, cada pino ativo): todos na peça certa, sem mão por cima, e nenhuma etiqueta cobre rosto. Nenhum número mudou.
- **Selo "CHEGOU" no pé da foto da peça, não no canto de cima:** com seis letras (o do vídeo tem três), no topo ele encostava no número da linha.
- **Estrutura em `--u` (2026-11-07):** painel, respiro, margens, linhas, foto da linha, botão, fecho, trilho, setas, play e X do foco usam `--u: min(1px, 100vw / 1440)`, e não o `--su` dos textos. Em 1098 × 624 a tela é a do vídeo reduzida: palco 838 e painel 260 (vídeo 838 e 259), eixo do centro em 419, ±1 em 174 e 664, título e logo em x 40, trilho em x 75 com ativo 131 e inativo 30,5, margem da sacola 32, X centrado em 798,5, pausa em 748, linhas de 104 com fios em 122, 227, 331 e 434. Em 1440 nada muda. No celular `--u` é o `--su` de 390. Os textos continuam em `--su`, com o piso de 12 px.
- **Fecho em 1098:** frase do fecho "Junto sai mais barato" (era "Junto sai mais em conta", que quebrava em duas linhas ao lado dos preços em 216 px); preço do conjunto em 18 `--u` (13,7 px em 1098, 18 em 1440); preços empilhados mais juntos. O bloco do fecho mede 113 da base em 1098 (vídeo 105) e 144 em 1440 × 818 (vídeo 138); os 8 px que sobram são o texto em 12 px, contra 7,5 a 8,9 no vídeo. Vão elástico de 76 em 1098 (78) e 105 em 1440 × 818 (102). Abaixo de 1098 a frase pode quebrar, e o vão absorve.
- **Foco e fila não andam juntos (2026-11-07):** no vídeo o foco só abre com a fila parada. Trocar de look com o foco aberto (links Moletom, Jeans e Tênis, seta do teclado) fecha o foco, e a fila sai do lugar quando o fechamento passou de 55 % (vizinhos já de volta); os links reabrem o foco no look novo quando a fila assenta, e só então o cabeçalho e os pinos passam para ele. Clique no centro no meio de uma troca (ou logo depois do autoplay) abre o foco quando a fila para. Por segurança, o peso do foco cai com a distância ao centro (1 na vaga 0, 0 a meia vaga), e nenhum caso troca o modelo do centro seco.
- **Trilho com o foco aberto:** setas, segmentos e play não respondem, e o trilho perde o clique na hora em que o foco abre, sem esperar o fade de 0,3 s.
- **Enter abre o foco de qualquer lugar fora de um controle**, e o foco de teclado vai ao X sem que a mesma tecla o feche.
- **Foco de teclado no painel pausa o autoplay:** Tab até um "+" ou até o botão pausa, como o clique; senão, a cada 5 s, o "+" em que a pessoa parou viraria o de outra peça. O redesenho do painel (troca de look, sacola) devolve o foco ao botão equivalente: o "+" da mesma linha; na sacola, o "−" do mesmo item, ou o que ficou no lugar dele, ou o de cima, ou o X da sacola quando ela esvazia.
- **Autoplay conta a partir da entrada da tela**, não do carregamento: com imagens lentas, o primeiro look fica os 5 s inteiros à vista. O teto de 3 s da entrada continua (passou dele, a tela aparece mesmo sem as imagens, e o autoplay começa ali).
- **Troca de segmento:** o preto do segmento antigo passa ao cinza de visitado por transição (`#202020` → `#969696` em ~0,4 s a partir de +0,03, sem passar pelo `#e2e2e2`).
- **Cursor:** sem pointermove por 60 ms, o ponteiro conta como parado e a bolha começa ~0,1 s depois de parar, a qualquer velocidade; o rótulo fica legível ~0,33 s depois (o morph de CSS não mudou).
- **Comparações com o vídeo fora da template:** os quadros lado a lado e sobrepostos (que mostram a tela da referência) e as medidas ficam em `referencias/provador-lookbook/comparacao-prega/`. Nada do vídeo fica em `templates/prega/`.

## Respondido (2026-11-05)

- **Nome:** Prega aprovado; pasta, slug e `usada-em` em `prega`.
- **Looks:** aprovados como estão na tabela, na distância atual do vídeo.
- **Uma referência só**, recriada de perto: aprovada junto com o workflow.
- **Escopo:** "somente esta seção" limita a página, não o processo: a entrega e o teste do prompt continuam no plano, depois da tela aprovada.

## Cenários de São Paulo (2026-11-09)

Pedido do usuário: um seletor no formato das glass-spheres do `glass-portfolio-v1`, no vão do trilho entre os segmentos e o play, que troca o fundo do palco por cenas ultra-realistas de São Paulo (rua, grafite e pichação, com luxo de contraste).

- **Fotos:** Higgsfield, GPT Image 2.6 (o mesmo modelo do elenco), `quality max`, 4K, 3:2 (3504 × 2336), 15 créditos cada. O 3:2 fica no meio da faixa de proporção do palco no desktop (1,33 em 1440 × 900 a 1,62 em 2560 × 1440); no celular só a faixa do meio aparece. Aprovadas pelo usuário uma a uma: 01 beco na Vila Madalena, 02 baixo do Minhocão, 03 loja de porta de aço (a partir de uma referência que ele mandou, sem o letreiro da marca original), 04 cobertura nos Jardins. Fontes, prompts e a v1 do beco (Nano Banana Pro, descartada porque escreveu "PIXO" legível) em `fonte/cenarios/`. Gasto: 4 + 4 × 15 = 64 créditos.
- **Exportação:** `node templates/prega/fonte/cenarios/exporta.mjs` (da raiz) gera `public/cenarios/<id>-1280|1920|2880.webp` e a textura da esfera `<id>-esfera.webp` (384 px, quadrado do meio).
- **Código:** `src/data/cenarios.js` (lista), `src/secoes/cenarios.js` (seletor e pilha de fundos), `src/motion/vidro.js` (ótica das glass-spheres portada para WebGL puro, só a passada nítida: lente hemisférica, dispersão na borda, fresnel, reflexo e aro; hover aumenta a esfera e abre a lente), `src/styles/cenarios.css`. Estado `cenario` (índice ou `null` = estúdio branco). Clicar na esfera ativa volta ao branco. Trocar o cenário não pausa o autoplay. A foto só baixa no hover ou no clique e só aparece decodificada (fade cruzado de 0,7 s). Com foto atrás, título, frase, trilho e cabeçalho do foco ficam brancos, e um véu escurece o alto e o pé do palco. Sem WebGL, a foto aparece num círculo.
- **Celular:** as esferas viram uma coluna na borda direita, acima do trilho, sobre o modelo desfocado da vaga +1 (na linha acima do trilho cobriam os pés do modelo do centro).
- **Logo:** o Swoosh desenhado à mão foi trocado pelo SVG oficial que o usuário mandou (`fonte/nike.svg`), na nav e no favicon.
- **Ajuste (2026-11-09):** esferas maiores (56 de design no desktop, 40 no celular); a selecionada cresce 22 % sobre as vizinhas (scale no botão, que o vidro lê) e ganha o anel.
- **Olho de peixe (2026-11-09):** pedido do usuário, "fish eye na câmera do site". `src/motion/camera.js` envolve fundo e fila num `.camera` com um filtro SVG (`feDisplacementMap`) cujo mapa é gerado no tamanho do palco: amostra a cena mais longe do centro em proporção a r² (força 0,16 da meia-diagonal nos cantos). O centro fica quase 1:1, então pinos e área de clique do modelo do meio não saem do lugar; bordas comprimem e curvam. Título, trilho, esferas e cabeçalho do foco ficam fora da lente. O fundo passa 12–14 % da borda para a lente ter cena nos cantos, e uma vinheta de lente entra com o cenário. 60 fps na troca de look (Chromium com GPU, desktop e celular). **Safari/iOS:** o WebKit conta o `feImage` e a região do filtro a partir da página, não do elemento; o código detecta WebKit e compensa (mapa na posição do palco, região larga). Conferido no WebKit do Playwright, desktop e iPhone 13; falta conferir num iPhone de verdade.
- **Integração modelo × cena (2026-11-09):** pedido do usuário, sem gerar nada novo. Valores por cenário em `src/data/cenarios.js` (`modelo`, `luz`, `reflexo`, `contato`), aplicados em `cenarios.css` ("Integração"): filtro de cor nos recortes (tira a luz branca de estúdio), camada `.luz` em `soft-light` dentro da câmera sobre fundo e modelos (cor e direção das luzes de cada cena; passa da borda como o fundo, senão a lente mostra a borda dela), sombra de contato sob os pés, reflexo no chão molhado (`-webkit-box-reflect` espelhado na linha da sola: Minhocão, loja, cobertura), grão de filme único por cima e profundidade de campo **embutida nos WebP** (`exporta.mjs`, sigma pelo `desfoque` de cada cena): `filter: blur` dentro da lente fazia o Safari cortar a foto. `?integracao=0` na URL desliga tudo, para comparar.
- **Safari, região do filtro:** uma região de 3 palcos (tentativa anterior) passa do limite de filtro do WebKit no iPhone (tela 3x) e o palco some; a região agora é justa (folga do deslocamento máximo), posta na posição do palco na página. Conferido no WebKit do Playwright, desktop e iPhone 13.
- **Intro 3D (2026-11-09):** pedido do usuário: o Swoosh gira em loop no carregamento, cresce e atravessa a tela, em Three.js (`three` 0.186.1). `src/motion/intro.js` (leve, no bundle principal: cobertura, sem WebGL / movimento reduzido / `?intro=0` só some quando a tela carrega) e `src/motion/intro-3d.js` (pedaço à parte, 157 KB gzip). Swoosh do `marca.logo.d` extrudado com chanfro, preto com verniz, num estúdio escuro de três softboxes feito em código (o `RoomEnvironment` deixava o preto cinza de frente). Roteiro refeito no mesmo dia (usuário: "menos voltas, mais fluido, mais natural"; a primeira versão tinha 7 fases em 1 s e giro de quase 3 voltas por segundo, com fantasmas do rastro): **uma volta** de 0,85 s numa curva de partida firme e freio longo (`cubic-bezier(0.5, 0, 0.15, 1)`), terminando de frente e parada; se a tela ainda carrega, outra volta igual (o loop). A travessia (0,6 s) começa nos últimos 22 % da volta, com um respiro para trás, e cresce em escala exponencial mirando o vão entre gancho e corpo, para o logo passar em volta da câmera. O site entra quando o logo passa da largura da tela. Rastro leve, só no pico do giro e no fim da travessia. ~1,15 s de 3D com a tela carregada. Conferido no Chromium (desktop e celular, 60 fps) e no WebKit (desktop e iPhone 13).
- **Esferas flutuando (2026-11-09):** cada esfera num laço curto (cima, lado, baixo, lado; ±6 % do diâmetro), com ritmo de 3,1 a 4,2 s e fase própria (`--i`), pela propriedade `translate` (separada do `transform` que aumenta a selecionada); a foto gira devagar dentro do vidro (±0,16 rad). Movimento reduzido: paradas. Correção junto: o palco marcava a cena em `data-cenario`, o mesmo atributo dos botões; com cena ativa, clicar no palco deixava de pausar o autoplay. Agora é `data-fundo`. Testes com Playwright precisam de `click(..., { force: true })` nas esferas (elas nunca ficam "estáveis").

## Loja abaixo do provador (2026-11-09)

**Pedido do usuário:** implementar o resto da página como e-commerce, a partir da segunda seção de uma gravação de referência (`referencias/halden`, loja de móveis vermelha e creme), com as imagens geradas no Higgsfield e a identidade toda da Nike e do provador. Isso desfaz o "sem outras seções e sem rodapé" do escopo de 2026-11-05: o provador continua sendo a primeira tela, e a página agora rola.

**O que veio da referência (da segunda seção para baixo), recriado de perto com outra marca, outros textos e outras fotos:** manifesto em bloco de cor que acende letra a letra, lista de categorias com faixa de borda a borda e duas fotos inclinadas, grade de quatro cards em cortina, foto larga com pílulas nas peças e paginação, rodapé com newsletter, colunas e a marca gigante. Notas e tags em `referencias/halden/notas.md`; nada da gravação (texto, foto, móvel) entrou na template.

**Identidade:** o vermelho `#dd0016` da referência virou o preto da Nike (`--escuro: #111`) no manifesto, na faixa e no rodapé; o creme virou o branco da página; a serifa condensada virou a Anton em caixa alta (títulos, manifesto, lista) e a Inter no resto; botões, chips e etiquetas em pílula; o nome da marca no começo do manifesto e no pé do rodapé é o Swoosh. Tokens novos no fim de `src/styles/tokens.css`.

### As seções

| Seção | Arquivos | O que faz |
|---|---|---|
| Manifesto | `secoes/manifesto.js`, `styles/manifesto.css` | Bloco preto de 1,75 tela (1,65 no celular), palco preso abaixo da nav (`data-cena`). O texto acende letra a letra pela rolagem (`motion/rolagem.js`), com borda suave de 9 letras, pela cor (sem opacity nem filter); Swoosh, bola de várzea, bola de basquete e Air Force 1 entram no meio da frase quando a leitura chega neles. "O próprio campo" sublinhado. |
| Categorias | `secoes/categorias.js`, `styles/categorias.css` | "(01) — Categorias" e frase, fio, e a lista em Anton 56 (40 no celular) com a contagem sobrescrita. A faixa preta é uma segunda cópia da lista, em branco, recortada por `clip-path` no retângulo da faixa: a letra que passa por ela fica branca no ponto exato. Entrada: itens de cima para baixo, faixa nascendo com 30 % da largura e esticando até as bordas, fotos subindo. Mouse num item leva a faixa e troca as fotos (fade cruzado); clique filtra a vitrine e desce até ela. |
| Vitrine | `secoes/vitrine.js`, `styles/vitrine.css` | "Pronto pro rolê", chips das 8 categorias com contagem, "1–4 de N" e setas; quatro cards 4:5 por página (2 × 2 no celular, onde o arraste para o lado também vira a página). Card: número, "+" que vai para a mesma sacola do provador, nome, categoria · look, etiqueta de prazo ou selo, preço. A foto leva ao provador com a peça aberta no corpo ("Ver no look"). Entrada e troca de página ou filtro: cortina de cima para baixo, card a card. |
| Fora do provador | `secoes/rua.js`, `styles/rua.css`, `data/rua.js` | Quatro fotos de rua 21:9 (4:5 recortado em volta do modelo no celular), uma por vez, com legenda e "01 / 04 ← →". Pílulas de vidro presas às três peças do look, posicionadas pela conta do `object-fit: cover`; a pílula vira de lado se não cabe. No celular viram só o ponto com halo: o primeiro toque abre nome e preço, o segundo põe na sacola. Entrada: a foto abre de uma tira horizontal e assenta de um zoom de 6 %, as pílulas entram uma a uma. |
| Rodapé | `secoes/rodape.js`, `styles/rodape.css` | Bloco preto: "Par novo? Você sabe antes." (letras fora de ordem), campo de e-mail em pílula com validação e aviso (sem envio de verdade), três colunas de links sem destino, linha legal, "Voltar ao topo" e o Swoosh na largura do conteúdo, cortado em 84 % pela base da página, desenhando-se da ponta grossa ao rabo. |

Peças comuns: `styles/loja.css` (miolo de até 1200, cabeçalho com fio que se desenha, letras), `motion/revela.js` (entrada única por IntersectionObserver, depois da intro), `motion/letras.js` (palavra e letra em span, título fora de ordem com sorteio de semente fixa), `motion/tema-nav.js` (nav preta sobre manifesto e rodapé, fio quando rolou).

### Dados

- A loja vende as mesmas 24 peças que os oito modelos vestem. `src/data/loja.js` só organiza: categorias (Tudo, Tênis, Botas, Moletons, Jaquetas, Camisetas, Calças, Bermudas: 5 + 3 + 3 + 2 + 3 + 5 + 3 = 24), a ordem da vitrine em "Tudo", a etiqueta de cada card e as duas fotos da faixa de cada categoria. Nome, preço e foto continuam em `looks.js`.
- Estado novo: `categoria` em `estado.js` (faixa e vitrine assinam; abre em Tênis).
- Textos novos em `marca.loja` (`data/marca.js`).

### Integração com o provador

- Mesma sacola: o "+" da vitrine e as pílulas usam `adicionarPeca(look, n)`; a sacola da nav dá um pulo quando entra peça.
- A nav fica fixa sobre a página inteira. Links, logo e sacola agem no provador, então com a página rolada ela volta ao topo antes (`subirAoProvador`, `secoes/nav.js`). No celular, a linha de links recolhe enquanto o provador está fora da tela.
- Provador fora da tela: o autoplay congela no ponto em que está (não conta como pausa) e volta ao voltar; setas e Enter ficam para a página; clique na loja não pausa o autoplay.
- `.tela` saiu de `position: fixed` e está no fluxo (altura `100svh` menos a nav); no celular ela corta o que passa (`overflow: hidden`), senão a folha "Compre o look" fechada aparecia por cima do manifesto.
- A página sempre abre no provador (`history.scrollRestoration = 'manual'`).

### Imagens (Higgsfield, GPT Image 2.6)

| Imagem | Config | Créditos |
|---|---|---:|
| 4 fotos de rua em `fonte/rua/`: várzea (look 03), garrafão (04), último busão (02), laje (05). Referência: o modelo de estúdio do look (`fonte/nike/<NN>/modelo-gpt-image-2-6.png`) | 21:9, 4k (3840 × 1648), quality max | 4 × 15 |
| 3 recortes do manifesto em `fonte/manifesto/`: bola de futebol, bola de basquete, Air Force 1 Low (com a foto de peça do 08 como referência) | 1:1, 2k, quality high, fundo transparente | 3 × 2,75 |
| **Total** | saldo de 1479,82 para 1411,57 | **68,25** |

Uma geração por imagem, todas aproveitadas. Prompts em `*.prompt.txt`, jobs em `*.job.json`. As fotos de peça dos cards e da faixa são as do elenco (sem crédito novo). Exportação: `node templates/prega/fonte/loja/exporta.mjs` (da raiz) gera `public/loja/`: cards 4:5 em 720 × 900 com o fundo levado a `#f5f5f5` (calçado multiplicado sobre ele, sem a margem branca), calçado também em 3:2, fotos de rua em 1280/1920/2880 + recorte retrato 900 × 1125, recortes do manifesto com alfa em 300 de altura.

**Ressalva:** na foto da várzea o gorro azul ganhou um Swoosh branco pequeno que o modelo de estúdio não tem. Não aponta para peça à venda, então ficou.

### Decidido sem aprovação

- **Vermelho da referência → preto, não uma cor de destaque nova:** o provador não tem cor de interface (a cor vem da roupa), e preto e branco é a Nike. O Volt e o laranja ficaram de fora para não competir com as fotos.
- **Swoosh no lugar do nome da marca**, no começo do manifesto e no pé do rodapé (a referência espaça o nome em letras); sem "Just Do It", pelo mesmo motivo da seção "Marca Nike".
- **Textos escritos do zero**, com os nomes dos looks (várzea, garrafão, último busão, laje, rolê) amarrando o manifesto, a vitrine e as fotos ao provador.
- **Vitrine em páginas de quatro, não fileira rolável:** `tools/escala.mjs` conta os cards fora da tela como largura de conteúdo (1618 px), e a referência também mostra quatro numa linha. A cortina roda a cada página.
- **Miolo de 1200** (a régua aceita até 1280; `docs/escala.md` recomenda 1200) e zoom de entrada da foto de rua de no máximo 6 %: a foto ampliada no meio da entrada contava 1340 px.
- **Manifesto preso à tela** (a referência só passa rolando): presa, a frase acende com o bloco parado no meio da tela, e a seção vira `data-cena`, como a régua pede para texto desse tamanho.
- **Linha legal "© 2026 Nike · Conceito de loja, fora do ar":** a página usa a marca real e não vai ao ar; a linha deixa isso escrito na própria página.
- **Newsletter e links do rodapé sem destino:** validam o e-mail e mostram o aviso, sem envio.

### Conferido

- `node tools/escala.mjs`: "Tudo na escala de site" (desktop e celular).
- Interações (script Playwright): faixa no mouse e volta ao sair; clique filtra e desce; chips, páginas e setas; "+" do card e da pílula somam na sacola; paginação das fotos; newsletter; nav escura sobre o rodapé; setas do teclado fora do provador não trocam o look; "Ver no look" sobe e abre o foco na peça (look 07, pino 1); sacola da nav a partir da loja sobe e abre a sacola. Sem erro no console.

### Celular

- **Composição:** manifesto em 34 px, preso por 0,65 tela; categorias em 40 px com as molduras menores nas pontas da faixa; vitrine 2 × 2 com chips numa linha que rola de borda a borda e setas embaixo; foto de rua 4:5 com pontos, legenda e setas embaixo da foto (por cima, cobriam o ponto do calçado); rodapé empilhado, colunas em 2.
- **`tools/celular.mjs --webkit` (build, CPU 4×): nenhuma falha.** Thread ocupada 3 % devagar e 4 % rápido, 0 puxões; 2,1 MB ao abrir e 2,2 MB depois de rolar tudo; LCP 1,3 s; 147 MB de imagens decodificadas presas (os recortes do provador). Folhas do Chromium e do WebKit conferidas tela por tela.
- **Alvos de toque:** a primeira passada achou 25 controles da loja abaixo de 40 px (chips de 38, "+" dos cards de 32 no celular, links do rodapé de 28, "Voltar ao topo" de 16). Agora chips e "+" têm 40, e os links do rodapé 40 de altura e 44 de largura mínima. **O aviso que ficou (14)** é do provador e da nav, de antes da loja: segmentos do trilho de 15 × 41, setas, play e "+" do painel de 36, links da nav de 38 de altura.
- **Só o iPhone de verdade confirma:** o manifesto preso com a barra do Safari sumindo e voltando; o `backdrop-filter` das pílulas (o WebKit headless não desenha); o arraste da vitrine para o lado sem brigar com a rolagem vertical.

## Cristo no lugar do beco (2026-11-09)

- Pedido do usuário: trocar "Beco, Vila Madalena" por uma vista do Cristo Redentor, com os modelos pisando no mesmo chão da foto.
- Higgsfield, GPT Image 2.6, 4K 3:2, `quality max`, duas variações (30 créditos, saldo 1355,32 → 1325,32). Prompt e as duas em `fonte/cenarios/05-cristo-*`; ficou a A (Cristo maior, parapeito limpo). Mesma câmera das outras cenas (olho a 1,6 m, 35 mm, horizonte a 45 %), com o chão de pedra portuguesa plano até a base da foto, para o pé dos modelos cair no piso; sol baixo atrás da câmera, luz de frente como a do estúdio.
- `src/data/cenarios.js`: `cristo` no lugar de `beco` (primeira esfera), `foco: 74% 50%` para o Cristo entrar na faixa do meio no celular. Os WebP do beco saíram de `public/`; a fonte continua em `fonte/cenarios/`.
- Uso comercial da imagem do Cristo Redentor depende de autorização da Arquidiocese do Rio; aqui vale o mesmo que a marca Nike: conceito fora do ar.

## Cena nítida e acabamento da página (2026-11-09)

Dois pedidos do usuário no mesmo dia: a primeira seção com cenário estava "borrada e triste", e a página inteira pedia um passe de acabamento (animações, estados, rolagem, celular) para ficar com cara de e-commerce profissional. Nenhuma imagem nova foi gerada.

### Parte 1: cenários nítidos e vivos

Diagnóstico (medido na cena do Cristo, desktop 2x): a lente olho de peixe não tira nitidez do modelo e ficou como está. O que pesava: a foto exportada já desfocada (sigma 2–2,5), o grão a 35 %, o filtro do modelo com `brightness` abaixo de 1 e `sepia`, e três escurecimentos somados (véu, vinheta, faixa escura da camada `luz`).

| O quê | Antes | Agora | Onde |
|---|---|---|---|
| Desfoque embutido na foto | 2 (2,5 na cobertura) | 0,75 (0,9 na cobertura) | `fonte/cenarios/exporta.mjs` |
| Presença da foto | nada | contraste local (máscara de nitidez de raio largo, força 0,35), saturação +8 %, brilho +4 %, contraste +5 % | idem |
| WebP | q80 | q80 (q85 testado: 2880w passava de 520 KB, sem diferença visível em 2x) | idem |
| Grão | 0,35 | 0,10 | `--grao`, `styles/cenarios.css` |
| Vinheta | 0,38 nos cantos | 0,20 | `--vinheta-forca` |
| Véu | faixa de 50 % em cima e 55 % embaixo, até 40 % e 31 % da altura | mancha de 30 % só atrás do título, fio de 14 % no alto (X do foco) e faixa de 30 % até 25 % atrás do trilho; no celular, faixa de 30 % em cima | `--veu` |
| Camada `luz` | luzes da cena + faixa que escurecia o pé (35 a 55 %) | só as luzes da cena, na mesma força | `data/cenarios.js` |
| Filtro do modelo | `brightness(0.76–0.97)` + `sepia(0.12–0.28)` | dia (Cristo, cobertura): `brightness(1.02–1.03) contrast(1.04–1.05) saturate(1.05–1.06) sepia(0.04–0.05)`; noite: Minhocão `brightness(0.92) … sepia(0.1)`, loja `brightness(0.9) … hue-rotate(-3deg)` | idem |
| Texto sobre a cena | branco a 78–82 %, sombra larga de 25 % | branco a 90–94 % e um halo curto colado na letra (frase, rótulos do trilho e do foco); setas, play e X com o mesmo halo no traço | `styles/cenarios.css` |

- **O grão clareava, não escurecia:** medido isolado, o grão a 35 % em `overlay` somava ~8 % de luma no palco (133 → 140,6 no meio da cena do Cristo). Era a névoa que sujava o moletom branco. Sem ele a foto ficaria ~5 % mais escura no meio do palco; por isso o +4 % de brilho na exportação e o `brightness` logo acima de 1 nos modelos de dia.
- **Brilho do palco inteiro (luma média, desktop 2x):** Cristo 140,4 → 147,2 (+4,8 %), Minhocão 107,2 → 114,2 (+6,5 %), loja 88,7 → 93,2 (+5,1 %), cobertura 135,9 → 143,3 (+5,5 %). Saturação média +2 a +11 %.
- **Peso (1280 / 1920 / 2880w):** Cristo 159 / 300 / 441 KB (eram 52 / 92 / 141), Minhocão 127 / 237 / 351, loja 150 / 287 / 419, cobertura 78 / 125 / 209. Foto nítida comprime pior; Cristo e loja passam dos ~350 KB que eu queria no 2880w. Ficou assim porque a foto só baixa no hover ou no clique da esfera, uma por vez, e baixar o desfoque era o pedido. Para cortar: q78 com desfoque 0,8 dá ~380 KB no Cristo.
- **Contraste do texto branco na cena mais clara (Cristo), razão medida na caixa do texto com o halo:** título 4,1:1 no desktop e 3,8:1 no celular (texto grande pede 3:1); frase de apoio 3,2:1 (era 2,3:1 no desktop e 3,1:1 no celular com o véu antigo). A frase continua abaixo de 4,5:1 no céu do Cristo: para chegar lá o véu teria de passar de 55 %, que é o que deixava a cena triste. Nas outras três cenas a frase fica entre 4,4:1 e 17:1.
- **`?ajuste=antes`** (ao lado do `?integracao=0`): volta fotos, filtros, véu, vinheta, grão e cores de texto de antes. Conferido contra prints tirados antes de mexer: diferença média de 0,01 a 0,03 por canal (0–255). As fotos antigas saem da mesma exportação, em `public/cenarios/antes/` (1,0 MB, só baixam com a chave). **Chave e pasta saem juntas quando a comparação não for mais útil.**
- Conferido no WebKit do Playwright (desktop e iPhone 13): lente, halo do texto e cores iguais ao Chromium.

### Parte 2: acabamento da página

**Defeitos que apareciam no uso:**

- **Celular: a folha "Compre o look" passava por cima da nav** enquanto o provador saía rolando (o Swoosh sumia por ~0,5 s). A folha tem `z-index: 30` e a `.tela` não era contexto de empilhamento. `.tela { z-index: 0 }` (`styles/base.css`).
- **Desktop: a bolha "ANDA" do cursor ficava parada sobre a loja inteira** quando a página rolava sem o mouse andar. O cursor agora reavalia a zona na rolagem, um teste por quadro e só com o palco na tela (`motion/cursor.js`).
- **Vitrine: cada troca de página ou de filtro repetia a cortina da entrada** (0,95 s na curva de começo lento): ~0,5 s de vitrine vazia e 1,6 s até o preço do último card, com a foto pipocando depois. Agora a página antiga sai em 0,16 s enquanto as fotos da nova decodificam (teto de 0,42 s), e a nova abre em 0,55 s saindo rápido, 45 ms entre cards; a página seguinte fica decodificada de antemão. A cortina longa continua só na primeira entrada, pela rolagem (`secoes/vitrine.js`, `styles/vitrine.css`, classe `.is-troca`).
- **Categorias entravam tarde:** a lista só aparecia com 45 % dela na tela (cabeçalho à vista e um vazio embaixo). Agora com 16 % (`secoes/categorias.js`).
- **Sacola abria seca:** entrada curta ao abrir (itens sobem 8 px em fade, 45 ms entre eles; total em fade). A volta ao look já tinha a cascata (`motion/cascata.js`, `entradaSacola`).
- **Newsletter:** o sucesso só mudava o texto do aviso. Agora a seta do botão vira ✓, a borda clareia e o aviso fica branco; o erro some ao digitar; `aria-invalid` e `aria-describedby` no campo (`secoes/rodape.js`, `styles/rodape.css`).

**Consistência (tokens novos em `styles/tokens.css`):**

- `--t-hover` (0,2 s, `--c-suave`) e `--t-toque` (0,14 s) no lugar das transições soltas de 0,2 a 0,25 s na curva padrão do navegador.
- **Todo botão cede ao aperto** (`scale` 0,94 nos redondos, 0,98 nos largos, só composição; vale no toque): botão do painel, chips, setas, "+", pílulas das fotos, X do foco, sacola da nav, esferas (o vidro acompanha), "Assinar".
- **Botões só de ícone ganharam hover** (`.icone-redondo`, `styles/base.css`): disco de 9 % da cor do traço, que vale no estúdio branco, sobre a cena e no escuro. Setas e play do trilho, "+" e "−" do painel e X da sacola não tinham estado nenhum. No toque, a área clicável deles passa de 36 a 44 px por um `::after`.
- Seta que anda um passo no hover ("Adicionar o look", "Assinar", "Voltar ao topo"); segmento do trilho escurece a barra no hover; link da nav sublinha também no foco de teclado; sacola da nav com hover.
- **Anel de foco de 2 px** (era 1 px) na página inteira; branco sobre foto e sobre preto.
- **"Ir para a loja":** link de pular, só visível no primeiro Tab, que desce até a vitrine e põe o foco no primeiro filtro (`index.html`, `main.js`). Não muda o endereço, para um recarregar não abrir a página no meio.

**Desempenho na rolagem:**

- O laço das esferas de vidro pedia um quadro para sempre, mesmo fora da tela, e as quatro flutuações em CSS continuavam rodando: recálculo de estilo a cada quadro durante a loja inteira. O laço agora dorme fora da tela e com a aba oculta, e a flutuação pausa (`motion/vidro.js`, `.tela.is-fora`). Perfil por trecho (celular emulado, CPU 4×): recálculo de estilo de 3,6 % para 1,8 % do tempo na página inteira, e de 3–5 % para ~0,8 % do fim da vitrine ao rodapé. As duas passadas foram com a máquina em cargas diferentes (ver abaixo), então o número é indicativo; o que não depende da carga é que o laço deixou de pedir quadro com o provador fora da tela.

**O que não mudou, e por quê:**

- **Fila, troca de look, foco, pinos, cascata do painel e intro 3D:** são a recriação medida da referência (tempos da decupagem) e o roteiro da intro foi acertado com o usuário. Só ganharam os estados de hover e aperto.
- **Modelos das vagas laterais desfocados sobre a cena nítida:** é o desfoque da própria fila (profundidade do carrossel), não da cena.
- **Segmentos do trilho no celular (15 × 41) e links da nav (38 de altura):** não há largura para 40 sem redesenhar o trilho; continuam no aviso.
- **Nenhuma seção nova.** Falta à primeira tela um sinal de que a página continua para baixo (o provador ocupa 100 % da altura); não inventei um, fica como sugestão.

### Conferido

- `npx vite build`: passa. `node tools/escala.mjs`: "Tudo na escala de site" (desktop e celular).
- `tools/celular.mjs --webkit` no build (CPU 4×): **nenhuma falha.** Thread ocupada 5 % devagar e 5 % rápido (estilo+layout 1 %), 0 puxões; 2,0 MB ao abrir e depois de rolar tudo; LCP 1,25 s; 149 MB de imagens decodificadas presas (eram 147: os recortes do provador). A máquina estava carregada durante as medições (carga média de 11 a 32): antes da correção do laço do vidro, as mesmas passadas davam 8–16 % e 18–20 %. **Aviso que ficou (14 alvos < 40 px):** os de antes (segmentos do trilho 15 × 41, seta 36, links da nav); o tool mede a caixa do botão, não o `::after` de 44.
- Teste funcional por script (desktop e celular, no dev e no build): 33 conferências no desktop e 35 no celular, todas ok. Carrossel (seta, segmento, autoplay em 5 s), foco e pinos, "+" e conjunto na sacola, sacola (abrir, tirar, fechar), os 4 cenários e a volta ao estúdio, categoria que filtra e desce, chips, páginas da vitrine, "+" do card, paginação e pílulas das fotos (no celular, primeiro toque abre e segundo soma), newsletter (erro e sucesso), nav escura sobre o rodapé, "Ver no look" (sobe e abre o foco na peça), sem rolagem para o lado, sem erro no console.
- Movimento reduzido: página inteira visível, cenário e vitrine trocam sem animação, sem erro.

### Só o iPhone de verdade confirma

- A nitidez da cena numa tela 3x: a foto de 2880 px aparece ampliada ~1,45× (o palco do celular pede ~4200 px de largura); no emulador está boa.
- O halo do texto e o `drop-shadow` das setas sobre a cena no Safari (no WebKit do Playwright estão iguais ao Chromium).
- A folha "Compre o look" passando por baixo da nav com a barra do Safari sumindo e voltando.
- O aperto dos botões (`:active`) no toque: o Safari só mostra depois de ~50 ms de dedo parado.
- Continuam da lista anterior: a lente olho de peixe, o manifesto preso, o `backdrop-filter` das pílulas e o arraste da vitrine para o lado.

## Sem cenários (2026-11-10)

- Pedido do usuário: tirar a troca de fundo e as esferas de vidro. O provador volta ao estúdio branco.
- Saíram `src/secoes/cenarios.js`, `src/motion/vidro.js`, `src/data/cenarios.js`, `src/styles/cenarios.css` (integração modelo × cena, véu, vinheta, grão, `?integracao=0`, `?ajuste=antes`), `public/cenarios/` e o estado `cenario`. As seções acima sobre cenários, integração, esferas e o ajuste de nitidez ficam como histórico.
- A lente olho de peixe (`src/motion/camera.js`) continua, agora só sobre a fila; o `.camera` passou para `palco.css`.
- Fontes e prompts das fotos continuam em `fonte/cenarios/` (o `exporta.mjs` não tem mais destino em uso).
- Conferido: build, `tools/escala.mjs` sem problemas, teste funcional (desktop e celular) ok, `tools/celular.mjs --webkit` sem FALHA (thread 6 % / 11 %, 1,9 MB ao abrir, LCP 660 ms).

## Arara em 3D (2026-11-10)

A seção "Direto da arara" (entre o manifesto e as categorias: `src/secoes/arara.js`, física em `src/motion/arara.js`) deixou de girar fotos chapadas com `rotateY`: as seis peças agora são malhas de verdade no Three.js, cada uma num cabide de madeira com gancho de arame, penduradas no cano. Virar, balançar e tirar da arara para ver as costas são 3D de fato. Textos, layout, altura das peças (420 px na tela grande, 232 no celular), entrada e todas as interações continuam as mesmas.

**Como as peças foram feitas** (detalhe e comandos em `fonte/arara/3d/LEIAME.md`)

- Forma: Tripo H3.1 (imagem → 3D) pelo `higgsfield`, uma foto de frente por peça. **54 créditos** (6 × 9; teto de 60), saldo 1275,82 → 1221,82. A 01 foi sozinha primeiro, para validar. A 04 (preta) foi sobre fundo branco: o upload achata a transparência em preto.
- Cor: só das fotos de verdade. `fonte/arara/3d/prepara.py` (Blender) projeta a foto de frente e a de costas na malha e assa um atlas; onde nenhuma foto vê (laterais, ombros, dentro do capuz), a cor vem dos pontos de foto vizinhos em 3D, com o grão do tecido e uma luz de cúpula assada da malha de alta. A textura do Tripo ficou de fora (outra cor, sem a luz da foto, costas da camisa amarela sem o 9, costuras e etiquetas inventadas); só em volta do cabide ela serve de mapa para separar madeira de tecido.
- Malha: 1,4 M de triângulos → 30 mil nos moletons e 22 mil nas camisetas (`enxuga.mjs`, meshoptimizer), UV novo, `.glb` com meshopt só de posição, normal e UV. O gancho de arame do Tripo é cortado: o site desenha o dele (tubo cromado que dá a volta no cano), e o cano continua o de CSS, que entra no 3D só como profundidade (a parte de trás do gancho some atrás dele).

**No site**

- `src/motion/arara-3d.js`: um renderer para o cano (canvas atrás dos botões) e um pequeno para o modal (o `<dialog>` fica na camada de cima do navegador). Sem luzes nem sombras do Three: o atlas já tem a luz; o sombreador só clareia a face que olha para a luz e põe um brilho de fibra na borda.
- A física é a mesma e manda nos mesmos x / balanço / abertura. Mudou o que ela precisava para malhas com espessura: cada peça traz a largura que ocupa de lado e de frente; arrastada contra as outras, a peça as aperta só até a espessura de cada uma (antes passavam umas pelas outras); no celular a peça virada vem para a frente das vizinhas (o cano tem a largura da tela) e tem margem própria até a ponta do cano.
- Repouso a 60° na tela grande e 64° no celular (a foto ficava a 72°: com espessura, de lado demais só se via a manga). Profundidade das malhas achatada no cano (0,6 e 0,42): roupa em arara fica apertada.
- Os botões continuam no DOM por cima do canvas, um por peça, com a área de toque acompanhando a peça (centrada no gancho, da largura que ela mostra). Antes as caixas dos cabides se sobrepunham e o mouse podia virar a vizinha. Teclado, tabindex móvel, foco de volta e `<dialog>` iguais; o anel de foco é um elemento à parte.
- Modal: a peça chega no ângulo em que estava, vira de frente, balança e gira para as costas em 3D; o botão dá meia-volta a cada toque e dá para girar arrastando (solta e ela para na face mais próxima). O canvas tem `role="img"` e o rótulo troca entre frente e costas.
- Reserva: sem WebGL, se o contexto não sobe ou se perde, ou com `?arara=2d`, valem as fotos com `rotateY` como antes (a peça cujo modelo não chega fica na foto sozinha). Movimento reduzido: sem entrada nem balanço, e o modal já abre de costas.

**Peso** (só desce quando a seção está a uma tela de distância)

| | Tela grande | Celular |
|---|---|---|
| 6 malhas `.glb` | 1,32 MB | 1,32 MB |
| 6 atlas WebP | 1,27 MB (2048 px) | 0,40 MB (1024 px) |
| Total dos modelos | **2,6 MB** | **1,7 MB** |

Código: `arara-3d` 79 KB (24 KB gzip), mais o Three (603 KB, 152 gzip), que a intro já baixa.

**Desempenho** (build servido, Chromium headless com GPU; celular emulado com CPU 4×)

- Canvas 2912×1144 na tela grande (DPR 2) e 585×492 no celular (DPR 1,5 de 3; teto de 5,5 M de pixels em telas muito largas).
- Entrada e arrasto a 60 qps nos dois (mediana 16,7 ms, p95 16,8); o `render` custa 0,1 ms de CPU na tela grande e 0,5 ms no celular emulado (p95 1,2).
- Parado: 0 desenhos (o laço dorme; o balanço da entrada leva ~9 s para morrer, como já era). Fora da tela: 0 desenhos, mesmo com peça virando.
- `tools/celular.mjs --webkit` sem FALHA: thread ocupada 9–14 % na passada devagar e 13–20 % na rápida (sem o 3D: 11 % e 12 %), 0 puxões, 1,9 MB ao abrir (igual), 4,2 MB depois de rolar tudo (eram 3,0), imagens decodificadas presas 149 MB (igual: cada renderer solta a imagem do atlas depois de subir a textura). O aviso que fica é antigo (alvos de toque do trilho do provador).
- `tools/escala.mjs` sem problemas; teste funcional (provador, loja e a arara em 3D e em 2D, desktop e celular) ok; o 3D e o modal sobem também no WebKit do Playwright.

**Segunda rodada, no mesmo dia** (sem geração nova: zero créditos)

- **Camiseta cinza (06):** a passagem do branco para o cinza nos ombros e no alto das mangas saía borrada. Agora cada ponto que as fotos não veem fica inteiro numa das duas cores da peça: quem decide é a própria foto, projetada reto através da peça (a da frente na metade que olha para a frente, a das costas na outra), com a divisa alisada em 3D onde a malha está inclinada. O recorte do ombro fecha numa linha nítida que cruza o alto da manga e encosta sem degrau no que a foto mostra. Só o atlas mudou (`monta.mjs --mistura 06`). Sobram dentes de 2 a 4 px em alguns trechos da divisa.
- **Moletom mescla (02):** o relevo de costura em babado que o Tripo inventou nas mangas saiu com um alisamento de Taubin só nas mangas (do ombro até antes dos punhos), na malha de alta e na leve. Silhueta lisa; os punhos, o zíper e o capuz não mudam. A malha mudou, então UV e atlas foram refeitos (`monta.mjs --blender 02`).
- **Peça virada no celular:** no cano do celular as peças ficam coladas, e não existe caminho em que uma gire sem atravessar as vizinhas (precisaria sair quase uma altura de peça para fora). A peça virada (ou virando) agora é desenhada de novo depois de todas, com a profundidade zerada: nunca aparece cortada por uma vizinha nem cortando uma. Nos primeiros 22 % do virar essa cópia entra em transparência (e sai assim na volta), para a parte que estava atrás da vizinha não surgir de um quadro para o outro. Vale também na tela grande (a peça sob o mouse fica sempre inteira à vista). Custo: uma ou duas passadas a mais de uma peça só enquanto ela está virada.
- Conferido depois de cada mudança: build, `tools/escala.mjs`, teste funcional tudo ok e `tools/celular.mjs --webkit` sem FALHA (thread 5–8 % na passada devagar e 6–11 % na rápida, 0 puxões, 1,9 MB ao abrir, 149 MB de imagens presas). Entrada e arrasto seguem a 60 qps; parado e fora da tela, 0 desenhos.

**O que a entrega precisa levar** (a `entrega/` desta template ainda não existe; lista para quem for escrever)

- *Arquivos do 3D, em `entrega/arquivos/`* (o cliente nunca depende do Blender nem do Higgsfield):
  - 6 malhas: `public/loja/arara/3d/01-1.glb`, `02-1.glb`, `03-1.glb`, `04-1.glb`, `05-1.glb`, `06-1.glb`;
  - 12 atlas: os mesmos nomes com `-2048.webp` (tela grande) e `-1024.webp` (celular);
  - 12 fotos da reserva em 2D: `public/loja/arara/<chave>-frente.webp` e `<chave>-costas.webp`;
  - `src/data/arara-3d.json` (onde termina o gancho e a caixa de cada malha) e `src/data/arara-fotos.json`.
- *Código da seção:* `src/secoes/arara.js`, `src/motion/arara.js` (física), `src/motion/arara-3d.js` (Three.js), `src/styles/arara.css`, `src/data/arara.js`; dependência `three` 0.186.1 (com o `GLTFLoader` e o decodificador meshopt de `three/addons`).
- *Scripts de fonte* (só para quem for trocar ou refazer uma peça; não entram no prompt): `fonte/arara/3d/LEIAME.md`, `enxuga.mjs`, `prepara.py`, `monta.mjs` e `fonte/arara/exporta.mjs`. Os `.glb` brutos do Tripo e os PNG das fotos não vão (pesados; os brutos se baixam de novo pelos `*-tripo.job.json`).
- *Regras do 3D para o guia* (as que um Claude Code leigo quebra ao personalizar):
  1. O Three só chega por `import()` quando a seção está a uma tela de distância; nunca no bundle inicial.
  2. Um renderer para o cano e um pequeno para o modal; DPR com teto (2 na tela grande, 1,5 no celular).
  3. Desenho sob demanda: nada de `requestAnimationFrame` contínuo. Parado e fora da tela, zero desenhos.
  4. Por quadro só transform e a pose das malhas; nenhuma leitura de layout.
  5. O canvas não muda de tamanho com a barra do navegador (mudança pequena só de altura, no toque, é ignorada).
  6. Os botões continuam no DOM por cima do canvas, um por peça, com a área de toque acompanhando a peça: é o que mantém teclado, leitor de tela e testes.
  7. Sem WebGL, com o contexto perdido ou com um modelo que não chega, valem as fotos; com movimento reduzido, sem entrada nem balanço e o modal já de costas.
  8. O atlas já tem a luz: sem luzes nem sombras do Three. Trocar o material por um `MeshStandardMaterial` escurece e lava tudo.
  9. A peça virada é desenhada por cima das outras (profundidade zerada): tirar isso faz as peças se atravessarem no celular.
  10. Depois de subir a textura, a imagem decodificada é solta (fica só o Blob do WebP): senão são 100 MB presos na tela grande.
  11. Peça nova: `.glb` com posição, normal e UV (meshopt), y para cima, frente em +z, altura 1 com o topo do gancho em y = 0 e x = 0 na haste; atlas em 2048 e 1024; uma linha em `arara-3d.json` (`corte`, `caixa`) e as duas fotos da reserva.
  12. As quatro regras do `/celular` (nada rola para o lado; o script não briga com o dedo; memória de imagens; palco de tamanho estável).

**Só o iPhone de verdade confirma** (lista curta para testar com `npm run dev -- --host`)

1. Com o dedo numa peça, arrastar para o lado desliza a peça e não rola a página; arrastar para cima ou para baixo rola a página normalmente.
2. Tocar numa peça: ela vem para a frente das vizinhas sem piscar nem aparecer cortada. Tocar de novo: sobe para o modal e gira para as costas. No modal, girar com o dedo e fechar.
3. As bordas das roupas no cano: lisas ou serrilhadas? (o canvas roda a 1,5× num aparelho de 3×).
4. Primeira visita no 4G: as fotos aparecem antes e trocam pelo 3D sem pulo; quanto tempo até as seis peças estarem em 3D.
5. Abrir e fechar o modal das seis peças e rolar a página inteira duas vezes: a aba não recarrega sozinha (memória do Safari com os dois contextos WebGL).
6. Com a arara na tela, rolar devagar até a barra do Safari sumir e voltar: o cano e as peças não piscam nem mudam de tamanho.

**Fica em aberto**

- Camiseta cinza (06): a divisa do recorte ficou nítida, mas com dentes de 2 a 4 px em alguns trechos (rugas da malha que olham bem de frente); na lateral do corpo, logo abaixo da manga, o limite entre o cinza e o branco é irregular (nenhuma foto mostra essa região).
- A `entrega/` desta template ainda não existe (a lista do que ela leva está acima).
