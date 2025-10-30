/* eslint-disable @typescript-eslint/ban-types */

import * as React from 'react';

import serverErrorWhite from '@/images/common/no-network.svg?url';
import { useAppStore } from '@/model/app';

import './error-boundary.scss';

interface IState {
  hasError: boolean;
  err?: string;
}

export default class ErrorBoundary extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
    window.onerror = (err, place) => {
      // https://github.com/DevExpress/testcafe/issues/4857#issuecomment-598775956
      // eslint-disable-next-line max-len
      // https://github.com/inokawa/virtua?tab=readme-ov-file#what-is-resizeobserver-loop-completed-with-undelivered-notifications-error
      if (
        err === 'ResizeObserver loop completed with undelivered notifications.' ||
        err === 'ResizeObserver loop limit exceeded'
      ) {
        return;
        // err.stopImmediatePropagation();
      }
      console.log('window报错', { err, place }, window.location.href);
      // this.setState({
      //   hasError: true,
      //   err: err as string,
      // });
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    // logger.error('组件内部出错：', { error: error.message, errorInfo });
    this.setState({
      hasError: true,
      err: error.message,
    });

    console.log(error, errorInfo, '<-- error');
  }

  reFresh = () => {
    // 刷新页面
    window.location.reload();
  };

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<IState>, snapshot?: any): void {
    console.log('componentDidUpdate', prevProps, prevState, snapshot);
  }

  render(): any {
    const { hasError, err } = this.state;
    const { children } = this.props;

    if (hasError) {
      const { language, theme } = useAppStore.getState();
      return (
        <div styleName="wrap">
          <div styleName="header">
            <img styleName="icon" src={serverErrorWhite} alt="" />
            <p>{language === 'zh-CN' ? '您好！您访问的页面出现错误：' : '您好！您訪問的頁面出現錯誤：'}</p>
            <p>{err}</p>
          </div>
          <div styleName="content">
            <div>
              <span styleName="click">{language === 'zh-CN' ? '可以点击' : '可以點擊'}</span>
              <span
                styleName="no-network-button"
                onClick={() => {
                  this.reFresh();
                }}
              >
                刷新
              </span>
            </div>

            <p>{language === 'zh-CN' ? '或者通知相关的业务人员' : '或者通知相關的業務人員'}</p>
          </div>
        </div>
      );
    }
    return children;
  }
}
