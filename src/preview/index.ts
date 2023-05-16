import * as vscode from 'vscode';
import { isSSA, isASS, isSRT, getNonce } from '../common/utils';
import * as path from 'path';
import { promises as fsPromises } from "fs";
import { extractAssInfo } from './ass';
import { extractSrtInfo } from './srt';
import * as Handlebars from 'handlebars';


class File {
  constructor() {

  }
}


class PreviewPanel {
  // create
  constructor() {

  }

  open() {

  }

  close() {

  }

  reload() {

  }


}

// 对文档内容进行加工 如 提取有用的信息
// 主要根据 文件格式 对字幕对话内容进行统一处理 方便 preview panel 进行展示
export function processContent(document: vscode.TextDocument, context: vscode.ExtensionContext) {
  const fileText = document.getText();
  const fileName = document.fileName.split('/').at(-1) || '';
  const languageId = document.languageId;

  console.log('lineCount', document.lineCount);
  let contentInstance;

  if (isSSA(languageId) || isASS(languageId)) {
    contentInstance = extractAssInfo(fileText);
  } else if (isSRT(languageId)) {
    contentInstance = extractSrtInfo(fileText);
  }

  openPreviewPanel(fileName, context, contentInstance);
}

export function openPreviewPanel(fileName: string, context: vscode.ExtensionContext, contentInstance: any) {
  // ✅ TODO 1. get html raw file
  // ✅ TODO 2. get needed info from .ass file
  // ✅ TODO 3. render html with needed info
  // ✅ TODO 4. render to panel
  // ✅ TODO 5. load panel style
  // TODO 6. design panel style

  const _extensionUri = context.extensionUri;
  const _extensionPath = context.extensionPath;

  // 调起 webview 模板
  const webviewPanel = vscode.window.createWebviewPanel(
    // id
    "subtitlePreview",
    // name
    "Subtitle preview pannel",
    {
      preserveFocus: true,
      viewColumn: vscode.ViewColumn.Beside
    },
    {
      enableCommandUris: false,
      enableScripts: true,
      enableFindWidget: true,
      retainContextWhenHidden: false,
      localResourceRoots: [ context.extensionUri ]
    }
  );

  if (!contentInstance) {
    webviewPanel.webview.html = '<h3>请检查文件格式是否正确</h3>';
    return;
  }

  // generate webview HTML
  try {
    fsPromises.readFile(path.join(_extensionPath, '/src/assets/index.html'), { encoding: 'utf-8' }).then((panelTempl) => {

      const styleUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(_extensionUri, 'dist', 'main.css'));
      const scriptUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(_extensionUri, 'dist', 'main.js'));

      const panelParams = Object.assign({}, contentInstance, {
        fileName,
        styleUri: styleUri,
        scriptUri: scriptUri,
        cspSource: webviewPanel.webview.cspSource,
        nonce: getNonce(),
      });

      const template = Handlebars.compile(panelTempl);
      const panelContent = template(panelParams);

      webviewPanel.webview.html = panelContent;
    });

  } catch (e) {
    console.log(e);
  }
}
