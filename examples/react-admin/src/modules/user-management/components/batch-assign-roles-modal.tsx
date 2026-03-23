import { Button, Checkbox, Col, Row, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleAssignBatch } from '@/api/user-management-api';
import BaseModal from '@/components/base-modal/base-modal';

import useQueryRoleList from '../../../hooks/use-query-role-list';

interface IProps {
  ids: number[];
  subSuccess: () => void;
}

const BatchAssignRolesModal = ({ ids, subSuccess }: IProps) => {
  const { formatMessage } = useIntl();

  const { queryRoleList, roleList, isLoading } = useQueryRoleList();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleIds, setRoleIds] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onConfirm = () => {
    setConfirmLoading(true);
    queryRoleAssignBatch({ ids, roleIds })
      .then(() => {
        message.success(formatMessage({ id: 'userManagement.ROLE_BATCH_ASSIGNMENT_IS_SUCCESSFUL' }));
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
    if (!isModalOpen) {
      setRoleIds([]);
      return;
    }

    queryRoleList();
  }, [isModalOpen]);

  return (
    <>
      <Button
        className="mr-[12px]"
        onClick={() => {
          if (!ids.length) {
            message.warning(
              formatMessage({ id: 'userManagement.PLEASE_SELECT_THE_USERS_TO_WHOM_YOU_WANT_TO_ASSIGN_ROLES_IN_BATCHES' }),
            );
            return;
          }
          setIsModalOpen(true);
        }}
      >
        {formatMessage({ id: 'userManagement.BULK_ASSIGNMENT_OF_ROLES' })}
      </Button>

      <BaseModal
        modalProps={{
          title: formatMessage({ id: 'userManagement.BULK_ASSIGNMENT_OF_ROLES' }),
          open: isModalOpen,
          destroyOnClose: true,
          onCancel: () => setIsModalOpen(false),
          onOk: () => {
            onConfirm();
          },
          confirmLoading,
          loading: isLoading,
        }}
      >
        <Checkbox.Group
          onChange={(v) => {
            setRoleIds(v);
          }}
          value={roleIds}
        >
          <Row>
            {roleList.map((item) => (
              <Col key={item.value} span={8}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </BaseModal>
    </>
  );
};

export default BatchAssignRolesModal;
