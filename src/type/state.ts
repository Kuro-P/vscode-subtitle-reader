import * as vscode from 'vscode'
import { Panel } from '../preview/panel'

class State {
  protected panel: Panel | undefined

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
}

export default State
