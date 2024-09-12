import * as vscode from 'vscode';
import { join } from 'path';
import { addEntry } from '@dz-web/esboot-bundler-common';
import { cfg } from '@dz-web/esboot';
import { PLATFORMS, PAGE_TYPE } from '@dz-web/esboot-common';
import { refreshInfo, modifyEnv } from '../utils';

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

  public selectedPlatform: string | null = null;
  public selectedPageType: string | null = null;
  private _fullPages: string[] = [];
  private _currPagesKeys: Map<string, boolean> = new Map();

  public platforms: string[] = [];
  public pageTypes: string[] = [];

  constructor() {
    this.refresh();
  }

  private syncSelectedPlatform(): void {
    this.selectedPlatform = cfg.config.isMobile
      ? PLATFORMS.MOBILE
      : PLATFORMS.PC;
  }

  private syncSelectedPageType(): void {
    this.selectedPageType = cfg.config.isBrowser
      ? PAGE_TYPE.browser
      : PAGE_TYPE.native;
  }

  refresh = async (): Promise<void> => {
    refreshInfo();

    this.syncSelectedPlatform();
    this.syncSelectedPageType();

    this.platforms = Object.values(PLATFORMS).filter((key) =>
      isNaN(Number(key))
    );
    this.pageTypes = Object.values(PAGE_TYPE).filter((key) =>
      isNaN(Number(key))
    );

    this._currPagesKeys.clear();
    this._fullPages.length = 0;

    const { ESBOOT_CONTENT_PATTERN = '*', ESBOOT_CONTENT_PATH = '' } =
      process.env;
    const isFull = ESBOOT_CONTENT_PATTERN === '*';
    const contentPath = join(
      'platforms',
      this.selectedPlatform || '',
      `_${this.selectedPageType}`
    );

    await addEntry(
      cfg,
      (params) => {
        console.log('params', params);
        this._fullPages.push(params.chunkName);
        if (isFull) {
          this._currPagesKeys.set(params.chunkName, true);
        }
      },
      {
        contentPath,
        pattern: '*',
      }
    );

    if (!isFull) {
      await addEntry(
        cfg,
        (params) => {
          this._currPagesKeys.set(params.chunkName, true);
        },
        {
          contentPath: join(contentPath, ESBOOT_CONTENT_PATH),
          pattern: ESBOOT_CONTENT_PATTERN,
        }
      );
    }

    console.log('this._fullPages', this._fullPages, this._currPagesKeys);
    this._onDidChangeTreeData.fire();
  };

  getTreeItem(element: ESBootTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ESBootTreeItem): Thenable<ESBootTreeItem[]> {
    if (element) {
      switch (element.label) {
        case 'Platform':
          return Promise.resolve(this.getPlatformItems());
        case 'PageType':
          return Promise.resolve(this.getPageTypeItems());
        case 'Pages':
          return Promise.resolve(this.getPageItems());
      }
    } else {
      return Promise.resolve([
        new ESBootTreeItem(
          'Platform',
          vscode.TreeItemCollapsibleState.Expanded
        ),
        new ESBootTreeItem(
          'PageType',
          vscode.TreeItemCollapsibleState.Expanded
        ),
        new ESBootTreeItem('Pages', vscode.TreeItemCollapsibleState.Expanded),
      ]);
    }
    return Promise.resolve([]);
  }

  private getPlatformItems(): ESBootTreeItem[] {
    return this.platforms.map(
      (platform) =>
        new ESBootTreeItem(
          platform,
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'ESBoot.selectPlatform',
            title: 'Platform',
            arguments: [platform],
          },
          this.selectedPlatform === platform
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked
        )
    );
  }

  private getPageTypeItems(): ESBootTreeItem[] {
    return this.pageTypes.map(
      (pageType) =>
        new ESBootTreeItem(
          pageType,
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'ESBoot.selectPageType',
            title: 'Page Type',
            arguments: [pageType],
          },
          this.selectedPageType === pageType
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked
        )
    );
  }

  private getPageItems = (): ESBootTreeItem[] => {
    return this._fullPages.map(
      (page) =>
        new ESBootTreeItem(
          page,
          vscode.TreeItemCollapsibleState.None,
          {
            command: 'ESBoot.selectPage',
            title: 'Page',
            arguments: [page],
          },
          this._currPagesKeys.has(page)
            ? vscode.TreeItemCheckboxState.Checked
            : vscode.TreeItemCheckboxState.Unchecked
        )
    );
  };

  selectPlatform(platform: string): void {
    if (this.selectedPlatform === platform) {
      return;
    }

    modifyEnv('ESBOOT_PLATFORM', platform);
    this.selectedPlatform = platform;
    this.refresh();
  }

  selectPageType(pageType: string): void {
    if (this.selectedPageType === pageType) {
      return;
    }

    modifyEnv('ESBOOT_PAGE_TYPE', pageType);
    this.selectedPageType = pageType;
    this.refresh();
  }

  selectPage(page: string): void {
    if (this._currPagesKeys.has(page)) {
      this._currPagesKeys.delete(page);
    } else {
      this._currPagesKeys.set(page, true);
    }
    this.refresh();
  }
}
