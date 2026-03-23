import { UserOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { queryLoginInfo } from '@/api/home-api';
import { useAppStore } from '@/model/app';

interface IUserInfo {
  id: number;
  nickname: string;
  orgCode: string;
  orgName: string | null;
  roleName: string;
}

const defaultUserInfo: IUserInfo = {
  id: 0,
  nickname: '',
  orgCode: '',
  orgName: null,
  roleName: '',
};

const UserInfo = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [userInfo, setUserInfo] = useState<IUserInfo>(defaultUserInfo);

  const reset = useAppStore((state) => state.reset);

  useEffect(() => {
    queryLoginInfo()
      .then((res) => {
        setUserInfo(res?.result?.user);
      })
      .catch(() => {});
  }, []);

  return (
    <Popover
      content={
        <div className="w-[338px]">
          <div className="flex border-b-2 border-dotted border-[var(--color-divider-light)] pb-[20px] pt-[10px]">
            <UserOutlined className="mr-[12px] text-[40px]" />
            <div>
              <p className="mb-[2px] text-base">{userInfo?.nickname}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{userInfo?.roleName}</p>
            </div>
          </div>
          <div className="flex justify-center pt-[10px]">
            <Button
              type="primary"
              onClick={() => {
                reset();
                navigate('/login', { replace: true });
              }}
            >
              {formatMessage({ id: 'LOGOUT' })}
            </Button>
          </div>
        </div>
      }
      trigger="hover"
      placement="bottomRight"
    >
      <div className="ml-[auto] flex">
        <UserOutlined className="mr-[12px] text-[40px]" />

        <div>
          <p className="mb-[2px] text-base">{userInfo?.nickname}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{userInfo?.roleName}</p>
        </div>
      </div>
    </Popover>
  );
};

export default UserInfo;
