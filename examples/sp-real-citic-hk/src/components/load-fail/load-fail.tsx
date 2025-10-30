import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import blackIconLoading from '@/images/black/loading.svg?url';
import blackIconNoNetWork from '@/images/black/no-network.svg?url';
import whiteIconLoading from '@/images/white/loading.svg?url';
import whiteIconNoNetWork from '@/images/white/no-network.svg?url';
import { useAppStore } from '@/model/app';

import './load-fail.scss';

const imgObj = {
  whiteIconLoading,
  whiteIconNoNetWork,
  blackIconLoading,
  blackIconNoNetWork,
};

/**
 * Loading 加载组件
 * @param loading 是否默认开启 可选
 * @param width loading宽度 可选
 * @param height loading高度 可选
 * @param noNetWorkWidth 无网络图片宽度 可选
 * @param noNetWorkHeight 无网络图片高度 可选
 * @param reloadCallback 重试回调函数
 * @param module 模块名称
 */
const LoadFail: React.FC<any> = ({
  noNetWorkWidth = '2.4rem',
  noNetWorkHeight = '2.4rem',
  reloadCallback,
  status = '',
}) => {
  const theme = useAppStore((state) => state.theme);

  function reload() {
    if (reloadCallback) {
      reloadCallback();
      return;
    }
    console.log('%c未传参数 reloadCallback', 'background: red');
  }

  return (
    <div styleName="global_loading" style={{ left: status === 'error' ? '0' : '-99999px' }}>
      <div styleName="no-network">
        <img style={{ width: noNetWorkWidth, height: noNetWorkHeight }} alt="" src={imgObj[`${theme}IconNoNetWork`]} />
        <div>
          <span>
            <FormattedMessage id="network_error_tip" />
          </span>
          ，
          <span styleName="no-network-button" onClick={reload}>
            <FormattedMessage id="no_network_button" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadFail;
