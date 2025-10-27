/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const showContent = (val: string | number) => {
  if (!val) {
    return '--';
  }
  return val;
};

export function distinguishImg(theme: string, ImgArr: string[]) :string {
  if (theme === 'black') return ImgArr[0];
  if (theme === 'white') return ImgArr[1];
  return '';
}
