/**
 * @deprecated 眼中钉文件，很想删掉，先留着
 */

// /**
//  * 解析url参数
//  */
// export function getUrlParam(): Record<string, any> | null {
//   const url = window.location.href;
//   if (url.lastIndexOf('?') === -1) return null;
//   const search = url.slice(url.lastIndexOf('?') + 1);

//   if (!search) return null;

//   const data = search.split('&');
//   const params = {};

//   data.forEach((item) => {
//     const objMap = item.split('=');
//     const name = objMap[0];
//     const value = objMap[1];
//     params[name] = value;
//   });

//   return params;
// }

// export function toUrlParams(obj: Record<string, string>): string {
//   const newParam = { ...obj };
//   const paramsStr = Object.keys(newParam).reduce((pre, val) => `${pre + val}=${newParam[val] ?? ''}&`, '?');

//   return paramsStr.slice(0, paramsStr.length - 1);
// }

// /**
//  * 修改url参数指定key
//  *
//  * @param rest 覆盖参数
//  * @param url 重定向地址
//  */
// export const editUrlParams = (rest: Record<string, string>, url = ''): string => {
//   if (!url) {
//     const { href } = window.location;
//     url = href.lastIndexOf('?') > -1 ? href.slice(0, href.lastIndexOf('?')) : window.location.href;
//   }

//   const params = getUrlParam() || {};

//   try {
//     const newParam = { ...params, ...rest };
//     const paramsStr = toUrlParams(newParam);

//     return url + paramsStr;
//   } catch (e) {
//     throw new Error(`- editUrlParams function - use error,maybe not params, wrong information is as follows: ${e}`);
//   }
// };

/**
 * 搬过来先运行，后续考虑删除
 */
export function calculateStrLen(str: string) {
  const hanzi = str.match(/[\u4e00-\u9fa5]/g)?.join('');
  const num = str.replace(/[^0-9]/gi, '');
  const character = str.replace(/[^a-z]+/gi, '');
  return (hanzi?.length || 0) * 2 + num.length + character.length;
}
