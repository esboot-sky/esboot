import { describe, expect, it } from 'vitest';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
} from '../../environment';
import { isDevEnv, isProdEnv, isTestEnv } from '../environment';

it('reads environment predicates from the active provider', () => {
  const previous = setShellEnvProvider(createRecordEnvProvider({
    NODE_ENV: 'production',
  }));

  try {
    expect(isTestEnv()).toBe(false);
    expect(isDevEnv()).toBe(false);
    expect(isProdEnv()).toBe(true);
  }
  finally {
    setShellEnvProvider(previous);
  }
});

describe('isTestEnv', () => {
  it('should return true if the environment is test', () => {
    process.env.NODE_ENV = 'test';
    expect(isTestEnv()).toBe(true);
  });

  it('should return false if the environment is not test', () => {
    process.env.NODE_ENV = 'dev';
    expect(isTestEnv()).toBe(false);
  });
});

describe('isDevEnv', () => {
  it('should return true if the environment is dev', () => {
    process.env.NODE_ENV = 'development';
    expect(isDevEnv()).toBe(true);
  });

  it('should return false if the environment is not dev', () => {
    process.env.NODE_ENV = 'test';
    expect(isDevEnv()).toBe(false);
  });
});

describe('isProdEnv', () => {
  it('should return true if the environment is prod', () => {
    process.env.NODE_ENV = 'production';
    expect(isProdEnv()).toBe(true);
  });

  it('should return false if the environment is not prod', () => {
    process.env.NODE_ENV = 'test';
    expect(isProdEnv()).toBe(false);
  });
});
