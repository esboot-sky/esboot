import { useEffect } from 'react';

import Header from '@/components/header/header';
import Sidebar from '@/components/sidebar/sidebar';
import { useLoginStore } from '@/model';
import { fetchSystemLoginInfo } from '../login/api/login';

function Home() {
  const setAccountInfo = useLoginStore(state => state.setAccountInfo);

  useEffect(() => {
    fetchSystemLoginInfo()
      .then((res: any) => {
        if (res?.result?.user) {
          setAccountInfo(res.result.user);
        }
      })
      .catch(() => {});
  }, [setAccountInfo]);

  return (
    <div className="flex flex-col overflow-hidden bg-[#f8fafc] block-full">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-[#f8fafc]" id="subapp-viewport" />
      </div>
    </div>
  );
}

export default Home;
