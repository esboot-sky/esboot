import { cn } from '@dz-web/esboot-browser';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { requestOpenList, IOpenList } from '@/api/quotation/query';
import Empty from '@/components/empty/empty';

import './index.scss';

const right = 'text-[#111214] text-[28px] font-400';
const left = 'text-[#86909C] text-[24px] font-400 ';
const title = 'flex justify-between items-center py-[10px]';

const { memo, useMemo, useEffect, useState } = React;

const Header: React.FC<{ refresh: boolean }> = ({ refresh }) => {
  const { formatMessage } = useIntl();
  const [openList, setOpenList] = useState<IOpenList[]>([]);
  useEffect(() => {
    const getRequest = async () => {
      const openData = await requestOpenList();
      if (openData?.code === 0) {
        setOpenList(openData.result);
      }
    };
    getRequest();
  }, [refresh]);

  return (
    <div className={cn('flex flex-col p-[20px]')}>
      {openList.length ? (
        <>
          <h3 className={cn('font-400 mb-[10px] text-[26px] text-[#86909C]')}>{formatMessage({ id: 'opened' })}</h3>
          <div
            className={cn(
              'max-h-[170px] rounded-[16px] bg-white p-[20px]',
              'overflow-y-auto',
              'custom-scrollbar',
              'box-border',
            )}
          >
            {openList.map((item) => (
              <div className={cn(title)}>
                <div className={cn(right)}>{item.name}</div>
                <div className={cn(left)}>{item.autoRenew ? formatMessage({ id: 'auto_renew' }) : item.enableDate}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={cn('flex flex-1 items-center justify-center rounded-[16px] bg-white pb-[40px]')}>
          <Empty text={formatMessage({ id: 'no_opened_present' })} />
        </div>
      )}
    </div>
  );
};

export default memo(Header);
