#!/usr/bin/env python3
# Recorte fino de um modelo em fundo branco, depois da máscara do Vision (recorte.swift).
# O Vision acerta a silhueta e o vão entre as pernas, mas a máscara é mole e deixa halo branco.
# Aqui, numa faixa em volta da borda, o alfa sai da cor (fundo branco conhecido), e a cor da borda é limpa do branco.
# Depois normaliza o enquadramento (cabeça a 8 %, sola a 94 %, corpo centrado) e grava as versões desfocadas.
# Sola e vão têm tratamento próprio, pela cor: a máscara do Vision chanfra os cantos da sola branca e engole o alto do vão.
# Vão só é vão se tiver fundo de verdade (o fundo da foto dá 0 a 3 níveis abaixo de 255); o resto fechado pela silhueta fica opaco.
# Fresta é outra coisa: fenda de poucos px com fundo visto por ela, que não chega ao branco puro. Sai pela forma e pela cor (ver "frestas" abaixo).
# A borda inferior da sola é um perfil suavizado por pé, com fração de pixel: termina numa curva, sem degraus nem picos.
# Onde a sola sobe de repente (canto do arco), o perfil segue a medida, para o traço escuro da foto não ficar dentro da sola. O contato é uma camada à parte, composta por baixo do corpo depois do redimensionamento: o alfa só desce da sola para o chão.
# Sola colorida (borracha cor de mel) é outro caso: a sombra do chão é neutra e a sola não, então a borda sai da croma. Sem isso, a sombra clara entre os calcanhares virava sola, em retalho branco opaco.
# Fresta com menos de 2 px que não chega ao branco (o traço entre os dedos do look01-t4-3) não se resolve aqui: no fundo branco do site, abrir o alfa dá o mesmo traço claro, e --tirar piora. Sem pintar pixel, só outra geração tira.
# Tênis de corrida com sola de duas cores (entressola clara, solado escuro, como o look01): o traço escuro que a regra normal procura é o próprio solado, e ela cortava as travas e deixava um degrau na ponta. Com --sola-escura, o fim da sola é o último pixel escuro da coluna, porque abaixo dele a sombra do chão salta para claro.
# Tênis branco e baixo com sola colorida (Samba do look 04): a faixa da base tem mais couro branco que sola, a medida automática não reconhece a sola colorida e o couro branco virava fundo. Com --sola-colorida, o tratamento de sola colorida vale sempre, com a croma medida só nos pixels coloridos.
# Sola creme baixa com traço preto de 1 px no chão (Puma Suede do look 05): a regra normal morde a sola, porque a sombra clara do chão tem o tom dela; --sola-escura acerta a forma, mas deixa o traço preto como sola. Com --sola-creme, a forma é a de --sola-escura e o fim da sola é o começo do traço.
# Cadarço e filete brancos dentro do tênis (Vans Old Skool do look 07): têm branco puro, a regra da "área fechada" os toma por fundo e o corte da sola os fura. Com --pe-branco, o miolo da silhueta do Vision conta como sola e buraco fechado no pé fica opaco, na cor da foto. Sem efeito nos outros looks.
# Roupa branca encostada no fundo (camiseta branca, meia branca, letras brancas, tênis branco do elenco Nike de 2026-11-08): o branco puro dela é igual ao fundo, e a regra do vão a come a partir da borda, em retalhos. Com --branco, dentro do polígono não se procura vão nem fresta e a borda é a da silhueta do Vision, que nesse caso acerta.
# Uso: python recorte.py <foto.png> <mascara-vision.png> <saida-sem-extensao> [--sola-escura] [--sola-colorida] [--sola-creme] [--pe-branco] [--tirar x,y x,y x,y ...] [--manter x,y x,y x,y ...] [--branco x,y x,y x,y ...] [--claro x,y x,y x,y ...] [--pe-vision]
# --tirar: polígono, em px da foto, que vira fundo. Serve só para defeito da geração encostado num vão aberto, como um objeto entre os dedos.
# O defeito continua na foto e o polígono vale só para aquela foto: anotar no .prompt.txt e não repetir em outra tomada.
# --manter: polígono, em px da foto, onde não há fresta. Serve para ponto claro de roupa perto de um vão, como um rebite de bolso que virou furo. Mesma regra: anotar e não repetir em outra tomada. Pode repetir (um polígono por --manter).
# --branco: polígono, em px da foto, de roupa branca: ali não há vão nem fresta, vale a silhueta do Vision. Pode repetir. O polígono não pode cobrir vão de verdade (entre braço e tronco, entre as pernas). Mesma regra de anotar.
# Tênis todo branco no fundo branco (Air Force 1 do look 08 Nike): a sola branca e o solado cinza-claro não têm traço escuro nem cor, e a medida da sola cortava o bico e o solado. Com --pe-vision, do início da sola para baixo o alfa é a silhueta do Vision, que nesse tênis acerta; o contato continua.
# --claro: polígono de roupa quase branca (240 a 250) colada num vão de verdade, como o painel branco da camiseta encostado no vão entre braço e tronco do look 06 Nike. Ali o vão vale só no branco puro do fundo e não se espalha pelo claro, então o vão fica aberto e o painel fica. Pode repetir.
# Requer: pillow, numpy, scipy.
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.signal import savgol_filter

