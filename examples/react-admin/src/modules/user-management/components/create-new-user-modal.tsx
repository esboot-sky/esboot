import { BusinessPermission } from '@dz-web/antd-pro-components';
import { Button, message } from 'antd';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { queryAddUser } from '@/api/user-management-api';
import BaseModal from '@/components/base-modal/base-modal';
import { passwordEncrypt } from '@/modules/login/utils';

import UserInfoForm, { USER_INFO_FORM_TYPE } from './user-info-form';

interface IProps {
  subSuccess?: () => void;
}

const CreateNewUserModal = ({ subSuccess }: IProps) => {
  const { formatMessage } = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data) => {
    const params = { ...data };
    params.password = passwordEncrypt(params.password);
    return queryAddUser(params)
      .then((res) => {
        if (res.code === 0) {
          message.success(formatMessage({ id: 'userManagement.ADD_USER_SUCCESSFULLY' }));
          onCancel();
          if (subSuccess) {
            subSuccess();
          }
        }
      })
      .catch((err) => {
      });
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <BusinessPermission permissionKey="user:info:add">
      <Button type="primary" className="mr-[12px]" onClick={() => setIsModalOpen(true)}>
        <FormattedMessage id="CREATE_NEW" />
      </Button>

      <BaseModal
        modalProps={{
          title: <FormattedMessage id="userManagement.CREATE_A_NEW_USER" />,
          open: isModalOpen,
          footer: false,
          destroyOnClose: true,
          onCancel,
        }}
      >
        <UserInfoForm submitHandler={onSubmit} onCancel={onCancel} type={USER_INFO_FORM_TYPE.ADD} />
      </BaseModal>
    </BusinessPermission>
  );
};

export default CreateNewUserModal;
