import './main.scss'

console.info('hello preview js xixixi')

let contentEl: HTMLDivElement | null = null

// listen lines style change

function handleLangStyleSwitch() {
  if (!contentEl) {
    return
  }

  const _langPrimary = contentEl.dataset.langPrimary === 'primary' ? "subsidiary" : "primary"
  contentEl.dataset.langPrimary = _langPrimary
}

window.addEventListener('message', (event: any) => {
  const message = event.data
  const { switchPrimaryLang } = message

  if (!contentEl) {
    contentEl = document.querySelector('.content')
  }

  console.log('message', message)
  switchPrimaryLang && handleLangStyleSwitch()
})
