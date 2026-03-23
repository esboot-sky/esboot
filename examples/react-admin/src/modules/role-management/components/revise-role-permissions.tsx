import { Button } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryPermissionModify } from '@/api/role-management-api';

import SelectPermissionsModal from './select-permissions-modal';

const ReviseRolePermissions = ({ rowItem, subSuccess }) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onConfirm = (modules, moduleCode) => {
    setConfirmLoading(true);
    queryPermissionModify({ id: rowItem.id, modules }, moduleCode)
      .then(() => {
        subSuccess();
        setIsModalOpen(false);
      })
      .catch((err) => {
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  return (
    <>
      <Button type="link" className="!h-full !px-[5px] !py-0" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'roleManagement.PERMISSIONS' })}
      </Button>
      <SelectPermissionsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        getValues={() => rowItem.parentId}
        onConfirm={onConfirm}
        id={rowItem.id}
        confirmLoading={confirmLoading}
      />
    </>
  );
};

export default ReviseRolePermissions;
