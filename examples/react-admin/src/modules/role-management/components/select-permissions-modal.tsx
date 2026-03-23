import { Segmented, Tree, TreeProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { queryPermissionList as queryPermissionListApi, queryPermissionModules } from '@/api/role-management-api';
import BaseModal from '@/components/base-modal/base-modal';

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  getValues: (key: string) => any;
  onConfirm: (v: any, moduleCode: string) => void;
  id?: number;
  confirmLoading?: boolean;
}

function convertToTreeData(data) {
  return data.map((item) => {
    const treeNode = {
      title: item.name, // 映射到 title
      key: item.id, // 映射到 key，并且将 id 转换为字符串
    };

    if (item.children && item.children.length > 0) {
      treeNode.children = convertToTreeData(item.children);
    }

    return treeNode;
  });
}

const SelectPermissionsModal = ({ isModalOpen, setIsModalOpen, getValues, onConfirm, id, confirmLoading }: IProps) => {
  const { formatMessage } = useIntl();
  const [tabList, setTabList] = useState<
    {
      name: string;
      code: string;
    }[]
  >([]);
  const [activeKey, setActiveKey] = useState('');
  const [permissionList, setPermissionList] = useState([]);
  const [modules, setModules] = useState<
    {
      code: string;
      menuIds: number[];
    }[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);

  const moduleCode = useMemo(() => tabList.find((item) => item.name === activeKey)?.code || '', [tabList, activeKey]);

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {

    const item = modules.find((i) => i.code === moduleCode);
    if (item) {
      const _modules = modules.map((e) => {
        if (e.code === moduleCode) {
          e.menuIds = checkedKeysValue as number[];
        }
        return e;
      });
      setModules(_modules);
      return;
    }

    setModules([...modules, { code: moduleCode, menuIds: checkedKeysValue as number[] }]);
  };

  const onOk = () => {
    if (id) {
      onConfirm(modules, moduleCode);
      return;
    }
    onCancel();
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setActiveKey('');
  };

  const onChange = (key) => {
    setActiveKey(key);
  };

  const queryPermissionList = () => {
    const parentId = getValues('parentId');
    const param: { parentId: number; id?: number } = { parentId };

    if (id) {
      param.id = id;
    }

    queryPermissionListApi(param, moduleCode)
      .then((res) => {
        const permissions = res?.result?.permissions;
        const checkedList = res?.result?.checkedList;
        const treeData = convertToTreeData(permissions);
        setPermissionList(treeData);

        if (checkedList.length > 0) {
          onCheck(checkedList, {} as any);
        }
      })
      .catch((err) => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkedKeys = useMemo(() => {
    const item = modules.find((e) => e.code === moduleCode);

    return item?.menuIds || [];
  }, [moduleCode, modules]);

  useEffect(() => {
    if (!isModalOpen) return;
    const parentId = getValues('parentId');
    setLoading(true);
    queryPermissionModules({ id: parentId })
      .then((res) => {
        const { result } = res;
        setTabList(result);
        if (result.length > 0) {
          setActiveKey(result[0].name);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    if (activeKey) {
      queryPermissionList();
    }
  }, [activeKey, isModalOpen]);

  return (
    <BaseModal
      modalProps={{
        title: formatMessage({ id: 'roleManagement.PERMISSIONS' }),
        open: isModalOpen,
        destroyOnClose: true,
        onCancel,
        onOk,
        confirmLoading,
        loading,
        width: 'auto',
        className: 'min-w-[520px] !max-w-fit ',
      }}
    >
      <div className="w-full overflow-x-auto">
        <Segmented
          value={activeKey}
          style={{ marginBottom: 8 }}
          onChange={onChange}
          options={tabList?.map((item) => item.name)}
        />
      </div>

      <Tree checkable onCheck={onCheck} checkedKeys={checkedKeys} treeData={permissionList} />
    </BaseModal>
  );
};

export default SelectPermissionsModal;
