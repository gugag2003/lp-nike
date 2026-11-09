// Mede a proporção de uma pessoa de corpo inteiro em fundo branco (macOS, Vision, sem dependências).
// Uso, da raiz do repo:
//   swift templates/prega/fonte/mede_corpo.swift <imagem> [--regiao x,y,l,a] [--amplia N] [--fundo 0-255] [--conferir saida.png]
// --regiao recorta antes de medir (quadro com mais de uma pessoa); --amplia aumenta a imagem antes do Vision
// (rosto pequeno; as medidas saem em px da imagem de entrada); --conferir grava a imagem com as linhas achadas.
//
// O que cada medida quer dizer:
//   topo: primeira linha da silhueta (alto do cabelo). sola: última linha da silhueta, sem a sombra do chão.
//   queixo: ponto mais baixo do contorno facial do Vision (faceContour). Sem rosto (o guia não tem), sai da silhueta:
//     topo + (pescoço − topo) × K_QUEIXO, com o pescoço na primeira linha que chega à largura mais estreita abaixo da
//     cabeça. queixo_origem diz qual; altura_em_cabecas_silhueta sai sempre por esse método, para comparar com o guia.
//     Em plano desfocado do vídeo o Vision não acha rosto e vale a silhueta. Cabelo que cobre o pescoço invalida a silhueta.
//   cabeças: altura do corpo ÷ altura da cabeça (topo até o queixo).
//   largura da cabeça: largura do contorno facial; sem rosto, a linha mais larga da cabeça na silhueta.
//   ombros: largura da silhueta na linha queixo + 0,55 cabeça, onde a roupa já cobre o ombro em todos os casos.
//     ombros_ossos é a distância entre as articulações do Vision (null se ele não achar corpo).
//   vão: linha mais alta de fundo branco na faixa central entre as pernas, abaixo do quadril (e nunca acima de 50 %).
//     Com as pernas encostadas o branco só aparece mais abaixo: vao_ate_o_alto = false quando o vão fica abaixo de 62 %.
//   barra: onde a peça de cima termina, coluna a coluna, na faixa central do corpo: primeira linha, entre 36 % e 68 % da altura, em que a cor deixa de ser a da peça (a meio caminho da calça).
//     barra_frac é a mediana (camiseta aparecendo por baixo não conta: a primeira troca é a barra de cima). barra_frac_min e _max (percentis 10 e 90) mostram a barra torta ou levantada. Com braços cruzados sobre a barra a medida fica incerta: conferir a linha roxa em --conferir.
//   perfil: largura da silhueta ÷ altura do corpo, a cada 5 % da altura.
import AppKit
import CoreImage
import Vision

// ---- argumentos
var args = Array(CommandLine.arguments.dropFirst())
func opcao(_ nome: String) -> String? {
    guard let i = args.firstIndex(of: nome), i + 1 < args.count else { return nil }
    let v = args[i + 1]; args.removeSubrange(i...(i + 1)); return v
}
let regiaoTxt = opcao("--regiao"), conferir = opcao("--conferir"), amplia = Int(opcao("--amplia") ?? "") ?? 0
let limiteFundo = Int(opcao("--fundo") ?? "") ?? 238  // abaixar em plano desfocado, onde o vão estreito não chega ao branco
guard args.count == 1 else {
    print("uso: swift mede_corpo.swift <imagem> [--regiao x,y,l,a] [--amplia N] [--conferir saida.png]"); exit(1)
}
let K_QUEIXO = 1.17  // (queixo − topo) ÷ (pescoço − topo) nas fotos nítidas de cabelo curto: 1,15–1,19 no modelo 01 do vídeo, 1,20 em look01. Erro de ±3 %

