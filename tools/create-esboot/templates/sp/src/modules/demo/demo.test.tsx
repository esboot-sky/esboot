import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import Home from '@/modules/demo/app';

test('Demo', () => {
  const { container } = render(<Home />);

  expect(container.querySelector('p')?.textContent).toBe('close');
});
