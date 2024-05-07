import './main.scss'

let firstLineRawNumber = 0,
    lastLineRawNumber = 0,
    curLineNumber = 0

function handleLangStyleSwitch(langPrimary?: 'primary' | 'secondary' ) {
  const contentEl: HTMLDivElement | null = document.querySelector('.content')
  if (!contentEl) {
    return
  }

  const _langPrimary = langPrimary || (contentEl.dataset.langPrimary === 'primary' ? 'secondary' : 'primary')
  contentEl.dataset.langPrimary = _langPrimary
}

function handleResetAppearance() {
  window.scrollTo(0, 0)
  handleLangStyleSwitch('primary')
}

function handleUpdateContent(change: { rawLineNumber: number, text: string }) {
  const dialogueEl = document.getElementById(String(change.rawLineNumber)) as HTMLElement
  if (!dialogueEl) {
    return
  }

  dialogueEl.innerHTML = `
    <p class="line-number">${ dialogueEl.dataset.lineNumber }</p>
    ${ change.text }
  `
}

function handleUpdateStyle(cssText: string) {
  const customStyleEl = document.getElementById('customStyle')
  if (customStyleEl) {
    customStyleEl.innerText = cssText
  }
}

/**
 * refresh style
 * @param kind 1-lightTheme  2|3-darkTheme
 */
function handleUpdateColorTheme(kind: number) {
  const links = document.querySelectorAll('link[rel=stylesheet]') as NodeListOf<HTMLLinkElement>
  links.forEach(link => link.href = link.href.replace(/\?.*|$/, "?" + Date.now()))
}

function handleSyncScroll(options: { start: number, end: number }) {
  const { start, end } = options
  if (start < firstLineRawNumber) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  } else if ( firstLineRawNumber <= start && start < lastLineRawNumber ) {
    let dialogueEl = document.getElementById(String(start))
    let _start = start

    while (!dialogueEl) {
      if (start > curLineNumber) {
        // scroll down
        _start++
      } else {
        // scroll up
        _start--
      }
      dialogueEl = document.getElementById(String(_start))
    }
    dialogueEl.scrollIntoView({ behavior: start <= firstLineRawNumber ? 'smooth' : 'auto' })
  }
}

/**
 * https://code.visualstudio.com/api/references/vscode-api#ColorThemeKind
 * Light-1 Dark-2
 */
function detectColorTheme() {
  if (document.body.className.includes('light')) {
    return 1
  } else {
    return 2
  }
}

// listen lines style change
window.addEventListener('message', (event: any) => {
  const message = event.data
  const {
    switchPrimaryLang, resetAppearance, updateContent, updateStyle, updateColorTheme,
    syncScroll } = message

  switchPrimaryLang && handleLangStyleSwitch()
  resetAppearance && handleResetAppearance()
  updateContent && handleUpdateContent(updateContent)
  updateStyle && handleUpdateStyle(updateStyle)
  updateColorTheme && handleUpdateColorTheme(updateColorTheme)
  syncScroll && handleSyncScroll(syncScroll)
})

window.onload = () => {
  try {
    const dialogues = Array.prototype.slice.call(document.querySelectorAll('.dialogue-line'))
    if (dialogues.length > 0) {
      firstLineRawNumber = dialogues.at(0).dataset.rawLineNumber
      lastLineRawNumber = dialogues.at(-1).dataset.rawLineNumber
    }
  } catch (e: any) {
    console.log('Failed to get dialogues', e.message)
  }
}
