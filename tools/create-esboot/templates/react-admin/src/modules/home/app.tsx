import { cn } from '@dz-web/esboot-browser';
import { Outlet } from 'react-router-dom';

import Navigation from '@/containers/navigation/navigation';

import UserInfo from './user-info';

function Home() {
  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--home-background-gradient)' }}>
      <div
        className={cn(
          'static z-10 h-[64px] shadow-[0_2px_20px_0px_rgba(102,102,102,0.2)]',
          'flex items-center px-[25px]',
        )}
      >
        <img src="/static/logo.svg" alt="" />

        <UserInfo />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[200px] overflow-auto border-r-[1px] border-[var(--color-border-subtle)]">
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
