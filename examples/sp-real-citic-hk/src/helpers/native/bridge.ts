import { bridge as DZBridge } from '@dz-web/bridge';
import * as DZActions from '@dz-web/bridge/actions/mobile';
// import { bridge as PABridge, isPAhkebankApp } from '@dz-web/bridge-pingan';
// import * as PActions from '@dz-web/bridge-pingan/actions/mobile';

import { useBridgeMock } from '@/constants/config';

const bridge = DZBridge;
// const bridge = isPAhkebankApp ? PABridge : DZBridge;
// const actions: typeof PActions | (typeof DZActions & { _fullscreen: () => void }) = isPAhkebankApp
//   ? PActions
//   : {
//       ...DZActions,
//       _fullscreen: () => undefined,
//     };
const actions = {
  ...DZActions,
  _fullscreen: () => undefined,
}
export const initBridge = async () => {
  if (useBridgeMock) {
    const mockbridge = await import('@dz-web/bridge/platforms/mock');
    bridge.init(mockbridge.createBridge());
  } else {
    const { createBridge } = await import('@dz-web/bridge/platforms/webview');
    bridge.init(createBridge());
  }
};

export { bridge, actions };
