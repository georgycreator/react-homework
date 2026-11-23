import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { Input } from './Input';

function renderWithTheme(ui: ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Input', () => {
  it('uses .attrs() defaults for search fields', () => {
    renderWithTheme(
      <Input label="Поиск" type="search" placeholder="Найти товар" />,
    );

    const search = screen.getByRole('searchbox', { name: 'Поиск' });
    expect(search).toHaveAttribute('type', 'search');
    expect(search).toHaveAttribute('autocomplete', 'off');
  });

  it('allows a caller to override an .attrs() default', () => {
    renderWithTheme(
      <Input label="Поиск" type="search" autoComplete="on" />,
    );

    expect(screen.getByRole('searchbox', { name: 'Поиск' })).toHaveAttribute('autocomplete', 'on');
  });

  it('keeps regular text inputs as text fields', () => {
    renderWithTheme(<Input label="Название" placeholder="Продукт" />);

    expect(screen.getByRole('textbox', { name: 'Название' })).toHaveAttribute('type', 'text');
  });
});
