import type { LANG_CONFIG } from '@/constants/login';

import { useEffect, useState } from 'react';
import { DEFAULT_LANG, DEFAULT_LANG_LIST } from '@/constants/login';
import { useLoginStore } from '@/model';

import { fetchDictLang } from '../../api/login';
import { langBtn } from '../variant';

function LanguageBtns() {
  const setLang = useLoginStore(state => state.setLang);
  const lang = useLoginStore(state => state.lang);

  const [langList, setLangList] = useState<LANG_CONFIG[]>(DEFAULT_LANG_LIST);

  useEffect(() => {
    let isMounted = true;
    fetchDictLang({ types: ['lang'] })
      .then((res) => {
        if (!isMounted) return;
        const result = res?.result?.lang;
        if (!Array.isArray(result)) return;

        const list = result.map((item: string[]) => ({
          label: item[1],
          value: item[0],
        }));

        if (list.length > 0) {
          setLangList(list);
          const currentLang = useLoginStore.getState().lang;
          const _currentLang = list.find(item => item.value === currentLang);

          if (!_currentLang) {
            setLang(list[0]?.value || DEFAULT_LANG.value);
          }
        }
      })
      .catch((err) => {
        console.log('[LanguageBtns] fetchDictLang error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [setLang]);


  return (
    <div className="flex rounded-[4px] bg-[#f5f5f5] p-[2px]">
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
