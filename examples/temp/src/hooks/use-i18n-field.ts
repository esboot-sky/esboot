import { useMemo } from 'react';

import { lanEnum } from '@/constants/config';
import { useAppStore } from '@/model/app';

export default function useI18nField(fields: [string, string, string?]) {
  const language = useAppStore((state) => state.language);

  const getField = useMemo(() => {
    switch (language) {
      case lanEnum.ZH_CN:
        return fields[0];
      case lanEnum.ZH_TW:
        return fields[1];
      case lanEnum.EN_US:
        return fields[2] || fields[0];
      default:
        return fields[0];
    }
  }, [language, fields]);

  return getField;
}

export function useI18nStockName(): any {
  return useI18nField(['short_name', 'tr_name']);
}

export function useI18nSearchStockName(): any {
  return useI18nField(['sc_name', 'tc_name', 'en_name']);
}

export function useI18nFactorStockName(): any {
  return useI18nField(['简体名称', '繁体名称']);
}

export function useI18nFactorStockShortName(): any {
  return useI18nField(['短简体名称', '繁体名称']);
}

export function useI18nChoiceStockName(): 'tr_name' | 'name' {
  return useI18nField(['name', 'tr_name']) as 'tr_name' | 'name';
}
