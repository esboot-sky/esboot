import process from 'node:process';
import { $ } from 'bun';
import pkg from '../lerna.json' with { type: 'json' };

const { version } = pkg;

const prompt = `Current verison is ${version} Confirm (y/n): to restore version`;
Bun.stdout.write(prompt);
for await (const line of console) {
  if (line.toString().trim() === 'y') {
    await $`git tag -d v${version}`;
    console.log('delete local tag');

    await $`git push origin :refs/tags/v${version}`;
    console.log('delete remote tag');
    break;
  }
  else {
    console.log('cancel restore version');
    process.exit(0);
  }
}
