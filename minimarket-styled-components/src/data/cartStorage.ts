import { products } from './products';
import type { CartLine } from './cart';

const CART_STORAGE_KEY = 'nord-market-cart-v1';
const MAX_RESTORED_QUANTITY = Math.floor(
  Number.MAX_SAFE_INTEGER / (products.length * Math.max(...products.map((product) => product.price))),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Restores only known products and positive safe-integer quantities. */
export function readCart(): CartLine[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    const quantities = new Map<number, number>();

    for (const entry of parsed) {
      if (!isRecord(entry)) continue;

      const productId = entry.productId;
      const quantity = entry.quantity;

      if (
        typeof productId !== 'number' ||
        !Number.isSafeInteger(productId) ||
        typeof quantity !== 'number' ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0 ||
        quantity > MAX_RESTORED_QUANTITY
      ) {
        continue;
      }

      const exists = products.some((product) => product.id === productId);
      if (!exists) continue;

      quantities.set(
        productId,
        Math.min(MAX_RESTORED_QUANTITY, (quantities.get(productId) ?? 0) + quantity),
      );
    }

    return products.flatMap((product) => {
      const quantity = quantities.get(product.id);
      return quantity ? [{ product, quantity }] : [];
    });
  } catch {
    // Storage can be disabled or contain invalid JSON; the shop still works with an empty cart.
    return [];
  }
}

/** Persists only product IDs and quantities, not duplicated product objects. */
export function saveCart(items: CartLine[]): void {
  try {
    const payload = items.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
    }));
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // The current session remains usable when localStorage is unavailable or full.
  }
}
