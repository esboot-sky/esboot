import wrapI18n from '@/hoc/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import App from './app';

it('demo', () => {
  const { container } = render(
    wrapI18n(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    ),
  );

  expect(container).toBeDefined();
});


