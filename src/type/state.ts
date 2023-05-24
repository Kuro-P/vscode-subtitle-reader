import * as vscode from 'vscode'
import { Panel } from '../preview/panel'

class State {
  protected panel: Panel | undefined
  protected switchPrimaryLang: boolean = false

  constructor () {
  }

  isCreatedPanel () {
    return !!this.panel
  }

  setPanel (panel: Panel) {
    if (!panel) {
      return
    }

    this.panel = panel
    this.panel.onDidDispose(() => {
      this.delPanel()
    })
  }

  getPanel () {
    return this.panel
  }

  delPanel () {
    this.panel = undefined
  }

  getSwitchPrimaryLang () {
    return this.switchPrimaryLang
  }

  setSwitchPrimaryLang (switchLang: boolean) {
    this.switchPrimaryLang = switchLang
  }
}

export default State
