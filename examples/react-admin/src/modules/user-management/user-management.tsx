import { ProColumns, ProTable } from '@dz-web/antd-pro-components';
import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { queryUserInfoList } from '@/api/user-management-api';
import { QueryKeyUserInfoList } from '@/constants/query-key';
import useQueryRoleList from '@/hooks/use-query-role-list';
import useTableConfig from '@/hooks/use-table-config';

import BatchAssignRoles from './components/batch-assign-roles-modal';
import BatchDeleteUser from './components/batch-delete-user';
import BatchDisableUser from './components/batch-disable-user';
import BatchEnableUser from './components/batch-enable-user';
import ChangeUserStatus from './components/change-user-status';
import CreateNewUserModal from './components/create-new-user-modal';
import DeleteUserConfirm from './components/delete-user-confirm';
import ResetPasswordModal from './components/reset-password-modal';
import ReviseUserModal from './components/revise-user-modal';
import RoleAssignModal from './components/role-assign-modal';

type DataType = {
  createTime: string;
  username: string;
  nickname: string;
};

type TableQueryParams = {
  pageSize: number;
  pageNum: number;
  orders: {
    asc: boolean;
    column: string;
  }[];
  [key: string]: unknown;
};

const defaultParams = {
  pageSize: 20,
  pageNum: 1,
  orders: [
    {
      asc: false,
      column: 'createTime',
    },
  ],
};

const UserManagement = () => {
  const { formatMessage } = useIntl();

  const { queryRoleList, transformValueEnum } = useQueryRoleList();

  const { selectedRowKeys, rowSelection, setSelectedRowKeys, actionRef, tableRequest, tableRequestLoading } =
    useTableConfig<TableQueryParams, DataType>({
      defaultParams,
      fetch: queryUserInfoList,
      queryKey: QueryKeyUserInfoList,
    });

  const columns: ProColumns<DataType>[] = useMemo(
    () => [
      {
        title: '',
        hideInTable: true,
        dataIndex: 'keyword',
        fieldProps: {
          placeholder: formatMessage({ id: 'userManagement.PLEASE_ENTER_YOUR_ACCOUNT_NUMBER_NAME_NICKNAME_MOBILE_NUMBER' }),
        },
      },
      {
        title: formatMessage({ id: 'userManagement.SUPERIOR_ROLE' }),
        dataIndex: 'roleId',
        key: 'roleId',
        sorter: true,
        valueType: 'select',
        valueEnum: transformValueEnum,
        hideInTable: true,
      },
      {
        title: formatMessage({ id: 'ADD_TIME' }),
        width: 150,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'userManagement.LOGIN_ACCOUNT' }),
        width: 150,
        dataIndex: 'username',
        key: 'username',
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'NAME' }),
        dataIndex: 'nickname',
        key: '1',
        width: 120,
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'PHONE_NUMBER' }),
        dataIndex: 'mobile',
        key: '2',
        width: 120,
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'ROLE' }),
        dataIndex: 'roleName',
        key: '3',
        width: 150,
        search: false,
      },
      {
        title: formatMessage({ id: 'DEPARTMENT' }),
        dataIndex: 'deptName',
        key: '4',
        width: 120,
        search: false,
      },
      {
        title: formatMessage({ id: 'EMAIL' }),
        dataIndex: 'email',
        key: '5',
        width: 160,
        search: false,
      },
      {
        title: formatMessage({ id: 'userManagement.LAST_LOGIN_IP' }),
        dataIndex: 'lastLoginIp',
        key: '6',
        width: 120,
        search: false,
      },
      {
        title: formatMessage({ id: 'userManagement.LAST_LOGIN_TIME' }),
        dataIndex: 'updateTime',
        key: '7',
        width: 150,
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'STATUS' }),
        dataIndex: 'status',
        key: '8',
        width: 100,
        search: false,
        valueEnum: {
          1: {
            text: formatMessage({ id: 'ENABLE' }),
          },
          0: {
            text: formatMessage({ id: 'DISABLE' }),
          },
        },
      },
      {
        title: formatMessage({ id: 'OPERATE' }),
        key: 'operation',
        fixed: 'right',
        width: 270,
        search: false,
        render: (text, row: any) => (
          <div className="flex">
            <ReviseUserModal rowItem={row} subSuccess={() => actionRef.current?.reload()} />
            <DeleteUserConfirm id={row.id} subSuccess={() => actionRef.current?.reload()} />
            <ChangeUserStatus id={row.id} subSuccess={() => actionRef.current?.reload()} status={row.status} />
            <RoleAssignModal rowItem={row} subSuccess={() => actionRef.current?.reload()} />
            <ResetPasswordModal rowItem={row} subSuccess={() => actionRef.current?.reload()} />
          </div>
        ),
      },
    ],
    [transformValueEnum],
  );

  useEffect(() => {
    queryRoleList();
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col overflow-auto p-[20px]">
      <ProTable<DataType>
        columns={columns}
        actionRef={actionRef}
        cardBordered={false}
        defaultSize="small"
        scroll={{ x: 500 }}
        loading={tableRequestLoading}
        request={tableRequest}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          position: ['bottomLeft'],
          showQuickJumper: true,
        }}
        dateFormatter="string"
        headerTitle={formatMessage({ id: 'userManagement.USER_MANAGEMENT' })}
        toolBarRender={() => [
          <CreateNewUserModal subSuccess={() => actionRef.current?.reload()} />,
          <BatchDeleteUser
            ids={selectedRowKeys}
            subSuccess={() => {
              actionRef.current?.reload();
              setSelectedRowKeys([]);
            }}
          />,
          <BatchEnableUser
            ids={selectedRowKeys}
            subSuccess={() => {
              actionRef.current?.reload();
              setSelectedRowKeys([]);
            }}
          />,
          <BatchDisableUser
            ids={selectedRowKeys}
            subSuccess={() => {
              actionRef.current?.reload();
              setSelectedRowKeys([]);
            }}
          />,
          <BatchAssignRoles
            ids={selectedRowKeys as number[]}
            subSuccess={() => {
              actionRef.current?.reload();
              setSelectedRowKeys([]);
            }}
          />,
        ]}
        rowSelection={rowSelection}
      />
    </div>
  );
};
export default UserManagement;
