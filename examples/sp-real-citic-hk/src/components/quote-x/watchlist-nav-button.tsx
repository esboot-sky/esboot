import { clsx } from '@dz-web/esboot-browser';
import { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { WatchlistGroupEnum } from '@/constants/watchlist';
import { openManageWatchlistStockPage, openSearchPage } from '@/helpers/native/url';
import useWatchlist, { useWatchlistAllGroup } from '@/hooks/quote/use-watchlist';
import IconAdd from '@/images/quote/icon-add-to-watchlist.svg';
import IconEdit from '@/images/quote/icon-edit-stocks-in-watchlist.svg';

export interface IWatchlistNavButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon?: React.ReactNode;
}

export function WatchlistNavButton(props: IWatchlistNavButtonProps) {
  const { className, icon, children, ...rest } = props;

  return (
    <div
      className={clsx(
        `inline-flex h-[70px] min-w-[220px] items-center justify-center rounded-[35px] bg-[#e8e8e8] font-bold
        text-[var(--main-text-color)]`,
        className,
      )}
      {...rest}
    >
      {icon}
      <span
        className={clsx({
          'ml-[9px]': !!icon,
        })}
      >
        {children}
      </span>
    </div>
  );
}

interface ICommonWatchlistNavButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  generatedGroupId?: string;
}

export function CommonWatchlistNavButtonGroup({
  className,
  generatedGroupId,
  ...rest
}: ICommonWatchlistNavButtonGroupProps) {
  const { watchListGroups } = useWatchlist();
  const currentGroup = useMemo(() => {
    return watchListGroups.find((group) => group._genId === generatedGroupId);
  }, [watchListGroups, generatedGroupId]);

  const allGroup = useWatchlistAllGroup();

  return (
    <div className={clsx('flex justify-center', className)} {...rest}>
      <WatchlistNavButton
        icon={<IconAdd className="h-[30px] w-[30px]" />}
        className="mr-[30px] w-[220px]"
        onClick={() => {
          openSearchPage();
        }}
      >
        <FormattedMessage id="watchlist.add_watchlist" />
      </WatchlistNavButton>
      <WatchlistNavButton
        icon={<IconEdit className="h-[30px] w-[30px]" />}
        className="ml-[30px] w-[220px]"
        onClick={() => {
          if (generatedGroupId) {
            if (
              currentGroup?.type === WatchlistGroupEnum.HKGroup ||
              currentGroup?.type === WatchlistGroupEnum.USGroup
            ) {
              openManageWatchlistStockPage(allGroup?._genId);
              return;
            }

            openManageWatchlistStockPage(generatedGroupId);
          }
        }}
      >
        <FormattedMessage id="watchlist.edit_watchlist" />
      </WatchlistNavButton>
    </div>
  );
}

export default memo(WatchlistNavButton);
