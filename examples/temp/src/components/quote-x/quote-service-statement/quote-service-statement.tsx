import { OpenPageParams } from '@dz-web/bridge/actions/mobile';
import { BIG_MARKET } from '@dz-web/quote-client';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useIntl } from 'react-intl';

import { fetchDictList, ITypes } from '@/api/quotation/query';
import { CacheKey, CacheStore } from '@/constants/cache';
import { marketType as marketTypeMap } from '@/constants/quotation';
import { openPage } from '@/helpers/native/url';
import { isEntryPage } from '@/helpers/url';
import IconMore from '@/images/icon_more.svg?url';
import { useQuotePermissionsStore } from '@/model/quote-permissions';

import { PAGE_TYPE_KEY } from './constants';
import IconNotice from './images/icon-inform.svg?url';

const quotePermissionBackendMarketReverse: Record<BIG_MARKET, string> = {
  [BIG_MARKET.HK]: '1',
  [BIG_MARKET.US]: '3',
  [BIG_MARKET.CN]: '2',
};

const findPageTip = (
  pageTips: Array<[string, string]>,
  pagekey: string,
  marketType: BIG_MARKET | string,
  level: string | null,
): string | null => {
  const searchKey = `${pagekey}_${marketType}_${level}`;
  const pageTipsMap = new Map(pageTips);
  const message = pageTipsMap.get(searchKey) || null;
  return message || null;
};

const replaceMessageVariables = (message: string, variables: Record<string, string>): string => {
  let result = message;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
  });
  return result;
};

type QuoteServiceStatementBaseProps = {
  visible?: boolean;
  className?: string;
  active?: boolean;
};

type QuoteServiceStatementConditionProps =
  | {
      pagekey: PAGE_TYPE_KEY.PRODUCT_DETAIL;
      bigMarket: BIG_MARKET;
    }
  | {
      pagekey?: Exclude<PAGE_TYPE_KEY | string, PAGE_TYPE_KEY.PRODUCT_DETAIL>;
      bigMarket?: BIG_MARKET;
    };

const cacheQuotePermissionDict = CacheStore.getItem(CacheKey.globalQuotePermissionDict, null);
function QuoteServiceStatement({
  pagekey = PAGE_TYPE_KEY.SELF_ALL,
  bigMarket,
  visible = true,
  className = '',
  active = true,
}: QuoteServiceStatementConditionProps & QuoteServiceStatementBaseProps) {
  const { formatMessage } = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const bigMarketPermissions = useQuotePermissionsStore((state) => state.bigMarketPermissions);

  const { data: pageTips = [] } = useQuery({
    queryKey: [ITypes.page_tips],
    queryFn: () => {
      if (!isEntryPage() && cacheQuotePermissionDict) {
        return Promise.resolve(cacheQuotePermissionDict);
      }

      return fetchDictList({ types: [ITypes.page_tips as any] }).then((res) => {
        CacheStore.setItem(CacheKey.globalQuotePermissionDict, res.result[ITypes.page_tips]);
        return res.result[ITypes.page_tips];
      });
    },
    gcTime: 10000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,
    networkMode: 'always',
  });

  const debouncedOpenPage = useCallback(
    debounce((url: string, params: Partial<Omit<OpenPageParams, 'path'>> = {}) => {
      openPage(url, params);
    }, 500),
    [],
  );

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const actionElement = target.closest('[data-action]') as HTMLElement;

    if (actionElement) {
      const action = actionElement.getAttribute('data-action');
      if (action === 'level-up') {
        event.stopPropagation();
        // 美股 需要跳转 美股行情套餐
        const param = bigMarket === BIG_MARKET.US ? `?active=${marketTypeMap.US}` : '';
        debouncedOpenPage(`/quotes-packages.html${param}`, { fullScreen: true });
      } else if (action === 'disclaimers') {
        event.stopPropagation();
        debouncedOpenPage('/quote-disclaimer.html');
      }
    }
  };

  useEffect(() => {
    if (pageTips.length === 0) {
      setMessage('');
      return;
    }

    const getMessageData = (parsedData: Array<[string, string]>) => {
      if (bigMarket) {
        // 有指定市场，使用指定市场和当前报价等级
        const market = quotePermissionBackendMarketReverse[bigMarket];
        return findPageTip(parsedData, pagekey, market, bigMarketPermissions[bigMarket]?.level) ?? '';
      }
      // 没有指定市场，使用港股和美股的权限等级
      const hkLevel = bigMarketPermissions[BIG_MARKET.HK]?.level;
      const usLevel = bigMarketPermissions[BIG_MARKET.US]?.level;

      return findPageTip(parsedData, pagekey, hkLevel, usLevel) ?? '';
    };

    const messageData = getMessageData(pageTips);

    if (messageData) {
      const variables = {
        disclaimers:
          `<span style="color: #BB874A; cursor: pointer;" data-action="disclaimers">` +
          `${formatMessage({ id: 'global.disclaimers' })}` +
          `</span>`,
        level_up:
          `<div class="flex flex-shrink-0 items-center text-[24px] text-[#BB874A] cursor-pointer" ` +
          `data-action="level-up">` +
          `${formatMessage({ id: 'global.levelUp' })}` +
          `<img src="${IconMore}" alt="icon-more" class="ml-[5px] h-[18px] w-[11px]" />` +
          `</div>`,
      };
      const processedMessage = replaceMessageVariables(messageData, variables);
      setMessage(processedMessage);
    } else {
      setMessage('');
    }
  }, [pagekey, bigMarket, bigMarketPermissions, formatMessage, pageTips]);

  if (!visible || !message) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleContainerClick(event);
  };

  return (
    <div
      className={`flex h-[62px] cursor-pointer items-center bg-[#F7F8FA] p-[10px] text-[#86909C] ${className}`}
      ref={containerRef}
      onClick={handleClick}
    >
      <div className="mr-[10px] flex flex-shrink-0 items-center justify-center opacity-80">
        <img src={IconNotice} alt="icon-notice" className="w-[30px]" />
      </div>
      <Marquee play={active} speed={30} gradient={false} delay={2}>
        <div
          className="flex min-w-fit whitespace-nowrap pr-[50px] text-[24px]"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </Marquee>
    </div>
  );
}

export default QuoteServiceStatement;
