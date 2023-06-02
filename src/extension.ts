import * as vscode from 'vscode'
import * as path from 'path'
import { displayPreviewPanel } from './preview'
import { isSubtitleFile, getFileName } from './common/utils'
import State from './type/state'

export let context: vscode.ExtensionContext
export let state: State
export let configuration: Configuration
import Configuration from './preview/configuration'

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

	// open Folder
	const openFolder = vscode.commands.registerCommand('subtitleReader.helloFolder', () => {
		const folderPath = path.join(context.extensionPath, '/test')
		const folderPathParsed = folderPath.split(`\\`).join(`/`)
		// Updated Uri.parse to Uri.file
		const folderUri = vscode.Uri.file(folderPathParsed)
		vscode.commands.executeCommand(`vscode.openFolder`, folderUri)
	})

	// open preview panel
	const showPreview = vscode.commands.registerCommand('subtitleReader.showPreviewPanel', async () => {
		const textEditor = vscode.window.activeTextEditor
		if (!textEditor) {
			return vscode.window.showErrorMessage('Not found activated tab')
		}

		const cachePanel = state.getPanel()
		const panel = await displayPreviewPanel(cachePanel)
		state.setPanel(panel)

		if (textEditor.document.uri.fsPath !== cachePanel?.fileUri?.fsPath) {
			panel.webview.postMessage({ resetDocument: true })
		}
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

		const autoOpen = configuration.get('autoOpen')
		if (!isSubtitleFile(document.languageId) || !autoOpen) {
			return
		}

		vscode.commands.executeCommand(`subtitleReader.showPreviewPanel`)
	})

	// auto close reader panel
	const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
		const readerPanel = state.getPanel()
		const autoClose = configuration.get('autoClose')
		if (!readerPanel || isSubtitleFile(document.languageId) || !autoClose) {
			return
		}

		readerPanel.dispose()
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

	// TOOD sync context changes


	// auto open preview panel when workspace open subtitle file before
	if (configuration.get('autoOpen') && activeTextEditor && isSubtitleFile(activeTextEditor.document.fileName)) {
		vscode.commands.executeCommand('subtitleReader.showPreviewPanel')
	}

	// 注册命令
	context.subscriptions.push(...[
 		openFile, openFolder, showPreview, switchPrimaryLang,
 		onDidChangeActiveTextEditor, onDidChangeConfiguration,
		onDidOpenTextDocument
	])
}

// This method is called when your extension is deactivated
export function deactivate() {}
