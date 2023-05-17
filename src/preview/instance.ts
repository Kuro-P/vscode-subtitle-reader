import * as vscode from 'vscode';

interface PanelInstance {
  webviewPanel: vscode.WebviewPanel
  webview: vscode.Webview,
  pagination: number
  reload: () => void
  refresh: () => void
  dispose: () => void
}

class Panel implements PanelInstance {
  webviewPanel: vscode.WebviewPanel;
  webview: vscode.Webview;
  // 待定
  pagination: number = 0;

  // create
  constructor(webviewPanel: vscode.WebviewPanel) {
    this.webviewPanel = webviewPanel;
    this.webview = webviewPanel.webview;
  }

  // 整个 webview 重新加载
  reload() {

  }

  // 局部刷新 保留滚动条位置？
  refresh() {

  }

  // 废弃
  dispose() {
    this.webviewPanel.dispose();
  }

}

export { Panel, PanelInstance };

