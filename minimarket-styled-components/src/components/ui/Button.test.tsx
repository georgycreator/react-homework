import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { Button } from './Button';

function renderWithTheme(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Button', () => {
  it('renders its content', () => {
    renderWithTheme(<Button>Добавить</Button>);
    const button = screen.getByRole('button', { name: 'Добавить' });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('$variant');
    expect(button).not.toHaveAttribute('$size');
  });

  it('disables itself and exposes the busy state while loading', () => {
    renderWithTheme(<Button loading>Добавляем</Button>);
    const button = screen.getByRole('button', { name: 'Добавляем' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders as an anchor when the as prop is set', () => {
    renderWithTheme(
      <Button as="a" href="#catalog" variant="outline">
        Смотреть каталог
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Смотреть каталог' });
    expect(link).toHaveAttribute('href', '#catalog');
    expect(link).not.toHaveAttribute('variant');
    expect(link).not.toHaveAttribute('$variant');
    expect(link).not.toHaveAttribute('$size');
  });

  it('prevents navigation when a polymorphic link is disabled or loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(
      <Button as="a" href="#catalog" loading onClick={onClick}>
        Загружаем ссылку
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Загружаем ссылку' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
