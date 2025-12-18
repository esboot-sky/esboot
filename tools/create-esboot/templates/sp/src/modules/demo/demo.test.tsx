import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import Home from '@/modules/demo/app';

it('demo', () => {
  const { container } = render(<Home />);

  expect(container.querySelector('p')?.textContent).toBe('close');
});
