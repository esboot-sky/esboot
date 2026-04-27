import os from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getIpv4 } from './get-ipv4';

describe('getIpv4', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should prefer 172 and 192 ipv4 addresses', () => {
    vi.spyOn(os, 'networkInterfaces').mockReturnValue({
      lo: [
        {
          address: '127.0.0.1',
          family: 'IPv4',
          internal: true,
          netmask: '255.0.0.0',
          mac: '00:00:00:00:00:00',
          cidr: '127.0.0.1/8',
        },
      ],
      en0: [
        {
          address: '10.0.0.8',
          family: 'IPv4',
          internal: false,
          netmask: '255.255.255.0',
          mac: '00:11:22:33:44:55',
          cidr: '10.0.0.8/24',
        },
        {
          address: '172.16.0.25',
          family: 'IPv4',
          internal: false,
          netmask: '255.255.0.0',
          mac: '00:11:22:33:44:55',
          cidr: '172.16.0.25/16',
        },
      ],
      en1: [
        {
          address: '192.168.0.9',
          family: 'IPv4',
          internal: false,
          netmask: '255.255.0.0',
          mac: '00:11:22:33:44:66',
          cidr: '192.168.0.9/16',
        },
      ],
    } as NodeJS.Dict<ReturnType<typeof os.networkInterfaces>[string]>);

    expect(getIpv4()).toBe('172.16.0.25');
  });

  it('should fall back to the first available ipv4 when no preferred address exists', () => {
    vi.spyOn(os, 'networkInterfaces').mockReturnValue({
      en0: [
        {
          address: '10.0.0.8',
          family: 'IPv4',
          internal: false,
          netmask: '255.255.255.0',
          mac: '00:11:22:33:44:55',
          cidr: '10.0.0.8/24',
        },
      ],
    } as NodeJS.Dict<ReturnType<typeof os.networkInterfaces>[string]>);

    expect(getIpv4()).toBe('10.0.0.8');
  });

  it('should fall back to localhost when no external ipv4 exists', () => {
    vi.spyOn(os, 'networkInterfaces').mockReturnValue({
      lo: [
        {
          address: '127.0.0.1',
          family: 'IPv4',
          internal: true,
          netmask: '255.0.0.0',
          mac: '00:00:00:00:00:00',
          cidr: '127.0.0.1/8',
        },
      ],
    } as NodeJS.Dict<ReturnType<typeof os.networkInterfaces>[string]>);

    expect(getIpv4()).toBe('localhost');
  });
});
