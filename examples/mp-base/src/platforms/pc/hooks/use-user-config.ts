import { ThemeValues } from '@pc/constants/config';
import { IStandardAppUserConfig, selectUserConfig, setTheme, setUserConfig } from '@pc/model/app/slice';
import { useMinimalAppDispatch, useMinimalAppSelector } from '@pc/model/minimal-store';

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
