import { Button, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleInfoModify } from '@/api/role-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import RoleInfoForm, { ROLE_INFO_FORM_TYPE } from './role-info-form';

const ReviseRoleInfoModal = ({ subSuccess, rowItem }) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data) => {
    return queryRoleInfoModify({ id: rowItem.id, ...data })
      .then((res) => {
        if (res.code === 0) {
          message.success(formatMessage({ id: 'roleManagement.EDIT_SUCCESSFULLY' }));
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
      <Button type="link" className="!h-full !px-[5px] !py-0" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'userManagement.EDIT' })}
      </Button>
      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'roleManagement.EDIT_ROLE' }),
          open: isModalOpen,
          footer: false,
          destroyOnClose: true,
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
};

export default ReviseRoleInfoModal;
