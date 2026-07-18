import {
  createRecordEnvProvider,
  setShellEnvProvider,
  shellEnv,
} from '@dz-web/esboot-common/environment';
import { describe, expect, it, vi } from 'vitest';

describe('resolvePrepareTasks', () => {
  it('keeps only base tasks in CI', async () => {
    const { resolvePrepareTaskStages, resolvePrepareTasks } = await import('./resolve-prepare-tasks');
    const tasks = [
      { name: 'tsconfig', stage: 'base', run: () => {} },
      { name: 'stylelint', stage: 'local', run: () => {} },
    ] as const;

    expect(resolvePrepareTaskStages(true)).toEqual(['base']);
    expect(resolvePrepareTasks([...tasks], true).map(task => task.name)).toEqual(['tsconfig']);
  });

  it('keeps base and local tasks outside CI without reordering them', async () => {
    const { resolvePrepareTaskStages, resolvePrepareTasks } = await import('./resolve-prepare-tasks');
    const tasks = [
      { name: 'tsconfig', stage: 'base', run: () => {} },
      { name: 'types', stage: 'base', run: () => {} },
      { name: 'stylelint', stage: 'local', run: () => {} },
      { name: 'vscode', stage: 'local', run: () => {} },
    ] as const;

    expect(resolvePrepareTaskStages(false)).toEqual(['base', 'local']);
    expect(resolvePrepareTasks([...tasks], false).map(task => task.name)).toEqual([
      'tsconfig',
      'types',
      'stylelint',
      'vscode',
    ]);
  });

  it('logs task execution only when debug mode is enabled', async () => {
    const { runPrepareTasks } = await import('./resolve-prepare-tasks');
    const logs: string[] = [];
    const previousProvider = setShellEnvProvider(createRecordEnvProvider({}));
    const logSpy = vi.spyOn(console, 'log').mockImplementation((message: string) => {
      logs.push(message);
    });

    try {
      shellEnv.set('ESBOOT_PREPARE_DEBUG', '1');
      runPrepareTasks([
        { name: 'tsconfig', stage: 'base', run: () => {} },
        { name: 'stylelint', stage: 'local', run: () => {} },
      ]);

      expect(logs).toEqual([
        '[prepare] stage=base task=tsconfig',
        '[prepare] stage=local task=stylelint',
      ]);
    }
    finally {
      logSpy.mockRestore();
      setShellEnvProvider(previousProvider);
    }
  });
});
