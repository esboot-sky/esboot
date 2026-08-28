export const isQiankun = typeof window !== 'undefined' && Boolean(window.__POWERED_BY_QIANKUN__);

export function isQiankunEnv(): boolean {
  return typeof window !== 'undefined' && Boolean(window.__POWERED_BY_QIANKUN__);
}

const BASENAME_REGEX = /^(\/[^/]+)/;
export function getRouterBasename(propsRouterBase?: string, fallbackBase = '/'): string {
  if (propsRouterBase) return propsRouterBase;

  if (isQiankunEnv()) {
    const pathMatch = window.location.pathname.match(BASENAME_REGEX);
    return pathMatch ? pathMatch[1] : fallbackBase;
  }

  return fallbackBase;
}
