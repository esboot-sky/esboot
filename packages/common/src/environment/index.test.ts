import process from 'node:process';
import { afterEach, describe, expect, it } from 'vitest';

import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from './index';

const originalProvider = setShellEnvProvider(
  createRecordEnvProvider(process.env),
);

afterEach(() => {
  setShellEnvProvider(originalProvider);
});

describe('shellEnv', () => {
  it('reads, writes, deletes, and snapshots the active provider', () => {
    const source: Record<string, string | undefined> = { EMPTY: '' };
    setShellEnvProvider(createRecordEnvProvider(source));

    expect(shellEnv.get('MISSING')).toBeUndefined();
    expect(shellEnv.get('MISSING', 'fallback')).toBe('fallback');
    expect(shellEnv.get('EMPTY', 'fallback')).toBe('');
    expect(shellEnv.has('EMPTY')).toBe(true);

    shellEnv.set('VALUE', 'one');
    shellEnv.assign({ SECOND: 'two', SKIPPED: undefined });
    expect(shellEnv.toObject()).toEqual({
      EMPTY: '',
      VALUE: 'one',
      SECOND: 'two',
    });

    const snapshot = shellEnv.toObject();
    snapshot.VALUE = 'changed';
    expect(shellEnv.get('VALUE')).toBe('one');

    shellEnv.delete('VALUE');
    expect(shellEnv.has('VALUE')).toBe(false);
  });

  it('keeps the facade identity when replacing providers', () => {
    const facade = shellEnv;
    const previous = setShellEnvProvider(
      createRecordEnvProvider({ VALUE: 'replacement' }),
    );

    expect(shellEnv).toBe(facade);
    expect(shellEnv.get('VALUE')).toBe('replacement');
    expect(setShellEnvProvider(previous)).not.toBe(previous);
  });
});
