import { describe, expect, it } from 'vitest';

import { passwordEncrypt } from './index';

describe('passwordEncrypt', () => {
  it('should return a deterministic 20-char sha256 prefix', () => {
    const encrypted1 = passwordEncrypt('admin123');
    const encrypted2 = passwordEncrypt('admin123');

    expect(encrypted1).toBe(encrypted2);
    expect(encrypted1).toHaveLength(20);
    expect(encrypted1).toMatch(/^[a-f0-9]{20}$/);
  });

  it('should generate different outputs for different passwords', () => {
    const encrypted1 = passwordEncrypt('admin123');
    const encrypted2 = passwordEncrypt('admin1234');

    expect(encrypted1).not.toBe(encrypted2);
  });
});
