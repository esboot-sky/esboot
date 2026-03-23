import { Button, Popconfirm, message } from 'antd';
import { useIntl } from 'react-intl';

import { queryDeleteRole } from '@/api/role-management-api';

const DeleteRoleConfirm = ({ id, subSuccess }) => {
  const { formatMessage } = useIntl();

  const userDeleteHandler = () => {
    return queryDeleteRole({ id })
      .then(() => {
        message.success(formatMessage({ id: 'DELETED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: 'roleManagement.CONFIRM_DELETE' })}
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

export default DeleteRoleConfirm;
