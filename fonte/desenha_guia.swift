// Desenha fonte/_guia-proporcao.png: homem magro em roupa larga, em zonas chapadas de cinza, nascido só dos números do alvo.
// Não decalca nada: cada ponto abaixo está em fração da altura do corpo (x a partir do eixo, t a partir do topo do cabelo).
// Versão anterior, de um cinza só: desenha_guia-v1.swift e _guia-proporcao-v1.png.
// Medir o resultado: swift templates/prega/fonte/mede_corpo.swift templates/prega/fonte/_guia-proporcao.png
// Uso, da raiz do repo: swift templates/prega/fonte/desenha_guia.swift templates/prega/fonte/_guia-proporcao.png
import AppKit

// ---- números do alvo
let CABECAS = 7.1            // altura em cabeças
let LARGURA_CABECA = 0.113   // cabeça com cabelo ÷ altura (mínimo 0,110)
let LARGURA_PESCOCO = 0.076  // pescoço ÷ altura
let BARRA = 0.47             // borda entre tricô e calça
let VAO = 0.70               // alto do vão das pernas
let K_QUEIXO = 1.17          // o mesmo do medidor: a mandíbula chega à largura do pescoço em cabeça ÷ K

// ---- tons: tricô escuro, calça clara, pele e cabeça no meio, tênis em outro tom
let TRICO = 0.21, CALCA = 0.76, PELE = 0.53, TENIS = 0.37

// ---- enquadramento de fonte/_estilo.txt: 1024×1536, topo a 8 %, sola a 94 %
let W = 1024.0, H = 1536.0
let topo = H * 0.08, sola = H * 0.94, corpo = sola - topo
let eixo = W / 2

let cab = 1 / CABECAS
let mC = LARGURA_CABECA / 2, mP = LARGURA_PESCOCO / 2
let juncao = cab / K_QUEIXO  // linha em que a mandíbula já chegou ao pescoço, para o medidor achar o queixo

// Cabeça com cabelo: (t, meia-largura). Volume arredondado no alto, têmpora, orelha e mandíbula fechando no pescoço em juncao.
let perfilCabeca: [(Double, Double)] = [
    (0.0006, mC * 0.20), (0.003, mC * 0.42), (0.008, mC * 0.59), (0.016, mC * 0.77), (0.027, mC * 0.93), (0.040, mC * 0.99), (0.052, mC), (0.063, mC * 0.97),
    (0.072, mC * 0.925), (0.078, mC * 0.93), (0.084, mC * 0.965), (0.091, mC * 0.96), (0.097, mC * 0.89), (0.104, mC * 0.85), (0.111, mC * 0.80),
    (juncao - 0.003, mC * 0.75), (juncao + 0.0012, mP * 1.05), (juncao + 0.006, mP), (0.15, mP), (0.17, mP),
]
let HX = -0.006  // a cabeça vai um pouco para o lado do apoio
let cabeca: [(Double, Double)] = [(HX, 0)] + perfilCabeca.map { (HX + $0.1, $0.0) } + perfilCabeca.reversed().map { (HX - $0.1, $0.0) }

