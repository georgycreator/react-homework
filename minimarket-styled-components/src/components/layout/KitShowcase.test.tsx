import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { KitShowcase } from './KitShowcase';

describe('KitShowcase', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('finishes the loading demonstration after 900 milliseconds', () => {
    vi.useFakeTimers();

    render(
      <ThemeProvider>
        <KitShowcase />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Показать загрузку' }));

    expect(screen.getByRole('button', { name: 'Загрузка…' })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByRole('button', { name: 'Показать загрузку' })).toBeEnabled();
  });
});
