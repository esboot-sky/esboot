import { ProColumns, ProTable } from '@dz-web/antd-pro-components';
import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { queryRoleInfoList } from '@/api/role-management-api';
import { QueryKeyRoleInfoList } from '@/constants/query-key';
import useQueryRoleList from '@/hooks/use-query-role-list';
import useTableConfig from '@/hooks/use-table-config';

import BatchDeleteRole from './components/batch-delete-role';
import CreateNewRoleModal from './components/create-new-role-modal';
import DeleteRoleConfirm from './components/delete-role-confirm';
import ReviseRoleInfoModal from './components/revise-role-info-modal';
import ReviseRolePermissions from './components/revise-role-permissions';

type DataType = {
  createTime: string;
  name: string;
  parentName: string;
  remark: string;
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

  const { selectedRowKeys, rowSelection, setSelectedRowKeys, actionRef, tableRequest, tableRequestLoading } =
    useTableConfig<TableQueryParams, DataType>({
      defaultParams,
      fetch: queryRoleInfoList,
      queryKey: QueryKeyRoleInfoList,
    });

  const { queryRoleList, transformValueEnum } = useQueryRoleList();

  const columns: ProColumns<DataType>[] = useMemo(
    () => [
      {
        title: formatMessage({ id: 'ADD_TIME' }),
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'roleManagement.ROLE_NAME' }),
        hideInTable: true,
        dataIndex: 'keyword',
        fieldProps: {
          placeholder: formatMessage({ id: 'roleManagement.PLEASE_ENTER_ROLE_NAME' }),
        },
      },
      {
        title: formatMessage({ id: 'roleManagement.ROLE_NAME' }),
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'roleManagement.PARENT_ROLE' }),
        hideInTable: true,
        dataIndex: 'parentId',
        key: 'parentId',
        sorter: true,
        valueType: 'select',
        valueEnum: transformValueEnum,
      },
      {
        title: formatMessage({ id: 'roleManagement.PARENT_ROLE' }),
        dataIndex: 'parentName',
        key: 'parentName',
        sorter: true,
        search: false,
      },
      {
        title: formatMessage({ id: 'roleManagement.REMARK' }),
        dataIndex: 'remark',
        key: 'remark',
        sorter: true,
        search: false,
      },

      {
        title: formatMessage({ id: 'OPERATE' }),
        key: 'operation',
        fixed: 'right',
        width: 150,
        search: false,
        render: (text, row: any) => (
          <div className="flex">
            <ReviseRolePermissions rowItem={row} subSuccess={() => actionRef.current?.reload()} />
            <ReviseRoleInfoModal rowItem={row} subSuccess={() => actionRef.current?.reload()} />
            <DeleteRoleConfirm id={row.id} subSuccess={() => actionRef.current?.reload()} />
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
    <div className="flex h-full flex-1 flex-col">
      <div className="flex flex-1 flex-col p-[20px]">
        <ProTable<DataType>
          columns={columns}
          actionRef={actionRef}
          cardBordered={false}
          defaultSize="small"
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
          headerTitle={formatMessage({ id: 'roleManagement.ROLE_MANAGEMENT' })}
          toolBarRender={() => [
            <CreateNewRoleModal subSuccess={() => actionRef.current?.reload()} />,

            <BatchDeleteRole
              ids={selectedRowKeys}
              subSuccess={() => {
                actionRef.current?.reload();
                setSelectedRowKeys([]);
              }}
            />,
          ]}
          rowSelection={rowSelection}
        />
      </div>
    </div>
  );
};
export default UserManagement;
