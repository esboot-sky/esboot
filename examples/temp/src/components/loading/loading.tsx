import * as React from 'react';

import './loading.scss';
import LoadingIcon from './loading.svg?url';

/**
 * Loading 加载组件
 * @param width 宽度
 * @param height 高度
 */
const Loading: React.FC<any> = ({ width = '.4rem', height = '.4rem' }) => (
  <div styleName="global_loading">
    <img style={{ width, height }} alt="" src={LoadingIcon} />
  </div>
);

export default Loading;
