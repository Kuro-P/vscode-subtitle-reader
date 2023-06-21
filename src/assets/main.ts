import './main.scss'

console.info('hello preview js xixixi')


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
  // const head = document.head || document.querySelector('head'),
  //       style = document.createElement('style')

  // head.appendChild(style)
  // style.appendChild(document.createTextNode(cssText))

  const customStyleEl = document.getElementById('customStyle')
  console.log('customStyleEl', customStyleEl)
  if (customStyleEl) {
    customStyleEl.innerText = cssText
  }
}

// listen lines style change
window.addEventListener('message', (event: any) => {
  const message = event.data
  const { switchPrimaryLang, resetAppearance, updateContent, updateStyle } = message

  switchPrimaryLang && handleLangStyleSwitch()
  resetAppearance && handleResetAppearance()
  updateContent && handleUpdateContent(updateContent)
  updateStyle && handleUpdateStyle(updateStyle)
})
