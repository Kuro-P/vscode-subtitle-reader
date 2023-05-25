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
	console.log('vscode.window.activeTextEditor uri', vscode.window.activeTextEditor?.document.fileName)
	const activeTextEditor = vscode.window.activeTextEditor

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

	// switch primary lang style
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

		configuration.flush()
		if (configuration.get('autoOpen')) {
			vscode.commands.executeCommand(`subtitleReader.showPreviewPanel`)
		}
	})

	// configuration change
	const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (!event.affectsConfiguration('subtitleReader')) {
			console.log('修改的并非是 subtitle reader的配置')
			return
		}

		configuration.flush()
		if (event.affectsConfiguration('subtitleReader.style')) {
			// console.log('style change', configuration.get('style').get('html'))
		}
	})

	// auto open preview panel when workspace open subtitle file before
	if (configuration.get('autoOpen') && activeTextEditor && isSubtitleFile(activeTextEditor.document.fileName)) {
		vscode.commands.executeCommand('subtitleReader.showPreviewPanel')
	}

	// 注册命令
	context.subscriptions.push(...[
 openFile, openFolder, showPreview, switchPrimaryLang,
 onDidChangeActiveTextEditor, onDidChangeConfiguration
])
}

// This method is called when your extension is deactivated
export function deactivate() {}
