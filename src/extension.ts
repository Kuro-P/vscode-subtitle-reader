import * as vscode from 'vscode'
import * as path from 'path'
import { displayPreviewPanel } from './preview'
import { isSubtitleFile, getFileName } from './common/utils'
import State from './type/state'

export let context: vscode.ExtensionContext
export let state: State

export function activate(c: vscode.ExtensionContext) {
	context = c
	state = new State()
	console.log('Congratulations, your extension "helloVscode" is now active!')

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
		if (textEditor) {
			const panelName = getFileName(textEditor.document.fileName)
			const panel = await displayPreviewPanel({
				viewType: panelName,
				title: panelName
			})

			// TODO if (panel.fileUri in tab.groups) { renderWithStoredDada }

			state.addPanel(panel)

		} else {
			vscode.window.showErrorMessage('Not found activated tab')
		}
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
	context.subscriptions.push(...[ openFile, openFolder, showPreview, onDidChangeActiveTextEditor ])
}

// This method is called when your extension is deactivated
export function deactivate() {}
