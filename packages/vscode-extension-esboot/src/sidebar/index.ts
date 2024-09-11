import * as vscode from 'vscode';

import { ESBootSidebarProvider } from './provider';

export function activateSidebar(context: vscode.ExtensionContext) {
  const sidebarProvider = new ESBootSidebarProvider();
  vscode.window.registerTreeDataProvider('ESBoot', sidebarProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.refreshSidebar', () => {
      sidebarProvider.refresh();
      vscode.window.showInformationMessage('ESBoot sidebar refreshed');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.refresh', () => {
      sidebarProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ESBoot.toggleCheckbox',
      (label: string) => {
        sidebarProvider.toggleCheckbox(label);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.showDropdown', async () => {
      const result = await vscode.window.showQuickPick(
        ['Option X', 'Option Y', 'Option Z'],
        {
          placeHolder: 'Select an option',
        }
      );
      if (result) {
        vscode.window.showInformationMessage(`Selected: ${result}`);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ESBoot.selectRadio', (option: string) => {
      sidebarProvider.selectRadio(option);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ESBoot.selectPlatform',
      (platform: string) => {
        sidebarProvider.selectPlatform(platform);
        vscode.window.showInformationMessage(`Platform selected: ${platform}`);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ESBoot.selectPageType',
      (pageType: string) => {
        sidebarProvider.selectPageType(pageType);
        vscode.window.showInformationMessage(`Page Type selected: ${pageType}`);
      }
    )
  );
}
