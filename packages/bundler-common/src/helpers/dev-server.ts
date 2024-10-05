import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';
import { getIpv4 } from './get-ipv4';

export const logDevServer = (port: number, isHttps: boolean) => {
  const ip = getIpv4();
  ready(
    `started server on [::]:${port}, url: ${kleur
      .underline()
      .green(`${isHttps ? 'https' : 'http'}://${ip}:${port}`)} \n`
  );
};
