import * as vscode from 'vscode';
import { refreshInfo } from '../utils';
import { ESBootSidebarProvider } from './provider';
import { TreeItemType } from './constants';

export function activateSidebar(context: vscode.ExtensionContext) {
  refreshInfo();

  const sidebarProvider = new ESBootSidebarProvider();
  vscode.window.registerTreeDataProvider('ESBoot', sidebarProvider);

  const treeView = vscode.window.createTreeView('ESBoot', {
    treeDataProvider: sidebarProvider,
    canSelectMany: false,
  });

  treeView.onDidChangeSelection((event) => {
    if (event.selection.length > 0) {
      const selectedItem = event.selection[0];
      console.log(selectedItem, 'selectedItem');

      const label = selectedItem.label.replace(/^[▶ ]+/, '').trim();

      switch (selectedItem.type) {
        case TreeItemType.PLATFORM:
          if (
            sidebarProvider.platforms.includes(label) &&
            sidebarProvider.selectedPlatform !== label
          ) {
            sidebarProvider.selectPlatform(label);
            vscode.window.showInformationMessage(`Platform selected: ${label}`);
          }
          break;
        case TreeItemType.PAGE_TYPE:
          if (
            sidebarProvider.pageTypes.includes(label) &&
            sidebarProvider.selectedPageType !== label
          ) {
            sidebarProvider.selectPageType(label);
            vscode.window.showInformationMessage(`PageType selected: ${label}`);
          }
          break;
        case TreeItemType.PAGE:
          if (sidebarProvider.fullPages.includes(label)) {
            sidebarProvider.selectPage(label);
          }
          break;
      }
    }
  });

  context.subscriptions.push(treeView);

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.refreshSidebar', () => {
      sidebarProvider.refresh();
      vscode.window.showInformationMessage('ESBoot sidebar refreshed');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.selectPlatform', async () => {
      const quickPickItems: vscode.QuickPickItem[] =
        sidebarProvider.platforms.map((platform) => {
          const isCurrent = sidebarProvider.selectedPlatform === platform;

          return {
            label: platform,
            description: isCurrent ? '(current)' : '',
            picked: isCurrent,
          };
        });

      const result = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select an option',
        title: 'Select Platform',
      });
      if (result) {
        if (!result.picked) {
          sidebarProvider.selectPlatform(result.label);
          vscode.window.showInformationMessage(
            `Platform selected: ${result.label}`
          );
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.selectPageType', async () => {
      const quickPickItems: vscode.QuickPickItem[] =
        sidebarProvider.pageTypes.map((pageType) => {
          const isCurrent = sidebarProvider.selectedPageType === pageType;

          return {
            label: pageType,
            description: isCurrent ? '(current)' : '',
            picked: isCurrent,
          };
        });
      const result = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select an option',
        title: 'Select Page Type',
      });
      if (result) {
        if (!result.picked) {
          sidebarProvider.selectPageType(result.label);
          vscode.window.showInformationMessage(
            `Page Type selected: ${result.label}`
          );
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.selectPages', async () => {
      const quickPickItems: vscode.QuickPickItem[] =
        sidebarProvider.fullPages.map((page) => {
          const isCurrent = sidebarProvider.selectedPages.includes(page);

          return {
            label: page,
            description: '',
            picked: isCurrent,
          };
        });

      const results = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select an option',
        title: 'Select Pages',
        canPickMany: true,
      });

      if (results) {
        sidebarProvider.selectedPages = results.map((item) => item.label);
        vscode.window.showInformationMessage(
          `Selected pages: ${sidebarProvider.selectedPages.join(', ')}`
        );
      }
    })
  );
}