src, vis, out = sys.argv[1:4]
def poligono(nome):
    if nome not in sys.argv:
        return []
    pontos = []
    for p in sys.argv[sys.argv.index(nome) + 1:]:
        if p.startswith('--'):
            break
        pontos.append(tuple(float(v) for v in p.split(',')))
    return pontos


def poligonos(nome):
    lista = []
    for i, a in enumerate(sys.argv):
        if a != nome:
            continue
        pontos = []
        for p in sys.argv[i + 1:]:
            if p.startswith('--'):
                break
            pontos.append(tuple(float(v) for v in p.split(',')))
        lista.append(pontos)
    return lista


def area(lista, w, h):
    tela_a = Image.new('L', (w, h), 0)
    for pts in lista:
        ImageDraw.Draw(tela_a).polygon(pts, fill=255)
    return np.asarray(tela_a) > 0


TIRAR, MANTER, BRANCO = poligono('--tirar'), poligonos('--manter'), poligonos('--branco')
SOLA_ESCURA = '--sola-escura' in sys.argv
SOLA_COLORIDA = '--sola-colorida' in sys.argv
SOLA_CREME = '--sola-creme' in sys.argv
SOLA_ESCURA = SOLA_ESCURA or SOLA_CREME
PE_BRANCO = '--pe-branco' in sys.argv
PE_VISION = '--pe-vision' in sys.argv
W, H = 1024, 1536
TOPO, SOLA = .08, .94
# desfoque dos planos de trás, em px da imagem de 1536: dão 2,5 e 4 px na tela (vagas ±1 e ±2 do brief)
DESFOQUES = {'desfoque-1': 7, 'desfoque-2': 13}
FUNDO_BR, FUNDO_CR, FUNDO_MIN = 3, 2, 4  # fundo de verdade: até 3 níveis abaixo do branco, sem cor, em pelo menos 4 px da mancha
VAO_BANDA = 3  # px em volta do vão onde o alfa sai só da cor: é onde sobram as lascas brancas
OPACO_PX = 5  # a mais que isso do fundo nada fica transparente, nem pedaço claro de pele ou de roupa
SOLA_JANELA, SOLA_PONTA, SOLA_SUBIDA, SOLA_MIN, SOLA_FOLGA = 41, 12, 24, 24, 1.  # px do ajuste do perfil, px da ponta que seguem a medida, px da ponta que só sobem, menor pé aceito, px além do traço escuro que o perfil tolera
FRESTA_RAIO, FRESTA_TOPO, FRESTA_CR, FRESTA_CLARO = 4, 35, 30, 190  # raio da abertura em px, quanto mais claro que a vizinhança, croma máximo, luz mínima da mancha
FRESTA_BORDA, FRESTA_LONGE, FRESTA_PISO = 140, 40, .12  # luz mínima do pixel, para pegar também a borda cinza da fenda (a 110, a mancha seguia pelo pesponto do bolso e o deixava translúcido); px até o fundo aberto; fração da altura do corpo, a partir da sola, onde não há fresta (tênis e barra)
SOLA_CREME_L = 160  # --sola-creme: luz abaixo da qual o pixel ainda é o traço escuro do chão, sob a sola clara
SOLA_ESC_L, SOLA_ESC_BR, SOLA_ESC_FAIXA, SOLA_ESC_ABERTURA = 140, 45, .035, 1  # --sola-escura: luz máxima do último pixel da sola (o chão, logo abaixo, mede 165 ou mais), distância do branco que conta como tênis (a sombra ao lado mede até 35), fração da altura do corpo em que o pé termina, abertura em px (a de 3 comia cadarço e deixava farpas no peito do pé)
SOLA_CROMA, SOLA_CORTE_CR = 30, .45  # croma mediana da base do tênis a partir da qual a sola é colorida; fração dela que ainda conta como sola
CONTATO_PX, CONTATO_MAX, CONTATO_COR = 12, .4, np.array([24., 22., 20.])  # px da foto original, alfa máximo, cor
CONTATO_DE, CONTATO_ATE, CONTATO_GANHO, CONTATO_SUAVE = 3, 8, 1.5, 8  # linhas do chão medidas abaixo da sola (depois do traço escuro), ganho sobre o tom dele, suavização ao longo do pé em px

