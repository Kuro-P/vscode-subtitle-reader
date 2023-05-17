import * as vscode from 'vscode';
import * as path from 'path';
import { displayPreviewPanel } from './preview';

export let context: vscode.ExtensionContext;

export function activate(c: vscode.ExtensionContext) {
	context = c;
	console.log('Congratulations, your extension "helloVscode" is now active!');

	// open file
	let openFile = vscode.commands.registerCommand('subtitleReader.helloFile', () => {
		vscode.window.showErrorMessage('Hello File xixixi from VS Code');
		vscode.workspace.openTextDocument(path.join(context.extensionPath, '/test/Tags.ass')).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	});

	// openFolder
	let openFolder = vscode.commands.registerCommand('subtitleReader.helloFolder', () => {
		const folderPath = path.join(context.extensionPath, '/test');
		const folderPathParsed = folderPath.split(`\\`).join(`/`);
		// Updated Uri.parse to Uri.file
		const folderUri = vscode.Uri.file(folderPathParsed);
		vscode.commands.executeCommand(`vscode.openFolder`, folderUri);
	});

	let showPreview = vscode.commands.registerCommand('subtitleReader.showPreviewPanel', () => {
		console.log('vscode.window.state', vscode.window.state);

		const textEditor = vscode.window.activeTextEditor;
		if (textEditor) {
			displayPreviewPanel();
		} else {
			vscode.window.showErrorMessage('Not found activated tab');
		}
	});

	// 注册命令
	context.subscriptions.push(...[ openFile, openFolder, showPreview ]);
}

// This method is called when your extension is deactivated
export function deactivate() {}
