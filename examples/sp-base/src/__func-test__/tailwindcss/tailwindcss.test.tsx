import { render } from '@testing-library/react';
import { test, expect } from 'vitest';

import Tailwindcss from './tailwindcss';

test('Tailwindcss is working', () => {
  const { container, getByText, getByTestId } = render(<Tailwindcss />);
  expect(getByText('Tailwindcss')).toBeInTheDocument();

  expect(container).toMatchSnapshot();

  const element = getByTestId('tailwindcss');
  expect(element).toHaveStyle('color: white');
});
