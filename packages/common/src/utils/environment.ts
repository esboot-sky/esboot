import { Environment } from '../constants/environment';

export const isTestEnv = () => {
  return process.env.NODE_ENV === Environment.test;
};

export const isDevEnv = () => {
  return process.env.NODE_ENV === Environment.dev;
};

export const isProdEnv = () => {
  return process.env.NODE_ENV === Environment.prod;
};
