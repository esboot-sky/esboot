import { themeList } from '@/hooks/use-init-native';

export default function getThemeName(): string {
  const theme = document.documentElement.className;

  const themeIndex = Object.values(themeList).findIndex((v) => theme.indexOf(v) > -1);

  return `?theme=${Object.keys(themeList)[themeIndex]}`;
}
