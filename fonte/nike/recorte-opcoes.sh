#!/bin/zsh
# Recorte do elenco Nike (2026-11-08). Rodar da pasta templates/prega/fonte. PY = python com pillow, numpy e scipy.
# Entrada: modelo-gpt-image-2-6.png (2336 × 3504) reduzida para modelo-1024.png (1024 × 1536, Lanczos), máscara do Vision em mascara.png.
# Saída: recorte.png, recorte-desfoque-1.png, recorte-desfoque-2.png em cada pasta.
# Polígonos em px de modelo-1024.png. Valem só para estas fotos: outra tomada mede de novo.
#   --branco  roupa branca encostada no fundo (camiseta, meia, letras, relógio): sem vão nem fresta, vale o Vision
#   --claro   painel quase branco colado num vão de verdade (look 06): o vão fica só no branco puro
#   --manter  sem fresta (malha mesclada, camuflado claro, corrente, zíper, anel)
#   --pe-vision  bota e tênis em que a medida da sola comia solado (botas trigo, Killshot, AF1): do início da sola para baixo vale o Vision
set -e
PY=${PY:-python3}
for d in nike/0*; do
  [[ -f $d/modelo-1024.png ]] || $PY -I -c "import sys; from PIL import Image; Image.open(sys.argv[1]).convert('RGB').resize((1024, 1536), Image.LANCZOS).save(sys.argv[2])" $d/modelo-gpt-image-2-6.png $d/modelo-1024.png
  [[ -f $d/mascara.png ]] || swift recorte.swift $d/modelo-1024.png $d/mascara.png
done
r() { local d=$1; shift; echo -n "$d: "; $PY -I recorte.py nike/$d/modelo-1024.png nike/$d/mascara.png nike/$d/recorte "$@"; }

# 01 Enzo: gorro de strass (pedras viravam furo), cinto branco de ilhós, camuflado e moletom creme com pontos de fresta
r 01-enzo --pe-vision \
  --branco 425,125 600,125 600,245 425,245 --branco 355,735 650,735 650,785 355,785 \
  --manter 552,350 578,350 578,376 552,376 --manter 384,662 410,662 410,688 384,688 \
  --manter 320,770 482,770 482,1250 320,1250 --manter 518,770 735,770 735,1250 518,1250 --manter 640,380 745,380 745,600 640,600
# 02 Gabriel: moletom mesclado fazia fresta em pontos claros da malha (capuz, mangas); o vão do cotovelo continua aberto
r 02-gabriel --pe-vision \
  --manter 220,250 800,250 800,690 220,690 --manter 220,680 420,680 420,785 220,785 --manter 400,60 660,60 660,260 400,260
# 03 Leo: meias brancas, Swoosh branco do gorro, mostrador do relógio; corrente da carteira
r 03-leo --pe-vision \
  --branco 360,1262 432,1262 432,1385 360,1385 --branco 550,1262 622,1262 622,1385 550,1385 \
  --branco 478,143 533,143 533,172 478,172 --branco 595,722 652,722 652,768 595,768 \
  --manter 535,770 650,770 650,945 535,945
# 04 Luca: faixa da camiseta branca sob o moletom, letras NIKE do gorro
r 04-luca --pe-vision --branco 375,712 652,712 652,772 375,772 --branco 438,128 572,128 572,198 438,198
# 05 Lucas: camiseta branca inteira, Shox prata (--pe-branco), anel e a sombra entre dedo e bermuda
r 05-lucas --pe-branco \
  --branco 250,600 280,430 350,350 440,300 580,300 660,330 720,420 770,610 710,650 705,720 660,800 540,815 360,825 330,790 300,650 \
  --manter 306,900 334,900 334,924 306,924 --manter 334,864 352,864 352,897 334,897
# 06 Miguel: ombros, gola e NIKE brancos; painéis laterais brancos colados no vão braço-tronco (--claro); meias; Air Max Plus branco
r 06-miguel --pe-branco \
  --branco 315,450 335,360 420,315 470,295 560,295 620,315 695,370 715,460 600,485 420,485 \
  --branco 362,1262 446,1262 446,1372 362,1372 --branco 549,1262 632,1262 632,1372 549,1372 \
  --claro 345,480 412,480 412,805 335,805 --claro 595,480 690,480 700,805 600,805 \
  --manter 655,778 718,778 718,822 655,822
# 07 Nico: Swooshes brancos (gorro, manga, calça) e o branco dos olhos
r 07-nico --branco 465,155 545,155 545,195 465,195 --branco 675,435 720,435 720,485 675,485 \
  --branco 350,985 405,985 405,1025 350,1025 --branco 460,200 550,200 550,232 460,232
# 08 Tai: NIKE do boné, camiseta branca na gola, jaqueta de lona clara (fresta no zíper e nas mangas), corrente, AF1 branco
r 08-tai --pe-vision --branco 468,118 548,118 548,158 468,158 --branco 488,348 568,348 568,388 488,388 \
  --manter 340,790 425,790 425,930 340,930 --manter 255,330 775,330 775,795 255,795
