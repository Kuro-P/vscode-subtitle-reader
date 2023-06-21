import * as vscode from 'vscode'
import * as path from 'path'
import { displayPreviewPanel, updateContent } from './preview'
import { isSubtitleFile, getFileName, processingStyle } from './common/utils'
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

	// open reader panel
	const showPanel = vscode.commands.registerCommand('subtitleReader.showPreviewPanel', async () => {
		const textEditor = vscode.window.activeTextEditor
		if (!textEditor) {
			return vscode.window.showErrorMessage('Not found activated tab')
		}

		const cachePanel = state.getPanel()
		const panel = await displayPreviewPanel(cachePanel)
		state.setPanel(panel)

		vscode.commands.executeCommand('subtitleReader.refreshCustomStyle')
		if (textEditor.document.uri.fsPath !== cachePanel?.fileUri?.fsPath) {
			panel.resetAppearance()
		}
	})

	// refresh reader panel
	const refreshPanel = vscode.commands.registerCommand('subtitleReader.refreshPanel', async () => {
		// !!! unlike showPanel, refresh action was trigger by panel focus, so vscode.window.activeTextEditor was undefined at here.
		const cachePanel = state.getPanel()
		if (!cachePanel || !cachePanel.fileUri) {
			return
		}

		const textDocument = await vscode.workspace.openTextDocument(cachePanel.fileUri)
		const panel = await displayPreviewPanel(cachePanel, undefined, textDocument)
		state.setPanel(panel)
		vscode.commands.executeCommand('subtitleReader.refreshCustomStyle')
	})

	// switch primary lang style
	const switchPrimaryLang = vscode.commands.registerCommand('subtitleReader.switchPrimaryLang', () => {
		const panel = state.getPanel()
		if (!panel) {
			return vscode.window.showWarningMessage('Not found activated reader panel.')
		}
		panel.switchPrimaryLang()
	})

	// refresh custom style
	const refreshCustomStyle = vscode.commands.registerCommand('subtitleReader.refreshCustomStyle', () => {
		const panel = state.getPanel()
		if (!panel) {
			return vscode.window.showWarningMessage('Not found activated reader panel.')
		}

		// get lastest configuration
		configuration.flush()

		const cssText = processingStyle((configuration.get('style') as any))
		panel.updateStyle(cssText)
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

		vscode.commands.executeCommand('subtitleReader.refreshCustomStyle')
	})

	// document content change
	const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
		const { document, contentChanges } = event
		const panel = state.getPanel()

		if (!panel) {
			return
		}

		if (!isSubtitleFile(document.fileName)) {
			return
		}

		if (!contentChanges?.length) {
			return
		}

		updateContent(panel, document, contentChanges.map(changeEvent => changeEvent.range))
	})

	// document scroll
	// const onDidChangeTextEditorVisibleRanges = vscode.window.onDidChangeTextEditorVisibleRanges((event: vscode.TextEditorVisibleRangesChangeEvent) => {
	// 	const { textEditor: { document }, visibleRanges } = event
	// 	const panel = state.getPanel()

	// 	if (!panel) {
	// 		return
	// 	}

	// 	if (!isSubtitleFile(document.fileName)) {
	// 		return
	// 	}

	// 	// TODO

	// })

	// auto open preview panel when workspace open subtitle file before
	if (configuration.get('autoOpen') && activeTextEditor && isSubtitleFile(activeTextEditor.document.fileName)) {
		vscode.commands.executeCommand('subtitleReader.showPreviewPanel')
	}

	context.subscriptions.push(...[
 		openFile, openFolder, showPanel, refreshPanel, switchPrimaryLang, refreshCustomStyle,
 		onDidChangeActiveTextEditor, onDidChangeConfiguration,
		onDidOpenTextDocument, onDidChangeTextDocument
	])
}

// This method is called when your extension is deactivated
export function deactivate() {}
