import VConsole from 'vconsole';

import { enableVConsole } from '@/constants/config';

if (enableVConsole && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const vConsole = new VConsole();
  vConsole.setSwitchPosition(0, 80);
}
