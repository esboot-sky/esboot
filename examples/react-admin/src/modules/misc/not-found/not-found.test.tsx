import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound from './not-found';

describe('NotFound', () => {
  it('should render 404 text', () => {
    render(<NotFound />);

    expect(screen.queryByText('404')).not.toBeNull();
  });
});
