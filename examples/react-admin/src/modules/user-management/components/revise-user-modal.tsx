import { Button, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { queryModifyUser } from '@/api/user-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import UserInfoForm, { USER_INFO_FORM_TYPE } from './user-info-form';

interface IProps {
  subSuccess?: () => void;
  rowItem: {
    id: number;
    nickname: string;
    areaCode: string;
    mobile: string;
    email: string;
    username: string;
    deptId: string;
    roleName: string;
    status: number;
  };
}

const ReviseUserModal = ({ rowItem, subSuccess }: IProps) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onSubmit = async (data) => {
    const { id } = rowItem;
    queryModifyUser({ id, ...data })
      .then((res) => {
        if (res.code === 0) {
          message.success(formatMessage({ id: 'userManagement.EDIT_USER_SUCCESSFULLY' }));
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
          title: formatMessage({ id: 'userManagement.EDIT_USER' }),
          open: isModalOpen,
          footer: false,
          destroyOnClose: true,
          onCancel,
        }}
      >
        <UserInfoForm
          submitHandler={onSubmit}
          onCancel={onCancel}
          type={USER_INFO_FORM_TYPE.REVISE}
          defaultValues={{
            nickname: rowItem.nickname,
            areaCode: rowItem.areaCode,
            mobile: rowItem.mobile,
            email: rowItem.email,
            username: rowItem.username,
            deptId: rowItem.deptId,
            roleIds: [],
            status: rowItem.status,
          }}
          roleName={rowItem.roleName}
        />
      </BaseModal>
    </>
  );
};

export default ReviseUserModal;
