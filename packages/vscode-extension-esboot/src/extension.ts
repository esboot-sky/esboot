import * as vscode from 'vscode';
import { loadEnv, cfg } from '@dz-web/esboot';

import { activateSidebar } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
  activateSidebar(context);
}

export function deactivate() {}
