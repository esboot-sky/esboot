/* eslint-disable @typescript-eslint/no-unused-vars */
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode } from 'react';

import { enableReactQueryDevTool } from '@/constants/config';

export interface IMeta {
  /**
   * 自定义错误消息
   */
  errorMessage?: string;
  /**
   * 不显示此请求的错误提示
   */
  suppressErrorNotification?: boolean;
}

function handleRequestError(error?: Error, meta?: IMeta) {
  // 根据meta对象自定义提示消息
  if (typeof meta === 'object') {
    const { errorMessage, suppressErrorNotification } = meta;
    // 特殊处理在meta中声明了不需要全局错误提示
    if (!suppressErrorNotification) {
      const message = errorMessage || error?.message || (error as any)?.msg || '系统异常';

      console.error(message, error, meta);
      // TODO: toast message
      // globalEventsCenter.emit(GlobalEvents.REACT_QUERY_REQUEST_ERROR, message, error, meta);
    }
  } else {
    const message = error?.message || (error as any)?.msg || '系统异常';
    console.error(message, error, meta);
    // globalEventsCenter.emit(GlobalEvents.REACT_QUERY_REQUEST_ERROR, message, error, meta);
    // TODO: toast message
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      handleRequestError(error, query.meta);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any, variables, context, mutation) => {
      handleRequestError(error, mutation.meta);
    },
  }),
  defaultOptions: {
    queries: {
      networkMode: 'always',
      retry: (failureCount) => {
        if (failureCount >= 1) {
          return false;
        }
        return true;
      },
    },
    mutations: {
      networkMode: 'always',
    },
  },
});

/**
 * HOC组件 - 添加queryClient
 */
export function withReactQuery(App): any {
  return function QueryApp({ ...rest }) {
    return (
      <QueryClientProvider client={queryClient}>
        <App {...rest} />
        {enableReactQueryDevTool && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    );
  };
}

export function wrapReactQuery(element: ReactNode) {
  const App = withReactQuery(() => element);

  return <App />;
}
