import type { OriginalUserInfo } from '@mobile/helpers/customize';
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import type { ServerErrorResponse } from '@/global-events';
import { getUserConfig, getUserInfo, sendLoginStatus } from '@mobile-native/helpers/msg';
import { onUpdateUserConfig, onUpdateUserInfo } from '@mobile-native/helpers/register';
import { setUserConfig, setUserInfo, useAppStore } from '@mobile/model/mobile';
import { useQueryClient } from '@tanstack/react-query';
import deepMerge from 'deepmerge';
import { useEffect } from 'react';
import isDeepEqual from 'react-fast-compare';
import { cancelListenLoginExpired, listenLoginExpired } from '@/global-events';

export interface IWithNativeOptions {
  disabledLoginExpired?: boolean;
}

export function withNative(Component: FC<any>, options: IWithNativeOptions = {}) {
  const defaultOptions: IWithNativeOptions = {
    disabledLoginExpired: false,
  };

  const mergeOptions = deepMerge(defaultOptions, options);

  return function NativeApp(props: ComponentPropsWithoutRef<typeof Component>) {
    const queryClient = useQueryClient();

    useEffect(() => {
      getUserConfig()
        .then((setUserConfig))
        .catch(err => console.log(`获取用户配置失败: ${err}`));

      const disposeUserConfigListener = onUpdateUserConfig(setUserConfig);

      getUserInfo()
        .then(setUserInfo)
        .catch(err => console.log('err:', err));

      const disposeUserInfoListener = onUpdateUserInfo((res: OriginalUserInfo) => {
        console.log('收到用户信息更新: ', res);

        const { userInfo } = useAppStore.getState();
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
      if (mergeOptions.disabledLoginExpired)
        return () => {};

      const onLoginExpired = (serverResponse: ServerErrorResponse) => {
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
