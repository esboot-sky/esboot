import { render } from '@testing-library/react';
import { expect, it } from 'vitest';

import Detail from './detail';

it('detail Comp', () => {
  const { container } = render(<Detail />);

  expect(container?.textContent).equals('detail');
});

export function renderDetail(a: Record<string, any>) {
  a.b = 'prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]prefer-arrow-callback [error, { allowNamedFunctions: true }]';
}
