import { Button, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleAssign } from '@/api/user-management-api';
import BaseFormItem from '@/components/base-form-item/base-form-item';
import BaseModal from '@/components/base-modal/base-modal';

import useQueryRoleList from '../../../hooks/use-query-role-list';

interface IProps {
  subSuccess: () => void;
  rowItem: {
    id: number;
    nickname: string;
    username: string;
    roleName: string;
  };
}

const RoleAssignModal = ({ subSuccess, rowItem: { username, nickname, roleName, id } }: IProps) => {
  const { formatMessage } = useIntl();
  const { queryRoleList, roleList, roleNameToIds } = useQueryRoleList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleIds, setRoleIds] = useState<number[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const roleAssignHandler = () => {
    setConfirmLoading(true);
    queryRoleAssign({ id, roleIds })
      .then(() => {
        message.success(formatMessage({ id: 'userManagement.ASSIGN_ROLE_SUCCESSFULLY' }));
        subSuccess();
        setIsModalOpen(false);
      })
      .catch((err) => {
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  useEffect(() => {
    if (!isModalOpen) return;
    queryRoleList();
  }, [isModalOpen]);

  useEffect(() => {
    const _roleIds = roleNameToIds(roleName);
    setRoleIds(_roleIds);
  }, [roleList]);

  return (
    <>
      <Button type="link" className="!h-full !px-[5px] !py-0" onClick={() => setIsModalOpen(true)}>
        {formatMessage({ id: 'userManagement.ASSIGN_ROLE' })}
      </Button>
      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'userManagement.ASSIGN_ROLE_MODAL_TITLE' }),
          open: isModalOpen,
          destroyOnClose: true,
          onCancel: () => setIsModalOpen(false),
          onOk: () => {
            roleAssignHandler();
          },
          confirmLoading,
        }}
      >
        <BaseFormItem label={formatMessage({ id: 'userManagement.USER_NAME' })}>{nickname}</BaseFormItem>
        <BaseFormItem label={formatMessage({ id: 'userManagement.LOGIN_ACCOUNT' })}>{username}</BaseFormItem>
        <BaseFormItem label={formatMessage({ id: 'ROLE' })}>
          <Select
            options={roleList}
            className="w-full"
            mode="multiple"
            allowClear
            showSearch={false}
            value={roleIds}
            onChange={(v) => setRoleIds(v)}
          />
        </BaseFormItem>
      </BaseModal>
    </>
  );
};

export default RoleAssignModal;