// ---- imagem em RGBA 8 bits, sobre branco
guard let nsimg = NSImage(contentsOfFile: args[0]), var cg = nsimg.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("não abriu \(args[0])"); exit(1)
}
if let txt = regiaoTxt {
    let p = txt.split(separator: ",").compactMap { Int($0) }
    guard p.count == 4, let c = cg.cropping(to: CGRect(x: p[0], y: p[1], width: p[2], height: p[3])) else { print("--regiao inválida"); exit(1) }
    cg = c
}
let fator = amplia > 0 ? amplia : (cg.height < 1000 ? 3 : 1)  // quadro de vídeo: o rosto tem ~50 px e o Vision erra menos ampliado
let W = cg.width * fator, H = cg.height * fator
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: cs,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(.white); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
ctx.interpolationQuality = .high
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
let img = ctx.makeImage()!
let px = ctx.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)
let linhaBytes = ctx.bytesPerRow
func cor(_ x: Int, _ y: Int) -> (Int, Int, Int) {
    let i = y * linhaBytes + x * 4
    return (Int(px[i]), Int(px[i + 1]), Int(px[i + 2]))
}
func eFundo(_ x: Int, _ y: Int) -> Bool { let c = cor(x, y); return min(c.0, c.1, c.2) >= limiteFundo }

// ---- máscara: Vision, com a instância que fica no meio do quadro; sem resultado, cai para a cor
var mascara = [Bool](repeating: false, count: W * H)
let handler = VNImageRequestHandler(cgImage: img, options: [:])
let reqFundo = VNGenerateForegroundInstanceMaskRequest()
try? handler.perform([reqFundo])
var mascaraOrigem = "cor"
if let res = reqFundo.results?.first {
    var melhor = -1
    for inst in res.allInstances {
        guard let buf = try? res.generateScaledMaskForImage(forInstances: IndexSet(integer: inst), from: handler) else { continue }
        CVPixelBufferLockBaseAddress(buf, .readOnly)
        let bw = CVPixelBufferGetWidth(buf), bh = CVPixelBufferGetHeight(buf), br = CVPixelBufferGetBytesPerRow(buf)
        let base = CVPixelBufferGetBaseAddress(buf)!
        var m = [Bool](repeating: false, count: W * H), area = 0, meio = 0
        for y in 0..<min(bh, H) {
            let linha = (base + y * br).assumingMemoryBound(to: Float32.self)
            for x in 0..<min(bw, W) where linha[x] > 0.5 {
                m[y * W + x] = true; area += 1
                if abs(x - W / 2) < W / 8 { meio += 1 }
            }
        }
        CVPixelBufferUnlockBaseAddress(buf, .readOnly)
        let nota = meio * 4 + area
        if nota > melhor { melhor = nota; mascara = m; mascaraOrigem = "vision" }
    }
}
if mascaraOrigem == "cor" {  // silhueta chapada ou imagem em que o Vision não acha objeto: tudo que não é branco
    for y in 0..<H { for x in 0..<W where !eFundo(x, y) { mascara[y * W + x] = true } }
}

// só o maior pedaço conexo
var rotulo = [Int32](repeating: 0, count: W * H), maiorArea = 0, maiorRot: Int32 = 0, proximo: Int32 = 0
var pilha = [Int]()
for ini in 0..<(W * H) where mascara[ini] && rotulo[ini] == 0 {
    proximo += 1; rotulo[ini] = proximo; pilha = [ini]; var area = 0
    while let p = pilha.popLast() {
        area += 1
        let x = p % W, y = p / W
        if x > 0, mascara[p - 1], rotulo[p - 1] == 0 { rotulo[p - 1] = proximo; pilha.append(p - 1) }
        if x < W - 1, mascara[p + 1], rotulo[p + 1] == 0 { rotulo[p + 1] = proximo; pilha.append(p + 1) }
        if y > 0, mascara[p - W], rotulo[p - W] == 0 { rotulo[p - W] = proximo; pilha.append(p - W) }
        if y < H - 1, mascara[p + W], rotulo[p + W] == 0 { rotulo[p + W] = proximo; pilha.append(p + W) }
    }
    if area > maiorArea { maiorArea = area; maiorRot = proximo }
}
for i in 0..<(W * H) { mascara[i] = rotulo[i] == maiorRot }
guard maiorArea > 0 else { print("nenhuma silhueta"); exit(1) }

