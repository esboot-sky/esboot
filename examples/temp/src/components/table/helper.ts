const itemStyleName = (iFixed: boolean) => {
  if (iFixed) return 'title-hidden';
  return '';
};

/**
 * 获取属性
 */
const itemStyle = (a, tFixed: boolean, height: string) => {
  let iWidth: any = {
    width: a.width,
    padding: '0 .12rem',
  };

  if (tFixed && a.fixed) {
    iWidth = {
      width: a.width,
      padding: '0 .12rem',
    };
  }

  return {
    textAlign: a.align || 'left',
    ...iWidth,
    height,
  };
};

export { itemStyleName, itemStyle };
