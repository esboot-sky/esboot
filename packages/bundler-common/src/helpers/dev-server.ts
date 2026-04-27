import { ready } from '@dz-web/esboot-common/helpers';
import kleur from '@dz-web/esboot-common/kleur';

export const logDevServer = (port: number, isHttps: boolean, options: { ipv4: string } = { ipv4: 'localhost' }) => {
  const { ipv4 } = options;
  ready(
    `started server on [::]:${port}, url: ${kleur
      .underline()
      .green(`${isHttps ? 'https' : 'http'}://${ipv4}:${port}`)} \n`
  );
};
