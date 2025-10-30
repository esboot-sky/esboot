import { memo } from 'react';

/**
 * 仅用于解决memo的类型推导问题，没特别的作用
 */
// export const genericMemo: <T>(component: T) => T = memo;

/**
 * 仅用于解决memo的类型推导问题，没特别的作用, memo现已支持泛型，不需要了
 * @deprecated
 */
export const genericMemo = memo;
