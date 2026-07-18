/* eslint-disable no-console */
import kleur from 'kleur';
import { shellEnv } from '../environment';

const prefixes = {
  wait: `${kleur.cyan('wait')}  -`,
  error: `${kleur.red('error')} -`,
  warn: `${kleur.yellow('warn')}  -`,
  ready: `${kleur.green('ready')} -`,
  info: `${kleur.cyan('info')}  -`,
  event: `${kleur.magenta('event')} -`,
  debug: `${kleur.gray('debug')} -`,
};

export function wait(...message: string[]): void {
  console.log(prefixes.wait, ...message);
}

export function error(...message: string[]): void {
  console.error(prefixes.error, ...message);
}

export function warn(...message: string[]): void {
  console.warn(prefixes.warn, ...message.map(s => kleur.yellow(s)));
}

export function ready(...message: string[]): void {
  console.log(prefixes.ready, ...message);
}

export function info(...message: string[]): void {
  console.log(prefixes.info, ...message);
}

export function event(...message: string[]): void {
  console.log(prefixes.event, ...message);
}

export function debug(...message: string[]): void {
  if (shellEnv.get('DEBUG')) {
    console.log(prefixes.debug, ...message);
  }
}
