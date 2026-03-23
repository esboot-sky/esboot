import { Button, Popconfirm, message } from 'antd';
import { useIntl } from 'react-intl';

import { queryUserDisable, queryUserEnable } from '@/api/user-management-api';

const ChangeUserStatus = ({ id, subSuccess, status }) => {
  const { formatMessage } = useIntl();

  const userDeleteHandler = () => {
    const request = status === 1 ? queryUserDisable : queryUserEnable;

    return request({ id })
      .then(() => {
        message.success(formatMessage({ id: status === 1 ? 'DISABLE_SUCCESSFULLY' : 'ENABLED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: status === 1 ? 'userManagement.CONFIRM_DISABLE_USER' : 'userManagement.CONFIRM_ENABLE_USER' })}
      onConfirm={() => userDeleteHandler()}
      okText={formatMessage({ id: 'CONFIRM' })}
      cancelText={formatMessage({ id: 'CANCEL' })}
    >
      <Button type="link" className="!h-full !px-[5px] !py-0">
        {formatMessage({ id: status === 1 ? 'DISABLE' : 'ENABLE' })}
      </Button>
    </Popconfirm>
  );
};

export default ChangeUserStatus;
