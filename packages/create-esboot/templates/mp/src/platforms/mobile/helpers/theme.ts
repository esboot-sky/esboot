import { SupportedThemes } from '@mobile/constants/config';
import { isValidRaiseMode } from '@/utils/capacities';

export const updateRootClass = (() => {
  let prevTheme = '';
  let prevRaise = '';
  const themePrefix = 'dz-theme-';

  return (theme: string, raise: string, lang = '') => {
    console.log(lang);
    const { classList } = document.documentElement;

    if (isValidRaiseMode(raise) && raise !== prevRaise) {
      if (prevRaise) {
        classList.remove(`${prevRaise}`);
      }
      classList.add(`${raise}`);
      prevRaise = raise;
    }

    const nextTheme = SupportedThemes[theme];
    if (nextTheme && nextTheme !== prevTheme) {
      if (prevTheme) {
        classList.remove(`${themePrefix}${prevTheme}`);
      }
      classList.add(`${themePrefix}${theme}`);

      prevTheme = theme;
    }
  };
})();
