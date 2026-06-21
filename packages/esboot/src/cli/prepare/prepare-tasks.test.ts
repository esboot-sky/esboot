import { describe, expect, it } from 'vitest';

describe('prepareTasks', () => {
  it('declares base and local tasks in the current execution order', async () => {
    const { prepareTasks } = await import('./prepare-tasks');

    expect(prepareTasks.map(task => ({
      name: task.name,
      stage: task.stage,
    }))).toEqual([
      { name: 'typescript-config', stage: 'base' },
      { name: 'typescript-types', stage: 'base' },
      { name: 'stylelint-config', stage: 'local' },
      { name: 'prettier-config', stage: 'local' },
      { name: 'commitlint-config', stage: 'local' },
      { name: 'vscode-settings', stage: 'local' },
      { name: 'husky-setup', stage: 'local' },
    ]);
  });
});