I = np.asarray(Image.open(src).convert('RGB')).astype(float)
V = np.asarray(Image.open(vis).convert('RGBA')).astype(float)[..., 3] / 255
B = np.array([255., 255., 255.])
L = I.mean(-1)
branco = 255 - I.min(-1)  # distância do fundo branco
croma = I.max(-1) - I.min(-1)
ROUPA_BRANCA = area(BRANCO, I.shape[1], I.shape[0])
ROUPA_CLARA = area(poligonos('--claro'), I.shape[1], I.shape[0])

# vãos: o Vision engole a ponta de cima do vão das pernas (ou braço e tronco). Mancha de fundo cercada pela silhueta sai da máscara.
ys = np.where((V > .5).any(1))[0]
piso = ys.max() - int((ys.max() - ys.min()) * .07)  # daqui para baixo é sola e sombra de chão
# Só entra mancha com fundo de verdade dentro: brilho de tricô e pedaço claro de roupa não chegam a esse branco.
nucleo = (branco <= FUNDO_BR) & (croma <= FUNDO_CR) & (V > .3)
nucleo[piso:] = False
nucleo[ROUPA_BRANCA] = False
oito = np.ones((3, 3), bool)  # a ponta do vão corre na diagonal
rot, k = ndi.label((branco < 25) & (croma < 14) & (V > .3), structure=oito)
vao = np.zeros_like(V, bool)
if k:
    conta = ndi.sum(nucleo, rot, range(1, k + 1))
    vao = np.isin(rot, 1 + np.where(conta >= FUNDO_MIN)[0]) & (branco < 11) & (croma < 6)
    vao[piso:] = False
    vao[ROUPA_BRANCA] = False
    vao[ROUPA_CLARA & ~((branco <= FUNDO_BR) & (croma <= FUNDO_CR))] = False
# a ponta do vão, fina demais para virar mancha: o fundo cresce pelos pixels quase brancos encostados nele (zíper e brilho ficam, não encostam)
claro = (branco < 22) & (croma < 10)
claro[piso:] = False
claro[ROUPA_BRANCA | ROUPA_CLARA] = False
fundo = (V < .5) | vao
vao = vao | (ndi.binary_propagation(fundo, structure=oito, mask=fundo | claro) & ~(V < .5))
longe_vao = ndi.distance_transform_edt(~vao) if vao.any() else np.full(V.shape, 1e3)
V = V * (1 - ndi.gaussian_filter(ndi.binary_dilation(vao).astype(float), 1))

# trimap: dentro certo, fora certo, faixa de borda
dentro = ndi.binary_erosion(V > .97, iterations=5)
fora = ~ndi.binary_dilation(V > .03, iterations=3)
faixa = ~dentro & ~fora

# cor de frente: a do pixel certo mais próximo, levemente suavizada. Conta como certo o que é claramente roupa ou pele pela cor,
# a 1 px da borda: com só o miolo da máscara, a ponta do dedo pegava a cor do jeans ao lado e ficava translúcida.
solido = dentro | ndi.binary_erosion((V > .5) & (branco >= 40) & ~vao, iterations=1)
idx = ndi.distance_transform_edt(~solido, return_distances=False, return_indices=True)
F = I[idx[0], idx[1]]
F = np.stack([ndi.gaussian_filter(F[..., c], 1) for c in range(3)], -1)

