import { clamp } from 'lodash-es';

import { PC_FONT_SIZE_MAPPER } from '@pc/constants/config';

export function getRealPCNativeFontSizee(pcFontSize: number) {
  const delta = PC_FONT_SIZE_MAPPER[pcFontSize] || 0;

  return clamp(16 + delta, 10, 18);
}
