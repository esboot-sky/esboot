import * as vscode from 'vscode';
import { PLATFORMS, PAGE_TYPE } from '@dz-web/esboot-common';

class ESBootTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public checkboxState?: vscode.TreeItemCheckboxState
  ) {
    super(label, collapsibleState);
    this.checkboxState = checkboxState;
  }
}

export class ESBootSidebarProvider
  implements vscode.TreeDataProvider<ESBootTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    ESBootTreeItem | undefined | null | void
  > = new vscode.EventEmitter<ESBootTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    ESBootTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ESBootTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ESBootTreeItem): Thenable<ESBootTreeItem[]> {
    console.log('getChildren', element);

    if (element) {
      switch (element.label) {
        case 'Platform':
          return Promise.resolve(this.getPlatformItems());
        case 'Page Type':
          return Promise.resolve(this.getPageTypeItems());
      }
    } else {
      return Promise.resolve([
        new ESBootTreeItem('Platform', vscode.TreeItemCollapsibleState.Expanded),
        new ESBootTreeItem('Page Type', vscode.TreeItemCollapsibleState.Expanded),
      ]);
    }
    return Promise.resolve([]);
  }

  private getPlatformItems(): ESBootTreeItem[] {
    const platforms = Object.keys(PLATFORMS).filter(key => isNaN(Number(key)));
    if (platforms.length !== 2) {
      throw new Error('Expected exactly two platforms');
    }

    return platforms.map(platform => 
      new ESBootTreeItem(
        platform,
        vscode.TreeItemCollapsibleState.None,
        {
          command: 'ESBoot.selectPlatform',
          title: 'Select Platform',
          arguments: [platform]
        },
        this._selectedPlatform === platform
          ? vscode.TreeItemCheckboxState.Checked
          : vscode.TreeItemCheckboxState.Unchecked
      )
    );
  }

  private getPageTypeItems(): ESBootTreeItem[] {
    return Object.keys(PAGE_TYPE)
      .filter(key => isNaN(Number(key)))
      .map(pageType => 
        new ESBootTreeItem(
          pageType,
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'ESBoot.selectPageType',
            title: 'Select Page Type',
            arguments: [pageType]
          },
          this._selectedPageType === pageType
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked
        )
      );
  }

  private _selectedPlatform: string | null = null;
  private _selectedPageType: string | null = null;

  selectPlatform(platform: string): void {
    this._selectedPlatform = platform;
    this.refresh();
  }

  selectPageType(pageType: string): void {
    this._selectedPageType = pageType;
    this.refresh();
  }
}
