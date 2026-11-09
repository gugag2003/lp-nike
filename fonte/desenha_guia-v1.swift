// Desenha fonte/_guia-proporcao.png: silhueta chapada de um homem magro em roupa larga, nascida só dos números do alvo.
// Não decalca nada: cada ponto abaixo está em fração da altura do corpo (u a partir do eixo, t a partir do topo do cabelo).
// Medir o resultado: swift templates/prega/fonte/mede_corpo.swift templates/prega/fonte/_guia-proporcao.png
// Uso, da raiz do repo: swift templates/prega/fonte/desenha_guia.swift templates/prega/fonte/_guia-proporcao.png
import AppKit

// ---- números do alvo (mede_corpo.swift nos modelos do vídeo; a faixa medida está no comentário)
let CABECAS = 7.2            // altura em cabeças (6,75–7,9)
let LARGURA_CABECA = 0.107   // largura da cabeça na silhueta ÷ altura (0,102–0,117)
let LARGURA_PESCOCO = 0.076  // pescoço ÷ altura (0,076–0,081)
let OMBROS = 0.256           // silhueta na linha queixo + 0,55 cabeça ÷ altura (0,224–0,272)
let LARGURA_MANGAS = 0.316   // largura total nas mangas ÷ altura; é a largura/altura do corpo (0,285–0,337)
let VAO = 0.70               // alto do vão das pernas ÷ altura (0,667–0,726)
let PERNA = 0.115            // largura de cada perna da calça ÷ altura (0,094–0,129)
let K_QUEIXO = 1.17          // o mesmo do medidor: a mandíbula chega à largura do pescoço em cabeça ÷ K

// ---- enquadramento de fonte/_estilo.txt: 1024×1536, cabeça a 8 %, sola a 94 %
let W = 1024.0, H = 1536.0
let topo = H * 0.08, sola = H * 0.94, corpo = sola - topo
let eixo = W / 2

let cab = 1 / CABECAS
let mC = LARGURA_CABECA / 2, mP = LARGURA_PESCOCO / 2, mO = OMBROS / 2, mM = LARGURA_MANGAS / 2
let juncao = cab / K_QUEIXO

// Cabeça: meia-largura (em fração de mC) para cada altura (em fração da cabeça). A mandíbula fecha na largura do pescoço em juncao.
let lados: [(Double, Double)] = [
    (0.012, 0.28), (0.04, 0.50), (0.09, 0.70), (0.17, 0.86), (0.27, 0.97), (0.38, 1.0), (0.50, 0.97), (0.60, 0.92), (0.70, 0.86),
    (0.78, 0.81), (1 / K_QUEIXO - 0.015, 0.765), (1 / K_QUEIXO + 0.03, mP / mC + 0.01), (1.0, mP / mC), (1.12, mP / mC),
]
let cabeca: [(Double, Double)] = [(0, 0)] + lados.map { ($0.1 * mC, $0.0 * cab) } + lados.reversed().map { (-$0.1 * mC, $0.0 * cab) }

