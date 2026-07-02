import { PluginHooks } from '@dz-web/esboot-common/plugin';
import type { Plugin } from '@dz-web/esboot-common/plugin';
import kleur from '@dz-web/esboot-common/kleur';
import path from 'node:path';
import { definePlugin } from '../index';

export interface EntryLogPluginOptions {
  /**
   * Whether to log only in development mode.
   * @default true
   */
  devOnly?: boolean;
}

export function entryLogPlugin(options: EntryLogPluginOptions = {}): Plugin {
  const { devOnly = true } = options;

  return definePlugin({
    key: 'entry-log',
    [PluginHooks.afterCompile]: (cfg, ctx) => {
      const { isDev } = cfg;
      if (devOnly && !isDev) {
        return;
      }

      const entries = Object.entries(cfg.entry);
      if (entries.length === 0) {
        ctx.logger.info(kleur.yellow('No compile entries found.'));
        return;
      }

      const totalPages = entries.length;
      const platform = process.env.ESBOOT_PLATFORM;
      const pageType = process.env.ESBOOT_PAGE_TYPE;

      let modeInfo = `${kleur.gray('Total: ')}${kleur.bold().white(`${totalPages} page${totalPages > 1 ? 's' : ''}`)}`;
      if (platform) {
        modeInfo += `${kleur.gray(', Platform: ')}${kleur.bold().yellow(platform)}`;
      }
      if (pageType) {
        modeInfo += `${kleur.gray(', PageType: ')}${kleur.bold().magenta(pageType)}`;
      }

      let output = '\n' + `${kleur.bold().green('Compile Entry Details')} ${kleur.gray('(')}${modeInfo}${kleur.gray(')')}:` + '\n';
      output += kleur.gray('==================================================') + '\n';

      entries.forEach(([name, entryInfo], index) => {
        const relativeEntry = path.relative(cfg.cwd, entryInfo.entry);
        output += `${kleur.bold().cyan(`Page ${index + 1}: ${name}`)}\n`;
        if (entryInfo.url) {
          output += `  ${kleur.gray('URL:')}       ${kleur.underline().blue(entryInfo.url)}\n`;
        }
        output += `  ${kleur.gray('Entry:')}     ${kleur.cyan(relativeEntry)}\n`;
        if (entryInfo.tpl) {
          output += `  ${kleur.gray('Template:')}  ${kleur.yellow(entryInfo.tpl)}\n`;
        }
        if (entryInfo.title) {
          output += `  ${kleur.gray('Title:')}     ${kleur.white(entryInfo.title)}\n`;
        }

        // Print separator if it's not the last page
        if (index < totalPages - 1) {
          output += '\n' + kleur.gray('--------------------------------------------------') + '\n\n';
        } else {
          output += '\n';
        }
      });

      output += kleur.gray('==================================================');

      console.log(output);
    },
  });
}
