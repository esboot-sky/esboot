import { cn } from '@dz-web/esboot-browser';
import { Outlet } from 'react-router-dom';

import Navigation from '@/containers/navigation/navigation';
import { isQiankun } from '@/utils/qiankun';

import UserInfo from './user-info';

function Home() {
  if (isQiankun) {
    return (
      <div className="block-full inline-full min-block-full">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col block-full" style={{ background: 'var(--home-background-gradient)' }}>
      <div
        className={cn(
          'static z-10 shadow-[0_2px_20px_0px_rgba(102,102,102,0.2)] block-[64px]',
          'flex items-center px-[25px]',
        )}
      >
        <img src="/static/logo.svg" alt="" />

        <UserInfo />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-auto border-e border-(--color-border-subtle) inline-[200px]">
          <Navigation />
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
