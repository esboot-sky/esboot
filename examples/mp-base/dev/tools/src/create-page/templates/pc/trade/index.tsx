import { CacheStore } from '@dz-web/cache';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';

import './index.scss';
import { increase, selectCount } from './model/hello/slice';
import { useAppDispatch, useAppSelector } from './model/store';

const AppHome: React.FC = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const queryClient = useQueryClient();
  CacheStore.setItem('userInfoTest', { name: 'test' });

  console.log('query client: ', queryClient);

  return (
    <div>
      <p styleName={clsx({ test: true })}>
        <FormattedMessage id="global.project" />: {count}
      </p>

      <button onClick={() => dispatch(increase(1))} type="button">
        <FormattedMessage id="global.project" />
      </button>
    </div>
  );
};

export default AppHome;
