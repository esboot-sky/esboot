import * as vscode from 'vscode';
import { loadEnv, cfg } from '@dz-web/esboot';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new ESBootSidebarProvider(
    vscode.workspace.workspaceFolders
  );

  console.log(42323432, '<-- 42323432');
  vscode.window.registerTreeDataProvider('ESBoot', sidebarProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.refresh', () => {
      sidebarProvider.refresh();
    })
  );
}

class ESBootSidebarProvider implements vscode.TreeDataProvider<ESBootTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ESBootTreeItem | undefined | void
  > = new vscode.EventEmitter<ESBootTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ESBootTreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined
  ) {
    if (workspaceFolders) {
      const cwd = workspaceFolders[0].uri.fsPath;
      loadEnv({ root: cwd });
      cfg.load({ cwd });

      console.log(cfg.config, '<-- process.');
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ESBootTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ESBootTreeItem): Thenable<ESBootTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return Promise.resolve([
        new ESBootTreeItem('Item 12'),
        new ESBootTreeItem('Item 2'),
      ]);
    }
  }
}

class ESBootTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
