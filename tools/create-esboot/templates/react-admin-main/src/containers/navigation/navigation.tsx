import { Menu, ConfigProvider } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLoginStore } from '@/model';

import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const transformToMenuItems = (data) => {
  return data.map((item) => {
    const newItem = {
      key: item.id.toString(),
      label: item.name,
    };

    if (!item.children?.length) return newItem;

    return {
      ...newItem,
      children: transformToMenuItems(item.children),
    };
  });
};

const findPathById = (items, targetPath, currentPath = []) => {
  for (const item of items) {
    const newPath = [...currentPath, item.id]; // 记录当前路径

    if (item.children && item.children.length > 0) {
      const foundPath = findPathById(item.children, targetPath, newPath);
      if (foundPath) {
        return foundPath; // 找到路径，返回
      }
    }

    if (item.path === targetPath) {
      return newPath; // 找到目标路径，返回路径上的所有ID
    }
  }
  return null; // 如果未找到则返回 null
};

const findPath = (items, targetId) => {
  for (const item of items) {
    const newPath = item.path; // 记录当前路径

    if (item.id === targetId) {
      return newPath; // 找到目标ID，返回路径
    }

    if (item.children && item.children.length > 0) {
      const foundPath = findPath(item.children, targetId);
      if (foundPath) {
        return foundPath; // 找到路径，返回
      }
    }
  }
  return null; // 如果未找到则返回 null
};

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentModule = useLoginStore((state) => state.currentModule);
  const currentModulePath = useLoginStore((state) => state.currentModulePath);
  const setCurrentModulePath = useLoginStore((state) => state.setCurrentModulePath);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const columns: MenuItem[] = useMemo(() => {
    if (!currentModule) return [];
    return transformToMenuItems(currentModule?.menu);
  }, [currentModule]);

  const selectedKeys = useMemo(() => {
    if (!currentModule) return [];

    const pathIds = findPathById(currentModule?.menu, currentModulePath);

    if (!pathIds) {
      return [];
    }

    if (pathIds.length > 1) {
      const _openKey = pathIds.slice(0, -1);
      setOpenKeys(_openKey.map((item) => item.toString()));
      return [pathIds[pathIds.length - 1]].map((item) => item.toString());
    }

    return pathIds.map((item) => item.toString());
  }, [currentModule, currentModulePath]);

  useEffect(() => {
    // 点击 Menu-item 跳转的路由404，点击浏览器 <- 按钮返回时，路由返回了，但是会高亮404的 Menu-item，原因是没有修改存在localStorage里的currentModulePath，在这里进行修改
    if (location.pathname === currentModulePath) return;
    setCurrentModulePath(location.pathname);
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: 'transparent',
            algorithm: true,
          },
        },
      }}
    >
      <Menu
        style={{ width: '100%' }}
        // defaultSelectedKeys={['9801']}
        selectedKeys={selectedKeys}
        // defaultOpenKeys={['sub1']}
        openKeys={openKeys}
        mode="inline"
        items={columns}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        onSelect={({ selectedKeys: keys }) => {
          const pathId = keys[0];
          const path = findPath(currentModule.menu, Number(pathId));
          setCurrentModulePath(path);
          navigate(path);
        }}
      />
    </ConfigProvider>
  );
};

export default Navigation;
