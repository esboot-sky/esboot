import { Button } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryPermissionModify } from '@/api/role-management-api';

import SelectPermissionsModal from './select-permissions-modal';

function ReviseRolePermissions({ rowItem, subSuccess }) {
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
      .catch(() => {})
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  return (
    <>
      <Button type="link" className="!py-0 !h-full !px-[5px]" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'rolemanagement.permissions' })}
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
}

export default ReviseRolePermissions;
