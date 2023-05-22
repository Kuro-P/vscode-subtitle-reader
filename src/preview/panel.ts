import * as vscode from 'vscode'

interface PanelInstance {
  webviewPanel: vscode.WebviewPanel
  webview: vscode.Webview,
  fileUri?: vscode.Uri
  pagination: number
  show: () => void
  reload: () => void
  refresh: () => void
  dispose: () => void
}

class Panel implements PanelInstance {
  webviewPanel: vscode.WebviewPanel
  webview: vscode.Webview
  fileUri?: vscode.Uri
  // 待定
  pagination: number = 0

  // create
  constructor(webviewPanel: vscode.WebviewPanel, fileUri?: vscode.Uri) {
    this.webviewPanel = webviewPanel
    this.webview = webviewPanel.webview
    this.fileUri = fileUri
  }

  // bring webviewPanel to view
  show(viewColumn?: vscode.ViewColumn, preserveFocus?: boolean) {
    this.webviewPanel.reveal(viewColumn, preserveFocus)
  }

  // 整个 webview 重新加载
  reload() {

  }

  // 局部刷新 保留滚动条位置？
  refresh() {

  }

  // 废弃
  dispose() {
    this.webviewPanel.dispose()
  }

  onDidDispose(fn: Function) {
    this.webviewPanel.onDidDispose(() => {
      fn()
      console.log('webview instance onDidDispose')
    })
  }

}

export { Panel, PanelInstance }

