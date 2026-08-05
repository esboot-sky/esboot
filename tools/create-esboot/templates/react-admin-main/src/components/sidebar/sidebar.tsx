import type { MenuProps } from 'antd';
import type { IMenu, IModuleItem } from '@/model';
import {
  AppstoreOutlined,
  CloseOutlined,
  FolderOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Menu, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLoginStore } from '@/model';
import { getExternalModuleUrl } from '@/modules/login/api/login';
import { cn } from '@/utils/cn';
import { getDefaultModulePath } from '@/utils/common';

type MenuItem = Required<MenuProps>['items'][number];

function transformToMenuItems(data: IMenu[]): MenuItem[] {
  if (!data?.length) return [];
  return data.map((item) => {
    const key = item.path || item.id?.toString();
    const newItem: any = {
      key,
      label: item.title || item.name,
    };

    if (item.children?.length) {
      newItem.children = transformToMenuItems(item.children);
    }

    return newItem;
  });
}

function findMenuPathKeys(
  items: IMenu[],
  targetPath: string,
  currentKeys: string[] = [],
): { selectedKey: string; openKeys: string[] } | null {
  if (!items?.length || !targetPath) return null;

  for (const item of items) {
    const key = item.path || item.id?.toString();
    const newKeys = [...currentKeys, key];

    if (item.path === targetPath || (item.path && targetPath === item.path)) {
      if (!item.children?.length) {
        return {
          selectedKey: key,
          openKeys: currentKeys,
        };
      }
    }

    if (item.children?.length) {
      const found = findMenuPathKeys(item.children, targetPath, newKeys);
      if (found) return found;
    }
    else if (item.path && targetPath.startsWith(item.path)) {
      return {
        selectedKey: key,
        openKeys: currentKeys,
      };
    }
  }

  return null;
}

