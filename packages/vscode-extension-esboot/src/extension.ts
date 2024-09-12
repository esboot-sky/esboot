import * as vscode from 'vscode';

import { activateSidebar } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
  activateSidebar(context);
}

export function deactivate() {}
