import type { ThemeValues } from '@mobile/constants/config';
import type { IStandardAppUserConfig } from '@mobile/model/app/slice';
import { selectUserConfig, setTheme, setUserConfig } from '@mobile/model/app/slice';
import { useMinimalAppDispatch, useMinimalAppSelector } from '@mobile/model/minimal-store';

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
