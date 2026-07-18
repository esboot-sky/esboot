import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadEnv } from '../load-env';

const ENV_KEYS = [
  'NODE_ENV',
  'ESBOOT_TEST_PRIORITY',
  'ESBOOT_TEST_MODE_PRIORITY',
  'ESBOOT_TEST_HOST',
  'ESBOOT_TEST_URL',
  'ESBOOT_TEST_EMPTY',
] as const;

const tmpRoots: string[] = [];
let originalEnv: Map<(typeof ENV_KEYS)[number], string | undefined>;

async function createEnvProject(files: Record<string, string>): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'esboot-load-env-'));
  tmpRoots.push(root);
  await Promise.all(
    Object.entries(files).map(([name, contents]) => writeFile(join(root, name), contents)),
  );
  return root;
}

beforeEach(() => {
  originalEnv = new Map(ENV_KEYS.map(key => [key, process.env[key]] as const));
  for (const key of ENV_KEYS)
    delete process.env[key];
});

afterEach(async () => {
  await Promise.all(tmpRoots.splice(0).map(root => rm(root, { recursive: true, force: true })));
  for (const key of ENV_KEYS) {
    const value = originalEnv.get(key);
    if (value === undefined)
      delete process.env[key];
    else
      process.env[key] = value;
  }
});

describe('loadEnv', () => {
  it('loads env files from lowest to highest priority', async () => {
    process.env.NODE_ENV = 'test';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\nESBOOT_TEST_MODE_PRIORITY=base\n',
      '.env.test': 'ESBOOT_TEST_PRIORITY=mode\nESBOOT_TEST_MODE_PRIORITY=mode\n',
      '.env.local': 'ESBOOT_TEST_PRIORITY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('local');
    expect(process.env.ESBOOT_TEST_MODE_PRIORITY).toBe('mode');
  });

  it('preserves a value supplied by the shell or CI', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_PRIORITY = 'shell';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\n',
      '.env.test': 'ESBOOT_TEST_PRIORITY=mode\n',
      '.env.local': 'ESBOOT_TEST_PRIORITY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('shell');
  });

  it('expands a local value from a lower-priority env file', async () => {
    process.env.NODE_ENV = 'test';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_HOST=base.example.com\n',
      '.env.local': `ESBOOT_TEST_URL=https://\${ESBOOT_TEST_HOST}/api\n`,
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_URL).toBe('https://base.example.com/api');
  });

  it('uses a shell or CI value during expansion', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_HOST = 'shell.example.com';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_HOST=base.example.com\n',
      '.env.local': `ESBOOT_TEST_URL=https://\${ESBOOT_TEST_HOST}/api\n`,
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_HOST).toBe('shell.example.com');
    expect(process.env.ESBOOT_TEST_URL).toBe('https://shell.example.com/api');
  });

  it('preserves an explicitly empty shell or CI value', async () => {
    process.env.NODE_ENV = 'test';
    process.env.ESBOOT_TEST_EMPTY = '';
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_EMPTY=base\n',
      '.env.local': 'ESBOOT_TEST_EMPTY=local\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_EMPTY).toBe('');
  });

  it('does not load a mode-specific file when NODE_ENV is absent', async () => {
    const root = await createEnvProject({
      '.env': 'ESBOOT_TEST_PRIORITY=base\n',
      '.env.undefined': 'ESBOOT_TEST_PRIORITY=mode\n',
    });

    loadEnv({ root });

    expect(process.env.ESBOOT_TEST_PRIORITY).toBe('base');
  });
});
