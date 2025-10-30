import { useMemo, useCallback, useState } from 'react';

interface UseRem2pxProps {
  rootValue?: number;
}

interface UseRem2pxReturn {
  rem2px: (size: number, withUnit?: boolean) => string | number;
  px2rem: (size: number, withUnit?: boolean) => string | number;
  ratio: number;
}

export const useRem2px = (props: UseRem2pxProps = {}): UseRem2pxReturn => {
  const { rootValue = 100 } = props;

  const [rootFontSize] = useState(() => document.documentElement.style.fontSize.replace('px', ''));
  const ratio = useMemo(() => +rootFontSize / rootValue, [rootFontSize, rootValue]);

  if (ratio <= 0) {
    // debug only
    document.body.setAttribute('data-rem2px-ratio-le-0', `${ratio}`);
  }

  const rem2px = useCallback<UseRem2pxReturn['rem2px']>(
    (size, withUnit = true) => {
      const result = size * ratio;
      return withUnit ? `${result}px` : result;
    },
    [ratio],
  );

  const px2rem = useCallback<UseRem2pxReturn['px2rem']>(
    (size, withUnit = true) => {
      const result = size / ratio;
      return withUnit ? `${result}rem` : result;
    },
    [ratio],
  );

  return { rem2px, px2rem, ratio };
};
