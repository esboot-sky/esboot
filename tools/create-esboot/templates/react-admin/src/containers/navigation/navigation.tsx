import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/model/app';

import { findPath, findPathById, transformToMenuItems } from '@/utils/menu';

type MenuItem = Required<MenuProps>['items'][number];

function Navigation() {
  const navigate = useNavigate();

  const currentModule = useAppStore(state => state.currentModule);
  const currentModulePath = useAppStore(state => state.currentModulePath);
  const setCurrentModulePath = useAppStore(state => state.setCurrentModulePath);
  const setCurrentPermissionList = useAppStore(state => state.setCurrentPermissionList);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const columns: MenuItem[] = useMemo(() => {
    if (!currentModule)
      return [];
    return transformToMenuItems(currentModule?.menu);
  }, [currentModule]);

  const selectedKeys = useMemo(() => {
    if (!currentModule)
      return [];

    const pathIds = findPathById(currentModule?.menu, currentModulePath);

    if (!pathIds) {
      return [];
    }

    if (pathIds.length > 1) {
      return [pathIds.at(-1)].map((item: number) => item.toString());
    }

    return pathIds.map((item: number) => item.toString());
  }, [currentModule, currentModulePath]);

  useEffect(() => {
    if (!currentModule || !currentModulePath) {
      return;
    }
    const pathIds = findPathById(currentModule?.menu, currentModulePath);
    if (pathIds && pathIds.length > 1) {
      const _openKey = pathIds.slice(0, -1);
      const timer = setTimeout(setOpenKeys, 0, _openKey.map((item: number) => item.toString()));
      return () => clearTimeout(timer);
    }
  }, [currentModule, currentModulePath]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: 'var(--color-border-light)',
            itemSelectedColor: 'var(--color-menu-selected-text)',
            itemHoverBg: 'var(--color-border-light)',
            activeBarBorderWidth: 0,
          },
        },
      }}
    >
      <Menu
        style={{ width: '100%' }}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        mode="inline"
        items={columns}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        onSelect={({ selectedKeys: keys }) => {
          const pathId = keys[0];
          const path = findPath(currentModule?.menu, Number(pathId));

          if (!path)
            return;

          setCurrentPermissionList(currentModule?.permission as string[]);

          setCurrentModulePath(path);
          navigate(path);
        }}
      />
    </ConfigProvider>
  );
}

export default Navigation;
