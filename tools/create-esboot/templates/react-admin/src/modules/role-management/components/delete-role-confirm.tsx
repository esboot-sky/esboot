import { Button, message, Popconfirm } from 'antd';
import { useIntl } from 'react-intl';

import { queryDeleteRole } from '@/api/role-management-api';

function DeleteRoleConfirm({ id, subSuccess }: { id: number; subSuccess: () => void }) {
  const { formatMessage } = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const userDeleteHandler = () => {
    return queryDeleteRole({ id })
      .then(() => {
        messageApi.success(formatMessage({ id: 'deleted_successfully' }));
        subSuccess();
      });
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title={formatMessage({ id: 'rolemanagement.confirm_delete' })}
        onConfirm={() => userDeleteHandler()}
        okText={formatMessage({ id: 'confirm' })}
        cancelText={formatMessage({ id: 'cancel' })}
      >
        <Button type="link" className="!py-0 !h-full !px-[5px]">
          {formatMessage({ id: 'rolemanagement.delete' })}
        </Button>
      </Popconfirm>
    </>
  );
}

export default DeleteRoleConfirm;