// ---- caixa e perfil. Uma linha só conta com pelo menos 1 % da largura preenchida (ruído de borda fica de fora)
var ini = [Int](repeating: -1, count: H), fim = [Int](repeating: -1, count: H)
for y in 0..<H {
    var a = -1, b = -1
    for x in 0..<W where mascara[y * W + x] { if a < 0 { a = x }; b = x }
    ini[y] = a; fim[y] = b
}
let linhasCheias = (0..<H).filter { ini[$0] >= 0 && fim[$0] - ini[$0] >= max(2, W / 200) }
guard let topo = linhasCheias.first, var sola = linhasCheias.last else { print("silhueta vazia"); exit(1) }
// A máscara do Vision às vezes pega o começo da sombra do chão. A sombra é larga, sem borda e clara: sobe a sola
// enquanto a linha, dentro da máscara, não tiver nenhum pixel realmente escuro nem o branco da sola com borda.
func linhaTemObjeto(_ y: Int) -> Bool {
    guard ini[y] >= 0 else { return false }
    var duros = 0
    for x in ini[y]...fim[y] where mascara[y * W + x] { let c = cor(x, y); if min(c.0, c.1, c.2) < 170 { duros += 1 } }
    return duros >= max(2, W / 400)
}
var sobe = 0
while sobe < H / 40, sola > topo, !linhaTemObjeto(sola) { sola -= 1; sobe += 1 }
if sobe >= H / 40 { sola += sobe }  // nada escuro por muito tempo: sola clara, fica o que a máscara disse
let altura = sola - topo + 1
var xMin = W, xMax = 0
for y in topo...sola where ini[y] >= 0 { xMin = min(xMin, ini[y]); xMax = max(xMax, fim[y]) }

// ---- rosto e corpo no Vision
let reqRosto = VNDetectFaceLandmarksRequest()
let reqCorpo = VNDetectHumanBodyPoseRequest()
try? handler.perform([reqRosto, reqCorpo])
func paraImagem(_ p: CGPoint) -> CGPoint { CGPoint(x: p.x * CGFloat(W), y: (1 - p.y) * CGFloat(H)) }
// o rosto dentro da silhueta medida, se houver mais de um no quadro
var queixoVision: Double? = nil, larguraRosto: Double? = nil, contorno: [CGPoint] = []
func leContorno(_ obs: [VNFaceObservation]) {
    let dentro = obs.filter { f in
        let c = paraImagem(CGPoint(x: f.boundingBox.midX, y: f.boundingBox.midY))
        return c.x >= CGFloat(xMin) && c.x <= CGFloat(xMax) && c.y >= CGFloat(topo) && c.y <= CGFloat(topo + altura / 3)
    }
    guard let f = dentro.max(by: { $0.boundingBox.width < $1.boundingBox.width }), let reg = f.landmarks?.faceContour else { return }
    contorno = reg.normalizedPoints.map { n in
        paraImagem(CGPoint(x: f.boundingBox.minX + n.x * f.boundingBox.width, y: f.boundingBox.minY + n.y * f.boundingBox.height))
    }
    queixoVision = contorno.map { Double($0.y) }.max()
    let xs = contorno.map { Double($0.x) }
    larguraRosto = xs.max()! - xs.min()!
}
leContorno(reqRosto.results ?? [])

// ---- pescoço e cabeça pela silhueta: linha mais larga do alto, depois a mais estreita antes de abrir para os ombros
let fimBusca = topo + altura * 26 / 100
var linhaCabecaLarga = topo, larguraCabecaSil = 0
for y in topo...(topo + altura / 8) where ini[y] >= 0 {
    let l = fim[y] - ini[y] + 1
    if l > larguraCabecaSil { larguraCabecaSil = l; linhaCabecaLarga = y }
}
var larguraPescoco = larguraCabecaSil, fimPescoco = linhaCabecaLarga
for y in linhaCabecaLarga...fimBusca where ini[y] >= 0 {
    let l = fim[y] - ini[y] + 1
    if l < larguraPescoco { larguraPescoco = l }
    if l > larguraCabecaSil * 3 / 2 { break }  // já é ombro
    fimPescoco = y
}
// junção queixo-pescoço: a primeira linha que já chegou (com folga de 6 %) à largura mais estreita
var pescoco = fimPescoco
for y in linhaCabecaLarga...fimPescoco where ini[y] >= 0 && Double(fim[y] - ini[y] + 1) <= Double(larguraPescoco) * 1.06 { pescoco = y; break }
let queixoSilhueta = Double(topo) + Double(pescoco - topo) * K_QUEIXO
let queixo = queixoVision ?? queixoSilhueta
let queixoOrigem = queixoVision != nil ? "vision" : "silhueta"
let alturaCabeca = queixo - Double(topo)
let larguraCabeca = larguraRosto ?? Double(larguraCabecaSil)

