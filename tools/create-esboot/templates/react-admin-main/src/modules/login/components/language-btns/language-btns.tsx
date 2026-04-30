import { useEffect, useState } from 'react';

import { DEFAULT_LANG, DEFAULT_LANG_LIST, LANG_CONFIG } from '@/constants/login';
import { useLoginStore } from '@/model';

import { fetchDictLang } from '../../api/login';
import { langBtn } from '../variant';

const LanguageBtns = () => {
  const setLang = useLoginStore((state) => state.setLang);
  const lang = useLoginStore((state) => state.lang);

  const [langList, setLangList] = useState<LANG_CONFIG[]>(DEFAULT_LANG_LIST);

  useEffect(() => {
    fetchDictLang({ types: ['lang'] })
      .then((res) => {
        const result = res.result.lang;
        const list = result.map((item: string[]) => {
          return {
            label: item[1],
            value: item[0],
          };
        });

        setLangList(list);

        const _currentLang = list.find((item) => item.value === lang);

        if (!_currentLang) {
          setLang(list[0]?.value || DEFAULT_LANG.value);
        }
        // setLang(_currentLang.value);
      })
      .catch((err) => {
        console.log(err, '---> err');
      });
  }, []);

  return (
    <div className="flex rounded-[4px] bg-[#f5f5f5] p-[2px]">
      {langList.map((item) => (
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
};

export default LanguageBtns;
