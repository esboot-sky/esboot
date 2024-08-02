import type { SayHi } from '@/types/multi-platforms';

export const sayHi: SayHi = (name) => {
  console.log(`hello ${name} from mobile browser`);
};