// Roupa de cima, uma peça só: tricô e as duas mangas, ombro caído. Peso na perna da direita da tela: esse ombro um pouco mais baixo.
let cima: [(Double, Double)] = [
    (0, cab * 0.85), (mP * 0.7, cab * 0.98), (mP * 0.95, cab * 1.05), (mP * 1.4, cab * 1.14), (mO * 0.62, cab * 1.26), (mO * 0.83, cab * 1.40),
    (mO * 0.97, cab * 1.53), (mO * 1.05, 0.233),
    (0.142, 0.27), (0.150, 0.32), (0.156, 0.37), (mM, 0.41), (0.154, 0.44), (0.146, 0.466), (0.134, 0.482),
    (0.118, 0.488), (0.109, 0.486), (0.06, 0.482), (0, 0.486), (-0.06, 0.484), (-0.106, 0.476), (-0.113, 0.478),
    (-0.120, 0.486), (-0.134, 0.490), (-0.148, 0.484), (-0.156, 0.46), (-mM, 0.42), (-0.155, 0.37), (-0.148, 0.32), (-0.139, 0.27),
    (-mO * 1.02, 0.232), (-mO * 0.95, cab * 1.50), (-mO * 0.83, cab * 1.36), (-mO * 0.62, cab * 1.22), (-mP * 1.4, cab * 1.12),
    (-mP * 0.95, cab * 1.04), (-mP * 0.7, cab * 0.98),
]
// fresta entre a manga solta e o tronco (branca, a única parte desenhada em branco)
let fresta: [(Double, Double)] = [(-0.107, 0.375), (-0.104, 0.405), (-0.105, 0.44), (-0.109, 0.462), (-0.112, 0.44), (-0.112, 0.405)]
// mão solta ao lado da coxa (o punho mais fino que a manga) e mão na lateral do quadril pegando a barra
let maoSolta: [(Double, Double)] = [
    (-0.143, 0.482), (-0.147, 0.505), (-0.149, 0.530), (-0.145, 0.553), (-0.135, 0.566), (-0.124, 0.564), (-0.116, 0.546), (-0.113, 0.515), (-0.118, 0.482),
]
let maoBarra: [(Double, Double)] = [
    (0.134, 0.478), (0.139, 0.50), (0.134, 0.52), (0.120, 0.529), (0.106, 0.524), (0.100, 0.505), (0.104, 0.482),
]
// Calça: quadril para o lado do apoio. A perna de apoio cai quase vertical e a solta abre para fora; as duas só se separam em VAO
// e têm PERNA de largura. Bainha com uma quebra, que alarga um pouco antes de pousar no tênis.
let pernaApoio: [(Double, Double)] = [
    (0.0, 0.47), (0.106, 0.47), (0.112, 0.49), (0.120, 0.53), (0.124, 0.58), (0.126, 0.64), (0.126, 0.70), (0.125, 0.76),
    (0.125, 0.82), (0.126, 0.87), (0.128, 0.915), (0.133, 0.94), (0.130, 0.958),
    (0.095, 0.962), (0.055, 0.960), (0.018, 0.954), (0.125 - PERNA, 0.93), (0.126 - PERNA, 0.88), (0.125 - PERNA, 0.82), (0.008, 0.76),
    (0.006, VAO + 0.015), (0.002, VAO + 0.002), (0.0, VAO - 0.02),
]
let pernaSolta: [(Double, Double)] = [
    (0.0, 0.47), (-0.104, 0.47), (-0.108, 0.49), (-0.113, 0.53), (-0.116, 0.58), (-0.118, 0.64), (-0.120, 0.70), (-0.123, 0.76),
    (-0.127, 0.82), (-0.130, 0.87), (-0.134, 0.915), (-0.140, 0.94), (-0.137, 0.958),
    (-0.105, 0.962), (-0.060, 0.960), (-0.026, 0.954), (-0.136 + PERNA, 0.93), (-0.130 + PERNA, 0.87), (-0.127 + PERNA, 0.82), (-0.006, 0.76),
    (-0.004, VAO + 0.015), (-0.001, VAO + 0.002), (0.0, VAO - 0.02),
]
// Tênis robustos em 3/4: bico para fora e calcanhar para dentro, com sola grossa de pontas redondas. Corte reto na linha da sola.
let tenisDir: [(Double, Double)] = [
    (0.018, 1.006), (0.012, 0.985), (0.018, 0.955), (0.048, 0.945), (0.083, 0.950), (0.106, 0.962), (0.130, 0.973), (0.146, 0.985), (0.150, 0.998), (0.147, 1.006),
]
let tenisEsq: [(Double, Double)] = [
    (-0.022, 1.006), (-0.016, 0.985), (-0.022, 0.955), (-0.052, 0.945), (-0.087, 0.950), (-0.110, 0.962), (-0.134, 0.973), (-0.150, 0.985), (-0.154, 0.998), (-0.151, 1.006),
]
let solaDir: [(Double, Double)] = [
    (0.012, 0.990), (0.018, 0.983), (0.09, 0.982), (0.148, 0.984), (0.154, 0.990), (0.155, 0.996), (0.150, 1.002), (0.14, 1.012), (0.02, 1.012), (0.012, 1.002), (0.010, 0.996),
]
let solaEsq: [(Double, Double)] = [
    (-0.016, 0.990), (-0.022, 0.983), (-0.094, 0.982), (-0.152, 0.984), (-0.158, 0.990), (-0.159, 0.996), (-0.154, 1.002), (-0.144, 1.012), (-0.024, 1.012), (-0.016, 1.002), (-0.014, 0.996),
]

// ---- desenho
guard CommandLine.arguments.count == 2 else { print("uso: swift desenha_guia.swift <saida.png>"); exit(1) }
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CGContext(data: nil, width: Int(W), height: Int(H), bitsPerComponent: 8, bytesPerRow: 0, space: cs,
                    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.setFillColor(CGColor(srgbRed: 1, green: 1, blue: 1, alpha: 1)); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
ctx.translateBy(x: 0, y: H); ctx.scaleBy(x: 1, y: -1)
ctx.clip(to: CGRect(x: 0, y: 0, width: W, height: sola))  // sola reta, na mesma linha para os dois pés
ctx.setFillColor(CGColor(srgbRed: 0.5, green: 0.5, blue: 0.5, alpha: 1))

// curva fechada suave por Catmull-Rom
func preenche(_ pontos: [(Double, Double)]) {
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
for parte in [pernaApoio, pernaSolta, tenisDir, tenisEsq, solaDir, solaEsq, maoSolta, maoBarra, cima, cabeca] { preenche(parte) }
ctx.setFillColor(CGColor(srgbRed: 1, green: 1, blue: 1, alpha: 1))
preenche(fresta)

let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
print("ok \(CommandLine.arguments[1])")
