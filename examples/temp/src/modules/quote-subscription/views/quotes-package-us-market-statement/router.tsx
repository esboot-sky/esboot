import { lazy } from 'react';
import { FormattedMessage } from 'react-intl';
import { Route, Routes, Navigate } from 'react-router-dom';

import { useUserQuotePermissions } from '@/hooks/quote/use-user-quote-permissions';
import { useTradeAccounts } from '@/hooks/trade/use-trade-accounts';

import { StatementRouter } from './constant/const';

const Home = lazy(() => import('./pages/home/home'));
const PersonalData = lazy(() => import('./pages/personal-data/personal-data'));
const RadioData = lazy(() => import('./pages/radio-data/radio-data'));
const Progress = lazy(() => import('./pages/progress/progress'));

export const routerArr = [
  {
    component: Home,
    path: StatementRouter.STATEMENT_HOME,
    name: <FormattedMessage id="us-stock-quotes.page_title" />,
  },
  {
    component: PersonalData,
    path: StatementRouter.STATEMENT_PERSONAL_DATA,
    name: <FormattedMessage id="us-stock-quotes.page_title" />,
  },
  {
    component: RadioData,
    path: StatementRouter.STATEMENT_RADIO_DATA,
    name: <FormattedMessage id="us-stock-quotes.page_title" />,
  },
  {
    component: Progress,
    path: StatementRouter.STATEMENT_PROGRESS,
    name: <FormattedMessage id="us-stock-quotes.page_title" />,
  },
];

export const RouterConfig = (): JSX.Element => {
  useTradeAccounts({});
  useUserQuotePermissions();

  return (
    <Routes>
      {routerArr.map((routerItem) => (
        <Route key={routerItem.path} path={routerItem.path} element={<routerItem.component />} />
      ))}
      <Route path="*" element={<Navigate to={StatementRouter.STATEMENT_HOME} replace />} />
    </Routes>
  );
};
