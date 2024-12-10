import { test, expect } from 'vitest';
import { cva, cn } from '..';

test('cn', () => {
  expect(cn('foo', 'bar')).toBe('foo bar');
});

test('cva is exported', () => {
  const button = cva({
    base: 'bg-blue-500 text-white',
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
  });

  expect(button()).toBe('bg-blue-500 text-white');
  expect(button({ size: 'sm' })).toBe('bg-blue-500 text-white text-sm');
  expect(button({ size: 'md' })).toBe('bg-blue-500 text-white text-base');
  expect(button({ size: 'lg' })).toBe('bg-blue-500 text-white text-lg');
});
