import { ReactNode } from 'react';
import { Provider } from 'react-redux';

export function withReduxProvider(WrappedComponent: any, store: any) {
  return function ReduxApp(props) {
    return (
      <Provider store={store as any}>
        <WrappedComponent {...props} />
      </Provider>
    );
  };
}

export function wrapRedux(element: ReactNode, store: any) {
  const ReduxApp = withReduxProvider(() => element, store);

  return <ReduxApp />;
}
