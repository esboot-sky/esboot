import { toUnit } from '@dz-web/o-orange';

import { useAppStore } from '@/model/app';

const useToUnit = (): typeof toUnit => {
  const language = useAppStore((state) => state.language);

  return (num, options) => toUnit(num, { lanType: language ?? 'zh-CN', ...options });
};

export default useToUnit;