d = F - B
n = (d * d).sum(-1)
a_cor = ((I - B) * d).sum(-1) / np.maximum(n, 1)
a_cor = np.clip((a_cor - .05) / .87, 0, 1)
a_vis = np.clip((V - .45) / .4, 0, 1)
a_vis = a_vis * a_vis * (3 - 2 * a_vis)

# onde a frente é quase branca (sola, cadarço claro) a cor não decide: fica a silhueta do Vision
conf = np.clip((np.sqrt(n) - 60) / 60, 0, 1)
A = conf * a_cor + (1 - conf) * a_vis
# a sombra do chão não é corpo: abaixo do início da sola vale só a silhueta (a sola entra depois, pela cor)
A[piso:] = np.minimum(A[piso:], a_vis[piso:])
# bem dentro da silhueta nada fica transparente, nem o pedaço claro de pele ou de sola
piso_vis = np.clip((V - .8) / .18, 0, 1)
# ...exceto colado num vão, onde a máscara não acompanha a ponta fina e o piso deixaria lasca branca
A = np.where(longe_vao <= VAO_BANDA, A, np.maximum(A, piso_vis))
alfa = np.where(dentro, 1., np.where(fora, 0., A))
longe_fundo = ndi.distance_transform_edt(~((V < .5) | vao))
alfa = np.where((longe_fundo > OPACO_PX) & (longe_vao > VAO_BANDA), 1., alfa)

# solas. A sola clara é 20 a 30 níveis mais escura que o fundo: a borda sai da cor, não do Vision, que é mole e chanfra os cantos.
# O fim da sola, coluna a coluna, é onde começa o traço escuro do contato; sem traço, onde o tom sobe para o branco da sombra.
perto = ndi.binary_dilation(V > .5, iterations=10)
perto[:piso] = False
# corte relativo ao tom da sola: a meia altura entre a sola e o branco, para o halo de sombra em volta não virar sola
tom = branco[perto & dentro & (croma < 24) & (L > 170)]
corte = max(np.median(tom) * .55, 6) if tom.size else 8
objeto = (branco >= corte) & perto
# sola colorida: mede-se na base do corpo, onde só há sola
base = perto & dentro
base[:ys.max() - int((ys.max() - ys.min()) * .035)] = False
croma_base = np.median(croma[base]) if base.any() else 0
colorida = croma_base >= SOLA_CROMA
if SOLA_COLORIDA:
    colorida = True
    croma_base = np.median(croma[base & (croma >= SOLA_CROMA)])
if SOLA_ESCURA:
    colorida = False
    objeto = (branco >= SOLA_ESC_BR) & perto
elif colorida:
    objeto = (croma >= croma_base * SOLA_CORTE_CR) & perto
fim = np.full(I.shape[1], -1)
y_pe = ys.max() - int((ys.max() - ys.min()) * SOLA_ESC_FAIXA)
for x in np.where(perto.any(0))[0] if SOLA_ESCURA else []:
    y_esc = np.where(perto[:, x] & (L[:, x] < SOLA_ESC_L))[0]
    if y_esc.size and y_esc.max() >= y_pe:  # acima disso é barra do jeans, não pé
        fim[x] = y_esc.max() + 1
        if SOLA_CREME:  # o último pixel escuro é o traço do chão, abaixo da sola clara: o fim é o começo dele
            y_tr = y_esc.max()
            while L[y_tr - 1, x] < SOLA_CREME_L and y_esc.max() - y_tr < 5:
                y_tr -= 1
            fim[x] = y_tr if y_esc.max() - y_tr < 5 else -1  # corrida longa é camurça ou barra, não traço: a coluna fica sem medida e o perfil interpola
for x in [] if SOLA_ESCURA else np.where(objeto.any(0))[0]:
    y_obj = np.where(objeto[:, x])[0]
    if y_obj.size < 12:  # coluna só com sombra, fora do pé
        objeto[:, x] = False
        continue
    y_fim = y_obj.max()
    y_cor = y_obj[(y_obj >= y_fim - 34) & (y_obj < y_fim - 8)]
    claro_s = L[y_cor, x] if colorida else L[y_cor, x][L[y_cor, x] > 170]
    if not claro_s.size:
        continue
    ref = np.median(claro_s)
    jan = np.arange(max(y_fim - 14, piso), y_fim + 1)
    escuro = jan[L[jan, x] < ref - 35]
    subiu = jan[L[jan, x] > ref + 9]
    fim[x] = escuro.min() if escuro.size else (subiu.min() if subiu.size else y_fim + 1)
