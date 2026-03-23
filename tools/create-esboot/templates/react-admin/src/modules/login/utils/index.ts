import { SHA256 } from 'crypto-js';

export function passwordEncrypt(password: string) {
  return SHA256(password).toString().substring(0, 20);
}
