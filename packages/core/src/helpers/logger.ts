import kleur from 'kleur';
import esbootConfig from '@@/config';

const prefixes = {
  wait: kleur.cyan('wait') + '  -',
  error: kleur.red('error') + ' -',
  warn: kleur.yellow('warn') + '  -',
  ready: kleur.green('ready') + ' -',
  info: kleur.cyan('info') + '  -',
  event: kleur.magenta('event') + ' -',
  debug: kleur.gray('debug') + ' -',
};

export function wait(...message: any[]) {
  console.log(prefixes.wait, ...message);
}

export function error(...message: any[]) {
  console.error(prefixes.error, ...message);
}

export function warn(...message: any[]) {
  console.warn(prefixes.warn, ...message.map((s) => kleur.yellow(s)));
}

export function ready(...message: any[]) {
  console.log(prefixes.ready, ...message);
}

export function info(...message: any[]) {
  console.log(prefixes.info, ...message);
}

export function event(...message: any[]) {
  console.log(prefixes.event, ...message);
}

export function debug(...message: any[]) {
  if (process.env.DEBUG) {
    console.log(prefixes.debug, ...message);
  }
}

export function logBrand(...message: any[]) {
  const { version } = esbootConfig.compileTimeConfig;

  // console.log(
  //   `🚀 ${kleur.bold().bgGreen().black('  ESBoot  ')} v${version} \n`
  // );
  console.log(
    `🚀 ${kleur.bold().magenta(`ESBoot v${version}`)}  \n`
  );
}
