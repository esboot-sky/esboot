import { clsx, cn } from '@dz-web/esboot-browser';
import { ensure } from '@dz-web/o-orange';
import { useQuery } from '@tanstack/react-query';
import { HTMLAttributes, memo, ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { requestIpoSubscribe, requestIpoTab } from '@/api/ipo/ipo/ipo';
import NavBlock, { NavBlockProps } from '@/components/nav-block/nav-block';
import { IPOHomeTabKey } from '@/constants/ipo';
import { QueryKeyIPOStatistics, QueryKeyIPOStocksList } from '@/constants/query-keys';
import { openIPOHome } from '@/helpers/native/url';
import { useAppStore } from '@/model/app';
import { useTradePreCheckStore } from '@/model/trade-pre-check';

interface IPOStatisticItemProps {
  title: ReactNode;
  value: number | undefined;
  onClick?: () => void;
}

const IPOStatisticItem = memo(({ title, value, onClick }: IPOStatisticItemProps) => {
  return (
    <div className="flex flex-col items-center text-[var(--main-text-color)]" onClick={onClick}>
      <div className="text-[34px] font-[600] leading-[48px]">{ensure(value)}</div>
      <div className="text-[24px]">{title}</div>
    </div>
  );
});

interface IIPOStockItem {
  ipoCode: string;
  stockName: string;
}

interface IPOStockListProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  isLoading?: boolean;
  data?: IIPOStockItem[];
}

const IPOStockList = memo(({ className, isLoading, data = [], ...restProps }: IPOStockListProps) => {
  const commonCls = `text-[24px] bg-[var(--quote-tips-background-color)] px-[20px] py-[12px] mt-[16px] rounded-[8px]`;

  function renderContent() {
    if (isLoading)
      return (
        <div className={commonCls}>
          <FormattedMessage id="home.loading" />
        </div>
      );

    if (!data.length) {
      return (
        <div className={clsx('', commonCls)}>
          <FormattedMessage id="home.ipo_empty_tips" />
        </div>
      );
    }

    return (
      <div className={cn(commonCls)} onClick={() => openIPOHome(IPOHomeTabKey.subscription)}>
        <span className="pr-[10px] text-[var(--secondary-text-color)]">
          <FormattedMessage id="home.ipo_applying" />
        </span>
        {data.map((item) => (
          <span className="pr-[10px]" key={item.ipoCode}>{`${item.stockName}(${item.ipoCode})`}</span>
        ))}
      </div>
    );
  }

  return (
    <div className={className} {...restProps}>
      {renderContent()}
    </div>
  );
});

export type IPOEntryProps = Omit<NavBlockProps, 'title'> & {
  active?: boolean;
};

function IPOEntry({ active, ...restProps }: IPOEntryProps) {
  const { locale } = useIntl();
  const { data } = useQuery({
    enabled: active,
    queryKey: QueryKeyIPOStatistics,
    queryFn: async () => {
      const res = await requestIpoTab({ type: '5', language: locale });

      // val subscribe: Int? = null,         // subscribe	认购
      // val await: Int? = null,             // await	暗盘
      // val ballot: Int? = null,            // ballot	公布中签
      // val market: Int? = null             // market	上市
      const { await: awaitCount, ballot, market } = res.result;

      return {
        await: awaitCount,
        ballot,
        market,
      };
    },
  });

  const isLogin = useAppStore((state) => state.isLogin);
  const isOpenTrade = useTradePreCheckStore((state) => state.isOpenTrade);
  const canUseTradeAPI = isLogin && isOpenTrade;

  const { data: ipoStocksList, isLoading: isLoadingIpoStocksList } = useQuery({
    enabled: canUseTradeAPI && active,
    queryKey: QueryKeyIPOStocksList,
    queryFn: async (): Promise<IIPOStockItem[]> => {
      const res = await requestIpoSubscribe();

      return res.result.map((item: any) => {
        return {
          ipoCode: item.ipoCode,
          stockName: item.stockName,
        };
      });
    },
  });

  return (
    <NavBlock title={<FormattedMessage id="home.ipo_center" />} onMoreClick={() => openIPOHome()} {...restProps}>
      <div className="rounded-[16px] bg-[var(--main-content-background)] p-[24px]">
        <div className="flex justify-between px-[55px]">
          <IPOStatisticItem
            title={<FormattedMessage id="home.ipo_subscribe" />}
            value={ipoStocksList?.length}
            onClick={() => openIPOHome(IPOHomeTabKey.subscription)}
          />
          <IPOStatisticItem
            title={<FormattedMessage id="home.ipo_await" />}
            value={data?.await}
            onClick={() => openIPOHome(IPOHomeTabKey.waitListed)}
          />
          <IPOStatisticItem
            title={<FormattedMessage id="home.ipo_market" />}
            value={data?.market}
            onClick={() => openIPOHome(IPOHomeTabKey.alreadyListed)}
          />
        </div>
        <IPOStockList isLoading={isLoadingIpoStocksList} data={ipoStocksList} />
      </div>
    </NavBlock>
  );
}
export default memo(IPOEntry);
