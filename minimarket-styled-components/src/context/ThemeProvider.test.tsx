import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { ThemeProvider, useThemeMode } from './ThemeProvider';

function ThemeProbe() {
  const { activeTheme, preference, setPreference } = useThemeMode();
  return (
    <div>
      <span data-testid="active-theme">{activeTheme}</span>
      <span data-testid="preference">{preference}</span>
      <button type="button" onClick={() => setPreference('berry')}>Выбрать ягодную тему</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('uses the system preference when no saved preference exists', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('active-theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('preference')).toHaveTextContent('system');
  });

  it('persists a manually selected theme', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Выбрать ягодную тему' }));

    expect(screen.getByTestId('active-theme')).toHaveTextContent('berry');
    expect(window.localStorage.getItem('nord-market-theme')).toBe('berry');
  });
});
