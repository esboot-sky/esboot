import * as vscode from 'vscode';
import { refreshInfo } from '../utils';
import { ESBootSidebarProvider } from './provider';

export function activateSidebar(context: vscode.ExtensionContext) {
  refreshInfo();

  const sidebarProvider = new ESBootSidebarProvider();
  vscode.window.registerTreeDataProvider('ESBoot', sidebarProvider);

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
      const result = await vscode.window.showQuickPick(
        quickPickItems,
        {
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
}
