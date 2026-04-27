import os from 'node:os';
import type { NetworkInterfaceInfo } from 'node:os';
import { ip } from 'address';

const isPreferredIpv4 = (address: string) =>
  address.startsWith('172.') || address.startsWith('192.');

export const getIpv4 = () => {
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter(
      (item: NetworkInterfaceInfo | undefined): item is NetworkInterfaceInfo =>
        item != null && !item.internal && item.family === 'IPv4',
    )
    .map((item) => item.address);

  const preferredIpv4 = addresses.find(isPreferredIpv4);

  if (preferredIpv4) {
    return preferredIpv4;
  }

  const fallbackIpv4 = ip();
  return fallbackIpv4;
};