// ---- ombros e larguras
let linhaOmbro = min(sola, Int(queixo + 0.55 * alturaCabeca))
let larguraOmbros = ini[linhaOmbro] >= 0 ? Double(fim[linhaOmbro] - ini[linhaOmbro] + 1) : 0
var larguraMaxLinha = 0, linhaMax = topo
for y in topo...sola where ini[y] >= 0 {
    let l = fim[y] - ini[y] + 1
    if l > larguraMaxLinha { larguraMaxLinha = l; linhaMax = y }
}
var ombrosOssos: Double? = nil, quadrilFrac: Double? = nil, ossos: [(CGPoint)] = []
if let corpo = reqCorpo.results?.first, let pts = try? corpo.recognizedPoints(.all) {
    func ponto(_ n: VNHumanBodyPoseObservation.JointName) -> CGPoint? {
        guard let p = pts[n], p.confidence > 0.2 else { return nil }
        return paraImagem(p.location)
    }
    if let a = ponto(.leftShoulder), let b = ponto(.rightShoulder) { ombrosOssos = Double(hypot(a.x - b.x, a.y - b.y)); ossos += [a, b] }
    if let a = ponto(.leftHip), let b = ponto(.rightHip) {
        quadrilFrac = (Double(a.y + b.y) / 2 - Double(topo)) / Double(altura); ossos += [a, b]
    }
}

// ---- vão das pernas: fundo branco numa faixa central, do quadril para baixo
let centroBaixo: Int = {
    var soma = 0, n = 0
    for y in (topo + altura * 55 / 100)...sola where ini[y] >= 0 { soma += ini[y] + fim[y]; n += 2 }
    return n > 0 ? soma / n : W / 2
}()
let meiaFaixa = max(2, (xMax - xMin + 1) * 18 / 100)
let minimoGrosso = max(2, H / 700)  // alguns px de largura, para não pegar reflexo no jeans
let quadrilLinha = quadrilFrac.map { topo + Int($0 * Double(altura)) } ?? (topo + altura / 2)
// começa abaixo do osso do quadril e nunca antes de 50 %: acima disso o branco é camiseta aparecendo na barra
var vao: Int? = nil
var yVao = max(quadrilLinha + altura * 2 / 100, topo + altura / 2)
let descida = max(3, altura / 120)  // o branco precisa continuar para baixo: mancha clara no tecido não é vão
buscaVao: while yVao <= sola - altura / 100 {
    var seguidos = 0
    for x in max(0, centroBaixo - meiaFaixa)...min(W - 1, centroBaixo + meiaFaixa) {
        if eFundo(x, yVao), x > ini[yVao], x < fim[yVao] {  // entre partes da silhueta, não na borda de fora
            seguidos += 1
            if seguidos >= minimoGrosso {
                let meio = x - seguidos / 2
                if (1...descida).allSatisfy({ yVao + $0 < H && eFundo(meio, yVao + $0) }) { vao = yVao; break buscaVao }
            }
        } else { seguidos = 0 }
    }
    yVao += 1
}
// pernas: larguras dos trechos preenchidos em três alturas, como fração da altura do corpo
func trechos(_ y: Int) -> [Double] {
    var res = [Double](), a = -1
    for x in 0...W {
        let dentro = x < W && mascara[y * W + x] && !eFundo(x, y)
        if dentro, a < 0 { a = x }
        if !dentro, a >= 0 {
            if x - a >= altura / 100 { res.append(Double(x - a) / Double(altura)) }
            a = -1
        }
    }
    return res
}
// ---- barra da peça de cima
let barras: [Int] = {
    let meia = altura / 9, faixaY = max(2, altura / 60)  // média de ~1,7 % da altura abaixo da linha: ignora nervura, dobra fina e ruído
    let y0 = topo + altura * 36 / 100, y1 = topo + altura * 68 / 100
    var res = [Int]()
    func dist(_ a: (Double, Double, Double), _ b: (Double, Double, Double)) -> Double {
        ((a.0 - b.0) * (a.0 - b.0) + (a.1 - b.1) * (a.1 - b.1) + (a.2 - b.2) * (a.2 - b.2)).squareRoot()
    }
    for x in stride(from: max(0, centroBaixo - meia), to: min(W, centroBaixo + meia), by: max(1, altura / 200)) {
        func media(_ a: Int, _ b: Int) -> (Double, Double, Double) {
            var s = (0.0, 0.0, 0.0)
            for y in a..<b { let c = cor(x, y); s.0 += Double(c.0); s.1 += Double(c.1); s.2 += Double(c.2) }
            let n = Double(b - a); return (s.0 / n, s.1 / n, s.2 / n)
        }
        // cor da peça de cima na própria coluna; a barra é onde o tecido deixa de ser ela, a meio caminho da calça
        let peca = media(y0 - altura * 3 / 100, y0), calca = media(topo + altura * 70 / 100, topo + altura * 74 / 100)
        let corte = max(50, dist(peca, calca) * 0.5)
        // a troca precisa durar: sombra de braço cruzado ou de dobra não passa de uns 3 % da altura
        let dura = altura * 5 / 100
        if let y = (y0...y1).first(where: { y in stride(from: y, through: y + dura, by: faixaY).allSatisfy { dist(media($0, $0 + faixaY), peca) >= corte } }) { res.append(y + faixaY / 2) }
    }
    return res.sorted()
}()
let barra: Int? = barras.isEmpty ? nil : barras[barras.count / 2]

