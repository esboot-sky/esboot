import { describe, it, expect } from 'vitest';
import { isTestEnv, isDevEnv, isProdEnv } from '../environment';

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
