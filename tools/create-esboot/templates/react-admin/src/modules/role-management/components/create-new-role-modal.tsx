import { Button, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleInfoAdd } from '@/api/role-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import RoleInfoForm, { ROLE_INFO_FORM_TYPE } from './role-info-form';

interface IProps {
  subSuccess?: () => void;
}
function CreateNewRoleModal({ subSuccess }: IProps) {
  const { formatMessage } = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: any, modules: any) => {
    return queryRoleInfoAdd({ ...data, modules })
      .then((res) => {
        if (res.code === 0) {
          messageApi.success(formatMessage({ id: 'rolemanagement.create_successfully' }));
          onCancel();
          if (subSuccess) {
            subSuccess();
          }
        }
      })
      .catch(() => {});
  };

  return (
    <>
      {contextHolder}
      <Button type="primary" className="me-[12px]" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'create_new' })}
      </Button>

      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'rolemanagement.create_new_role' }),
          open: isModalOpen,
          footer: false,
          destroyOnHidden: true,
          onCancel,
        }}
      >
        <RoleInfoForm submitHandler={onSubmit} onCancel={onCancel} type={ROLE_INFO_FORM_TYPE.ADD} />
      </BaseModal>
    </>
  );
}

export default CreateNewRoleModal;
