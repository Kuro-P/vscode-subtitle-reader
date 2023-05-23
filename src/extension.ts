import * as vscode from 'vscode'
import * as path from 'path'
import { displayPreviewPanel } from './preview'
import { isSubtitleFile } from './common/utils'
import State from './type/state'

export let context: vscode.ExtensionContext
export let state: State

export function activate(c: vscode.ExtensionContext) {
	context = c
	state = new State()
	console.log('Congratulations, your extension "helloVscode" is now active!')
	console.log('vscode getConfiguration', vscode.workspace.getConfiguration('subtitleReader.panelPosition'))

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

		// TODO if (panel.fileUri in tab.groups) { renderWithStoredDada }

		// TODO set state to vscode context
	})

	// TODO subtitleReader.showSource
	const showSource = vscode.commands.registerCommand('subtitleReader.showSource', () => {
		console.log('show source!!!')
	})

	const switchPrimaryLang = vscode.commands.registerCommand('subtitleReader.switchPrimaryLang', () => {
		const panel = state.getPanel()
		if (!panel) {
			return
		}

		panel.webview.postMessage({ switchPrimaryLang: true })
	})

	// auto open reader panel
	const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
		const document = textEditor?.document
		if (!document) {
			return
		}

		if (!isSubtitleFile(document.languageId)) {
			return
		}
		const configuration: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('subtitleReader')
		const autoOpen = configuration.get('autoOpen')

		if (autoOpen) {
			vscode.commands.executeCommand(`subtitleReader.showPreviewPanel`)
		}
	})

	// 注册命令
	context.subscriptions.push(...[
 openFile, openFolder, showPreview, showSource, switchPrimaryLang, onDidChangeActiveTextEditor
])
}

// This method is called when your extension is deactivated
export function deactivate() {}
