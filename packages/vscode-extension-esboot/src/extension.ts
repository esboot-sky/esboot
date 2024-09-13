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
  const isSP = content.includes('isSP: true');
  if (isSP) return;

  console.log('ESBoot activated');
  activateSidebar(context);
}

export function deactivate() {}
