import { UserOutlined } from '@ant-design/icons';

import Navigation from '@/containers/navigation/navigation';
import { cn } from '@/utils/cn';

function Home() {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          'static z-10 h-[64px] shadow-[0_2px_20px_0px_rgba(102,102,102,0.2)]',
          'flex items-center px-[25px]',
        )}
      >
        <img src="/static/logo.svg" alt="" />

        <div className="ml-[auto] flex">
          <UserOutlined className="mr-[8px] text-[30px]" />

          <div>
            <p className="mb-[2px] text-base">RRROOOCCCC</p>
            <p className="text-sm text-[#999]">超级管理员43232</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[200px] overflow-auto bg-[#f5f6f8]">
          <Navigation />
        </div>

        <div className="flex-1 overflow-auto p-[20px]" id="subapp-viewport" />
      </div>
    </div>
  );
}

export default Home;
