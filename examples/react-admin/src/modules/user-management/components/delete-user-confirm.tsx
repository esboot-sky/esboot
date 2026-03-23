import { Button, Popconfirm, message } from 'antd';
import { useIntl } from 'react-intl';

import { queryUserDelete } from '@/api/user-management-api';

const DeleteUserConfirm = ({ id, subSuccess }) => {
  const { formatMessage } = useIntl();

  const userDeleteHandler = () => {
    return queryUserDelete({ id })
      .then(() => {
        message.success(formatMessage({ id: 'DELETED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: 'userManagement.CONFIRM_DELETE' })}
      onConfirm={() => userDeleteHandler()}
      okText={formatMessage({ id: 'CONFIRM' })}
      cancelText={formatMessage({ id: 'CANCEL' })}
    >
      <Button type="link" className="!h-full !px-[5px] !py-0">
        {formatMessage({ id: 'userManagement.DELETE' })}
      </Button>
    </Popconfirm>
  );
};

export default DeleteUserConfirm;
