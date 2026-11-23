import type { Product } from './products';

export interface CartLine {
  product: Product;
  quantity: number;
}
