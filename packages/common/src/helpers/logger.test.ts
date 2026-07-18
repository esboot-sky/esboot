import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createRecordEnvProvider,
  setShellEnvProvider,
} from '../environment';
import { debug } from './logger';

const originalProvider = setShellEnvProvider(
  createRecordEnvProvider(process.env),
);

afterEach(() => {
  setShellEnvProvider(originalProvider);
  vi.restoreAllMocks();
});

describe('debug', () => {
  it('reads DEBUG from the active environment provider', () => {
    setShellEnvProvider(createRecordEnvProvider({ DEBUG: '1' }));
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});

    debug('message');

    expect(log).toHaveBeenCalledOnce();
  });
});
