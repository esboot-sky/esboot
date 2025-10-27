import { cn } from '@dz-web/esboot-browser';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import IconNoData from '@/images/common/no-data.svg';
import IconNoNetwork from '@/images/common/no-network.svg';
import IconNotFound from '@/images/common/not-found.svg';
import { genericMemo } from '@/utils/react-utils';

export enum EmptyType {
  no_data, // 无数据
  no_network, // 无网络
  not_found, // 找不到页面
}

interface NoDataProps {
  text?: React.ReactNode;
  Icon?: typeof IconNoData;
  type?: EmptyType;
  isForPage?: boolean; // true是页面级的，icon会大一些
}

interface IEmptyIcon {
  IconComp: typeof IconNoData;
  _text: string;
}

const NoData = (props: NoDataProps) => {
  const { type = EmptyType.no_data, isForPage = false, text, Icon } = props;

  const { IconComp, _text } = useMemo<IEmptyIcon>(() => {
    const result: IEmptyIcon = {
      IconComp: IconNoData,
      _text: 'global.no_data',
    };

    switch (type) {
      case EmptyType.no_network:
        result.IconComp = IconNoNetwork;
        result._text = 'global.no_network';
        break;
      case EmptyType.not_found:
        result.IconComp = IconNotFound;
        result._text = 'global.not_found';
        break;
      default:
        break;
    }

    if (Icon) result.IconComp = Icon;
    if (text) result._text = text as string;

    return result;
  }, [type, text]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-[40px]">
        <IconComp className={cn({ 'h-[300px] w-[340px]': isForPage, 'h-[140px] w-[160px]': !isForPage })} />
      </div>
      <div className="text-secondary-color font-regular-24">
        <FormattedMessage id={_text} />
      </div>
    </div>
  );
};

export default genericMemo(NoData);
