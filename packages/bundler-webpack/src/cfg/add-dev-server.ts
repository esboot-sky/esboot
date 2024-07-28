import type { ConfigurationInstance } from '@dz-web/esboot';
import { merge } from '@dz-web/esboot-common/lodash';
import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';
import Config, { DevServer } from 'webpack-5-chain';

export async function addDevServer(
  cfg: ConfigurationInstance,
  webpackChain: Config
) {
  const {
    isDev,
    server: { port },
  } = cfg.config;

  if (!isDev) return;

  webpackChain.devServer
    .compress(true)
    .hot(true)
    .clientLogLevel('error')
    .port(port!)
    .historyApiFallback({
      disableDotRule: true,
    })
    // .onBeforeSetupMiddleware((devServerInstance) => {
    //   if (!devServerInstance) {
    //     throw new Error('webpack-dev-server is not defined');
    //   }
    //   devServerInstance.app.use(
    //     ...(devServer.setupMiddlewares?.(devServerInstance.app._router.stack) ??
    //       [])
    //   );
    // })
    .onListening((devServerInstance) => {
      if (!devServerInstance) {
        throw new Error('webpack-dev-server is not defined');
      }
      const { port } = devServerInstance.server?.address() as any;
      ready(
        `started server on [::]:${port}, url: ${kleur
          .underline()
          .green(`http://${address.ip()}:${port}`)} \n`
      );
    });
}
