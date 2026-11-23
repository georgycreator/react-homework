import type { BadgeTone, ProductAccent } from '../styles/theme';

export type ProductCategory = 'Фрукты и овощи' | 'Молочное' | 'Бакалея' | 'Напитки' | 'Сладости';

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  description: string;
  emoji: string;
  accent: ProductAccent;
  badge?: string;
  badgeTone?: BadgeTone;
}

export const categories = [
  'Все',
  'Фрукты и овощи',
  'Молочное',
  'Бакалея',
  'Напитки',
  'Сладости',
] as const;

export const products: Product[] = [
  {
    id: 1,
    name: 'Авокадо хаас',
    category: 'Фрукты и овощи',
    price: 200,
    unit: '1 шт.',
    description: 'Спелый, сливочный, для тостов и салатов.',
    emoji: '🥑',
    accent: 'leaf',
    badge: 'Хит',
    badgeTone: 'success',
  },
  {
    id: 2,
    name: 'Мандарины',
    category: 'Фрукты и овощи',
    price: 190,
    unit: '1 кг',
    description: 'Сочные и сладкие, с тонкой кожурой.',
    emoji: '🍊',
    accent: 'sun',
    badge: 'Сезонное',
    badgeTone: 'warning',
  },
  {
    id: 3,
    name: 'Молоко овсяное',
    category: 'Молочное',
    price: 110,
    unit: '1 л',
    description: 'Нежная текстура, без добавленного сахара.',
    emoji: '🥛',
    accent: 'sky',
  },
  {
    id: 4,
    name: 'Йогурт греческий',
    category: 'Молочное',
    price: 69,
    unit: '170 г',
    description: 'Густой йогурт с высоким содержанием белка.',
    emoji: '🥣',
    accent: 'berry',
    badge: 'Новинка',
    badgeTone: 'accent',
  },
  {
    id: 5,
    name: 'Хлеб зерновой',
    category: 'Бакалея',
    price: 120,
    unit: '400 г',
    description: 'На закваске, с семенами льна и тыквы.',
    emoji: '🍞',
    accent: 'sun',
  },
  {
    id: 6,
    name: 'Паста ригатони',
    category: 'Бакалея',
    price: 230,
    unit: '500 г',
    description: 'Итальянская паста из твёрдых сортов пшеницы.',
    emoji: '🍝',
    accent: 'sun',
  },
  {
    id: 7,
    name: 'Оливковое масло',
    category: 'Бакалея',
    price: 600,
    unit: '500 мл',
    description: 'Масло высшей категории, полученное холодным отжимом.',
    emoji: '🫒',
    accent: 'leaf',
    badge: 'Выбор шефа',
    badgeTone: 'success',
  },
  {
    id: 8,
    name: 'Кофе в зёрнах',
    category: 'Напитки',
    price: 500,
    unit: '250 г',
    description: 'Шоколадные ноты и мягкая карамельная сладость.',
    emoji: '☕',
    accent: 'berry',
  },
  {
    id: 9,
    name: 'Чай жасминовый',
    category: 'Напитки',
    price: 110,
    unit: '80 г',
    description: 'Лёгкий зелёный чай с цветочным ароматом.',
    emoji: '🍵',
    accent: 'leaf',
  },
  {
    id: 10,
    name: 'Шоколад 72%',
    category: 'Сладости',
    price: 200,
    unit: '90 г',
    description: 'Тёмный шоколад с выразительным вкусом какао.',
    emoji: '🍫',
    accent: 'berry',
    badge: 'Без лишнего',
    badgeTone: 'neutral',
  },
  {
    id: 11,
    name: 'Мёд цветочный',
    category: 'Сладости',
    price: 129,
    unit: '250 г',
    description: 'Ароматный мёд с небольших пасек.',
    emoji: '🍯',
    accent: 'sun',
  },
  {
    id: 12,
    name: 'Сыр гауда',
    category: 'Молочное',
    price: 200,
    unit: '200 г',
    description: 'Молодой полутвёрдый сыр с нежным вкусом.',
    emoji: '🧀',
    accent: 'sun',
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
}


/** Returns a Russian noun form for a product count (e.g. 1 товар, 2 товара, 5 товаров). */
export function formatProductCount(count: number): string {
  const absoluteCount = Math.abs(Math.trunc(count));
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} товаров`;
  if (lastDigit === 1) return `${count} товар`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} товара`;
  return `${count} товаров`;
}
