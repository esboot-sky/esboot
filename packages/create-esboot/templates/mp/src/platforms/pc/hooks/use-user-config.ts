import { useMinimalAppDispatch, useMinimalAppSelector } from '@pc/model/minimal-store';
import {
  IStandardAppUserConfig,
  disableFollowSystemPrefersColorSchemeWhenInBrowser,
  selectUserConfig,
  setTheme,
  setUserConfig,
} from '@pc/model/app/slice';
import { ThemeValues } from '@pc/constants/config';
import { isBrowser } from '@/utils/platforms';

export function useUserConfig() {
  const userConfig = useMinimalAppSelector(selectUserConfig);
  const dispatch = useMinimalAppDispatch();

  return {
    userConfig,
    setUserConfig(newValue: IStandardAppUserConfig) {
      dispatch(setUserConfig(newValue));
    },
    setTheme(theme: ThemeValues) {
      dispatch(setTheme(theme));
    },
  };
}

/**
 * 如果您的页面需要禁用跟随系统主题模式，但页面没有设置界面。可以在页面顶层组件使用此hook
 */
export function useDisableFollowSystemPrefersColorSchemeWhenInBrowser() {
  const dispatch = useMinimalAppDispatch();

  if (!isBrowser()) return;
  dispatch(disableFollowSystemPrefersColorSchemeWhenInBrowser());
}
