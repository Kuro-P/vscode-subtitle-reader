import * as vscode from 'vscode'
import { Panel } from '../preview/instance'

const MAX_PANEL_NUM = 2

class State {
  protected panels: Panel[] = []
  panelsFilePath: (string | undefined) [] = []
  activePanel?: Panel

  constructor () {
  }

  isCreatedPanel = (fileUri: vscode.Uri) => {
    return this.panelsFilePath.includes(fileUri.fsPath)
  }

  addPanel = (panel: Panel): Panel[] => {

    // setting max num of webview panel to save memory
    if (this.panels.length >= MAX_PANEL_NUM) {
      // this.delPanel(this.panels[0])
      console.log('max memeory lead')
    }

    if (panel) {
      this.panels.push(panel)
      this.panelsFilePath.push(panel.fileUri?.fsPath)
    }
    return this.panels
  }

  delPanel = (panel: Panel): Panel[] => {
    if (panel) {
      const _panelPath = panel.fileUri?.fsPath

      this.panels = this.panels.filter(item => {
        return item.fileUri?.fsPath !== _panelPath
      })
      this.panelsFilePath = this.panelsFilePath.filter(path => {
        return path && path !== _panelPath
      })
      panel.dispose()
    }
    return this.panels
  }

  getPanel = (fileUri: vscode.Uri): Panel | undefined => {
    return this.panels.find(item => item.fileUri?.fsPath === fileUri.fsPath)
  }

  dispose = () => {
    // clear panels
    if (this.panels.length > 0) {
      this.panels.forEach(panel => panel.dispose())
      this.panels = []
      this.panelsFilePath = []
    }
  }
}

export default State
