import { getIpv4, ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

export function logDevServer(port: number, isHttps: boolean): void {
  const ip = getIpv4();
  ready(
    `started server on [::]:${port}, url: ${kleur
      .underline()
      .green(`${isHttps ? 'https' : 'http'}://${ip}:${port}`)} \n`,
  );
}
