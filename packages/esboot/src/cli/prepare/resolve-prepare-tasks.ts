import type { PrepareTask, PrepareTaskStage } from './prepare-tasks';
import process from 'node:process';

export function resolvePrepareTaskStages(isCIBuild: boolean): PrepareTaskStage[] {
  return isCIBuild ? ['base'] : ['base', 'local'];
}

export function resolvePrepareTasks(
  tasks: PrepareTask[],
  isCIBuild: boolean,
): PrepareTask[] {
  const activeStages = resolvePrepareTaskStages(isCIBuild);

  return tasks.filter(task => activeStages.includes(task.stage));
}

export function runPrepareTasks(tasks: PrepareTask[]): void {
  const isDebug = process.env.ESBOOT_PREPARE_DEBUG === '1';

  tasks.forEach((task) => {
    if (isDebug) {
      console.log(`[prepare] stage=${task.stage} task=${task.name}`);
    }

    task.run();
  });
}
