import { Button, Popconfirm, message } from 'antd';
import { useIntl } from 'react-intl';

import { queryBatchDeleteRole } from '@/api/role-management-api';

const BatchDeleteRole = ({ ids, subSuccess }) => {
  const { formatMessage } = useIntl();

  const onConfirm = () => {
    return queryBatchDeleteRole({ ids })
      .then(() => {
        message.success(formatMessage({ id: 'DELETED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: 'roleManagement.CONFIRM_BATCH_DELETE' })}
      disabled={!ids.length}
      onConfirm={() => onConfirm()}
      okText={formatMessage({ id: 'CONFIRM' })}
      cancelText={formatMessage({ id: 'CANCEL' })}
    >
      <Button
        className="mr-[12px]"
        onClick={() => {
          if (!ids.length) {
            message.warning(formatMessage({ id: 'roleManagement.PLEASE_SELECT_ROLE_TO_DELETE' }));
          }
        }}
      >
        {formatMessage({ id: 'roleManagement.BATCH_DELETE' })}
      </Button>
    </Popconfirm>
  );
};

export default BatchDeleteRole;
