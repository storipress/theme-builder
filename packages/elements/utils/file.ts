// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer'
import isBufferAnimated from 'is-animated'
import png from 'is-animated/lib/types/png'

// The `is-animated` check for some apng files will return false because its conditions are more strict. I copyed its code, pasted below, and disabled those conditions.
const isAPNG = function (buffer: Buffer) {
  let hasACTL = false
  let hasIDAT = false
  let hasFDAT = false

  // let previousChunkType = ''

  let offset = 8

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset)
    const chunkType = buffer.slice(offset + 4, offset + 8).toString('ascii')

    switch (chunkType) {
      case 'acTL':
        hasACTL = true
        break

      case 'IDAT':
        if (!hasACTL) {
          return false
        }

        // if (previousChunkType !== 'fcTL' && previousChunkType !== 'IDAT') {
        //   return false
        // }

        hasIDAT = true
        break

      case 'fdAT':
        if (!hasIDAT) {
          return false
        }

        // if (previousChunkType !== 'fcTL' && previousChunkType !== 'fdAT') {
        //   return false
        // }

        hasFDAT = true
        break
    }

    // previousChunkType = chunkType
    offset += 4 + 4 + chunkLength + 4
  }

  return hasACTL && hasIDAT && hasFDAT
}

export function isAnimated(file: File): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.addEventListener('load', () => {
      const buffer = Buffer.from(fileReader.result as ArrayBuffer)
      return png.isPNG(buffer) ? resolve(isAPNG(buffer)) : resolve(isBufferAnimated(buffer))
    })
    fileReader.addEventListener('error', reject)
    fileReader.readAsArrayBuffer(file)
  })
}
