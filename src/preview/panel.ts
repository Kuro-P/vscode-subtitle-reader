import * as vscode from 'vscode'


interface PanelInstance {
  webviewPanel: vscode.WebviewPanel
  webview: vscode.Webview,
  fileUri?: vscode.Uri
  show: () => void
  dispose: () => void
  switchPrimaryLang: () => void
  resetAppearance: () => void
}

class Panel implements PanelInstance {
  webviewPanel: vscode.WebviewPanel
  webview: vscode.Webview
  fileUri?: vscode.Uri

  constructor(webviewPanel: vscode.WebviewPanel, fileUri?: vscode.Uri) {
    this.webviewPanel = webviewPanel
    this.webview = webviewPanel.webview
    this.fileUri = fileUri
  }

  show(viewColumn?: vscode.ViewColumn, preserveFocus?: boolean) {
    this.webviewPanel.reveal(viewColumn, preserveFocus)
  }

  dispose() {
    this.webviewPanel.dispose()
  }

  onDidDispose(fn: Function) {
    this.webviewPanel.onDidDispose(() => {
      fn()
      console.log('webview instance onDidDispose')
    })
  }

  switchPrimaryLang() {
    this.webview.postMessage({ switchPrimaryLang: true })
  }

  resetAppearance() {
    this.webview.postMessage({ resetAppearance: true })
  }

  updateContent(rawLineNumber: number, text?: string) {
    this.webview.postMessage({
      updateContent: {
        rawLineNumber,
        text
      }
    })
  }

  updateStyle(cssText: string) {
    this.webview.postMessage({
      updateStyle: cssText.trim()
    })
  }
}

export { Panel, PanelInstance }

