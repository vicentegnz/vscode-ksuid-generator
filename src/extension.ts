// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Constants from './constants';
import { copy } from './clipboard';
const KSUID = require('ksuid');
const COMMANDS: string[] = [Constants.KSUID_GENERATE, Constants.KSUID_REPEAT];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ksuid-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	for (const cmd of COMMANDS) {
		context.subscriptions.push(vscode.commands.registerCommand(cmd, (args: any[]) => {
			const editor = vscode.window.activeTextEditor;

			generateKSUID(cmd, editor);
		}));
	}

}

// this method is called when your extension is deactivated
export function deactivate() { }

function generateKSUID(cmd:string, editor: vscode.TextEditor | undefined) {
  if (editor === undefined || editor.selection === undefined) {
	  copyKSUID(KSUID.randomSync().string);
    return;
  }

  let ksuid:string = KSUID.randomSync().string;

  editor.edit(editBuilder => {
    for (const selection of editor.selections) {
      editBuilder.replace(selection, ksuid);
      if (cmd === Constants.KSUID_GENERATE) {
        ksuid = KSUID.randomSync().string;
      }
    }
  });
}

function showMessage(ksuid: string) {
  if (isNullOrWhiteSpace(ksuid)) {
    return;
  }

  vscode.window.showInformationMessage(ksuid);
}

function copyKSUID(ksuid: string) {
  copy(ksuid, () => {
    showMessage(ksuid + ' is copied.');
  });
}

function isNullOrWhiteSpace(text: string | null | undefined) {
  return typeof text === 'string' && !text.trim() || typeof text === undefined || text === null;
}