import { permissionContext } from '@/hoc/wrap-permissions';

interface IProps {
  children: React.ReactNode;
  value: string;
}

function Permissions({ children, value }: IProps) {
  const permissionList = use(permissionContext);
  if (permissionList?.includes(value))
    return children;
  return null;
}

export default Permissions;
