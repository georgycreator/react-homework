import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { ThemeProvider } from './context/ThemeProvider';
import { formatPrice, products } from './data/products';

function renderApp() {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  );
}

async function waitForCatalog() {
  await screen.findByRole(
    'button',
    { name: 'Добавить Авокадо хаас в корзину' },
    { timeout: 3_000 },
  );
}

async function waitForCartCount(count: number, label: string) {
  return screen.findByRole(
    'button',
    { name: `Открыть корзину, ${count} ${label}` },
    { timeout: 3_000 },
  );
}

describe('NORD Market basket flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('shows the current catalog price in the featured product poster', async () => {
    renderApp();

    const featuredAvocado = products.find((product) => product.id === 1);
    if (!featuredAvocado) throw new Error('Featured product is missing');

    const featuredPrice = await screen.findByTestId('featured-product-price');
    // Compare raw text to avoid false negatives caused by non-breaking spaces
    // inserted by Intl.NumberFormat in Russian currency formatting.
    expect(featuredPrice.textContent).toBe(formatPrice(featuredAvocado.price));
    expect(featuredPrice.textContent).toContain('200');
  });

  it('adds multiple products, recalculates line and basket totals, and removes items at zero', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForCatalog();

    await user.click(screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' }));
    await user.click(screen.getByRole('button', { name: 'Добавить Мандарины в корзину' }));

    expect(screen.getByRole('button', { name: 'Добавляем Авокадо хаас' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Добавляем Мандарины' })).toBeDisabled();

    const trigger = await waitForCartCount(2, 'товара');
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /Ваша корзина/ });
    expect(within(dialog).getByText('Авокадо хаас')).toBeInTheDocument();
    expect(within(dialog).getByText('Мандарины')).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Итого');
    expect(dialog).toHaveTextContent('390');

    await user.click(within(dialog).getByRole('button', { name: 'Увеличить количество: Авокадо хаас' }));
    expect(dialog).toHaveTextContent('Сумма: 400');
    expect(dialog).toHaveTextContent('590');
    expect(await waitForCartCount(3, 'товара')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Уменьшить количество: Авокадо хаас' }));
    expect(dialog).toHaveTextContent('Сумма: 200');
    expect(dialog).toHaveTextContent('390');

    await user.click(within(dialog).getByRole('button', { name: 'Удалить из корзины: Авокадо хаас' }));
    expect(within(dialog).queryByText('Авокадо хаас')).not.toBeInTheDocument();
    expect(dialog).toHaveTextContent('190');

    await user.click(within(dialog).getByRole('button', { name: 'Удалить из корзины: Мандарины' }));
    expect(within(dialog).getByRole('status')).toHaveTextContent('Здесь пока пусто');
    expect(await waitForCartCount(0, 'товаров')).toBeInTheDocument();
  });

  it('does not schedule duplicate additions while a product is already loading', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForCatalog();

    await user.dblClick(screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' }));

    expect(await waitForCartCount(1, 'товар')).toBeInTheDocument();
  });

  it('increments an existing cart line when the same product is added again later', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForCatalog();

    await user.click(screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' }));
    await screen.findByRole('button', { name: 'Добавить Авокадо хаас в корзину' }, { timeout: 3_000 });

    await user.click(screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' }));
    const trigger = await waitForCartCount(2, 'товара');

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: /Ваша корзина/ });
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(1);
    expect(dialog).toHaveTextContent('Сумма: 400');
    expect(dialog).toHaveTextContent('400');
  });

  it('restores the basket after the app is mounted again', async () => {
    const user = userEvent.setup();
    const view = renderApp();
    await waitForCatalog();

    await user.click(screen.getByRole('button', { name: 'Добавить Авокадо хаас в корзину' }));
    await waitForCartCount(1, 'товар');

    view.unmount();
    renderApp();

    const trigger = await waitForCartCount(1, 'товар');
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: /Ваша корзина/ })).toHaveTextContent('Авокадо хаас');
  });

  it('closes the cart with Escape and when the user clicks outside', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitForCatalog();

    const trigger = screen.getByRole('button', { name: 'Открыть корзину, 0 товаров' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: /Ваша корзина/ });
    expect(within(dialog).getByRole('button', { name: 'Закрыть корзину' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('heading', { name: 'Сегодня в корзину' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