// ---- saída
func r(_ v: Double, _ casas: Int = 3) -> NSDecimalNumber { NSDecimalNumber(string: String(format: "%.\(casas)f", v)) }
let f = Double(fator)
var perfil: [String: NSDecimalNumber] = [:]
for pct in stride(from: 5, through: 100, by: 5) {
    let y = min(sola, topo + altura * pct / 100)
    if ini[y] >= 0 { perfil[String(format: "%03d", pct)] = r(Double(fim[y] - ini[y] + 1) / Double(altura)) }
}
var pernas: [String: [NSDecimalNumber]] = [:]
for pct in [70, 80, 90] { pernas[String(pct)] = trechos(min(sola, topo + altura * pct / 100)).map { r($0) } }
var saida: [String: Any] = [
    "imagem": args[0],
    "regiao": regiaoTxt ?? NSNull(),
    "ampliacao": fator,
    "mascara_origem": mascaraOrigem,
    "topo_px": r(Double(topo) / f, 1),
    "queixo_px": r(queixo / f, 1),
    "sola_px": r(Double(sola) / f, 1),
    "altura_corpo_px": r(Double(altura) / f, 1),
    "largura_silhueta_px": r(Double(xMax - xMin + 1) / f, 1),
    "largura_altura": r(Double(xMax - xMin + 1) / Double(altura)),
    "largura_maior_linha_altura": r(Double(larguraMaxLinha) / Double(altura)),
    "linha_maior_largura_frac": r(Double(linhaMax - topo) / Double(altura)),
    "altura_cabeca_px": r(alturaCabeca / f, 1),
    "queixo_origem": queixoOrigem,
    "altura_em_cabecas": r(Double(altura) / alturaCabeca, 2),
    "altura_em_cabecas_silhueta": r(Double(altura) / (queixoSilhueta - Double(topo)), 2),
    "largura_cabeca_silhueta_frac_altura": r(Double(larguraCabecaSil) / Double(altura)),
    "altura_cabeca_frac_altura": r(alturaCabeca / Double(altura)),
    "largura_cabeca_px": r(larguraCabeca / f, 1),
    "largura_cabeca_origem": larguraRosto != nil ? "contorno_facial" : "silhueta",
    "largura_cabeca_silhueta_px": r(Double(larguraCabecaSil) / f, 1),
    "cabeca_largura_altura": r(larguraCabeca / alturaCabeca),
    "ombros_px": r(larguraOmbros / f, 1),
    "ombros_em_larguras_de_cabeca": r(larguraOmbros / larguraCabeca, 2),
    "ombros_em_larguras_de_cabeca_silhueta": r(larguraOmbros / Double(larguraCabecaSil), 2),
    "ombros_frac_altura": r(larguraOmbros / Double(altura)),
    "ombros_ossos_em_larguras_de_cabeca": ombrosOssos.map { r($0 / larguraCabeca, 2) } ?? NSNull(),
    "quadril_ossos_frac": quadrilFrac.map { r($0) } ?? NSNull(),
    "barra_frac": barra.map { r(Double($0 - topo) / Double(altura)) } ?? NSNull(),
    "barra_frac_min": barra.map { _ in r(Double(barras[barras.count / 10] - topo) / Double(altura)) } ?? NSNull(),
    "barra_frac_max": barra.map { _ in r(Double(barras[barras.count * 9 / 10] - topo) / Double(altura)) } ?? NSNull(),
    "barra_px": barra.map { r(Double($0) / f, 1) } ?? NSNull(),
    "vao_frac": vao.map { r(Double($0 - topo) / Double(altura)) } ?? NSNull(),
    "vao_px": vao.map { r(Double($0) / f, 1) } ?? NSNull(),
    "vao_ate_o_alto": vao.map { Double($0 - topo) / Double(altura) < 0.62 } ?? false,
    "pescoco_frac": r(Double(pescoco - topo) / Double(altura)),
    "calibra_queixo": queixoVision.map { r(($0 - Double(topo)) / Double(pescoco - topo)) } ?? NSNull(),
    "centro_silhueta_x_frac": r((Double(xMin + xMax) / 2) / Double(W)),
    "topo_frac_imagem": r(Double(topo) / Double(H)),
    "sola_frac_imagem": r(Double(sola) / Double(H)),
    "perfil_largura": perfil,
    "pernas_frac_altura": pernas,
]
let dados = try JSONSerialization.data(withJSONObject: saida, options: [.prettyPrinted, .sortedKeys])
print(String(data: dados, encoding: .utf8)!)

