import { SHA256 } from 'crypto-js';
// 密码加密
export function passwordEncrypt(password: string) {
  return SHA256(password).toString().substring(0, 20);
}
