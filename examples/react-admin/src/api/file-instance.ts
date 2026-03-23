import { message } from 'antd';
import axios from 'axios';

import StaticConfig from '@/helpers/static-config';
import { useAppStore } from '@/model/app';

const baseURL = StaticConfig.getCommonServer();

type UrlParamValue = string | number | boolean | null | undefined;
type UrlParamObject = Record<string, UrlParamValue>;
type UrlParams = Record<string, UrlParamValue | UrlParamObject[]>;

export function fileDownload(file: BlobPart, fileName: string): void {
  const blob = new Blob([file]);
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

const transformUrlParams = (obj: UrlParams) => {
  const queryString = Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        return (obj[key] as UrlParamObject[])
          .map((item, index) =>
            Object.keys(item)
              .map((subKey) => `${key}[${index}].${subKey}=${encodeURIComponent(String(item[subKey] ?? ''))}`)
              .join('&'),
          )
          .join('&');
      }
      return `${key}=${encodeURIComponent(String(obj[key] ?? ''))}`;
    })
    .join('&');

  return queryString;
};

export function getPostExportFile(params: UrlParams, path: string, fileName = '表格数据.xls') {
  const { token, lang } = useAppStore.getState();
  const url = `${baseURL + path}?${transformUrlParams(params)}`;

  return new Promise((resolve) => {
    axios(url, {
      headers: {
        method: 'GET',
        token,
        'Accept-Language': lang,
      },
      responseType: 'blob',
    })
      .then((res: Record<string, any>) => {
        if (res.data.code) {
          message.error(res.data.message);
          return;
        }
        fileDownload(res.data, fileName);
      })
      .catch(() => {
        message.error('导出失败');
      })
      .finally(() => {
        resolve('');
      });
  });
}
