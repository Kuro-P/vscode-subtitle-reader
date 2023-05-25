import * as vscode from 'vscode'
import * as path from 'path'
import { displayPreviewPanel } from './preview'
import { Configuration } from './preview/configuration'
import { isSubtitleFile } from './common/utils'
import State from './type/state'

export let context: vscode.ExtensionContext
export let state: State
export let configuration: Configuration

export function activate(c: vscode.ExtensionContext) {
	context = c
	state = new State()
	configuration = new Configuration()
	console.log('Congratulations, your extension "helloVscode" is now active!')

	// TODO 激活的时候也应该查看当前的文档是不是 subtitle，如果是则 show panel

	// open file
	const openFile = vscode.commands.registerCommand('subtitleReader.helloFile', () => {
		vscode.window.showErrorMessage('Hello File xixixi from VS Code')
		vscode.workspace.openTextDocument(path.join(context.extensionPath, '/test/Tags.ass')).then(doc => {
			vscode.window.showTextDocument(doc)
		})
	})

	// openFolder
	const openFolder = vscode.commands.registerCommand('subtitleReader.helloFolder', () => {
		const folderPath = path.join(context.extensionPath, '/test')
		const folderPathParsed = folderPath.split(`\\`).join(`/`)
		// Updated Uri.parse to Uri.file
		const folderUri = vscode.Uri.file(folderPathParsed)
		vscode.commands.executeCommand(`vscode.openFolder`, folderUri)
	})

	const showPreview = vscode.commands.registerCommand('subtitleReader.showPreviewPanel', async () => {
		const textEditor = vscode.window.activeTextEditor
		if (!textEditor) {
			return vscode.window.showErrorMessage('Not found activated tab')
		}

		const cachePanel = state.getPanel()
		const panel = await displayPreviewPanel(cachePanel)
		!cachePanel && state.setPanel(panel)
	})

	// TODO subtitleReader.showSource
	const showSource = vscode.commands.registerCommand('subtitleReader.showSource', () => {
		console.log('show source!!!')
		// reveal source document

		vscode.window.activeTextEditor?.document

	})

	// switch primary lang style
	const switchPrimaryLang = vscode.commands.registerCommand('subtitleReader.switchPrimaryLang', () => {
		const panel = state.getPanel()
		if (!panel) {
			return
		}
		panel.webview.postMessage({ switchPrimaryLang: true })
	})

	// auto open reader panel
	vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
		const document = textEditor?.document
		if (!document) {
			return
		}

		if (!isSubtitleFile(document.languageId)) {
			return
		}

		configuration.flush()
		const autoOpen = configuration.get('autoOpen')

		if (autoOpen) {
			vscode.commands.executeCommand(`subtitleReader.showPreviewPanel`)
		}
	})

	// TODO on active tab change 

	// configuration change
	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (!event.affectsConfiguration('subtitleReader')) {
			console.log('修改的并非是 subtitle reader的配置')
			return
		}

		configuration.flush()
		if (event.affectsConfiguration('subtitleReader.style')) {
			// console.log('style change', configuration.get('style').get('html'))
		}
	})

	// 注册命令
	context.subscriptions.push(...[
 openFile, openFolder, showPreview, showSource, switchPrimaryLang
])
}

// This method is called when your extension is deactivated
export function deactivate() {}
