import { FIleType } from '../type/file'

export function isSSA(filePath: string) {
  return filePath.endsWith(FIleType.SSA)
}

export function isASS (filePath: string) {
  return filePath.endsWith(FIleType.ASS)
}

export function isSRT(filePath: string) {
  return filePath.endsWith(FIleType.SRT)
}

export function isSUB(filePath: string) {
  return filePath.endsWith(FIleType.SUB)
}

export function isSubtitleFile (filePath: string) {
  return isSSA(filePath) || isASS(filePath) || isSRT(filePath) || isSUB(filePath)
}

export function getFileName (fsPath: string) {
  return fsPath.split('/').at(-1) || ''
}

export function getNonce() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

