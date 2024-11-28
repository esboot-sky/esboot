import * as vscode from 'vscode';
import { join } from 'path';
import { addEntry } from '@dz-web/esboot-bundler-common';
import { cfg } from '@dz-web/esboot';
import { PLATFORMS, PAGE_TYPE } from '@dz-web/esboot-common';
import { refreshInfo, modifyEnv } from '../utils';
import { TreeItemType } from './constants';

export class ESBootTreeItem extends vscode.TreeItem {
  public selected: boolean;
  public type: TreeItemType;

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    type: TreeItemType,
    selected?: boolean
  ) {
    super(label, collapsibleState);
    this.selected = selected || false;
    this.type = type;
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
  public fullPages: string[] = [];
  public selectedPages: string[] = [];
  public pageDict: Record<string, any> = {};

  public platforms: string[] = [];
  public pageTypes: string[] = [];

  private isSP: boolean;

  constructor(options: { isSP?: boolean }) {
    this.isSP = options.isSP || false;
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

    this.selectedPages.length = 0;
    this.fullPages.length = 0;
    this.pageDict = {};

    const { ESBOOT_CONTENT_PATTERN = '*', ESBOOT_CONTENT_PATH = '', ESBOOT_CONTENT_IGNORE = '' } =
      process.env;
    const isFull = ESBOOT_CONTENT_PATTERN === '*';
    const contentPath = this.isSP
      ? ''
      : join(
          'platforms',
          this.selectedPlatform || '',
          `_${this.selectedPageType}`
        );

    await addEntry(
      cfg,
      (params) => {
        this.fullPages.push(params.chunkName);
        this.pageDict[params.chunkName] = params;
        if (isFull) {
          this.selectedPages.push(params.chunkName);
        }
      },
      {
        contentPath,
        pattern: '*',
        ignore: ESBOOT_CONTENT_IGNORE,
      }
    );

    if (!isFull) {
      await addEntry(
        cfg,
        (params) => {
          this.selectedPages.push(params.chunkName);
        },
        {
          contentPath: join(contentPath, ESBOOT_CONTENT_PATH),
          pattern: ESBOOT_CONTENT_PATTERN,
          ignore: ESBOOT_CONTENT_IGNORE,
        }
      );
    }

    this._onDidChangeTreeData.fire();
  };

  getTreeItem(element: ESBootTreeItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.label,
      element.collapsibleState
    );

    if (element.selected) {
      treeItem.iconPath = new vscode.ThemeIcon('circle-filled');
    }

    treeItem.contextValue = element.type;
    return treeItem;
  }

  getChildren(element?: ESBootTreeItem): Thenable<ESBootTreeItem[]> {
    if (element) {
      switch (element.type) {
        case TreeItemType.PLATFORM:
          return Promise.resolve(this.getPlatformItems());
        case TreeItemType.PAGE_TYPE:
          return Promise.resolve(this.getPageTypeItems());
        case TreeItemType.PAGE:
          return Promise.resolve(this.getPageItems());
        default:
          return Promise.resolve([]);
      }
    }

    return Promise.resolve(
      [
        this.isSP
          ? undefined
          : new ESBootTreeItem(
              'Platform',
              vscode.TreeItemCollapsibleState.Expanded,
              TreeItemType.PLATFORM
            ),
        new ESBootTreeItem(
          'PageType',
          vscode.TreeItemCollapsibleState.Expanded,
          TreeItemType.PAGE_TYPE
        ),
        new ESBootTreeItem(
          `Pages(${this.selectedPages.length}/${this.fullPages.length})`,
          vscode.TreeItemCollapsibleState.Expanded,
          TreeItemType.PAGE
        ),
      ].filter(Boolean) as ESBootTreeItem[]
    );
  }

  private getPlatformItems(): ESBootTreeItem[] {
    return this.platforms.map(
      (platform) =>
        new ESBootTreeItem(
          platform,
          vscode.TreeItemCollapsibleState.None,
          TreeItemType.PLATFORM,
          platform === this.selectedPlatform
        )
    );
  }

  private getPageTypeItems(): ESBootTreeItem[] {
    return this.pageTypes.map(
      (pageType) =>
        new ESBootTreeItem(
          pageType,
          vscode.TreeItemCollapsibleState.None,
          TreeItemType.PAGE_TYPE,
          pageType === this.selectedPageType
        )
    );
  }

  private getPageItems = (): ESBootTreeItem[] => {
    return this.fullPages.map((page) => {
      const item = new ESBootTreeItem(
        page,
        vscode.TreeItemCollapsibleState.None,
        TreeItemType.PAGE,
        this.selectedPages.includes(page)
      );
      return item;
    });
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

  createPageEnv(): void {
    let pattern = '*';

    if (this.selectedPages.length !== 0) {
      pattern = '+(';
      this.selectedPages.forEach((page) => {
        pattern += `${page}|`;
      });
      pattern = pattern.slice(0, -1) + ')';
    }

    modifyEnv('ESBOOT_CONTENT_PATTERN', pattern);

    this._onDidChangeTreeData.fire();
  }

  selectPages(pages: string[]): void {
    this.selectedPages = pages;
    this.createPageEnv();
  }

  selectSinglePage(page: string): void {
    this.selectedPages = [page];
    this.createPageEnv();
  }

  toggleSinglePage(page: string): void {
    if (this.selectedPages.includes(page)) {
      if (this.selectedPages.length === 1) return;
      this.selectedPages = this.selectedPages.filter((p) => p !== page);
    } else {
      this.selectedPages.push(page);
    }

    this.createPageEnv();
  }
}
