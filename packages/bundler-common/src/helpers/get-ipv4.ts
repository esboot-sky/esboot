import { ip } from 'address';

export const getIpv4 = () => {
  return ip();
};