// Tronco do tricô, com a gola arredondada. Peso na perna da esquerda da imagem: aquele ombro um pouco mais baixo.
// A barra é a borda de baixo, em BARRA; a cintura fica mais justa que a barra, onde o tricô sobra. O ombro de fora é da manga.
let tronco: [(Double, Double)] = [
    (-0.003, 0.164), (0.015, 0.1615), (0.029, 0.1565), (0.038, 0.1505), (0.044, 0.1505), (0.053, 0.156), (0.068, 0.166), (0.088, 0.180), (0.108, 0.196), (0.121, 0.2075), (0.1265, 0.222),
    (0.114, 0.24), (0.105, 0.25), (0.098, 0.28), (0.094, 0.33), (0.092, 0.38), (0.094, 0.42), (0.101, 0.452), (0.106, BARRA - 0.004), (0.104, BARRA + 0.001),
    (0.06, BARRA + 0.002), (0.0, BARRA), (-0.06, BARRA), (-0.100, BARRA - 0.002), (-0.104, BARRA - 0.007),
    (-0.098, 0.445), (-0.089, 0.41), (-0.086, 0.37), (-0.088, 0.32), (-0.092, 0.28), (-0.102, 0.25), (-0.112, 0.24), (-0.122, 0.226),
    (-0.1175, 0.212), (-0.106, 0.200), (-0.086, 0.183), (-0.066, 0.168), (-0.053, 0.1575), (-0.047, 0.1515), (-0.041, 0.1515), (-0.032, 0.157), (-0.018, 0.1615),
]
// Braço solto (esquerda da imagem): o ombro continua a linha do tronco; manga da mesma largura até o punho.
let mangaSolta: [(Double, Double)] = [
    (-0.085, 0.215), (-0.106, 0.208), (-0.1195, 0.216), (-0.1265, 0.2295), (-0.133, 0.25), (-0.141, 0.29), (-0.147, 0.34), (-0.1505, 0.40), (-0.153, 0.45), (-0.153, 0.495), (-0.1505, 0.502),
    (-0.126, 0.505), (-0.102, 0.502), (-0.099, 0.495), (-0.0995, 0.45), (-0.098, 0.39), (-0.094, 0.33), (-0.09, 0.29), (-0.088, 0.26), (-0.08, 0.235),
]
// Mão relaxada, ~0,10 de comprimento: pulso fino, dorso, dedos um pouco fechados e o polegar do lado da coxa.
let maoSolta: [(Double, Double)] = [
    (-0.140, 0.498), (-0.1435, 0.515), (-0.146, 0.535), (-0.1455, 0.555), (-0.142, 0.575), (-0.136, 0.592), (-0.129, 0.600), (-0.1225, 0.595),
    (-0.119, 0.580), (-0.1155, 0.571), (-0.1095, 0.566), (-0.1065, 0.553), (-0.108, 0.538), (-0.111, 0.518), (-0.113, 0.498),
]
// Braço com a mão no bolso (direita da imagem): cotovelo para fora, antebraço voltando para o quadril, punho sobre a calça.
let mangaBolso: [(Double, Double)] = [
    (0.09, 0.212), (0.111, 0.204), (0.125, 0.2125), (0.132, 0.2265), (0.137, 0.245), (0.145, 0.285), (0.1515, 0.33), (0.1545, 0.37), (0.153, 0.395), (0.148, 0.425), (0.138, 0.46), (0.127, 0.495),
    (0.124, 0.502), (0.098, 0.496), (0.076, 0.489), (0.073, 0.483), (0.080, 0.46), (0.091, 0.425), (0.101, 0.397), (0.104, 0.37), (0.100, 0.33), (0.095, 0.29), (0.09, 0.26), (0.08, 0.235),
]
// Pulso entrando no bolso: o corte é a boca do bolso, em diagonal, dentro da calça. A mão fica escondida.
let pulsoBolso: [(Double, Double)] = [(0.112, 0.490), (0.110, 0.515), (0.107, 0.526), (0.095, 0.517), (0.083, 0.507), (0.078, 0.500), (0.080, 0.484)]

