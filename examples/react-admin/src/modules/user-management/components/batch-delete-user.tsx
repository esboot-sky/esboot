import { Button, Popconfirm, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

import { queryDeleteBatch } from '@/api/user-management-api';

const BatchDeleteUser = ({ ids, subSuccess }) => {
  const { formatMessage } = useIntl();

  const userDeleteHandler = () => {
    return queryDeleteBatch({ ids })
      .then(() => {
        message.success(formatMessage({ id: 'DELETED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: 'userManagement.ARE_YOU_SURE_YOU_WANT_TO_DELETE_IN_BATCHES' })}
      disabled={!ids.length}
      onConfirm={() => userDeleteHandler()}
      okText={formatMessage({ id: 'CONFIRM' })}
      cancelText={formatMessage({ id: 'CANCEL' })}
    >
      <Button
        className="mr-[12px]"
        onClick={() => {
          if (!ids.length) {
            message.warning(formatMessage({ id: 'userManagement.BATCH_DELETION' }));
          }
        }}
      >
        <FormattedMessage id="userManagement.BATCH_DELETION" />
      </Button>
    </Popconfirm>
  );
};

export default BatchDeleteUser;
