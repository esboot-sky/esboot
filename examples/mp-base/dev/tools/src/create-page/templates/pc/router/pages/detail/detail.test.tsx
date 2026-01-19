import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import Detail from './detail';

test('Detail Comp', () => {
  const { container } = render(<Detail />);

  expect(container?.textContent).equals('detail');
});
