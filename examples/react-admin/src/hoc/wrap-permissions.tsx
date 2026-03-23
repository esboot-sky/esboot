import { BusinessProvider } from '@dz-web/antd-pro-components';
import { createContext } from 'react';

import { useAppStore } from '@/model/app';

export const permissionContext = createContext<string[]>([]);

export default function wrapPermission(App: React.ReactNode) {
  function PermissionApp() {
    const currentPermissionList = useAppStore((state) => state.currentPermissionList);

    return <BusinessProvider permissionList={currentPermissionList}>{App}</BusinessProvider>;
  }
  return <PermissionApp />;
}
