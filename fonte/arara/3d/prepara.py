# Prepara uma peça da arara para o Three.js: das duas malhas que o enxuga.mjs tira do .glb bruto do Tripo
# (saida/<NN>-alta.glb e <NN>-leve.glb) sai a malha do site com UV novo e um atlas de cor feito só das fotos de
# verdade (fonte/arara/<NN>-frente.png e <NN>-costas.png):
#   - onde a superfície olha para a câmera de uma das fotos (e não está escondida), vale a foto projetada;
#   - nas laterais e no que nenhuma foto vê, a cor vem dos pontos de foto vizinhos em 3D (um campo de cor suave);
#     em volta do cabide, onde madeira e tecido se encostam, a textura do Tripo serve de mapa (que parte é cada
#     ponto) e uma tabela aprendida nas fotos troca a cor dele pela de verdade; por cima, o grão do tecido medido
#     na foto e a luz de cúpula assada da malha de alta (dobras, frestas, oclusão).
# Do Tripo fica a forma (e esse mapa em volta do cabide): a textura dele, usada direto, tem outra cor, não tem a luz
# da foto e inventa detalhes que a peça não tem (recortes e costuras nas laterais, etiquetas, costas sem o número).
#
# Rodar da raiz do repo (o monta.mjs chama este script para cada peça):
#   node tools/blender.mjs templates/prega/fonte/arara/3d/prepara.py -- <NN> [--atlas 2048] [--giro -90]
#   ... -- <NN> --mistura     refaz só o atlas, a partir dos assados guardados em saida/<NN>-assados.npz
#   ... -- <NN> --confere [--prefixo antes]   só os prints de conferência (<NN>-<prefixo>-<vista>.png)
# Ajustes por peça (o monta.mjs guarda os de cada uma em AJUSTES e passa sozinho):
#   --classes 2 --foto 0.3,0.5   peça de recortes (06): laterais em cores chapadas, com a divisa nítida
#   --alisa x0,x1,zc0,zc1,zb0,zb1[,escala]   alisa a malha nas mangas (02); com --teste-alisa, só mostra o resultado
#
# Sai em fonte/arara/3d/saida/: <NN>.glb (posição, normal e UV; sem material), <NN>-atlas.png, <NN>.json (medidas) e
# <NN>-confere-*.png (a malha final com o atlas, de frente, de lado e de costas, para olhar).
#
# Referencial da malha exportada (glTF): y para cima, a frente da peça olha para +z, altura total 1 com o topo do
# gancho da foto em y = 0 (a barra da peça em y = -1), x = 0 na haste do gancho. O gancho de arame do Tripo é
# cortado fora: o site desenha o dele (src/motion/arara-3d.js).
import bpy, bmesh, sys, os, math, json, time
import numpy as np
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:]
ID = argv[0]
def opt(nome, padrao):
    return type(padrao)(argv[argv.index(nome) + 1]) if nome in argv else padrao
ATLAS = opt('--atlas', 2048)
GIRO = opt('--giro', -90.0)  # graus em torno do eixo vertical até a frente olhar para -Y do Blender (+z do glTF)
AMOSTRAS = opt('--amostras', 24)
CLASSES = opt('--classes', 1)  # peça de recortes (06): em quantas cores chapadas as laterais se dividem
# de quanto a quanto de "olhar para a câmera" (cosseno da inclinação) a foto passa a mandar; mais alto = a foto só
# vale no que está bem de frente (a 06 pede isso: em superfície inclinada o recorte projetado escorre em riscos)
FOTO_DE, FOTO_ATE = [float(x) for x in opt('--foto', '0.1,0.36').split(',')]
# alisar a malha nas mangas (o Tripo inventou no 02 um relevo de costura, em babado, de cima a baixo da manga):
# "x0,x1,zcima0,zcima1,zbaixo0,zbaixo1[,escala]" = a faixa em que o alisamento entra (|x| de x0 a x1, a partir do
# gancho) e sai (em cima, de zcima0 a zcima1; embaixo, de zbaixo0 a zbaixo1, para poupar os punhos), em alturas de
# peça (z = 0 no topo, -1 na barra); escala = tamanho do relevo que some (padrão 0,03)
ALISA = [float(x) for x in opt('--alisa', '').split(',')] if '--alisa' in argv else None
SO_ALISA = '--teste-alisa' in argv  # para depois de alisar e mostra a malha em sólido (saida/<NN>-alisa-*.png)
SO_MISTURA = '--mistura' in argv
SO_CONFERE = '--confere' in argv  # só os prints de conferência do que já está em saida/
PREFIXO = argv[argv.index('--prefixo') + 1] if '--prefixo' in argv else 'confere'  # <NN>-<prefixo>-<vista>.png

