import './main.scss'

console.info('hello preview js xixixi')


function handleLangStyleSwitch(langPrimary?: 'primary' | 'subsidiary' ) {
  const contentEl: HTMLDivElement | null = document.querySelector('.content')
  if (!contentEl) {
    return
  }

  const _langPrimary = langPrimary || (contentEl.dataset.langPrimary === 'primary' ? 'subsidiary' : 'primary')
  contentEl.dataset.langPrimary = _langPrimary
}

function handleResetDocument() {
  window.scrollTo(0, 0)
  handleLangStyleSwitch('primary')
}

// listen lines style change
window.addEventListener('message', (event: any) => {
  const message = event.data
  const { switchPrimaryLang, resetDocument } = message

  switchPrimaryLang && handleLangStyleSwitch()
  resetDocument && handleResetDocument()
})
