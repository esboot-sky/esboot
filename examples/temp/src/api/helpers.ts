import { IJavaAPICommonResponse } from './types';

export const parseResult = <T>(res: IJavaAPICommonResponse<T>): Promise<T> => {
  return Promise.resolve(res)
    .then((resData) => {
      const { code, message, result } = resData;

      if (code !== 0) {
        throw new Error(message);
      }

      return result;
    })
    .catch((err) => {
      console.error('Query API Error', err);

      return res.result;
    });
};
