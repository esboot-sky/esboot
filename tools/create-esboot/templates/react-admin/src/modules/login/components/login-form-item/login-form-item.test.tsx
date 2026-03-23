import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LoginFormItem from './login-form-item';

describe('loginFormItem', () => {
  it('should render icon, children and error message', () => {
    const { container } = render(
      <LoginFormItem icon="/icon.svg" error="invalid password">
        <input aria-label="password-input" />
      </LoginFormItem>,
    );

    expect(container.querySelector('img')).not.toBeNull();
    expect(screen.queryByLabelText('password-input')).not.toBeNull();
    expect(screen.queryByText('invalid password')).not.toBeNull();
  });

  it('should keep child interaction behavior', async () => {
    const onClick = vi.fn();

    render(
      <LoginFormItem>
        <button type="button" onClick={onClick}>
          retry
        </button>
      </LoginFormItem>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'retry' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