tem = fim >= 0
pes = []
if tem.any():
    # um perfil por pé. Coluna isolada não é pé; o buraco curto no meio do pé é preenchido.
    tem = ndi.binary_opening(ndi.binary_closing(tem, iterations=4), iterations=3)
    rot_x, k_x = ndi.label(tem)
    pes = [np.where(rot_x == i)[0] for i in range(1, k_x + 1)]
    pes = [c for c in pes if c.size >= SOLA_MIN]
    tem = np.zeros_like(tem)
if pes:
    bruto = fim.astype(float)
    fim = np.full(I.shape[1], -1.)
    for c in pes:
        tem[c] = True
        val = bruto[c]
        val = np.where(val < 0, np.interp(c, c[val >= 0], val[val >= 0]), val)
        med = ndi.median_filter(val, size=9, mode='nearest')
        jan = min(SOLA_JANELA, (c.size - 1) | 1)
        s_ = savgol_filter(med, jan, 3, mode='interp')
        for _ in range(6):  # o que foge da curva é sombra ou ruído, não sola; o erro da medida é quase sempre para baixo, onde a sombra engana
            lim = np.clip(med, s_ - 1.5, s_ + .75)
            s_ = savgol_filter(lim, jan, 3, mode='interp')
        # as pontas sobem rápido demais para o ajuste: ali vale a medida, para não comer o canto nem deixar a sombra virar sola
        d_ponta = np.minimum(c - c[0], c[-1] - c)
        p = np.clip(d_ponta / SOLA_PONTA, 0, 1)[..., None][:, 0]
        ponta = np.minimum(s_, ndi.gaussian_filter1d(med, 1.5, mode='nearest'))
        perfil = p * s_ + (1 - p) * ponta
        # da curva para a ponta do pé a sola só sobe: o que desce ali é a sombra do calcanhar entrando na medida
        n_ = min(SOLA_SUBIDA, c.size // 2)
        perfil[-n_:] = np.minimum.accumulate(perfil[-n_:])
        perfil[:n_] = np.minimum.accumulate(perfil[:n_][::-1])[::-1]
        # onde a sola sobe de repente (canto do arco), a curva ajustada passa por baixo do começo do traço escuro e o traço fica dentro da sola, opaco.
        # Só ali o perfil segue a medida. As pontas ficam de fora, porque nelas a subida rápida é o arredondado do canto.
        teto = ndi.minimum_filter1d(med, 5, mode='nearest') + .5
        trecho = ndi.binary_dilation((perfil > teto + SOLA_FOLGA) & (d_ponta >= SOLA_PONTA), iterations=3)
        perfil = np.where(trecho, np.minimum(perfil, teto), perfil)
        mistura = ndi.gaussian_filter1d(trecho.astype(float), 2, mode='nearest')
        fim[c] = (1 - mistura) * ndi.gaussian_filter1d(perfil, 1, mode='nearest') + mistura * ndi.gaussian_filter1d(perfil, 2, mode='nearest')
    linhas = np.arange(I.shape[0])[:, None]
    # cobertura: 1 acima do fim, 0 abaixo, fração na linha do fim
    cob = np.where(tem[None, :], np.clip(fim[None, :] - linhas + .5, 0, 1), 1.)
    # abertura tira as orelhas de sombra nos cantos; a gaussiana arredonda os degraus
    disco = ndi.generate_binary_structure(2, 1)
    # a base da máscara passa um pouco do fim: quem corta embaixo é a cobertura, com fração de pixel
    sola = ndi.binary_opening(objeto & (linhas < fim[None, :] + 3), disco, iterations=SOLA_ESC_ABERTURA if SOLA_ESCURA else 3)
    sola = ndi.binary_fill_holes(ndi.binary_closing(sola, disco, iterations=2))
    if colorida:  # na sola colorida o objeto é só o que tem cor: fio claro do jeans, dentro da silhueta, não pode cair no corte do pixel neutro logo abaixo
        sola = sola | dentro
    if PE_BRANCO:  # bem dentro da silhueta do Vision o branco é cadarço ou filete, nunca fundo, mesmo encostado no contorno
        sola = sola | ndi.binary_erosion(V > .9, iterations=2)
    a_sola = np.clip(ndi.gaussian_filter(sola.astype(float), 1.5) * 3 - 1, 0, 1)
    alfa = np.where(perto, np.maximum(alfa, a_sola), alfa)
    alfa = np.where(perto & (croma < 24) & (L > 170), np.minimum(alfa, a_sola), alfa)
    alfa = np.where(perto, alfa * cob, alfa)

# --sola-colorida com tênis branco: a máscara do Vision é um borrão no couro branco e o corte pela cor do branco abre buracos. No pé, o contorno sai da foto: o que difere do fundo em BR_PE níveis, fechado e preenchido; o fim da sola é o último pixel caramelo de cada coluna.
if SOLA_COLORIDA:
    y_pe0 = ys.max() - int((ys.max() - ys.min()) * .095)
    linhas = np.arange(I.shape[0])[:, None]
    caramelo = (croma >= 40) & (I[..., 0] - I[..., 2] >= 45) & (I[..., 0] >= I[..., 1])
    caramelo[:y_pe0] = False
    caramelo = ndi.binary_opening(caramelo, ndi.generate_binary_structure(2, 1), iterations=2)
    tem = caramelo.any(0)
    tem = ndi.binary_opening(ndi.binary_closing(tem, iterations=4), iterations=3)
    rot_x, k_x = ndi.label(tem)
    pes = [np.where(rot_x == i)[0] for i in range(1, k_x + 1)]
    pes = [c for c in pes if c.size >= SOLA_MIN]
    tem = np.zeros_like(tem)
    fim = np.full(I.shape[1], -1.)
    ultimo = I.shape[0] - 1 - np.argmax(caramelo[::-1], 0)
    for c in pes:
        tem[c] = True
        val = ultimo[c].astype(float) + 1
        tem_val = caramelo[:, c].any(0)
        val = np.where(tem_val, val, np.interp(c, c[tem_val], val[tem_val]))
        med = ndi.median_filter(val, size=9, mode='nearest')
        jan = min(SOLA_JANELA, (c.size - 1) | 1)
        s_ = savgol_filter(med, jan, 3, mode='interp')
        d_ponta = np.minimum(c - c[0], c[-1] - c)
        p = np.clip(d_ponta / SOLA_PONTA, 0, 1)
        fim[c] = ndi.gaussian_filter1d(p * s_ + (1 - p) * np.minimum(s_, med), 1, mode='nearest')
    cob = np.where(tem[None, :], np.clip(fim[None, :] - linhas + .5, 0, 1), 1.)
    pe = (255 - I.min(-1)) >= 10
    pe[:y_pe0] = False
    pe = pe & (linhas < fim[None, :] + 3)
    disco = ndi.generate_binary_structure(2, 1)
    pe = ndi.binary_fill_holes(ndi.binary_closing(pe, disco, iterations=2))
    pe = ndi.binary_opening(pe, disco, iterations=3)
    rot_p, k_p = ndi.label(pe)
    if k_p:
        pe = np.isin(rot_p, 1 + np.where(ndi.sum(caramelo, rot_p, range(1, k_p + 1)) > 0)[0])
    a_pe = np.clip(ndi.gaussian_filter(pe.astype(float), .8) * 2 - .5, 0, 1)
    so_pes = np.zeros_like(alfa, bool)
    so_pes[y_pe0:] = True
    so_pes &= tem[None, :]
    alfa = np.where(so_pes, np.maximum(a_pe, (I.mean(-1) < 110) & (alfa > .5)) * cob, alfa)
    perto = so_pes

if PE_VISION:
    alfa[piso:] = a_vis[piso:]

# cor limpa do branco
aa = np.maximum(alfa, .02)[..., None]
C = (I - (1 - aa) * B) / aa
peso = np.clip(alfa / .6, 0, 1)[..., None]
C = np.where(faixa[..., None], peso * C + (1 - peso) * F, I)
if pes and not PE_VISION:
    # a sola não pega cor do fundo: na borda dela vale a cor de dentro
    borda_sola = perto & (alfa < 1) & (alfa > 0)
    C = np.where(borda_sola[..., None], F, C)
    # no fim da sola, nem cor do traço escuro: as duas últimas linhas opacas são mistura de sola e traço na própria foto e faziam um pontilhado de claro e cinza. Ali vale a cor de 2 px para dentro.
    fundo_sola = perto & tem[None, :] & (fim[None, :] - linhas > -1) & (fim[None, :] - linhas < 2.5)
    miolo_sola = ndi.binary_erosion(solido & (cob >= 1) & (alfa > .98), iterations=2)
    i_s = ndi.distance_transform_edt(~miolo_sola, return_distances=False, return_indices=True)
    C = np.where(fundo_sola[..., None], F[i_s[0], i_s[1]], C)
C = np.clip(C, 0, 255)

if TIRAR:
    # cobertura do polígono com fração de pixel, e a cor em volta vem de fora dele: o defeito não sangra na borda semitransparente
    SS = 8
    tela_p = Image.new('L', (I.shape[1] * SS, I.shape[0] * SS), 0)
    ImageDraw.Draw(tela_p).polygon([((x + .5) * SS, (y + .5) * SS) for x, y in TIRAR], fill=255)
    cob_t = np.asarray(tela_p.resize((I.shape[1], I.shape[0]), Image.BOX)).astype(float) / 255
    cob_t = np.clip(ndi.gaussian_filter(cob_t, .7) * 1.25 - .125, 0, 1)  # borda macia, como a da máscara em volta
    perto_t = ndi.binary_dilation(cob_t > 0, iterations=3)
    fora_t = ~perto_t & (alfa > .98)
    i_t = ndi.distance_transform_edt(~fora_t, return_distances=False, return_indices=True)
    C = np.where(perto_t[..., None], C[i_t[0], i_t[1]], C)
    alfa = alfa * (1 - cob_t)

# área fechada sem fundo de verdade dentro é roupa ou pele, não vão: fica opaca, na cor de dentro
fechado = ndi.binary_fill_holes(alfa >= .5) & (alfa < .5)
rot, k = ndi.label(fechado)
if k:
    puro = ndi.sum((branco <= FUNDO_BR) & (croma <= FUNDO_CR), rot, range(1, k + 1))
    tapa = ndi.binary_dilation(np.isin(rot, 1 + np.where(puro < FUNDO_MIN)[0]), iterations=1)
    C = np.where(tapa[..., None], F, C)
    alfa = np.where(tapa, 1., alfa)

# frestas: fundo visto por uma fenda de poucos px, entre dedos, entre manga e tronco, entre cachos. O regime de opaco acima tapa, porque ali a máscara é sólida.
# Acha-se pela forma (mais claro que a vizinhança numa largura de até 9 px) e pela cor (sem croma); o alfa sai da cor, e a cor vem do corpo em volta.
# A mancha precisa chegar ao claro do fundo e ficar perto dele, e nada abaixo do joelho entra: unha e olho não chegam a esse claro; zíper e cadarço podem chegar, mas ficam longe do fundo ou abaixo do corte.
disco_f = ndi.iterate_structure(ndi.generate_binary_structure(2, 1), FRESTA_RAIO)
cand_f = (L - ndi.grey_opening(L, footprint=disco_f) > FRESTA_TOPO) & (croma < FRESTA_CR) & (L > FRESTA_BORDA) & (longe_fundo <= FRESTA_LONGE)
cand_f[ys.max() - int((ys.max() - ys.min()) * FRESTA_PISO):] = False
if MANTER:
    cand_f[area(MANTER, I.shape[1], I.shape[0])] = False
cand_f[ROUPA_BRANCA] = False
rot, k = ndi.label(cand_f, structure=oito)
if k:
    claro_f = ndi.maximum(L, rot, range(1, k + 1))
    zona = ndi.binary_dilation(np.isin(rot, 1 + np.where(np.asarray(claro_f) >= FRESTA_CLARO)[0]), structure=oito)
    corpo = (alfa > .98) & ~ndi.binary_dilation(zona, structure=oito)
    i_f = ndi.distance_transform_edt(~corpo, return_distances=False, return_indices=True)
    F_f = C[i_f[0], i_f[1]]
    d_f = F_f - B
    a_f = np.clip(((I - B) * d_f).sum(-1) / np.maximum((d_f * d_f).sum(-1), 1), 0, 1)
    C = np.where(zona[..., None], F_f, C)
    alfa = np.where(zona, np.minimum(alfa, a_f), alfa)

if PE_BRANCO:
    buraco = ndi.binary_fill_holes(alfa >= .5) & (alfa < .5)
    buraco = ndi.binary_dilation(buraco, structure=oito, iterations=2) & (alfa < .98)
    buraco[:piso] = False
    C = np.where(buraco[..., None], I, C)
    alfa = np.where(buraco, 1., alfa)

# ciscos soltos: fica só a maior ilha
rot, k = ndi.label(alfa > .02)
if k > 1:
    maior = 1 + np.argmax(ndi.sum(alfa > .02, rot, range(1, k + 1)))
    alfa[rot != maior] = 0

# enquadramento
y, x = np.where(alfa > .5)
t, b = y.min(), y.max() + 1
l, r = x.min(), x.max() + 1
e = (SOLA - TOPO) * H / (b - t)
a_cont = np.zeros_like(alfa)
if pes:
    # contato muito suave: uma camada preta translúcida sob a sola, que funciona em qualquer fundo.
    # A força vem do tom do chão na foto, mas varia devagar ao longo do pé e nunca pixel a pixel: a sombra junto do calcanhar é irregular e fazia picos.
    forca = np.zeros(I.shape[1])
    for c in pes:
        chao = np.array([np.mean(255 - L[min(int(fim[x]) + CONTATO_DE, L.shape[0] - 1):min(int(fim[x]) + CONTATO_ATE, L.shape[0]), x]) for x in c]) / 255
        ponta = np.clip(np.minimum(c - c[0], c[-1] - c) / 14, 0, 1)
        forca[c] = np.clip(ndi.gaussian_filter1d(chao, CONTATO_SUAVE, mode='nearest') * CONTATO_GANHO, 0, CONTATO_MAX) * ponta
    queda = np.clip(1 - (linhas - fim[None, :]) / CONTATO_PX, 0, 1) ** 1.5
    a_cont = ndi.gaussian_filter1d(forca, 3)[None, :] * queda * (fim[None, :] - linhas < 1.5) * tem[None, :]
rgba = np.dstack([C * alfa[..., None], alfa * 255]).astype(np.float32)  # pré-multiplicado, sem halo no redimensionar
canais = [Image.fromarray(rgba[..., c], 'F').resize((round(I.shape[1] * e), round(I.shape[0] * e)), Image.LANCZOS) for c in range(4)]
ox, oy = round(W / 2 - (l + r) / 2 * e), round(TOPO * H - t * e)
tela = np.zeros((H, W, 4), np.float32)
for c, im in enumerate(canais):
    p = Image.new('F', (W, H), 0)
    p.paste(im, (ox, oy))
    tela[..., c] = np.asarray(p)
# o contato entra depois do redimensionamento, por baixo do corpo, e sem Lanczos: o anel do Lanczos na borda da sola cavava um fio quase transparente logo abaixo dela
p = Image.new('F', (W, H), 0)
p.paste(Image.fromarray(a_cont.astype(np.float32), 'F').resize((round(I.shape[1] * e), round(I.shape[0] * e)), Image.BILINEAR), (ox, oy))
a_tela = np.asarray(p)
sob = a_tela > 0
tela[sob] = np.clip(tela[sob], 0, 255)  # o anel negativo do Lanczos não pode descontar do contato
a_tela = a_tela * (1 - tela[..., 3] / 255)
tela[..., :3] += a_tela[..., None] * CONTATO_COR.astype(np.float32)
tela[..., 3] += a_tela * 255


def grava(pm, nome):
    a = np.clip(pm[..., 3], 0, 255)
    rgb = pm[..., :3] / np.maximum(a[..., None] / 255, 1e-3)
    Image.fromarray(np.dstack([np.clip(rgb, 0, 255), a]).round().astype(np.uint8), 'RGBA').save(nome)


grava(tela, f'{out}.png')
for nome, s in DESFOQUES.items():
    grava(np.stack([ndi.gaussian_filter(tela[..., c], s) for c in range(4)], -1), f'{out}-{nome}.png')

y, x = np.where(tela[..., 3] > 127)
print(f'escala {e:.4f}; origem {ox},{oy}; cabeça {y.min() / H:.3f}; sola {(y.max() + 1) / H:.3f}; '
      f'largura/altura {(x.max() - x.min() + 1) / (y.max() - y.min() + 1):.3f}; centro x {(x.min() + x.max() + 1) / 2 / W:.3f}')
