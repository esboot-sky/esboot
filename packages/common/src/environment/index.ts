import process from 'node:process';

export type EnvRecord = Record<string, string | undefined>;

export interface EnvProvider {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  toObject: () => EnvRecord;
}

export interface ShellEnv {
  get: {
    (key: string): string | undefined;
    (key: string, fallback: string): string;
  };
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
  has: (key: string) => boolean;
  assign: (values: EnvRecord) => void;
  toObject: () => EnvRecord;
}

export function createRecordEnvProvider(source: EnvRecord): EnvProvider {
  return {
    get: key => source[key],
    set: (key, value) => {
      source[key] = value;
    },
    delete: (key) => {
      delete source[key];
    },
    has: key => Object.hasOwn(source, key),
    toObject: () => ({ ...source }),
  };
}

let provider: EnvProvider = createRecordEnvProvider(process.env);

function getEnv(key: string): string | undefined;
function getEnv(key: string, fallback: string): string;
function getEnv(key: string, fallback?: string): string | undefined {
  return provider.get(key) ?? fallback;
}

export const shellEnv: ShellEnv = {
  get: getEnv,
  set(key: string, value: string): void {
    provider.set(key, value);
  },
  delete(key: string): void {
    provider.delete(key);
  },
  has(key: string): boolean {
    return provider.has(key);
  },
  assign(values: EnvRecord): void {
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined)
        provider.set(key, value);
    });
  },
  toObject(): EnvRecord {
    return provider.toObject();
  },
};

export function setShellEnvProvider(nextProvider: EnvProvider): EnvProvider {
  const previousProvider = provider;
  provider = nextProvider;
  return previousProvider;
}