// ---- imagem de conferência: contorno da máscara e linhas achadas
if let destino = conferir {
    ctx.saveGState()
    ctx.translateBy(x: 0, y: CGFloat(H)); ctx.scaleBy(x: 1, y: -1)  // de cima para baixo, como a medida
    func linha(_ y: Double, _ c: NSColor, _ x0: Int? = nil, _ x1: Int? = nil) {
        ctx.setStrokeColor(c.cgColor); ctx.setLineWidth(CGFloat(max(1, H / 700)))
        ctx.move(to: CGPoint(x: CGFloat(x0 ?? xMin - W / 20), y: CGFloat(y)))
        ctx.addLine(to: CGPoint(x: CGFloat(x1 ?? xMax + W / 20), y: CGFloat(y))); ctx.strokePath()
    }
    ctx.setFillColor(NSColor.systemGreen.withAlphaComponent(0.8).cgColor)
    let passo = max(1, H / 1500)
    for y in stride(from: 0, to: H - 1, by: 1) { for x in stride(from: 0, to: W - 1, by: 1) {
        let a = mascara[y * W + x]
        if a != mascara[y * W + x + 1] || a != mascara[(y + 1) * W + x] { ctx.fill(CGRect(x: x, y: y, width: passo, height: passo)) }
    } }
    linha(Double(topo), .systemRed); linha(queixo, .systemRed); linha(Double(sola), .systemRed)
    linha(Double(linhaOmbro), .systemBlue, ini[linhaOmbro], fim[linhaOmbro])
    if let v = vao { linha(Double(v), .systemOrange, centroBaixo - meiaFaixa, centroBaixo + meiaFaixa) }
    if let b = barra { linha(Double(b), .systemPurple) }
    ctx.setFillColor(NSColor.systemYellow.cgColor)
    for p in contorno { ctx.fillEllipse(in: CGRect(x: p.x - CGFloat(passo * 2), y: p.y - CGFloat(passo * 2), width: CGFloat(passo * 4), height: CGFloat(passo * 4))) }
    ctx.setFillColor(NSColor.systemPink.cgColor)
    for p in ossos { ctx.fillEllipse(in: CGRect(x: p.x - CGFloat(passo * 4), y: p.y - CGFloat(passo * 4), width: CGFloat(passo * 8), height: CGFloat(passo * 8))) }
    ctx.restoreGState()
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: destino))
}
