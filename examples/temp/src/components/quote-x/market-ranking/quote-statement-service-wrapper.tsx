import { BIG_MARKET } from '@dz-web/quote-client';
import { memo, ReactNode } from 'react';

import { PAGE_TYPE_KEY } from '../quote-service-statement/constants';
import QuoteServiceStatement from '../quote-service-statement/quote-service-statement';

interface QuoteStatementServiceWrapperProps {
  bigMarket: BIG_MARKET;
  children: ReactNode;
  visible?: boolean;
  active?: boolean;
  pageKey?: string;
  bottom?: boolean;
}

function QuoteStatementServiceWrapper({
  children,
  bigMarket,
  visible = false,
  active = true,
  pageKey = PAGE_TYPE_KEY.PRODUCT_DETAIL,
  bottom = false,
}: QuoteStatementServiceWrapperProps) {
  if (bottom) {
    return (
      <div className="flex h-full flex-col">
        <div className="min-h-0 flex-1">{children}</div>
        {visible && <QuoteServiceStatement pagekey={pageKey} bigMarket={bigMarket} active={active} />}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {visible && <QuoteServiceStatement pagekey={pageKey} bigMarket={bigMarket} active={active} />}
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
export default memo(QuoteStatementServiceWrapper);
