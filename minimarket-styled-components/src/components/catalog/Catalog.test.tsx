import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { products } from '../../data/products';
import { Catalog } from './Catalog';

function renderCatalog() {
  const onAdd = vi.fn();
  render(
    <ThemeProvider>
      <Catalog products={products} onAdd={onAdd} />
    </ThemeProvider>,
  );
  return { onAdd };
}

describe('Catalog', () => {
  it('filters products by category', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.click(screen.getByRole('button', { name: 'Молочное' }));

    expect(screen.getByText('Молоко овсяное')).toBeInTheDocument();
    expect(screen.getByText('Йогурт греческий')).toBeInTheDocument();
    expect(screen.queryByText('Авокадо хаас')).not.toBeInTheDocument();
  });

  it('shows an empty state and allows resetting filters', async () => {
    const user = userEvent.setup();
    renderCatalog();

    await user.type(screen.getByRole('searchbox', { name: 'Что будем искать?' }), 'такого продукта нет');

    expect(screen.getByText('Пока ничего не нашлось')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }));
    expect(screen.getByText('Авокадо хаас')).toBeInTheDocument();
  });


  it('trims the search query and matches product names without case sensitivity', async () => {
    const user = userEvent.setup();
    renderCatalog();

    const search = screen.getByRole('searchbox', { name: 'Что будем искать?' });
    await user.type(search, '  КОФЕ  ');

    expect(screen.getByText('Кофе в зёрнах')).toBeInTheDocument();
    expect(screen.queryByText('Авокадо хаас')).not.toBeInTheDocument();
  });

  it('calls the add handler for the selected product', async () => {
    const user = userEvent.setup();
    const { onAdd } = renderCatalog();

    const addButton = screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' });
    await user.click(addButton);

    const firstProduct = products[0];
    expect(firstProduct).toBeDefined();
    expect(onAdd).toHaveBeenCalledWith(firstProduct);
  });
});
