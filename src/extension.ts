import * as vscode from 'vscode';
import * as path from 'path';
import { processContent } from './preview';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "helloVscode" is now active!');

	let openFile = vscode.commands.registerCommand('subtitleReader.helloFile', () => {
		vscode.window.showErrorMessage('Hello World from VS Code');

		vscode.workspace.openTextDocument(path.join(context.extensionPath, '/test/kiana.ass')).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	});

	let openFolder = vscode.commands.registerCommand('subtitleReader.helloFolder', () => {
		const folderPath = path.join(context.extensionPath, '/test');
		const folderPathParsed = folderPath.split(`\\`).join(`/`);
		// Updated Uri.parse to Uri.file
		const folderUri = vscode.Uri.file(folderPathParsed);
		vscode.commands.executeCommand(`vscode.openFolder`, folderUri);
	});

	let showPreview = vscode.commands.registerCommand('subtitleReader.showPreviewPanel', () => {
		const textEditor = vscode.window.activeTextEditor;
		if (textEditor) {
			processContent(textEditor.document, context);
		} else {
			vscode.window.showErrorMessage('Not found activated tab');
		}
	});

	// 注册命令
	context.subscriptions.push(...[ openFile, openFolder, showPreview ]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