function findPathByPath(items: IMenu[], targetKey: string): string | null {
  if (!items?.length) return null;
  for (const item of items) {
    if (item.path === targetKey || item.id?.toString() === targetKey) {
      return item.path;
    }
    if (item.children?.length) {
      const found = findPathByPath(item.children, targetKey);
      if (found) return found;
    }
  }
  return null;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const currentModule = useLoginStore(state => state.currentModule);
  const moduleList = useLoginStore(state => state.moduleList);
  const currentModulePath = useLoginStore(state => state.currentModulePath);

  const setCurrentModule = useLoginStore(state => state.setCurrentModule);
  const setCurrentModulePath = useLoginStore(state => state.setCurrentModulePath);

  const [showAllOverlay, setShowAllOverlay] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!moduleList?.length) return;
    const currentPath = location.pathname;
    if (!currentPath || currentPath === '/') return;

    const matchedModule = moduleList.find((m: IModuleItem) => {
      if (m.routerBase && currentPath.startsWith(m.routerBase)) return true;
      if (m.menu?.some(menuItem => findMenuPathKeys([menuItem], currentPath))) return true;
      return false;
    });

    if (matchedModule && matchedModule.code !== currentModule?.code) {
      setCurrentModule(matchedModule);
    }
  }, [location.pathname, moduleList, currentModule, setCurrentModule]);

  useEffect(() => {
    if (location.pathname && location.pathname !== currentModulePath) {
      setCurrentModulePath(location.pathname);
    }
  }, [location.pathname, currentModulePath, setCurrentModulePath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAllOverlay) {
        setShowAllOverlay(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllOverlay]);

  const menuItems = useMemo(() => {
    if (!currentModule?.menu) return [];
    return transformToMenuItems(currentModule.menu);
  }, [currentModule]);

  const activePath = location.pathname || currentModulePath;

  const activeKeysInfo = useMemo(() => {
    if (!currentModule?.menu || !activePath) return { selectedKeys: [], openKeys: [] };
    const found = findMenuPathKeys(currentModule.menu, activePath);
    if (found) {
      return {
        selectedKeys: [found.selectedKey],
        openKeys: found.openKeys,
      };
    }
    return { selectedKeys: [activePath], openKeys: [] };
  }, [currentModule, activePath]);

  useEffect(() => {
    if (activeKeysInfo.openKeys.length > 0) {
      queueMicrotask(() => {
        setOpenKeys((prev) => {
          const next = Array.from(new Set([...prev, ...activeKeysInfo.openKeys]));
          const isSame = prev.length === next.length && prev.every((key, i) => key === next[i]);
          return isSame ? prev : next;
        });
      });
    }
  }, [activeKeysInfo.openKeys]);

  const handleModuleClick = useCallback(
    (moduleItem: IModuleItem) => {
      setShowAllOverlay(false);

      if (moduleItem?.isExternal) {
        getExternalModuleUrl({ moduleCode: moduleItem.code }).then((res: any) => {
          if (res?.result) {
            window.location.href = res.result;
          }
        });
        return;
      }

      setCurrentModule(moduleItem);
      const defaultPath = getDefaultModulePath(moduleItem);
      if (defaultPath) {
        setCurrentModulePath(defaultPath);
        navigate(defaultPath);
      }
    },
    [navigate, setCurrentModule, setCurrentModulePath],
  );

  const handleSubMenuItemClick = useCallback(
    (moduleItem: IModuleItem, subItem: IMenu) => {
      setShowAllOverlay(false);
      setCurrentModule(moduleItem);
      const targetPath = subItem.path;
      if (targetPath) {
        setCurrentModulePath(targetPath);
        navigate(targetPath);
      }
    },
    [navigate, setCurrentModule, setCurrentModulePath],
  );

  return (
    <div className="relative flex select-none block-full">
      <div
        className="
          bg-white flex-none scrollbar-none overflow-y-auto border-e border-[#e9eaee] inline-[85px]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <ul className="m-0 p-0 flex list-none flex-col">
          <li
            onClick={() => setShowAllOverlay(!showAllOverlay)}
            className={cn(
              `
                my-[8px]! flex cursor-pointer flex-col items-center justify-center text-center
                transition-colors
              `,
              showAllOverlay
                ? 'font-medium text-[#0e67ff]'
                : `
                  text-[#868890]
                  hover:text-[#0e67ff]
                `,
            )}
          >
            <AppstoreOutlined className="mb-1 text-[20px]" />
            <span className="text-[12px] whitespace-nowrap">{formatMessage({ id: 'sidebar.all' })}</span>
          </li>

          <div className="mx-3 mb-4 bg-slate-200/60 block-px" />

          {moduleList.map((item: IModuleItem) => {
            const isActive = currentModule?.code === item.code;
            return (
              <li
                key={item.code}
                onClick={() => handleModuleClick(item)}
                title={item.name}
                className={cn(
                  `
                    my-[8px]! flex cursor-pointer flex-col items-center justify-center text-center
                    transition-colors
                  `,
                  isActive
                    ? 'font-medium text-[#0e67ff]'
                    : `
                      text-[#868890]
                      hover:text-[#0e67ff]
                    `,
                )}
              >
                <FolderOutlined className="mb-1 text-[20px]" />
                <span className="px-1 truncate text-[12px] leading-none">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {showAllOverlay && (
        <>
          <div
            className="
              inset-0 bg-slate-900/30 backdrop-blur-xs fixed z-40 transition-opacity duration-200
            "
            onClick={() => setShowAllOverlay(false)}
          />

          <div
            className="
              top-0 bottom-0 bg-white shadow-2xl border-slate-200/80 animate-in slide-in-from-left
              fixed inset-s-[85px] z-50 flex flex-col border-e duration-200 inline-[780px]
              max-inline-[calc(100vw-105px)]
            "
            onClick={e => e.stopPropagation()}
          >
            <div className="
              px-6 py-3.5 border-slate-100 bg-white flex items-center justify-between border-be
            "
            >
              <div className="gap-2.5 flex items-center">
                <div className="
                  w-7 h-7 rounded-lg bg-blue-600 text-white shadow-xs flex items-center
                  justify-center
                "
                >
                  <AppstoreOutlined className="text-base" />
                </div>
                <h3 className="text-base font-bold text-slate-800 m-0 leading-tight">
                  {formatMessage({ id: 'sidebar.allNav' })}
                </h3>
              </div>

              <button
                onClick={() => setShowAllOverlay(false)}
                className="
                  w-7 h-7 rounded-lg
                  hover:bg-slate-100
                  text-slate-400
                  hover:text-slate-700
                  flex cursor-pointer items-center justify-center border-none bg-transparent
                  transition-colors
                "
                title={formatMessage({ id: 'sidebar.close' })}
              >
                <CloseOutlined className="text-sm" />
              </button>
            </div>

            <div className="
              p-6 bg-slate-50/40
              [&::-webkit-scrollbar-thumb]:bg-slate-200
              hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
              flex-1 overflow-y-auto
              [&::-webkit-scrollbar]:inline-[5px]
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent
            "
            >
              <div className="
                md:grid-cols-2
                gap-5 grid grid-cols-1
              "
              >
                {moduleList.map((moduleItem: IModuleItem) => {
                  const isCurrent = currentModule?.code === moduleItem.code;
                  return (
                    <div
                      key={moduleItem.code}
                      className={cn(
                        `
                          group rounded-xl p-4 bg-white shadow-2xs
                          hover:shadow-md
                          flex flex-col border transition-all duration-200 block-[280px]
                        `,
                        isCurrent
                          ? 'border-blue-300 ring-blue-500/20 bg-blue-50/10 ring-1'
                          : `
                            border-slate-200/80
                            hover:border-blue-200
                          `,
                      )}
                    >
                      <div className="
                        mb-3 pb-2.5 border-slate-100 flex shrink-0 items-center justify-between
                        border-be
                      "
                      >
                        <div
                          onClick={() => handleModuleClick(moduleItem)}
                          className="gap-2.5 group/title flex cursor-pointer items-center"
                        >
                          <div className="
                            w-8 h-8 rounded-lg from-blue-50 to-indigo-50 border-blue-100
                            text-blue-600 font-medium shadow-xs flex items-center justify-center
                            border bg-linear-to-br transition-transform
                            group-hover/title:scale-105
                          "
                          >
                            <AppstoreOutlined className="text-sm" />
                          </div>
                          <span className="
                            font-bold text-slate-800
                            group-hover/title:text-blue-600
                            text-[15px] transition-colors
                          "
                          >
                            {moduleItem.name}
                          </span>
                          {isCurrent && (
                            <span className="
                              px-2 py-0.5 bg-blue-100 text-blue-600 font-medium rounded-full
                              text-[11px]
                            "
                            >
                              {formatMessage({ id: 'sidebar.current' })}
                            </span>
                          )}
                        </div>

                        {moduleItem.isExternal && (
                          <Tag color="orange" className="mr-0 text-xs rounded-md">
                            {formatMessage({ id: 'sidebar.external' })}
                          </Tag>
                        )}
                      </div>

                      <div className="
                        pr-2 space-y-3
                        [&::-webkit-scrollbar-thumb]:bg-slate-200
                        hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/60
                        flex-1 overflow-y-auto
                        [&::-webkit-scrollbar]:inline-[4px]
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-transparent
                      "
                      >
                        {moduleItem.menu?.map((menuGroup: IMenu) => (
                          <div key={menuGroup.id || menuGroup.name}>
                            <div className="
                              font-semibold text-slate-400 tracking-wider mb-1 px-1 text-[11px]
                              uppercase
                            "
                            >
                              {menuGroup.name}
                            </div>
                            <div className="gap-0.5 grid grid-cols-1">
                              {menuGroup.children?.map((subItem: IMenu) => (
                                <div
                                  key={subItem.id || subItem.path}
                                  onClick={() => handleSubMenuItemClick(moduleItem, subItem)}
                                  className="
                                    group/item px-2.5 py-1.5 rounded-lg text-slate-600
                                    hover:text-blue-600 hover:bg-blue-50/70
                                    font-normal flex cursor-pointer items-center justify-between
                                    text-[13px] transition-all
                                  "
                                >
                                  <span className="truncate">{subItem.title || subItem.name}</span>
                                  <RightOutlined className="
                                    text-slate-300
                                    group-hover/item:text-blue-500
                                    -translate-x-1
                                    group-hover/item:translate-x-0
                                    text-[10px] opacity-0 transition-all
                                    group-hover/item:opacity-100
                                  "
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white flex-none overflow-y-auto border-e border-[#e9eaee] inline-[200px]">
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={activeKeysInfo.selectedKeys}
          openKeys={openKeys}
          onOpenChange={keys => setOpenKeys(keys)}
          onSelect={({ key }) => {
            const path = findPathByPath(currentModule?.menu || [], key) || key;
            setCurrentModulePath(path);
            navigate(path);
          }}
          className="bg-white border-none py-[10px]"
        />
      </div>
    </div>
  );
}
