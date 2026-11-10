# Modelos 3D da arara

As seis peças da arara (`src/data/arara.js`) em 3D. A forma vem do Tripo H3.1 (imagem → 3D, pelo `higgsfield`); a cor
vem só das fotos de verdade (`../<NN>-frente.png` e `../<NN>-costas.png`), projetadas na malha.

## Pedidos no Higgsfield (2026-11-10)

Modelo `tripo_h3_1_image_to_3d`, uma foto de frente por peça, sem prompt (o modelo não tem). Parâmetros de todos:
`orientation=align_image`, `geometry_quality=standard`, `texture=true`, `texture_quality=standard`, `pbr=true`.
Custo conferido antes com `higgsfield generate cost tripo_h3_1_image_to_3d --image <foto>`: 9 créditos cada.

| Peça | Entrada | Pedido (`<NN>-tripo.job.json`) | Créditos |
|---|---|---|---|
| 01 moletom zip creme | `../01-frente.png` | `282ba620-6d35-4219-b2f9-2d98d332d040` | 9 |
| 02 moletom zip mescla | `../02-frente.png` | `e1321b38-b79f-4d18-9e1c-af9ac54476e8` | 9 |
| 03 camisa amarela 9 | `../03-frente.png` | `75883cd9-e9c0-42da-8081-4b807907eedc` | 9 |
| 04 moletom preto | `04-frente-fundo-branco.png` | `c7ef8a6e-da28-421a-bb20-511c2401b9e0` | 9 |
| 05 camiseta branca Swoosh | `../05-frente.png` | `0de761fa-c1bf-4692-83ae-7918981beec5` | 9 |
| 06 camiseta cinza de recortes | `../06-frente.png` | `79544643-6c8b-4e3f-a8e6-e68f78c58565` | 9 |

Total: **54 créditos** (teto da tarefa: 60). Saldo da conta: 1275,82 antes, 1221,82 depois. Nenhum pedido repetido.

- A 01 foi a primeira, sozinha, para validar a qualidade antes das outras cinco.
- O upload do Higgsfield achata a transparência em **preto**: a 04 (moletom preto) foi mandada sobre fundo branco
  (`04-frente-fundo-branco.png`), senão a peça sumiria no fundo.
- Os modelos de várias vistas (`tripo_h3_1_multiview_to_3d`, mesmo preço) ficaram de fora: o CLI não diz em que
  posição (frente, esquerda, costas, direita) cada imagem entra. As costas entram depois, na textura.
- Mais caros e não usados: `tripo_p2_image_to_3d` 34, `meshy_v7_image_to_3d` 38, `hunyuan3d_v3_image_to_3d` 11.

Os `.glb` brutos (~45 MB cada, 1,4 M de triângulos) ficam em `bruto/`, fora do git. Para baixar de novo:
`curl -o bruto/<NN>-tripo.glb "$(jq -r .result_url <NN>-tripo.job.json)"`.

## Do bruto ao site

```
node templates/prega/fonte/arara/3d/monta.mjs --blender        # as seis: Blender (minutos por peça) + empacotar
node templates/prega/fonte/arara/3d/monta.mjs --blender 03     # só uma
node templates/prega/fonte/arara/3d/monta.mjs                  # só empacotar o que já está em saida/
node tools/blender.mjs templates/prega/fonte/arara/3d/prepara.py -- 03 --mistura   # refaz só o atlas (assados guardados)
```

1. `enxuga.mjs` (Node, segundos): lê o bruto, solda os vértices pela posição e simplifica com o meshoptimizer em
   duas malhas só de posição: `saida/<NN>-alta.glb` (300 mil triângulos, de onde sai a luz) e `saida/<NN>-leve.glb`
   (a do site: 30 mil nos moletons, 22 mil nas camisetas). Guarda também a cor que o Tripo deu a cada vértice
   (`<NN>-tripo-pos.f32` e `<NN>-tripo-cor.u8`). Com o bruto inteiro, o Blender leva minutos e gigabytes por peça.
2. `prepara.py` (Blender 5.2, sem interface): gira as malhas para a frente olhar para +z, corta o gancho de arame
   (o site desenha o dele), abre um UV novo e assa, em 2048 px: luz de cúpula da malha de alta (só a forma),
   visibilidade de frente e de costas, as duas fotos projetadas e a posição de cada texel (fica tudo em
   `saida/<NN>-assados.npz`). Na mistura:
   - a foto vale onde a superfície olha para a câmera dela (até ~75° de inclinação) e não está escondida;
   - o resto (laterais, ombros, dentro do capuz) recebe a cor dos pontos de foto vizinhos em 3D (um volume de cor
     borrado com peso), mais o grão do tecido medido na foto e a luz de cúpula assada;
   - só em volta do cabide, onde madeira e tecido se encostam, a cor do Tripo serve de mapa (madeira ou tecido) e
     uma tabela aprendida nas fotos troca a cor dele pela de verdade.
   A textura do Tripo não entra de outro jeito: ela tem outra cor, não tem a luz da foto e inventa recortes,
   costuras e etiquetas (as costas da camisa amarela vieram sem o 9).
3. `monta.mjs`: `gltf-transform weld` + `meshopt` (posição 14 bits, normal 10, UV 12) e o atlas em WebP 2048
   (tela grande) e 1024 (celular), em `public/loja/arara/3d/`; medidas em `src/data/arara-3d.json`.

`saida/` (intermediários: malhas, atlas em PNG, assados em `.npz`, prints `<NN>-confere-*.png` para olhar a peça de
frente, de lado e de costas) fica fora do git.

No site: `src/motion/arara-3d.js` (Three.js), `src/secoes/arara.js` e `src/data/arara.js`.

## Ajustes por peça (ficam em `AJUSTES`, no `monta.mjs`)

- **06, camiseta cinza de recortes** (`--classes 2 --foto 0.3,0.5`): nos ombros e no alto das mangas nenhuma das
  duas fotos mostra por onde o recorte branco passa, e o campo de cor suave deixava a passagem borrada. Com
  `--classes`, cada ponto sem foto fica inteiro numa das duas cores da peça (k-médias na cor das fotos): quem decide
  é a própria foto, projetada reto através da peça (a da frente na metade que olha para a frente, a das costas na
  outra); no que está inclinado, a divisa é alisada em 3D, e a foto esticada só sai onde ficou do lado errado
  dela. `--foto` sobe o limite a partir do qual a foto manda (em superfície inclinada o recorte projetado escorria
  em riscos). Sobram uns dentes de 2 a 4 px na divisa, onde uma ruga da malha olha bem de frente.
- **02, moletom mescla** (`--alisa 0.23,0.29,-0.15,-0.09,-0.9,-0.84,0.045`): o Tripo inventou um relevo de costura,
  em babado, de cima a baixo das duas mangas. `--alisa` passa um alisamento de Taubin (não encolhe a malha) só nas
  mangas, do ombro até antes dos punhos, na malha de alta e na leve (o número de passos sai do tamanho das arestas,
  para as duas perderem o mesmo relevo). Dobras pequenas da manga somem junto; o resto da peça não muda.
  `--teste-alisa` mostra o antes e o depois em sólido (`saida/<NN>-alisa-*.png`) sem assar nada.

Para refazer só essas duas: `node templates/prega/fonte/arara/3d/monta.mjs --mistura 06` (só o atlas) e
`node templates/prega/fonte/arara/3d/monta.mjs --blender 02` (a malha mudou: refaz tudo). Nenhuma das duas pediu
geração nova: zero créditos.
