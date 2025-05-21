import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import Tailwindcss from './tailwindcss';

test('Tailwindcss is working', () => {
  const { container, getByText } = render(<Tailwindcss />);
  expect(getByText('Tailwindcss')).toBeInTheDocument();

  const element = container.querySelector('[data-testid="tailwindcss"]');
  expect(element).not.toBeNull();
  expect(element?.textContent).toBe('Tailwindcss');
  expect(element?.classList.contains('bg-red-500')).toBe(true);
  expect(element?.classList.contains('text-white')).toBe(true);
});
