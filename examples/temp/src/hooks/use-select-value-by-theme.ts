import { SupportedThemes, ThemeValues } from '@/constants/config';
import { useAppStore } from '@/model/app';

function selectValueByThemes(values: Record<ThemeValues, any>, currentTheme: ThemeValues) {
  const v = values[currentTheme];

  return v || values[SupportedThemes.light];
}

/**
 * @param values - [亮皮肤返回值, 暗皮肤返回值]
 */
export function useSelectValueByTheme(...values: any[]) {
  const theme = useAppStore((state) => state.theme);

  return selectValueByThemes(
    {
      [SupportedThemes.light]: values[0],
      [SupportedThemes.dark]: values[1] ?? values[0],
    },
    theme,
  );
}
