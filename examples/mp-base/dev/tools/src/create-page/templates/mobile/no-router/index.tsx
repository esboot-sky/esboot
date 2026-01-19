import { CacheStore } from '@dz-web/cache';
import { clsx } from '@dz-web/esboot-browser';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd-mobile';
import { FormattedMessage } from 'react-intl';

import useHelloStore, { increase, selectCount } from './model/hello';
import './index.scss';

function AppHome() {
  const count = useHelloStore(selectCount);
  const queryClient = useQueryClient();
  CacheStore.setItem('userInfoTest', { name: 'test' });

  console.log('query client: ', queryClient);

  const onClick = () => {
    increase(1);
  };

  return (
    <div>
      <p styleName={clsx({ test: true })}>
        <FormattedMessage id="global.project" />
        :
        {count}
      </p>

      <Button onClick={onClick}>
        <FormattedMessage id="global.project" />
      </Button>
    </div>
  );
}

export default AppHome;
