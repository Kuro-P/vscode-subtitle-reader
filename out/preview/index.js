"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPreviewPanel = exports.processContent = void 0;
const vscode = require("vscode");
const utils_1 = require("../common/utils");
const path = require("path");
const fsPromises = require("fs/promises");
const ass_1 = require("./ass");
const srt_1 = require("./srt");
const Handlebars = require("handlebars");
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
function processContent(document, context) {
    const fileText = document.getText();
    const fileName = document.fileName.split('/').at(-1) || '';
    const languageId = document.languageId;
    console.log('lineCount', document.lineCount);
    let contentInstance;
    if ((0, utils_1.isSSA)(languageId) || (0, utils_1.isASS)(languageId)) {
        contentInstance = (0, ass_1.extractAssInfo)(fileText);
    }
    else if ((0, utils_1.isSRT)(languageId)) {
        contentInstance = (0, srt_1.extractSrtInfo)(fileText);
    }
    openPreviewPanel(fileName, context, contentInstance);
}
exports.processContent = processContent;
function openPreviewPanel(fileName, context, contentInstance) {
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
    "Subtitle preview pannel", {
        preserveFocus: true,
        viewColumn: vscode.ViewColumn.Beside
    }, {
        enableCommandUris: false,
        enableScripts: true,
        enableFindWidget: true,
        retainContextWhenHidden: false,
        localResourceRoots: [context.extensionUri]
    });
    if (!contentInstance) {
        webviewPanel.webview.html = '<h3>请检查文件格式是否正确</h3>';
        return;
    }
    // generate webview HTML
    try {
        fsPromises.readFile(path.join(_extensionPath, '/src/assets/index.html'), { encoding: 'utf-8' }).then((panelTempl) => {
            const styleUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(_extensionUri, 'src/assets', 'main.css'));
            const scriptUri = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(_extensionUri, 'src/assets', 'main.js'));
            const panelParams = Object.assign({}, contentInstance, {
                fileName,
                styleUri: styleUri,
                scriptUri: scriptUri,
                cspSource: webviewPanel.webview.cspSource,
                nonce: (0, utils_1.getNonce)(),
            });
            const template = Handlebars.compile(panelTempl);
            const panelContent = template(panelParams);
            webviewPanel.webview.html = panelContent;
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.openPreviewPanel = openPreviewPanel;
//# sourceMappingURL=index.js.map