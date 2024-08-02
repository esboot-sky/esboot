import { SupportedThemes } from '@mobile/constants/config';
import { isValidRaiseMode } from '@mobile/utils/capacities';

export const updateRootClass = (() => {
  let prevTheme = '';
  let prevRaise = '';
  const themePrefix = 'dz-theme-';

  return (theme: string, raise: string) => {
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

      if (nextTheme === 'dark') {
        document.documentElement.setAttribute('data-prefers-color-scheme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-prefers-color-scheme');
      }
    }
  };
})();
