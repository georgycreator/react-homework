import { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { Product } from '../../data/products';
import { categories } from '../../data/products';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { Input } from '../ui/Input';
import { Grid } from '../ui/Grid';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const CatalogToolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  align-items: end;
  gap: 18px;
  margin: 24px 0 18px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? theme.colors.primaryText : theme.colors.textMuted)};
  font-size: 11px;
  font-weight: 750;
  transition:
    background ${({ theme }) => theme.motion.fast},
    border-color ${({ theme }) => theme.motion.fast},
    color ${({ theme }) => theme.motion.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultsLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 14px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 11px;
  font-weight: 650;
`;

const EmptyCard = styled(Card)`
  display: grid;
  min-height: 300px;
  place-items: center;
  text-align: center;
`;

const EmptyIcon = styled.div`
  display: grid;
  width: 76px;
  height: 76px;
  margin: 0 auto 16px;
  place-items: center;
  border-radius: 26px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 34px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  letter-spacing: -0.04em;
`;

const EmptyDescription = styled.p`
  max-width: 350px;
  margin: 8px auto 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

interface CatalogProps {
  products: Product[];
  loading?: boolean;
  pendingIds?: ReadonlySet<number>;
  onAdd: (product: Product) => void;
}

export function Catalog({ products, loading = false, pendingIds = new Set<number>(), onAdd }: CatalogProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('Все');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU');

    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Все' || product.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${product.name} ${product.category} ${product.description}`
          .toLocaleLowerCase('ru-RU')
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, products, query]);

  return (
    <section id="catalog" aria-labelledby="catalog-title">
      <CatalogToolbar>
        <Input
          id="catalog-search"
          type="search"
          label="Что будем искать?"
          placeholder="Например, авокадо или кофе"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ResultsLine aria-live="polite">
          {loading ? 'Подбираем продукты…' : `Найдено: ${filteredProducts.length}`}
        </ResultsLine>
      </CatalogToolbar>

      <CategoryList role="group" aria-label="Фильтр по категориям">
        {categories.map((category) => (
          <CategoryButton
            key={category}
            type="button"
            $active={activeCategory === category}
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryList>

      {loading ? (
        <ProductSkeleton />
      ) : filteredProducts.length > 0 ? (
        <Grid aria-label="Список товаров">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={pendingIds.has(product.id)}
              onAdd={onAdd}
            />
          ))}
        </Grid>
      ) : (
        <EmptyCard $padding="lg">
          <div>
            <EmptyIcon aria-hidden="true">🧺</EmptyIcon>
            <EmptyTitle>Пока ничего не нашлось</EmptyTitle>
            <EmptyDescription>
              Попробуйте изменить запрос или выбрать другую категорию — нужный продукт может быть рядом.
            </EmptyDescription>
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setActiveCategory('Все');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </EmptyCard>
      )}
    </section>
  );
}
