import { cva } from '@dz-web/esboot-browser';

console.log(cva, 'cva');

export const langBtn = cva(
  ' flex h-[32px] w-[36px] items-center justify-center rounded-[4px] text-[14px] text-[#999] pointer ',
  {
    variants: {
      isChosen: {
        false: '',
        true: 'bg-[#fff] shadow-[0_0_8px_0_#d8d8d8]',
      },
    },
    defaultVariants: {
      isChosen: false,
    },
  },
);
