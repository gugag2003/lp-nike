// Recorta o objeto em primeiro plano de uma foto (Vision, macOS 14+) e grava um PNG com alfa do mesmo tamanho.
// Uso: swift fonte/recorte.swift <entrada.png|jpg> <saida.png> (cópia de templates/shari/fonte; o acabamento fica em recorte.py)
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count == 3 else { print("uso: swift recorte.swift <entrada> <saida.png>"); exit(1) }
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: input) else { print("não abriu \(input.path)"); exit(1) }
let handler = VNImageRequestHandler(ciImage: ci)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { print("nenhum objeto encontrado"); exit(1) }
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: false)
let masked = CIImage(cvPixelBuffer: buffer)
let ctx = CIContext()
guard let cg = ctx.createCGImage(masked, from: masked.extent) else { print("falhou ao renderizar"); exit(1) }
let rep = NSBitmapImageRep(cgImage: cg)
try rep.representation(using: .png, properties: [:])!.write(to: output)
print("ok \(output.path) \(cg.width)×\(cg.height)")
