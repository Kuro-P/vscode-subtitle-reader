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

export interface StyleConfig {
  html?: { [key: string]: string },
  sectionTitle?: { [key: string]: string },
  fileName?: { [key: string]: string },
  dialogue?: { [key: string]: string }
}

export function processingStyle(style: StyleConfig): string {
  if (!style) {
    return ''
  }

  const getElClassName = (el: string) => {
    const elClassMap = {
      'html': 'html',
      'sectionTitle': '.section-title',
      'fileName': '.file-name',
      'dialogueLine': '.dialogue-line',
      'lineNumber': '.line-number',
      'timeAxis': '.dialogue-line .time',
      'primaryText': '.primary-text',
      'secondaryText': '.secondary-text'
    }

    return elClassMap[el as keyof typeof elClassMap] || el
  }

  let cssStr = ''
  for (let el in style) {
    const curStyle = style[el as keyof typeof style]
    const curClassName = getElClassName(el)

    if (!curStyle || !curClassName || Object.keys(curStyle).length <= 0) {
      continue
    }

    const cssPropsStr = Object.keys(curStyle).reduce((prevCSS, curKey) => {
      return prevCSS + `${ curKey }: ${curStyle[curKey] }; `
    }, '')

    if (el === 'primaryText') {
      cssStr += `
        .content[data-lang-primary="primary"] .primary-text {
          ${ cssPropsStr }
        }

        .content[data-lang-primary="secondary"] .secondary-text {
          ${ cssPropsStr }
        }
      `
    } else if (el === 'secondaryText') {
      cssStr += `.content[data-lang-primary="primary"] .secondary-text {
          ${ cssPropsStr }
        }

        .content[data-lang-primary="secondary"] .primary-text {
          ${ cssPropsStr }
        }
      }`
    } else {
      cssStr += `
        ${ curClassName } {
          ${ Object.keys(curStyle).reduce((prevCSS, curKey) => {
            return prevCSS + `${ curKey }: ${curStyle[curKey] }; ` } ,'')
          }
        }
      `
    }
  }

  return cssStr
}
