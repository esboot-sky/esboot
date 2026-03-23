import { useContext } from 'react';

import { permissionContext } from '@/hoc/wrap-permissions';

interface IProps {
  children: React.ReactNode;
  value: string;
}

const Permissions = ({ children, value }: IProps) => {
  const permissionList = useContext(permissionContext);
  if (permissionList?.includes(value)) return children;
  return null;
};

export default Permissions;
