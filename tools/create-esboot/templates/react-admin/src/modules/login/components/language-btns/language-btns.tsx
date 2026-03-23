import type { LANG_CONFIG } from '@/constants/login';

import { useEffect, useState } from 'react';
import { DEFAULT_LANG, DEFAULT_LANG_LIST } from '@/constants/login';
import { useAppStore } from '@/model/app';

import { queryDictLang } from '../../api/login';
import { langBtn } from '../variant';

function LanguageBtns() {
  const setLang = useAppStore(state => state.setLang);
  const lang = useAppStore(state => state.lang);

  const [langList, setLangList] = useState<LANG_CONFIG[]>(DEFAULT_LANG_LIST);

  useEffect(() => {
    queryDictLang({ types: ['lang'] })
      .then((res) => {
        const result = res.result.lang;
        const list = result.map((item: string[]) => {
          return {
            label: item[1],
            value: item[0],
          };
        });

        setLangList(list);

        const _currentLang = list.find((item: LANG_CONFIG) => item.value === lang);

        if (!_currentLang) {
          setLang(list[0]?.value || DEFAULT_LANG.value);
        }
      })
      .catch(() => {});
  }, [lang, setLang]);

  return (
    <div className="flex rounded-[4px] bg-[var(--color-bg-soft)] p-[2px]">
      {langList.map(item => (
        <span
          key={item.value}
          className={langBtn({ isChosen: item.value === lang })}
          onClick={() => {
            setLang(item.value);
          }}
        >
          {item.label.slice(0, 1)}
        </span>
      ))}
    </div>
  );
}

export default LanguageBtns;
