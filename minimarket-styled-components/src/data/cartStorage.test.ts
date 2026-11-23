import { beforeEach, describe, expect, it, vi } from 'vitest';
import { products } from './products';
import { readCart, saveCart } from './cartStorage';

const CART_STORAGE_KEY = 'nord-market-cart-v1';

describe('cart localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves product IDs and quantities and restores the matching current products', () => {
    const avocado = products.find((product) => product.id === 1);
    if (!avocado) throw new Error('Test product with ID 1 is missing');

    saveCart([{ product: avocado, quantity: 3 }]);

    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe('[{"productId":1,"quantity":3}]');
    expect(readCart()).toEqual([{ product: avocado, quantity: 3 }]);
  });

  it('returns an empty cart for malformed JSON or a non-array payload', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{broken json');
    expect(readCart()).toEqual([]);

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ productId: 1, quantity: 2 }));
    expect(readCart()).toEqual([]);
  });

  it('ignores unknown products and invalid quantities, and merges duplicate product IDs', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([
      { productId: 1, quantity: 2 },
      { productId: 1, quantity: 3 },
      { productId: 9999, quantity: 4 },
      { productId: 2, quantity: 0 },
      { productId: 3, quantity: -1 },
      { productId: 4, quantity: 1.5 },
      { productId: 5, quantity: Number.MAX_SAFE_INTEGER },
      { productId: '5', quantity: 2 },
      null,
    ]));

    const restored = readCart();
    expect(restored).toHaveLength(1);
    expect(restored[0]?.product.id).toBe(1);
    expect(restored[0]?.quantity).toBe(5);
  });

  it('does not crash when browser storage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage is blocked');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is full');
    });

    expect(readCart()).toEqual([]);
    expect(() => saveCart([])).not.toThrow();

    getItem.mockRestore();
    setItem.mockRestore();
  });
});
