import { useEffect, useState } from 'react';

function getScale() {
  return window.innerWidth / 375;
}

/**
 * 获取 rem 缩放比例
 */
export function useRemScaleFactor() {
  const [scale, setScale] = useState(() => getScale());

  useEffect(() => {
    function onResize() {
      setScale(getScale());
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return scale;
}

/**
 * 根据 rem 缩放比例转换数值
 */
export function useRemScaleValue(value: number) {
  const scale = useRemScaleFactor();
  return value * scale;
}
