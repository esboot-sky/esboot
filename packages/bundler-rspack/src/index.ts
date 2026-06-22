import type { BaseBundlerOptions } from '@dz-web/esboot';

import type { CustomRspackConfiguration } from './cfg/types';
import process from 'node:process';
import { Bundler } from '@dz-web/esboot';
import { error, warn } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';
import { rspack } from '@rspack/core';

import { RspackDevServer } from '@rspack/dev-server';
import { getRspackCfg } from './cfg';

export class BundlerRspack extends Bundler {
  name = 'rspack';

  constructor(options: BaseBundlerOptions) {
    super(options);
  }

  getName(): string {
    return this.name;
  }

  async dev(): Promise<void> {
    // console.time('Create config');
    const rspackCfg = this.onModifyBundlerConfig<CustomRspackConfiguration>(
      await getRspackCfg(this.cfg),
    );
    // console.timeEnd('Create config');

    const compiler = rspack(rspackCfg);

    const devServer = new RspackDevServer((rspackCfg.devServer || {}) as any, compiler);

    try {
      await devServer.start();
      this.onAfterCompile();
    }
    catch (err: unknown) {
      error((err as Error).message);
    }
  }

  async build(): Promise<void> {
    const rspackCfg = this.onModifyBundlerConfig<CustomRspackConfiguration>(
      await getRspackCfg(this.cfg),
    );
    const compiler = rspack(rspackCfg);

    compiler.run((err, stats) => {
      if (err) {
        console.error(err.stack || err);
        return;
      }

      const info = stats?.toJson();

      if (stats?.hasErrors()) {
        const errors = info?.errors ?? [];
        console.error(
          kleur.red().bold(`Failed to compile with ${errors.length} errors \\n`),
        );

        for (const [index, err] of errors.entries()) {
          console.error(
            `${kleur.bgRed().bold(` ERROR ${index + 1} `)} ${kleur.white(
              err.message,
            )} \\n`,
          );
        }
      }

      if (stats?.hasWarnings()) {
        for (const _warn of info?.warnings ?? []) {
          warn(_warn.message);
        }
      }

      compiler.close((closeErr) => {
        if (closeErr) {
          console.error(closeErr);
          process.exit(1);
        }
        this.onAfterCompile();
      });
    });
  }
}
export * from './cfg';
export * from './types';