T0 = time.time()
def marca(msg):
    print(f'[{time.time() - T0:6.1f}s] {msg}', flush=True)

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTE = os.path.dirname(AQUI)
SAIDA = os.path.join(AQUI, 'saida')
os.makedirs(SAIDA, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
cena = bpy.context.scene
cena.render.engine = 'CYCLES'
cena.cycles.samples = AMOSTRAS
cena.cycles.use_denoising = False
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    cena.cycles.device = 'GPU'
except Exception as e:
    print('GPU indisponível, CPU:', e)

NPZ = os.path.join(SAIDA, f'{ID}-assados.npz')


def caixa(obj):
    v = np.empty(len(obj.data.vertices) * 3, dtype=np.float32)
    obj.data.vertices.foreach_get('co', v)
    v = v.reshape(-1, 3)
    return v, v.min(0), v.max(0)


def material(nome):
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    m.node_tree.nodes.clear()
    return m, m.node_tree.nodes, m.node_tree.links


def alisar(obj, x0, x1, zc0, zc1, zb0, zb1, escala=0.03):
    """Alisamento de Taubin (passa-baixa que não encolhe a malha) com peso por vértice: 1 dentro da faixa, caindo
    a 0 nas bordas dela. O número de passos sai do tamanho das arestas, para a malha de alta e a leve perderem o
    mesmo relevo (o que for menor que `escala`)."""
    me = obj.data
    n = len(me.vertices)
    v = np.empty(n * 3, dtype=np.float32); me.vertices.foreach_get('co', v); v = v.reshape(-1, 3).astype(np.float64)
    e = np.empty(len(me.edges) * 2, dtype=np.int32); me.edges.foreach_get('vertices', e); e = e.reshape(-1, 2)
    def degrau(a, b, x):
        t = np.clip((x - a) / (b - a), 0, 1)
        return t * t * (3 - 2 * t)
    w = degrau(x0, x1, np.abs(v[:, 0])) * (1 - degrau(zc0, zc1, v[:, 2])) * degrau(zb0, zb1, v[:, 2])
    dentro = w > 0
    aresta = float(np.linalg.norm(v[e[:, 0]] - v[e[:, 1]], axis=1)[dentro[e[:, 0]] & dentro[e[:, 1]]].mean())
    passos = int(np.ceil(9 * (escala / aresta) ** 2))
    grau = np.maximum(np.bincount(e[:, 0], minlength=n) + np.bincount(e[:, 1], minlength=n), 1)[:, None]
    def lap(p):
        s_ = np.stack([np.bincount(e[:, 0], weights=p[e[:, 1], k], minlength=n) + np.bincount(e[:, 1], weights=p[e[:, 0], k], minlength=n) for k in range(3)], axis=1)
        return s_ / grau - p
    p = v.copy()
    for _ in range(passos):
        p += (0.6 * w)[:, None] * lap(p)
        p += (-0.62 * w)[:, None] * lap(p)
    me.vertices.foreach_set('co', p.astype(np.float32).ravel())
    me.update()
    print('ALISA', obj.name, f'{int(dentro.sum())} vértices, aresta {aresta:.4f}, {passos} passos, deslocamento máx {float(np.abs(p - v).max()):.4f}')


def solido(obj, etiqueta):
    """A malha em cinza, sem textura, de frente, de costas e de três quartos (para olhar a forma)."""
    c = bpy.context.scene
    motor = c.render.engine
    c.render.engine = 'BLENDER_WORKBENCH'
    sh = c.display.shading
    sh.light = 'MATCAP'; sh.color_type = 'SINGLE'; sh.single_color = (0.8, 0.8, 0.8); sh.show_cavity = True; sh.cavity_type = 'BOTH'
    c.display.render_aa = '8'
    c.render.film_transparent = True
    c.render.resolution_x = 900; c.render.resolution_y = 1125
    c.render.image_settings.file_format = 'PNG'
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = 1.25
    co = bpy.data.objects.new('cam', cam); c.collection.objects.link(co); c.camera = co
    outros = [o for o in c.objects if o.type == 'MESH' and o != obj]
    for o in outros:
        o.hide_render = True
    centro = Vector((0, 0, -0.5))
    for nome, ang in [('frente', 0), ('costas', 180), ('q', 50), ('qe', -50), ('lado', 90), ('ladoe', -90)]:
        a = math.radians(ang)
        co.location = centro + Vector((-math.sin(a), -math.cos(a), 0)) * 5
        co.rotation_euler = (centro - co.location).to_track_quat('-Z', 'Y').to_euler()
        c.render.filepath = os.path.join(SAIDA, f'{ID}-alisa-{etiqueta}-{nome}.png')
        bpy.ops.render.render(write_still=True)
    for o in outros:
        o.hide_render = False
    bpy.data.objects.remove(co)
    c.render.film_transparent = False
    c.render.engine = motor


def assados():
    """Parte pesada: malha leve, UV e os assados (luz, visibilidade, fotos projetadas, posição). Guarda tudo."""
    # ---------- as duas malhas do enxuga.mjs: alta (de onde sai a luz) e leve (a do site) ----------
    def importar(nome):
        bpy.ops.import_scene.gltf(filepath=os.path.join(SAIDA, f'{ID}-{nome}.glb'))
        o = [x for x in bpy.context.selected_objects if x.type == 'MESH'][0]
        o.name = nome
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = Matrix.Rotation(math.radians(GIRO), 4, 'Z') @ mw
        bpy.ops.object.select_all(action='DESELECT')
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        o.data.polygons.foreach_set('use_smooth', [True] * len(o.data.polygons))
        return o
    alta = importar('alta')
    leve = importar('leve')

    v, mn, mx = caixa(alta)
    alt = mx[2] - mn[2]
    # altura 1, topo em z = 0, centro da caixa em x = 0 (o x do gancho é acertado depois do corte)
    normaliza = Matrix.Scale(1 / alt, 4) @ Matrix.Translation((-(mn[0] + mx[0]) / 2, -(mn[1] + mx[1]) / 2, -mx[2]))
    alta.data.transform(normaliza)
    leve.data.transform(normaliza)
    v, mn, mx = caixa(alta)
    marca(f'CAIXA {mn.round(4)} {mx.round(4)}')

    # ---------- alisamento local (só nas peças que pedem) ----------
    if ALISA:
        if SO_ALISA:
            solido(leve, 'antes')
        for o in (alta, leve):
            alisar(o, *ALISA)
        marca('alisado')
        if SO_ALISA:
            solido(leve, 'depois')
            sys.exit(0)
        v, mn, mx = caixa(alta)

    # ---------- fotos: caixa da parte opaca, para casar com a caixa da malha ----------
    def foto(nome):
        img = bpy.data.images.load(os.path.join(FONTE, nome))
        w, h = img.size
        px = np.empty(w * h * 4, dtype=np.float32)
        img.pixels.foreach_get(px)
        a = px.reshape(h, w, 4)[:, :, 3]  # linha 0 = base da imagem
        ys, xs = np.where(a > 24 / 255)
        return img, (xs.min() / w, (xs.max() + 1) / w, ys.min() / h, (ys.max() + 1) / h), a

    imgF, cxF, aF_img = foto(f'{ID}-frente.png')
    imgB, cxB, aB_img = foto(f'{ID}-costas.png')
    print('FOTO frente', np.round(cxF, 4), 'costas', np.round(cxB, 4))

    # ---------- gancho: de cima para baixo, onde a peça alarga é o fim da haste de arame ----------
    # pela foto (mais confiável que a malha): largura opaca por linha; devolve a altura do corte (fração da altura
    # da peça) e o x da haste logo acima dele (fração da largura da caixa)
    def fim_do_gancho(a):
        op = a[::-1] > 0.5  # de cima para baixo
        larg = op.sum(1)
        cols = np.where(op.any(0))[0]
        x0, x1 = cols.min(), cols.max() + 1
        topo = int(np.argmax(larg > 0))
        alt_px = int(np.where(larg > 0)[0].max()) - topo + 1
        lim = 0.085 * alt_px  # a volta do gancho tem ~4 % da altura; a madeira passa disso logo
        fim = topo + int(0.08 * alt_px)
        for y in range(topo, topo + alt_px):
            if larg[y] > lim and larg[min(y + 6, len(larg) - 1)] > lim:
                fim = y
                break
        acima = op[max(topo, fim - int(0.012 * alt_px) - 2):max(topo + 1, fim - 2)]
        xs = np.where(acima)[1]
        haste = (xs.mean() - x0) / (x1 - x0) if len(xs) else 0.5
        return (fim - topo) / alt_px, float(haste)
    corte, haste_u = fim_do_gancho(aF_img)
    print('CORTE frente', round(corte, 4), 'haste', round(haste_u, 4), '| costas', np.round(fim_do_gancho(aB_img), 4))
    z_corte = -corte + 0.004  # um fio acima da madeira

    # a haste na malha: x pela foto; a profundidade, pelo topo da madeira logo abaixo do corte
    x_haste = float(mn[0] + (mx[0] - mn[0]) * haste_u)
    faixa = v[(v[:, 2] < z_corte) & (v[:, 2] > z_corte - 0.02) & (np.abs(v[:, 0] - x_haste) < 0.03)]
    y_haste = float(faixa[:, 1].mean()) if len(faixa) else 0.0
    print('HASTE', round(x_haste, 4), round(y_haste, 4), len(faixa))

    # ---------- malha leve: corta o gancho de arame (o site desenha o dele) e tampa o furo ----------
    bm = bmesh.new()
    bm.from_mesh(leve.data)
    geo = bm.verts[:] + bm.edges[:] + bm.faces[:]
    r = bmesh.ops.bisect_plane(bm, geom=geo, plane_co=(0, 0, z_corte), plane_no=(0, 0, 1), clear_outer=True)
    bordas = [e for e in r['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
    if bordas:
        bmesh.ops.holes_fill(bm, edges=bordas, sides=0)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.to_mesh(leve.data)
    bm.free()
    leve.data.polygons.foreach_set('use_smooth', [True] * len(leve.data.polygons))
    marca(f'TRIS {len(leve.data.polygons)}')

    # UV novo
    while leve.data.uv_layers:
        leve.data.uv_layers.remove(leve.data.uv_layers[0])
    leve.data.uv_layers.new(name='UVMap')
    bpy.ops.object.select_all(action='DESELECT')
    leve.select_set(True)
    bpy.context.view_layer.objects.active = leve
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    marca('UV')

    # ---------- assados (sem margem: a mistura estende as ilhas no fim) ----------
    def imagem(nome):
        im = bpy.data.images.new(nome, ATLAS, ATLAS, alpha=False, float_buffer=True)
        im.colorspace_settings.name = 'Non-Color'
        return im

    def ler(im):
        px = np.empty(ATLAS * ATLAS * 4, dtype=np.float32)
        im.pixels.foreach_get(px)
        return px.reshape(ATLAS, ATLAS, 4)[:, :, :3].copy()

    def assar(tipo, im, mat, de_alta=False, **kw):
        leve.data.materials.clear()
        leve.data.materials.append(mat)
        n = mat.node_tree.nodes.new('ShaderNodeTexImage')
        n.image = im
        mat.node_tree.nodes.active = n
        bpy.ops.object.select_all(action='DESELECT')
        if de_alta:
            alta.select_set(True)
        leve.select_set(True)
        bpy.context.view_layer.objects.active = leve
        alta.hide_render = not de_alta
        bpy.ops.object.bake(type=tipo, use_selected_to_active=de_alta, cage_extrusion=0.012, max_ray_distance=0.03,
                            margin=0, use_clear=True, **kw)
        return ler(im)

    mundo = bpy.data.worlds.new('mundo')
    mundo.use_nodes = True
    cena.world = mundo
    fundo = mundo.node_tree.nodes['Background']

    matBranco, nos, elos = material('branco')
    d = nos.new('ShaderNodeBsdfDiffuse'); d.inputs['Color'].default_value = (1, 1, 1, 1)
    o = nos.new('ShaderNodeOutputMaterial'); elos.new(d.outputs[0], o.inputs[0])

    # 1) luz de cúpula (mais clara em cima) na malha de alta, toda branca: só a forma (dobras, frestas, oclusão)
    alta.data.materials.append(matBranco)
    nt = mundo.node_tree
    coord = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    rampa = nt.nodes.new('ShaderNodeMapRange')
    rampa.inputs['From Min'].default_value = -1
    rampa.inputs['From Max'].default_value = 1
    rampa.inputs['To Min'].default_value = 0.62
    rampa.inputs['To Max'].default_value = 1.25
    nt.links.new(coord.outputs['Generated'], sep.inputs[0])
    nt.links.new(sep.outputs['Z'], rampa.inputs['Value'])
    nt.links.new(rampa.outputs['Result'], fundo.inputs['Strength'])
    fundo.inputs['Color'].default_value = (1, 1, 1, 1)
    imT = imagem('luz')
    L = assar('DIFFUSE', imT, matBranco, de_alta=True, pass_filter={'DIRECT', 'INDIRECT'})[:, :, 0]
    marca('assado: luz')

    # 2) visibilidade e inclinação vistas da frente e de trás: um sol de cada lado, só luz direta (cos × sombra)
    nt.links.remove(fundo.inputs['Strength'].links[0])
    fundo.inputs['Strength'].default_value = 0
    sol_dados = bpy.data.lights.new('sol', 'SUN')
    sol_dados.energy = math.pi
    sol_dados.angle = 0
    sol = bpy.data.objects.new('sol', sol_dados)
    cena.collection.objects.link(sol)
    imV = imagem('vis')
    cena.cycles.samples = 4
    sol.rotation_euler = (math.radians(90), 0, 0)  # aponta para +Y: ilumina o que olha para -Y (a frente)
    VF = assar('DIFFUSE', imV, matBranco, pass_filter={'DIRECT'})[:, :, 0]
    sol.rotation_euler = (math.radians(-90), 0, 0)
    VB = assar('DIFFUSE', imV, matBranco, pass_filter={'DIRECT'})[:, :, 0]
    sol.hide_render = True
    marca('assado: visibilidade')

    # 3) as fotos projetadas na malha (ortográfico, pela posição): cor pré-multiplicada e alfa, frente e costas;
    #    a posição de cada texel (para achar vizinhos em 3D) e a máscara das ilhas
    def emissao(monta):
        m, nos, elos = material('emite')
        em = nos.new('ShaderNodeEmission')
        monta(nos, elos, em)
        o = nos.new('ShaderNodeOutputMaterial')
        elos.new(em.outputs[0], o.inputs[0])
        return m

    def projecao(img, cx, espelha, alfa):
        def monta(nos, elos, em):
            geo = nos.new('ShaderNodeNewGeometry')
            sepp = nos.new('ShaderNodeSeparateXYZ')
            elos.new(geo.outputs['Position'], sepp.inputs[0])
            def faixa_no(saida, a0, a1, b0, b1):
                n = nos.new('ShaderNodeMapRange')
                n.clamp = False
                n.inputs['From Min'].default_value = a0; n.inputs['From Max'].default_value = a1
                n.inputs['To Min'].default_value = b0; n.inputs['To Max'].default_value = b1
                elos.new(saida, n.inputs['Value'])
                return n.outputs['Result']
            u = faixa_no(sepp.outputs['X'], mn[0], mx[0], cx[1] if espelha else cx[0], cx[0] if espelha else cx[1])
            vv = faixa_no(sepp.outputs['Z'], mn[2], mx[2], cx[2], cx[3])
            comb = nos.new('ShaderNodeCombineXYZ')
            elos.new(u, comb.inputs['X']); elos.new(vv, comb.inputs['Y'])
            tex = nos.new('ShaderNodeTexImage')
            tex.image = img
            tex.extension = 'CLIP'
            elos.new(comb.outputs[0], tex.inputs['Vector'])
            if alfa:
                elos.new(tex.outputs['Alpha'], em.inputs['Color'])
            else:
                mul = nos.new('ShaderNodeMixRGB'); mul.blend_type = 'MULTIPLY'; mul.inputs['Fac'].default_value = 1
                elos.new(tex.outputs['Color'], mul.inputs['Color1']); elos.new(tex.outputs['Alpha'], mul.inputs['Color2'])
                elos.new(mul.outputs[0], em.inputs['Color'])
        return emissao(monta)

    def posicao():
        def monta(nos, elos, em):
            geo = nos.new('ShaderNodeNewGeometry')
            ma = nos.new('ShaderNodeVectorMath'); ma.operation = 'MULTIPLY_ADD'
            ma.inputs[1].default_value = (0.5, 0.5, 0.5); ma.inputs[2].default_value = (0.5, 0.5, 0.75)
            elos.new(geo.outputs['Position'], ma.inputs[0])
            elos.new(ma.outputs[0], em.inputs['Color'])
        return emissao(monta)

    def cheio():
        def monta(nos, elos, em):
            em.inputs['Color'].default_value = (1, 1, 1, 1)
        return emissao(monta)

    imgF.alpha_mode = 'STRAIGHT'; imgB.alpha_mode = 'STRAIGHT'
    cena.cycles.samples = 1
    imP = imagem('proj')
    Fc = assar('EMIT', imP, projecao(imgF, cxF, False, False))
    Fa = assar('EMIT', imP, projecao(imgF, cxF, False, True))[:, :, 0]
    Bc = assar('EMIT', imP, projecao(imgB, cxB, True, False))
    Ba = assar('EMIT', imP, projecao(imgB, cxB, True, True))[:, :, 0]
    P = (assar('EMIT', imP, posicao()) - np.array([0.5, 0.5, 0.75], dtype=np.float32)) * 2
    M = assar('EMIT', imP, cheio())[:, :, 0] > 0.5
    marca('assado: fotos, posição e máscara')
    np.savez_compressed(NPZ, L=L.astype(np.float16), VF=VF.astype(np.float16), VB=VB.astype(np.float16),
                        Fc=Fc.astype(np.float16), Fa=Fa.astype(np.float16), Bc=Bc.astype(np.float16),
                        Ba=Ba.astype(np.float16), P=P.astype(np.float32), M=M)

    # ---------- exporta ----------
    # x = 0 na haste do gancho
    leve.data.transform(Matrix.Translation((-x_haste, -y_haste, 0)))
    v2, mn2, mx2 = caixa(leve)
    medidas = {
        'id': ID,
        'tris': len(leve.data.polygons),
        'corte': round(float(-z_corte), 4),  # y (para baixo, em alturas) onde começa a madeira: a haste do gancho chega aqui
        'caixa': {'x0': round(float(mn2[0]), 4), 'x1': round(float(mx2[0]), 4), 'y1': round(float(-mn2[2]), 4),
                  'z0': round(float(-mx2[1]), 4), 'z1': round(float(-mn2[1]), 4)},  # no referencial do glTF (z = frente)
    }
    with open(os.path.join(SAIDA, f'{ID}.json'), 'w') as f:
        json.dump(medidas, f, indent=2)
    print('MEDIDAS', medidas)
    leve.data.materials.clear()
    bpy.ops.object.select_all(action='DESELECT')
    leve.select_set(True)
    bpy.context.view_layer.objects.active = leve
    bpy.ops.export_scene.gltf(filepath=os.path.join(SAIDA, f'{ID}.glb'), use_selection=True, export_format='GLB',
                              export_materials='NONE', export_normals=True, export_texcoords=True, export_yup=True,
                              export_apply=True)
    marca('exportado')


def misturar():
    """Dos assados para o atlas: foto onde ela vale, vizinhos de foto (em 3D) no resto."""
    A = np.load(NPZ)
    L = A['L'].astype(np.float32); VF = A['VF'].astype(np.float32); VB = A['VB'].astype(np.float32)
    Fc = A['Fc'].astype(np.float32); Fa = A['Fa'].astype(np.float32)
    Bc = A['Bc'].astype(np.float32); Ba = A['Ba'].astype(np.float32)
    P = A['P']; M = A['M']
    N = M.shape[0]

    def degrau(a, b, x):
        t = np.clip((x - a) / (b - a), 0, 1)
        return t * t * (3 - 2 * t)

    # a foto manda onde a superfície olha para a câmera dela (até ~75° de inclinação) e cai dentro do recorte
    wF = degrau(FOTO_DE, FOTO_ATE, VF) * degrau(0.9, 0.995, Fa) * M
    wB = degrau(FOTO_DE, FOTO_ATE, VB) * degrau(0.9, 0.995, Ba) * M
    soma = wF + wB
    conf = np.clip(soma, 0, 1)
    F = Fc / np.maximum(Fa, 1e-4)[:, :, None]
    B = Bc / np.maximum(Ba, 1e-4)[:, :, None]
    fotoCor = (F * wF[:, :, None] + B * wB[:, :, None]) / np.maximum(soma, 1e-5)[:, :, None]
    print('COBERTURA frente', round(float((wF > 0.5).sum() / M.sum()), 3), 'costas', round(float((wB > 0.5).sum() / M.sum()), 3))

    # o resto (laterais, ombros, dentro do capuz, o que uma parte esconde da outra) sai de dois campos de cor em 3D:
    #   - o das fotos: a cor dos pontos de foto bem de frente, espalhada num volume em volta da malha e borrada
    #     com peso. É um campo suave: o tom do tecido e os recortes de cor continuam pelas laterais;
    #   - o do Tripo, só em volta do cabide: ali a madeira e o tecido se encostam, e a vizinhança de foto mancharia
    #     o capuz de laranja. A textura do Tripo diz que parte é cada ponto (madeira ou tecido) e uma tabela
    #     aprendida onde as fotos mandam troca a cor dele pela cor de verdade daquela parte.
    # A textura do Tripo não entra no resto da peça: nas laterais ela inventa recortes e costuras.
    ok = (np.maximum(wF, wB) > 0.92) & M
    fonte = ok & (np.maximum(VF, VB) > max(0.5, FOTO_ATE))  # bem de frente: sem o brilho rasante da borda
    if fonte.sum() < 5000:
        fonte = ok
    rng = np.random.default_rng(7)

    def borra3(a):
        # caixa de 3 em cada um dos três primeiros eixos, sem dar a volta
        for eixo in range(3):
            b2 = a.copy()
            ante = [slice(None)] * a.ndim; post = [slice(None)] * a.ndim
            ante[eixo] = slice(1, None); post[eixo] = slice(None, -1)
            b2[tuple(ante)] += a[tuple(post)]
            b2[tuple(post)] += a[tuple(ante)]
            a = b2 / 3
        return a

    def campo(indices, valores, dim, perto, longe, cola):
        """Volume de médias: soma os valores nas células, borra com peso e completa o vazio com a média de longe."""
        C = np.zeros((*dim, valores.shape[-1]), dtype=np.float32)
        W = np.zeros(tuple(dim), dtype=np.float32)
        i = np.clip(indices, 0, np.array(dim) - 1).astype(np.int32)
        np.add.at(C, (i[:, 0], i[:, 1], i[:, 2]), valores)
        np.add.at(W, (i[:, 0], i[:, 1], i[:, 2]), 1)
        cP, wP = C, W
        for _ in range(perto):
            cP, wP = borra3(cP), borra3(wP)
        cL, wL = cP, wP
        for _ in range(longe):
            cL, wL = borra3(cL), borra3(wL)
        media = valores.mean(0)
        longe_ = (cL + media * 1e-5) / (wL + 1e-5)[..., None]
        return (cP + longe_ * cola) / (wP + cola)[..., None]

    def amostra(v, g):
        """Leitura trilinear do volume v nas coordenadas g (em células, centro da célula em +0,5)."""
        dim = np.array(v.shape[:3])
        g = np.clip(g - 0.5, 0, dim - 1.001)
        i0 = g.astype(np.int32)
        t = (g - i0).astype(np.float32)
        i1 = np.minimum(i0 + 1, dim - 1)
        sai = np.zeros((len(g), v.shape[-1]), dtype=np.float32)
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    ix = (i1 if dx else i0)[:, 0]; iy = (i1 if dy else i0)[:, 1]; iz = (i1 if dz else i0)[:, 2]
                    peso = (t[:, 0] if dx else 1 - t[:, 0]) * (t[:, 1] if dy else 1 - t[:, 1]) * (t[:, 2] if dz else 1 - t[:, 2])
                    sai += v[ix, iy, iz] * peso[:, None]
        return sai

    # a cor do Tripo por vértice da malha bruta (enxuga.mjs), levada ao referencial dos assados e a um volume com
    # voxels de 1,2 % da altura da peça
    pv = np.fromfile(os.path.join(SAIDA, f'{ID}-tripo-pos.f32'), dtype=np.float32).reshape(-1, 3)
    cv = np.fromfile(os.path.join(SAIDA, f'{ID}-tripo-cor.u8'), dtype=np.uint8).reshape(-1, 3).astype(np.float32) / 255
    cv = np.where(cv <= 0.04045, cv / 12.92, ((cv + 0.055) / 1.055) ** 2.4)  # sRGB → linear
    bx, by, bz = pv[:, 0], -pv[:, 2], pv[:, 1]  # glTF (y para cima) → Blender (z para cima)
    th = math.radians(GIRO)
    q = np.stack([bx * math.cos(th) - by * math.sin(th), bx * math.sin(th) + by * math.cos(th), bz], axis=1)
    qmn, qmx = q.min(0), q.max(0)
    q = (q - np.array([(qmn[0] + qmx[0]) / 2, (qmn[1] + qmx[1]) / 2, qmx[2]], dtype=np.float32)) / (qmx[2] - qmn[2])
    VOX = 0.012
    DIM = np.array([88, 56, 96])
    ORG = np.array([-0.528, -0.336, -1.09], dtype=np.float32)
    volT = campo((q - ORG) / VOX, cv, DIM, 0, 10, 0.05)

    # tabela Tripo → foto: 16³ caixas na cor do Tripo (em raiz, para abrir os escuros), média da foto em cada uma
    my, mx_ = np.nonzero(M)
    corT = np.zeros((N, N, 3), dtype=np.float32)
    corT[my, mx_] = amostra(volT, (P[my, mx_] - ORG) / VOX)
    CAIXAS = 16
    tabela = campo(np.sqrt(np.clip(corT[fonte], 0, 1)) * CAIXAS, fotoCor[fonte], (CAIXAS,) * 3, 1, 8, 0.3)
    volFoto = campo((P[fonte] - ORG) / VOX, fotoCor[fonte], DIM, 2, 24, 0.05)

    def porClasses(fy, fx):
        """Peça de recortes: em vez do campo suave (que borra a passagem de uma cor para a outra), cada ponto sem
        foto fica inteiro numa das cores da peça. Quem decide é a própria foto, projetada reto através da peça:
        o recorte da frente e o das costas viram duas paredes que atravessam a malha, e cada ponto fica do lado
        da parede em que cai (a da frente na metade da peça que olha para a frente, a das costas na outra). A divisa sai nítida, encosta sem degrau no recorte que a foto
        mostra e cruza o ombro e o alto da manga numa linha só, da frente até as costas."""
        cores = fotoCor[fonte]
        pos = (P[fonte] - ORG) / VOX
        # as cores da peça: k-médias na cor dos pontos de foto, partindo de faixas de luminância
        amostra_ = cores[rng.choice(len(cores), min(len(cores), 200000), replace=False)]
        lum_ = amostra_ @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
        cortes = np.quantile(lum_, [(k + 0.5) / CLASSES for k in range(CLASSES)])
        centros = np.stack([amostra_[np.argmin(np.abs(lum_ - c))] for c in cortes])
        for _ in range(12):
            perto_ = np.argmin(((amostra_[:, None, :] - centros[None]) ** 2).sum(-1), axis=1)
            centros = np.stack([amostra_[perto_ == k].mean(0) if (perto_ == k).any() else centros[k] for k in range(CLASSES)])
        classe = np.argmin(((cores[:, None, :] - centros[None]) ** 2).sum(-1), axis=1)
        print('CLASSES', np.round(centros, 3).tolist(), [int((classe == k).sum()) for k in range(CLASSES)])
        pf = P[fy, fx]
        g = (pf - ORG) / VOX
        # a classe que cada foto dá ao ponto (um-de-K), e quanto cada foto pesa ali
        def daFoto(cor, alfa):
            k = np.argmin(((cor[fy, fx][:, None, :] - centros[None]) ** 2).sum(-1), axis=1)
            return np.eye(CLASSES, dtype=np.float32)[k], (alfa[fy, fx] > 0.9).astype(np.float32)
        kF, valeF = daFoto(F, Fa)
        kB, valeB = daFoto(B, Ba)
        # frente ou costas? Um campo em 3D de "olha mais para a frente do que para trás", borrado: nas dobras do
        # alto da manga a escolha não fica trocando de lado a cada ruga (a divisa sairia em dentes)
        my_, mx2 = np.nonzero(M)
        lado_ = amostra(campo((P[my_, mx2] - ORG) / VOX, (VF - VB)[my_, mx2][:, None], DIM, 3, 12, 0.02), g)[:, 0]
        a = (lado_ > 0) * valeF + 1e-3 * valeF
        b = (lado_ <= 0) * valeB + 1e-3 * valeB
        voto = kF * a[:, None] + kB * b[:, None]
        # onde nenhuma foto alcança (fora do recorte das duas), a classe que domina em volta, em 3D
        falta = (a + b) <= 0
        if falta.any():
            for k in range(CLASSES):
                W = np.zeros(tuple(DIM), dtype=np.float32)
                i = np.clip(pos[classe == k], 0, DIM - 1).astype(np.int32)
                np.add.at(W, (i[:, 0], i[:, 1], i[:, 2]), 1)
                for _ in range(6):
                    W = borra3(W)
                voto[falta, k] = amostra(W[..., None], g[falta])[:, 0] + 1e-9
        um = np.eye(CLASSES, dtype=np.float32)
        cru = um[np.argmax(voto, axis=1)]
        # no que está inclinado para as duas fotos (ombros, alto das mangas, laterais), a parede do recorte corta a
        # malha num ângulo raso e qualquer ruga a faz subir e descer em dentes: ali vale a classe alisada em 3D (a fração de cada cor em
        # volta do ponto, entre os pontos de foto e os já decididos), que dá uma linha lisa
        fracao = campo(np.concatenate([pos, g]), np.concatenate([um[classe], cru]), DIM, 9, 12, 0.02)
        raso = (1 - degrau(0.52, 0.66, np.maximum(VF, VB)[fy, fx]))[:, None]
        final = np.argmax(cru * (1 - raso) + amostra(fracao, g) * raso, axis=1)
        w = um[final]
        # e a foto, que ali vem esticada, sai só onde ficou do lado errado da linha alisada (os dentes); onde ela
        # concorda com a linha, fica (com a luz e o tecido dela)
        discorda = np.argmin(((fotoCor[fy, fx][:, None, :] - centros[None]) ** 2).sum(-1), axis=1) != final
        conf[fy, fx] *= np.where(discorda, 1 - raso[:, 0], 1)
        cor_k = [amostra(campo(pos[classe == k], cores[classe == k], DIM, 3, 24, 0.05), g) for k in range(CLASSES)]
        return sum(cor_k[k] * w[:, k:k + 1] for k in range(CLASSES))

    with open(os.path.join(SAIDA, f'{ID}.json')) as f:
        corte = json.load(f)['corte']
    # o que precisa de cor além da foto: onde ela não manda por inteiro e, na peça de recortes, também o que está
    # inclinado (a foto pode perder ali para a linha alisada do recorte)
    fy, fx = np.nonzero(M & ((conf < 0.999) | ((np.maximum(VF, VB) < 0.68) if CLASSES > 1 else False)))
    pf = P[fy, fx]
    doCabide = degrau(-(corte + 0.15), -(corte + 0.08), pf[:, 2])[:, None]  # 1 em volta do cabide, 0 abaixo dele
    liso = porClasses(fy, fx) if CLASSES > 1 else amostra(volFoto, (pf - ORG) / VOX)
    viz = liso * (1 - doCabide) + amostra(tabela, np.sqrt(np.clip(corT[fy, fx], 0, 1)) * CAIXAS) * doCabide
    marca(f'campos de cor: {int(fonte.sum())} pontos de foto, {len(fy)} texels preenchidos')

    # grão do tecido: desvio do passa-alta da luminância onde a foto manda, devolvido como ruído no preenchimento
    def borra(a):
        return (a + np.roll(a, 1, 0) + np.roll(a, -1, 0) + np.roll(a, 1, 1) + np.roll(a, -1, 1)) / 5
    lum = fotoCor @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    dentro = borra(borra(ok.astype(np.float32))) > 0.999
    alta_freq = (lum - borra(borra(lum)))[dentro]
    grao = float(alta_freq.std()) if alta_freq.size > 1000 else 0.0
    ruido = rng.standard_normal((N, N)).astype(np.float32)
    ruido = (ruido + np.roll(ruido, 1, 0) + np.roll(ruido, 1, 1) + np.roll(np.roll(ruido, 1, 0), 1, 1)) / 2  # 2×2, desvio 1
    print('GRÃO', round(grao, 4))

    # luz de cúpula da malha de alta, relativa à das faces de foto: escurece frestas e o que olha para baixo
    ref = float(np.median(L[ok])) if ok.any() else 1.0
    luz = np.clip(L / max(ref, 1e-3), 0.55, 1.1) ** 0.6

    fill = np.zeros((N, N, 3), dtype=np.float32)
    fill[fy, fx] = viz
    fill = fill * luz[:, :, None] + (ruido * grao * 0.55)[:, :, None]
    cor = fotoCor * conf[:, :, None] + fill * (1 - conf)[:, :, None]
    cor = np.clip(cor, 0, 1)

    # estende as ilhas para fora (margem), para o filtro da textura não puxar o vazio nas costuras
    cheio = M.copy()
    for _ in range(20):
        soma_c = np.zeros_like(cor)
        soma_n = np.zeros((N, N), dtype=np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            c = np.roll(cor, (dy, dx), (0, 1))
            m = np.roll(cheio, (dy, dx), (0, 1)).astype(np.float32)
            soma_c += c * m[:, :, None]
            soma_n += m
        novo = (~cheio) & (soma_n > 0)
        cor[novo] = soma_c[novo] / soma_n[novo][:, None]
        cheio |= novo
    # o resto do vazio fica na cor média (some nos mip-maps em vez de escurecer as bordas)
    cor[~cheio] = cor[M].mean(0)

    fim = bpy.data.images.new('atlas', N, N, alpha=False, float_buffer=True)
    try:
        fim.colorspace_settings.name = 'Linear Rec.709'
    except TypeError:
        fim.colorspace_settings.name = 'Non-Color'
    px = np.ones((N, N, 4), dtype=np.float32)
    px[:, :, :3] = cor
    fim.pixels.foreach_set(px.ravel())
    # salva em sRGB de 8 bits, sem a transformação de vista
    cena.view_settings.view_transform = 'Standard'
    cena.render.image_settings.file_format = 'PNG'
    cena.render.image_settings.color_mode = 'RGB'
    cena.render.image_settings.color_depth = '8'
    fim.save_render(os.path.join(SAIDA, f'{ID}-atlas.png'), scene=cena)
    marca('atlas')


def conferir():
    """A malha leve com o atlas, sem luz, de vários ângulos (para olhar)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    c = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.join(SAIDA, f'{ID}.glb'))
    leve = [o for o in c.objects if o.type == 'MESH'][0]
    m, nos, elos = material('atlas')
    tex = nos.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(os.path.join(SAIDA, f'{ID}-atlas.png'))
    em = nos.new('ShaderNodeEmission'); elos.new(tex.outputs['Color'], em.inputs['Color'])
    o = nos.new('ShaderNodeOutputMaterial'); elos.new(em.outputs[0], o.inputs[0])
    leve.data.materials.clear()
    leve.data.materials.append(m)
    c.render.engine = 'BLENDER_WORKBENCH'
    c.display.shading.light = 'FLAT'
    c.display.shading.color_type = 'TEXTURE'
    c.display.render_aa = '8'
    c.view_settings.view_transform = 'Standard'
    c.render.film_transparent = True
    c.render.resolution_x = 1000
    c.render.resolution_y = 1250
    c.render.image_settings.file_format = 'PNG'
    c.render.image_settings.color_mode = 'RGBA'
    cam = bpy.data.cameras.new('cam'); cam.type = 'ORTHO'; cam.ortho_scale = 1.25
    co = bpy.data.objects.new('cam', cam); c.collection.objects.link(co); c.camera = co
    # (vista, giro da peça em graus, altura da câmera em graus): de frente, de lado, de costas e duas de cima,
    # que mostram os ombros e o alto das mangas
    vistas = [('frente', 0, 0), ('q', 50, 0), ('lado72', 72, 0), ('lado', 90, 0), ('costas', 180, 0), ('q2', 230, 0),
              ('alto', 55, 42), ('alto2', 235, 42),
              # o outro lado da peça (o que fica à vista no cano do site, com a peça a 60°)
              ('qe', -50, 0), ('ladoe', -72, 0), ('altoe', -55, 42), ('q2e', -230, 0)]
    centro = Vector((0, 0, -0.5))
    for nome, ang, sobe in vistas:
        a = math.radians(ang)
        e = math.radians(sobe)
        # a frente olha para -Y; girar a peça por +ang em torno de Z é girar a câmera por -ang
        co.location = centro + Vector((-math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e))) * 5
        co.rotation_euler = (centro - co.location).to_track_quat('-Z', 'Y').to_euler()
        c.render.filepath = os.path.join(SAIDA, f'{ID}-{PREFIXO}-{nome}.png')
        bpy.ops.render.render(write_still=True)


if SO_CONFERE:
    conferir()
    marca(f'CONFERIDO {ID}')
    sys.exit(0)
if not (SO_MISTURA and os.path.exists(NPZ)):
    assados()
misturar()
conferir()
marca(f'PRONTO {ID}')
