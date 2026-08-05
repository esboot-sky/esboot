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

function UserInfo() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [userInfo, setUserInfo] = useState<IUserInfo>(defaultUserInfo);

  const reset = useAppStore(state => state.reset);

  useEffect(() => {
    queryLoginInfo()
      .then((res) => {
        setUserInfo(res?.result?.user);
      })
      .catch(() => {});
  }, []);

  return (
    <Popover
      content={(
        <div className="inline-[338px]">
          <div className={`
            flex border-be-2 border-dotted border-(--color-divider-light) pbs-[10px] pbe-[20px]
          `}
          >
            <UserOutlined className="me-[12px] text-[40px]" />
            <div>
              <p className="text-base mbe-[2px]">{userInfo?.nickname}</p>
              <p className="text-sm text-(--color-text-secondary)">{userInfo?.roleName}</p>
            </div>
          </div>
          <div className="flex justify-center pbs-[10px]">
            <Button
              type="primary"
              onClick={() => {
                reset();
                navigate('/login', { replace: true });
              }}
            >
              {formatMessage({ id: 'logout' })}
            </Button>
          </div>
        </div>
      )}
      trigger="hover"
      placement="bottomRight"
    >
      <div className="ms-auto flex">
        <UserOutlined className="me-[12px] text-[40px]" />

        <div>
          <p className="text-base mbe-[2px]">{userInfo?.nickname}</p>
          <p className="text-sm text-(--color-text-secondary)">{userInfo?.roleName}</p>
        </div>
      </div>
    </Popover>
  );
}

export default UserInfo;
