import { test, expect } from 'vitest';
import { cva, cn, twMerge, clsx } from '../..';

test('tailwind-merge is exported', () => {
  expect(twMerge('text-sm', 'py-1', 'px-2', 'px-4', 'text-base')).toBe(
    'py-1 px-4 text-base'
  );
});

test('clsx is exported', () => {
  const num = 10;
  expect(clsx('foo', num > 11 ? 'bar' : 'baz')).toBe('foo baz');
});

test('cn is exported', () => {
  const num = 12;
  expect(
    clsx(
      'text-sm',
      'py-1',
      'px-2',
      'px-4',
      'text-base',
      num > 11 ? 'bar' : 'baz'
    )
  ).toBe('text-sm py-1 px-2 px-4 text-base bar');
});

test('cva is exported', () => {
  const button = cva(['font-semibold', 'border', 'rounded'], {
    variants: {
      intent: {
        primary: [
          'bg-blue-500',
          'text-white',
          'border-transparent',
          'hover:bg-blue-600',
        ],
        secondary: [
          'bg-white',
          'text-gray-800',
          'border-gray-400',
          'hover:bg-gray-100',
        ],
      },
      size: {
        small: ['text-sm', 'py-1', 'px-2'],
        medium: ['text-base', 'py-2', 'px-4'],
      },
    },
    compoundVariants: [
      {
        intent: 'primary',
        size: 'medium',
        className: 'uppercase',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  });

  expect(button()).toBe(
    'font-semibold border rounded bg-blue-500 text-white border-transparent hover:bg-blue-600 text-base py-2 px-4 uppercase'
  );
  expect(button({ intent: 'secondary', size: 'small' })).toBe(
    'font-semibold border rounded bg-white text-gray-800 border-gray-400 hover:bg-gray-100 text-sm py-1 px-2'
  );
});