// Perna de apoio (esquerda da imagem): o quadril sai para esse lado e a perna desce para baixo do corpo.
let pernaApoio: [(Double, Double)] = [
    (0.0, 0.46), (-0.100, 0.46), (-0.108, 0.49), (-0.117, 0.53), (-0.122, 0.58), (-0.1245, 0.64), (-0.1235, 0.70), (-0.121, 0.76),
    (-0.118, 0.82), (-0.116, 0.865), (-0.1175, 0.888), (-0.1155, 0.905), (-0.118, 0.922), (-0.1165, 0.930),
    (-0.09, 0.931), (-0.05, 0.933), (-0.015, 0.930), (0.003, 0.926), (0.0035, 0.90), (0.0015, 0.86), (-0.002, 0.81), (-0.005, 0.76), (-0.003, 0.72), (-0.0003, VAO - 0.003), (0.0, VAO - 0.03),
]
// Perna solta (direita da imagem): abre para fora com caimento; o volume do punho no bolso marca o quadril.
let pernaSolta: [(Double, Double)] = [
    (0.0, 0.46), (0.102, 0.46), (0.110, 0.49), (0.119, 0.52), (0.1225, 0.56), (0.121, 0.60), (0.122, 0.66), (0.125, 0.72), (0.129, 0.78),
    (0.134, 0.84), (0.1385, 0.875), (0.1375, 0.895), (0.141, 0.92), (0.1385, 0.930),
    (0.11, 0.931), (0.08, 0.933), (0.045, 0.931), (0.022, 0.927), (0.020, 0.90), (0.0165, 0.84), (0.012, 0.79), (0.008, 0.75), (0.004, 0.72), (0.0003, VAO - 0.003), (0.0, VAO - 0.03),
]
// Tênis robustos em 3/4: bico para fora, calcanhar para dentro, uma saliência da sola no bico e sola reta na mesma linha nos dois pés.
let tenisApoio: [(Double, Double)] = [
    (-0.012, 1.004), (-0.001, 1.003), (0.0015, 0.99), (0.0015, 0.975), (0.0, 0.955), (-0.006, 0.93), (-0.055, 0.925), (-0.085, 0.933), (-0.104, 0.950), (-0.113, 0.966), (-0.116, 0.978), (-0.120, 0.984), (-0.1205, 0.995), (-0.116, 1.004), (-0.07, 1.004),
]
let tenisSolto: [(Double, Double)] = [
    (0.030, 1.004), (0.0185, 1.003), (0.0165, 0.99), (0.0165, 0.975), (0.018, 0.955), (0.025, 0.93), (0.075, 0.925), (0.105, 0.933), (0.125, 0.950), (0.136, 0.966), (0.141, 0.978), (0.1455, 0.984), (0.146, 0.995), (0.141, 1.004), (0.09, 1.004),
]

// ---- desenho
guard CommandLine.arguments.count == 2 else { print("uso: swift desenha_guia.swift <saida.png>"); exit(1) }
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: nil, width: Int(W), height: Int(H), bitsPerComponent: 8, bytesPerRow: 0, space: cs,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(srgbRed: 1, green: 1, blue: 1, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
ctx.translateBy(x: 0, y: H); ctx.scaleBy(x: 1, y: -1)
ctx.clip(to: CGRect(x: 0, y: 0, width: W, height: sola))  // sola reta, na mesma linha para os dois pés

// curva fechada suave por Catmull-Rom
func preenche(_ pontos: [(Double, Double)], _ tom: Double) {
    ctx.setFillColor(CGColor(srgbRed: tom, green: tom, blue: tom, alpha: 1))
    let p = pontos.map { CGPoint(x: eixo + $0.0 * corpo, y: topo + $0.1 * corpo) }
    let n = p.count
    ctx.move(to: p[0])
    for i in 0..<n {
        let a = p[(i + n - 1) % n], b = p[i], c = p[(i + 1) % n], d = p[(i + 2) % n]
        ctx.addCurve(to: c,
                     control1: CGPoint(x: b.x + (c.x - a.x) / 6, y: b.y + (c.y - a.y) / 6),
                     control2: CGPoint(x: c.x - (d.x - b.x) / 6, y: c.y - (d.y - b.y) / 6))
    }
    ctx.closePath(); ctx.fillPath()
}
// de trás para a frente: tênis, calça, cabeça e pescoço, mãos, tricô
for parte in [tenisApoio, tenisSolto] { preenche(parte, TENIS) }
for parte in [pernaApoio, pernaSolta] { preenche(parte, CALCA) }
for parte in [cabeca, maoSolta, pulsoBolso] { preenche(parte, PELE) }
for parte in [mangaSolta, mangaBolso, tronco] { preenche(parte, TRICO) }

let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
print("ok \(CommandLine.arguments[1])")
