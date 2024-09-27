import * as vscode from 'vscode';
import fse from 'fs-extra';
import path from 'node:path';
import { loadEnv, cfg } from '@dz-web/esboot';

export const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath!;
export const envPath = path.join(root, '.env.local');
export function refreshInfo() {
  loadEnv({ root });
  cfg.loadEnv({ cwd: root });
}

export function modifyEnv(key: string, value: string) {
  fse.ensureFileSync(envPath);
  const content = fse.readFileSync(envPath, 'utf8');

  const lines = content.split('\n');
  const lineIdx = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (lineIdx !== -1) {
    const oldValue = lines[lineIdx];
    lines[lineIdx] = lines[lineIdx].replace(
      `${key}=${oldValue.split('=')[1]}`,
      `${key}=${value}`
    );
  } else {
    lines.push(`${key}=${value}`);
  }

  fse.writeFileSync(envPath, lines.join('\n'));
}
