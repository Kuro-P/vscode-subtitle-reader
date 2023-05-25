import * as vscode from 'vscode'
import { isSSA, isASS, isSRT, getFileName, getNonce } from '../common/utils'
import * as path from 'path'
import { promises as fsPromises } from "fs"
import { extractAssInfo } from './ass'
import { extractSrtInfo } from './srt'
import * as Handlebars from 'handlebars'
import { Panel } from './panel'
import { context, state, configuration } from './../extension'

export let panel: Panel

export type PanelOptions = {
  viewType?: string
  title?: string
  viewColumn?: vscode.ViewColumn,
  localResourceRoots?: vscode.Uri[]
}

export async function displayPreviewPanel(panel?: Panel, options?: PanelOptions): Promise<Panel> {
  const document = vscode.window.activeTextEditor?.document
  const fileUri = document ? document.uri : undefined

  const previewPanel = panel ? panel.webviewPanel : createPreviewPanel(options)
  const content = await generateHTML(previewPanel)
  previewPanel.webview.html = content

  panel = new Panel(previewPanel, fileUri)
  return panel
}

export function createPreviewPanel(options?: PanelOptions): vscode.WebviewPanel {

  const {
    viewType = "subtitlePreviewPanel",
    title = "Subtitle preview panel",
    viewColumn = vscode.ViewColumn.Beside,
    localResourceRoots = [ context.extensionUri ]
  } = options || {}

  const webviewPanel = vscode.window.createWebviewPanel(
    // id
    viewType,
    // name
    title,
    {
      preserveFocus: true,
      viewColumn
    },
    {
      enableCommandUris: false,
      enableScripts: true,
      enableFindWidget: true,
      retainContextWhenHidden: false,
      localResourceRoots: localResourceRoots
    }
  )

  return webviewPanel
}

export async function generateHTML(webviewPanel: vscode.WebviewPanel): Promise<string> {
  const document = vscode.window.activeTextEditor?.document
  if (!document) {
    vscode.window.showErrorMessage('Not found activated tab')
    return ''
  }

  const fileText = document.getText()
  const fileName = getFileName(document.fileName)
  const languageId = document.languageId
  let contentInstance: any

  if (isSSA(languageId) || isASS(languageId)) {
    contentInstance = extractAssInfo(fileText)
  } else if (isSRT(languageId)) {
    contentInstance = extractSrtInfo(fileText)
  }
  if (!contentInstance) {
    return '<h3>请检查文件格式是否正确</h3>'
  }

  // generate webview HTML
  try {
    const { extensionUri, extensionPath } = context
    const panelTempl = await fsPromises.readFile(path.join(extensionPath, '/src/assets/index.html'), { encoding: 'utf-8' })
    const styleUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.css'))
    const scriptUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.js'))

    const panelParams = Object.assign({}, contentInstance, {
      fileName,
      styleUri: styleUri,
      scriptUri: scriptUri,
      // cspSource: webviewPanel.webview.cspSource,
      // nonce: getNonce(),
    })

    const template = Handlebars.compile(panelTempl)
    const panelContent = template(panelParams)
    return panelContent

  } catch (e) {
    return `
      <h3>Ops！出错了</h3>
      <p>${ e }</p>
    `
  }
}
