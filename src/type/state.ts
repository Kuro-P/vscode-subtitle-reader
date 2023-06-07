import { Panel } from '../preview/panel'
import { Ass } from '../preview/ass'
import { Srt } from '../preview/srt'


class State {
  protected _panel: Panel | undefined
  protected _switchPrimaryLang: boolean = false
  protected _contentInstance?: Ass | Srt

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

  setContentInstance (instance?: Ass | Srt) {
    this._contentInstance = instance
  }

  getContentInstance () {
    return this._contentInstance
  }
}

export default State
