import { Command } from 'commander';
import { upgradeV4 } from './upgrade-v4.js';
import kleur from 'kleur';

const program = new Command();

program
  .name('esboot-codemod')
  .description('ESBoot codemod and migration CLI tool')
  .version('4.3.3');

program
  .command('upgrade-v4')
  .description('Upgrade an ESBoot v3 project to v4')
  .option('--cwd <path>', 'working directory', process.cwd())
  .option('--no-tailwind3', 'disable Tailwind v3 compatibility (upgrades to Tailwind v4)')
  .action(async (options) => {
    try {
      const result = await upgradeV4({
        cwd: options.cwd,
        keepTailwind3: options.tailwind3,
      });
      if (result === 'already-latest') {
        console.log(kleur.green().bold('\nℹ️ Your project is already on the latest ESBoot version (v4+).'));
      } else if (result === 'not-esboot-project') {
        console.log(kleur.yellow().bold('\nℹ️ Skipped: current directory is not an ESBoot project.'));
      } else {
        console.log(kleur.green().bold('\n🎉 Migration completed successfully!'));
      }
    } catch (err: any) {
      console.error(kleur.red().bold(`\n❌ Migration failed: ${err.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
