import { ip } from 'address';

export function getIpv4(): string {
  return ip() || 'localhost';
}
