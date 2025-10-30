import React, { ReactNode } from 'react';

import { back } from '@/helpers/native/msg';
import IconBack24 from '@/images/icon_back_24.svg?url';

interface IProps {
  children: ReactNode;
  rightNode?: ReactNode | undefined;
  goback?: () => void;
}

const PageHead: React.FC<IProps> = ({ children, rightNode, goback }) => {
  // function handleGoBack() {
  //   const { history } = window;

  //   const isUnique = history.length === 1;
  //   const isFirstStateSub = !history.state || Number(history.state.idx) === 0;

  //   if (isUnique || isFirstStateSub) {
  //     back();
  //     return;
  //   }

  //   history.back();
  // }

  const handleBackClick = () => {
    if (goback) {
      goback();
    } else {
      back();
    }
  };

  return (
    <div className="content-background relative flex h-[88px] items-center justify-between">
      <div className="absolute left-0 px-[30px]" onClick={handleBackClick}>
        <img src={IconBack24} alt="" />
      </div>
      <div className="flex flex-1 justify-center">{children}</div>
      <div className="absolute right-0 px-[30px]">{rightNode || null}</div>
    </div>
  );
};

export default PageHead;
