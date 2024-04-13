import React, { ReactNode } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { globalEventsCenter } from '@/global-events';

const EVENTS = {
  ERROR: 'error',
};

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

function handleRequestError(
  error?: Error,
  meta?: IMeta,
) {
  if (typeof meta === 'object') {
    const { errorMessage, suppressErrorNotification } = meta;
    if (!suppressErrorNotification) {
      const message = errorMessage || error?.message || '系统异常';

      globalEventsCenter.emit(EVENTS.ERROR, message, error, meta);
    }
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
      console.log(mutation);
      handleRequestError(error, mutation.meta);
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= 1) {
          return false;
        }
        return true;
      },
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
      </QueryClientProvider>
    );
  };
}

export function wrapReactQuery(element: ReactNode) {
  const App = withReactQuery(() => element);

  return <App />;
}
