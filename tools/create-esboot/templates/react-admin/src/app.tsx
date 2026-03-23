import { StyleProvider } from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import zhTW from 'antd/locale/zh_TW';
import { Outlet } from 'react-router-dom';

import { Language } from '@/constants/config';
import { useAppStore } from './model/app';

const queryClient = new QueryClient();

const langDic: Record<Language, typeof zhCN> = {
  [Language.ZH_CN]: zhCN,
  [Language.ZH_TW]: zhTW,
  [Language.EN_US]: enUS,
};

function App() {
  const lang = useAppStore(state => state.lang);

  return (
    <ConfigProvider
      locale={langDic[lang]}
      theme={{
        components: {
          Menu: {
            itemSelectedBg: 'var(--color-border-light)',
            itemSelectedColor: 'var(--color-menu-selected-text)',
            itemHoverBg: 'var(--color-border-light)',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <StyleProvider container={document.body}>
          <Outlet />
        </StyleProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
