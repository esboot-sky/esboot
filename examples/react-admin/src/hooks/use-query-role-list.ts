import { useCallback, useMemo, useState } from 'react';

import { queryRoleList as queryRoleListApi } from '@/api/common-api';

type RoleOption = {
  label: string;
  value: number;
};

type RoleRecord = {
  id: number;
  name: string;
};

const useQueryRoleList = () => {
  const [roleList, setRoleList] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const queryRoleList = () => {
    setIsLoading(true);
    queryRoleListApi({
      pageSize: 100000,
    })
      .then((res) => {
        if (res.code !== 0) return;
        const records = (res?.result?.records || []) as RoleRecord[];
        const list = records.map((item: RoleRecord) => ({ label: item.name, value: item.id }));
        setRoleList(list);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const roleNameToIds = useCallback(
    (roleName: string) => {
      const roleIdsLabel = roleName?.split(',');
      const roleIds = roleList.filter((item) => roleIdsLabel?.includes(item.label)).map((item) => item.value);
      return roleIds as number[];
    },
    [roleList],
  );

  const transformValueEnum = useMemo(() => {
    const result = roleList?.reduce<Record<number, { text: string }>>((acc, item) => {
      acc[item.value] = { text: item.label };
      return acc;
    }, {});
    return result;
  }, [roleList]);

  return {
    queryRoleList,
    roleList,
    roleNameToIds,
    isLoading,

    transformValueEnum,
  };
};

export default useQueryRoleList;
