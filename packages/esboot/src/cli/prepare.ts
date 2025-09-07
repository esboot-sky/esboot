import process from 'node:process';
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from '@/constants/node';

function checkNodeVersion(): void {
  const v = Number.parseInt(process.version.slice(1));
  if (v < MIN_NODE_VERSION) {
    console.error(
      `Your node version ${v} is not supported, please upgrade to ${MIN_NODE_VERSION}.`
    );

    process.exit(1);
  }
}

function setNodeTitle(name?: string): void {
  if (process.title === 'node') {
    process.title = name || FRAMEWORK_NAME;
  }
}

function setNoDeprecation(): void {
  // @ts-expect-error
  process.noDeprecation = '1';
}

export function processPrepare(): void {
  checkNodeVersion();
  setNodeTitle();
  setNoDeprecation();
}
