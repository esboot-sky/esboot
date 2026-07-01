import { merge } from '@dz-web/esboot-common/lodash';

export function getSvgrOptions(userOptions: Record<string, any> = {}, defaultOverrides: Record<string, any> = {}) {
  return merge(
    {
      icon: false,
      svgoConfig: {},
    },
    defaultOverrides,
    userOptions,
  );
}
