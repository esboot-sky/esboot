import webpack from 'webpack';
import kleur from 'kleur';

import { ready, logBrand } from '@@/helpers/logger';

import { Environment } from '@@webpack/config/environment';
import getWebpackConfig from '@@webpack/config/config';

export async function runBuild() {
  const watch = true;
  const cfg = await getWebpackConfig({ env: Environment.prod });
  const compiler = webpack(cfg);
  let closeWatching: webpack.Watching['close'];

  logBrand();

  const handler: Parameters<typeof compiler.run>[0] = async (err, stats) => {
    const statsJson = stats?.toJson('minimal');
    const errors = statsJson?.errors ?? [];
    const errorsCount = statsJson?.errorsCount ?? 0;
    // const warnings = statsJson?.warnings ?? [];

    if (err || stats?.hasErrors()) {
      console.error(
        kleur.red().bold(`Failed to compile with ${errorsCount} errors \n`)
      );

      errors.forEach((err, index) => {
        const { message, moduleName = '', loc = '' } = err;
        console.log(
          `${kleur.bgRed().bold(` ERROR ${index + 1} `)} in ${kleur.white(
            moduleName
          )} ${kleur.green(loc)} \n`
        );
        console.log(`${message} \n`);
      });
      process.exit(1);
    }

    // if (stats?.hasWarnings()) {
    // }

    if (watch) compiler.close(() => {});
  };

  if (watch) {
    const watching = compiler.watch(
      // webpackConfig.watchOptions || {},
      {},
      handler
    );

    closeWatching = watching.close.bind(watching);
  } else {
    compiler.run(handler);
  }
}
