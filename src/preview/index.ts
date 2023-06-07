import * as vscode from 'vscode'
import { isSSA, isASS, isSRT, getFileName } from '../common/utils'
import * as path from 'path'
import { promises as fsPromises } from "fs"
import { extractAssInfo, extractAssInfoFromLine, Ass } from './ass'
import { extractSrtInfo, extractSrtInfoFromLine, MIN_EVENT_FIELD_NUM } from './srt'
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

export async function displayPreviewPanel(panel?: Panel, options?: PanelOptions, textDocument?: vscode.TextDocument): Promise<Panel> {
  const document = textDocument || vscode.window.activeTextEditor?.document
  const fileUri = document ? document.uri : undefined

  const previewPanel = panel ? panel.webviewPanel : createPreviewPanel(options)
  const content = await generateHTML(previewPanel, textDocument)
  fileUri && (previewPanel.title = 'Subtitle-' + getFileName(fileUri?.path))
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

export async function generateHTML(webviewPanel: vscode.WebviewPanel, textDocument?: vscode.TextDocument): Promise<string> {
  const document = textDocument || vscode.window.activeTextEditor?.document
  if (!document) {
    vscode.window.showErrorMessage('Not found panel origin document')
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

  // record ass field format info
  state.setContentInstance(contentInstance)

  // generate webview HTML
  try {
    const { extensionUri, extensionPath } = context
    const panelTempl = await fsPromises.readFile(path.join(extensionPath, '/src/assets/index.html'), { encoding: 'utf-8' })
    const styleUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.css'))
    const scriptUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'dist', 'main.js'))
    const showDialogueLineNumber = configuration.get('showDialogueLineNumber')

    const panelParams = Object.assign({}, contentInstance, {
      fileName,
      styleUri,
      scriptUri,
      showDialogueLineNumber,
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

export async function updateContent(panel: Panel, textDocument: vscode.TextDocument, changes: vscode.Range[]) {
  if (!panel || !panel.webviewPanel) {
    return
  }

  const contentInstance = state?.getContentInstance()
  if (!contentInstance) {
    return
  }

  changes.forEach((change: vscode.Range) => {
    const lineStart = change.start.line,
          lineEnd = change.end.line
    let rawLineNumber: number = 0

    if (change.isSingleLine) {
      let lineInfo = null
      if (isASS(textDocument.languageId)) {
        lineInfo = extractAssInfoFromLine(textDocument.lineAt(lineStart).text, (contentInstance as Ass).dialogueFormat!)
        rawLineNumber = lineStart
      } else if (isSRT(textDocument.languageId)) {
        const documentLineCount = textDocument.lineCount
        let lines: string[] = []
        let curLineText = textDocument.lineAt(lineStart).text
        let curLineNumber = lineStart

        // find forward
        while (curLineNumber < documentLineCount && curLineText) {
          lines.push(curLineText)
          curLineNumber++
          curLineText = curLineNumber >= documentLineCount ? '' : textDocument.lineAt(curLineNumber).text
        }

        // find backward
        curLineNumber = lineStart - 1
        curLineText = textDocument.lineAt(curLineNumber).text
        while (curLineNumber >= 0 && curLineText) {
          lines.unshift(curLineText)
          curLineNumber--
          curLineText = curLineNumber < 0 ? '' : textDocument.lineAt(curLineNumber).text
        }

        lineInfo = extractSrtInfoFromLine(lines)
        rawLineNumber = parseInt(lineInfo?.lineOrder as string || '0')
      }

      if (!lineInfo) {
        return
      }

      const htmlStr = `
      <p class="time">${ lineInfo.startTime } —> ${ lineInfo.endTime }</p>
      <div class="text">
        <p class="primary-text">${ lineInfo.primaryText }</p>
        ${ lineInfo.subsidiaryText ? `<p class="subsidiary-text">${ lineInfo.subsidiaryText }</p>` : '' }
      </div>
    `

      panel.updateContent(rawLineNumber, htmlStr)
    } else {
      vscode.commands.executeCommand('subtitleReader.refreshPanel')
    }
  })
}
