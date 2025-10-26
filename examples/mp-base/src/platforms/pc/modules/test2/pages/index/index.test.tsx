import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import { store } from '../../model/store';
import Index from './index';

const mockMessages = {
  'test2.title': 'Test2 Title',
};

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <IntlProvider messages={mockMessages} locale="en">
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
}

it('index component should render correctly', () => {
  const { container } = render(
    <TestWrapper>
      <Index />
    </TestWrapper>,
  );

  const link = container.querySelector('a')!;
  expect(link).toHaveStyle({ fontSize: '16px' });
  expect(link.getAttribute('href')).toBe('/detail');

  expect(screen.getByText('375 width in 750 design')).toBeInTheDocument();
});
