import qs from 'query-string';

/**
 * @AI
 * URL 参数管理工具
 */

/**
 * 编辑 URL 参数的内部方法
 * @param type 参数类型 'search' | 'hash'
 * @param params 要更新的参数对象
 * @param options 配置选项
 */
interface EditUrlParamsOptions {
  replace?: boolean;
  removeEmpty?: boolean;
}
const editUrlParamsInternal = (
  type: 'search' | 'hash',
  params: Record<string, any>,
  options?: EditUrlParamsOptions,
): string => {
  const { replace = false, removeEmpty = true } = options || {};
  const url = new URL(window.location.href);
  const currentParams = type === 'search' ? qs.parse(url.search) : qs.parse(url.hash.split('?')[1]);
  const newParams = replace ? params : { ...currentParams, ...params };

  if (removeEmpty) {
    Object.keys(newParams).forEach((key) => {
      const value = newParams[key];
      if (value === undefined || value === null || value === '') {
        delete newParams[key];
      }
    });
  }

  return qs.stringify(newParams);
};

/**
 * 编辑 URL 的 search 参数
 * @param params 要更新的参数对象
 * @param options 配置选项
 * @param options.replace 是否替换整个参数对象，默认为 false（合并模式）
 * @param options.removeEmpty 是否移除空值参数，默认为 true
 */
export const editSearchParams = (params: Record<string, any>, options?: EditUrlParamsOptions): void => {
  editUrlParamsInternal('search', params, options);
};

/**
 * 编辑 URL 的 hash 参数
 * @param params 要更新的参数对象
 * @param options 配置选项
 * @param options.replace 是否替换整个参数对象，默认为 false（合并模式）
 * @param options.removeEmpty 是否移除空值参数，默认为 true
 */
export const editHashParams = (params: Record<string, any>, options?: EditUrlParamsOptions): string => {
  return editUrlParamsInternal('hash', params, options);
};

/**
 * 移除指定参数的内部方法
 * @param type 参数类型 'search' | 'hash'
 * @param paramKeys 要移除的参数键名数组
 */
const removeUrlParamsInternal = (type: 'search' | 'hash', paramKeys: string[]): void => {
  const url = new URL(window.location.href);
  const currentParams = type === 'search' ? qs.parse(url.search) : qs.parse(url.hash);

  paramKeys.forEach((key) => delete currentParams[key]);

  if (type === 'search') {
    url.search = qs.stringify(currentParams);
  } else {
    url.hash = qs.stringify(currentParams);
  }

  window.history.replaceState({}, '', decodeURIComponent(url.toString()));
};

/**
 * 移除指定的 search 参数
 * @param paramKeys 要移除的参数键名数组
 */
export const removeSearchParams = (paramKeys: string[]): void => {
  removeUrlParamsInternal('search', paramKeys);
};

/**
 * 移除指定的 hash 参数
 * @param paramKeys 要移除的参数键名数组
 */
export const removeHashParams = (paramKeys: string[]): void => {
  removeUrlParamsInternal('hash', paramKeys);
};

/**
 * 获取指定类型参数的内部方法
 * @param type 参数类型 'search' | 'hash'
 * @returns 参数对象
 */
const getUrlParamsInternal = (type: 'search' | 'hash'): Record<string, string> => {
  const url = new URL(window.location.href);
  return type === 'search'
    ? (qs.parse(url.search) as Record<string, string>)
    : (qs.parse(url.hash.split('?')[1]) as Record<string, string>);
};

/**
 * 获取 search 参数
 * @returns search 参数对象
 */
export const getSearchParams = (): Record<string, string> => {
  return getUrlParamsInternal('search');
};

/**
 * 获取 hash 参数
 * @returns hash 参数对象
 */
export const getHashParams = (): Record<string, string> => {
  return getUrlParamsInternal('hash');
};
