import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

interface LogDevServerParams {
  port: number;
  isHttps: boolean;
  ip: string;
}

export function logDevServer(options: LogDevServerParams): void {
  const { port, isHttps, ip } = options;

  ready(
    `started server on [::]:${port}, url: ${kleur
      .underline()
      .green(`${isHttps ? 'https' : 'http'}://${ip}:${port}`)} \n`,
  );
}
