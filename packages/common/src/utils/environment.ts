import { Environment } from '../constants/environment';
import { shellEnv } from '../environment';

export const isTestEnv = () => {
  return shellEnv.get('NODE_ENV') === Environment.test;
};

export const isDebug = () => {
  return shellEnv.get('DEBUG') === 'true';
};

export const isDevEnv = () => {
  return shellEnv.get('NODE_ENV') === Environment.dev;
};

export const isProdEnv = () => {
  return shellEnv.get('NODE_ENV') === Environment.prod;
};
