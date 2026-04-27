import type { NetworkInterfaceInfo } from 'node:os';
import os from 'node:os';

function isPreferredIpv4(address: string): boolean {
  return address.startsWith('172.') || address.startsWith('192.');
}

export function getIpv4(): string {
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces)
    .flat()
    .filter(
      (item: NetworkInterfaceInfo | undefined): item is NetworkInterfaceInfo =>
        item != null && !item.internal && item.family === 'IPv4',
    )
    .map(item => item.address);

  const preferredIpv4 = addresses.find(isPreferredIpv4);

  if (preferredIpv4) {
    return preferredIpv4;
  }

  return addresses[0] || 'localhost';
}
