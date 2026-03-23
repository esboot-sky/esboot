import { Button, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleInfoAdd } from '@/api/role-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import RoleInfoForm, { ROLE_INFO_FORM_TYPE } from './role-info-form';

interface IProps {
  subSuccess?: () => void;
}
const CreateNewRoleModal = ({ subSuccess }: IProps) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data, modules) => {
    return queryRoleInfoAdd({ ...data, modules })
      .then((res) => {
        if (res.code === 0) {
          message.success(formatMessage({ id: 'roleManagement.CREATE_SUCCESSFULLY' }));
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
    <>
      <Button type="primary" className="mr-[12px]" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'CREATE_NEW' })}
      </Button>

      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'roleManagement.CREATE_NEW_ROLE' }),
          open: isModalOpen,
          footer: false,
          destroyOnClose: true,
          onCancel,
        }}
      >
        <RoleInfoForm submitHandler={onSubmit} onCancel={onCancel} type={ROLE_INFO_FORM_TYPE.ADD} />
      </BaseModal>
    </>
  );
};

export default CreateNewRoleModal;
