import { Button, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleInfoModify } from '@/api/role-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import RoleInfoForm, { ROLE_INFO_FORM_TYPE } from './role-info-form';

function ReviseRoleInfoModal({ subSuccess, rowItem }: { subSuccess: () => void; rowItem: any }) {
  const { formatMessage } = useIntl();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: any) => {
    return queryRoleInfoModify({ id: rowItem.id, ...data })
      .then((res) => {
        if (res.code === 0) {
          messageApi.success(formatMessage({ id: 'rolemanagement.edit_successfully' }));
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
      <Button type="link" className="!py-0 !h-full !px-[5px]" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'rolemanagement.edit' })}
      </Button>
      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'rolemanagement.edit_role' }),
          open: isModalOpen,
          footer: false,
          destroyOnHidden: true,
          onCancel,
        }}
      >
        <RoleInfoForm
          submitHandler={onSubmit}
          onCancel={onCancel}
          type={ROLE_INFO_FORM_TYPE.REVISE}
          defaultValues={{
            name: rowItem.name,
            remark: rowItem.remark,
            parentId: rowItem.parentId,
          }}
        />
      </BaseModal>
    </>
  );
}

export default ReviseRoleInfoModal;
