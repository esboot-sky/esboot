import { FRAMEWORK_NAME, MIN_NODE_VERSION } from '@/constants/node';

function checkNodeVersion() {
  const v = Number.parseInt(process.version.slice(1));
  if (v < MIN_NODE_VERSION) {
    console.error(
      `Your node version ${v} is not supported, please upgrade to ${MIN_NODE_VERSION}.`
    );

    process.exit(1);
  }
}

function setNodeTitle(name?: string) {
  if (process.title === 'node') {
    process.title = name || FRAMEWORK_NAME;
  }
}

function setNoDeprecation() {
  // @ts-ignore
  process.noDeprecation = '1';
}

export const processPrepare = () => {
  checkNodeVersion();
  setNodeTitle();
  setNoDeprecation();
};
