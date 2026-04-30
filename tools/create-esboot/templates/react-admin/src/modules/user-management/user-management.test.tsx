import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import UserManagement from './user-management';

describe('userManagement', () => {
  it('should render a simple placeholder', () => {
    render(<UserManagement />);

    expect(screen.getByText('user-management')).not.toBeNull();
  });
});
