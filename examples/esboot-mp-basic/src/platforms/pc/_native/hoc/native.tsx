/**
 * 此文件为项目标准格式，禁止修改，需要修改请联系负责人进行迭代
 */
import { useQueryClient } from '@tanstack/react-query';
import deepMerge from 'deepmerge';
import { useEffect, FC, ComponentPropsWithoutRef, ReactNode } from 'react';
import isDeepEqual from 'react-fast-compare';

import { cancelListenLoginExpired, listenLoginExpired } from '@/global-events';
import { useUserConfig } from '@pc/hooks/use-user-config';
import { useUserInfo } from '@pc/hooks/use-user-info';
import { MinimalStoreType } from '@pc/model/minimal-store';
import { getUserInfo, getUserConfig, sendLoginStatus } from '@pc-native/helpers/msg';
import { onUpdateUserConfig, onUpdateUserInfo } from '@pc-native/helpers/register';

export interface IWithNativeOptions {
  disabledLoginExpired?: boolean;
}

export function withNative(Component: FC<any>, options: IWithNativeOptions = {}) {
  const defaultOptions: IWithNativeOptions = {
    disabledLoginExpired: false,
  };

  const mergeOptions = deepMerge(defaultOptions, options);

  return function NativeApp(props: ComponentPropsWithoutRef<typeof Component>) {
    const {
      setUserConfig,
    } = useUserConfig();

    const {
      setUserInfo,
    } = useUserInfo();

    const queryClient = useQueryClient();

    useEffect(() => {
      getUserConfig()
        .then(setUserConfig)
        .catch((err) => console.log(`获取用户配置失败: ${err}`));

      const disposeUserConfigListener = onUpdateUserConfig(setUserConfig);

      getUserInfo()
        .then(setUserInfo)
        .catch((err) => console.log('err:', err));

      const disposeUserInfoListener = onUpdateUserInfo((res) => {
        console.log('收到用户信息更新: ', res);

        const store = (window as any).__mobile_store__ as MinimalStoreType;
        const { userInfo } = store.getState().app;
        // 用户信息变化，重置react query缓存
        if (!isDeepEqual(userInfo, res)) {
          console.log('用户信息有变化: ', res);
          setUserInfo(res);
          console.log('重置react query缓存');
          queryClient.clear();
        }
      });

      return () => {
        disposeUserConfigListener();
        disposeUserInfoListener();
      };
    }, []);

    useEffect(() => {
      if (mergeOptions.disabledLoginExpired) return () => {};

      const onLoginExpired = (serverResponse) => {
        console.warn('原生app登录过期, 调用退出登录交互');
        sendLoginStatus({
          code: serverResponse?.code || 76,
          message: serverResponse?.message || '登录过期',
        });
      };

      listenLoginExpired(onLoginExpired);

      return () => {
        cancelListenLoginExpired(onLoginExpired);
      };
    }, [mergeOptions.disabledLoginExpired]);

    return <Component {...props} />;
  };
}

export default function wrapNative(App: ReactNode, options?: IWithNativeOptions): React.ReactNode {
  const WrappedComponent = withNative(() => App, options);
  return <WrappedComponent />;
}
