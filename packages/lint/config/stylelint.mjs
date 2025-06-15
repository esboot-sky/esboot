import { fileURLToPath } from 'node:url';

const resolvePath = (p) => fileURLToPath(import.meta.resolve(p));

export default {
  extends: [resolvePath('@dz-web/esboot-stylelint-config')],
};
