import { Panel } from '../preview/panel'


class State {
  protected _panel: Panel | undefined
  protected _switchPrimaryLang: boolean = false

  static getAuthor () {
  }

  isCreatedPanel () {
    return !!this._panel
  }

  setPanel (panel: Panel) {
    if (!panel) {
      return
    }

    this._panel = panel
    this._panel.onDidDispose(() => {
      this.delPanel()
    })
  }

  getPanel () {
    return this._panel
  }

  delPanel () {
    this._panel = undefined
  }

  setSwitchPrimaryLang (switchLang: boolean) {
    this._switchPrimaryLang = switchLang
  }

  getSwitchPrimaryLang () {
    return this._switchPrimaryLang
  }
}

export default State
