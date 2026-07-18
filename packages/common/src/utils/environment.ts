import { Environment } from '../constants/environment';
import { shellEnv } from '../environment';

export function isTestEnv(): boolean {
  return shellEnv.get('NODE_ENV') === Environment.test;
}

export function isDebug(): boolean {
  return shellEnv.get('DEBUG') === 'true';
}

export function isDevEnv(): boolean {
  return shellEnv.get('NODE_ENV') === Environment.dev;
}

export function isProdEnv(): boolean {
  return shellEnv.get('NODE_ENV') === Environment.prod;
}
