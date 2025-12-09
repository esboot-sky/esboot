import { createConfig } from '@dz-web/esboot/eslint';

export default createConfig({
  reactConfig: {
    rules: {
      '@dz-web/esboot/no-cross-platform-lib-imports': ['error', ['rsuite'], ['antd-mobile']],
    },
  },
});
