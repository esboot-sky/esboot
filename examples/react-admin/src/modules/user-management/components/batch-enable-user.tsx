import { Button, Popconfirm, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

import { queryEnableBatch } from '@/api/user-management-api';

const BatchEnableUser = ({ ids, subSuccess }) => {
  const { formatMessage } = useIntl();

  const onConfirm = () => {
    return queryEnableBatch({ ids })
      .then(() => {
        message.success(formatMessage({ id: 'ENABLED_SUCCESSFULLY' }));
        subSuccess();
      })
  };

  return (
    <Popconfirm
      title={formatMessage({ id: 'userManagement.ARE_YOU_SURE_YOU_WANT_TO_ENABLE_BATCHES' })}
      disabled={!ids.length}
      onConfirm={() => onConfirm()}
      okText={formatMessage({ id: 'CONFIRM' })}
      cancelText={formatMessage({ id: 'CANCEL' })}
    >
      <Button
        className="mr-[12px]"
        onClick={() => {
          if (!ids.length) {
            message.warning(formatMessage({ id: 'userManagement.PLEASE_SELECT_THE_USERS_YOU_WANT_TO_ENABLE_IN_BATCHES' }));
          }
        }}
      >
        <FormattedMessage id="userManagement.BATCH_ACTIVATION" />
      </Button>
    </Popconfirm>
  );
};

export default BatchEnableUser;
