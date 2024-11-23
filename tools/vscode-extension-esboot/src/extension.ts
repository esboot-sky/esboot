import * as vscode from 'vscode';
import fse from 'fs-extra';
import path from 'path';
import { root } from './utils';
import { activateSidebar } from './sidebar';

export function activate(context: vscode.ExtensionContext) {
  if (!root) return;

  const cfgPath = path.join(root, '.esbootrc.ts');
  if (!fse.existsSync(cfgPath)) return;

  const content = fse.readFileSync(cfgPath, 'utf8');
  // TODO: load file content
  const isSP = content.includes('isSP: true');

  console.log('ESBoot activated');
  activateSidebar(context, { isSP });
}

export function deactivate() {}
