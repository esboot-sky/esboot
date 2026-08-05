import { Button, message, Popconfirm } from 'antd';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { queryBatchDeleteRole } from '@/api/role-management-api';

function BatchDeleteRole({ ids, subSuccess }: { ids: React.Key[]; subSuccess: () => void }) {
  const { formatMessage } = useIntl();
  const [messageApi, contextHolder] = message.useMessage();

  const onConfirm = () => {
    return queryBatchDeleteRole({ ids: ids.map(Number) })
      .then(() => {
        messageApi.success(formatMessage({ id: 'deleted_successfully' }));
        subSuccess();
      });
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title={formatMessage({ id: 'rolemanagement.confirm_batch_delete' })}
        disabled={!ids.length}
        onConfirm={() => onConfirm()}
        okText={formatMessage({ id: 'confirm' })}
        cancelText={formatMessage({ id: 'cancel' })}
      >
        <Button
          className="me-[12px]"
          onClick={() => {
            if (!ids.length) {
              messageApi.warning(formatMessage({ id: 'rolemanagement.please_select_role_to_delete' }));
            }
          }}
        >
          {formatMessage({ id: 'rolemanagement.batch_delete' })}
        </Button>
      </Popconfirm>
    </>
  );
}

export default BatchDeleteRole;
