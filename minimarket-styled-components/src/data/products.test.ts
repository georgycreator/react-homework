import { describe, expect, it } from 'vitest';
import { formatProductCount, formatPrice, products } from './products';

describe('product formatting', () => {
  const cases: Array<[number, string]> = [
    [0, '0 товаров'],
    [1, '1 товар'],
    [2, '2 товара'],
    [4, '4 товара'],
    [5, '5 товаров'],
    [11, '11 товаров'],
    [14, '14 товаров'],
    [21, '21 товар'],
    [22, '22 товара'],
    [25, '25 товаров'],
  ];

  it.each(cases)('formats the count %i with the correct Russian noun form', (count, expected) => {
    expect(formatProductCount(count)).toBe(expected);
  });

  it('formats product prices as Russian rubles without fractional digits', () => {
    expect(formatPrice(200)).toContain('200');
    expect(formatPrice(0)).toContain('0');
  });

  it('uses the researched reference prices for the demo catalog', () => {
    expect(Object.fromEntries(products.map(({ id, price }) => [id, price]))).toEqual({
      1: 200,
      2: 190,
      3: 110,
      4: 69,
      5: 120,
      6: 230,
      7: 600,
      8: 500,
      9: 110,
      10: 200,
      11: 129,
      12: 200,
    });
  });

  it('keeps all customer-facing product text in Russian', () => {
    const oliveOil = products.find((product) => product.id === 7);

    expect(oliveOil?.description).toBe('Масло высшей категории, полученное холодным отжимом.');

    for (const product of products) {
      const customerFacingText = [
        product.name,
        product.category,
        product.description,
        product.badge ?? '',
      ].join(' ');

      expect(customerFacingText).not.toMatch(/[A-Za-z]{2,}/);
    }
  });
});
