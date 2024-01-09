import { getAbsolutePath as baseGetAbsolutePath } from '@dz-web/esboot-utils';

export const getAbsolutePath = (p: string) => baseGetAbsolutePath(p, require.resolve)