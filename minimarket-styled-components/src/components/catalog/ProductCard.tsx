import styled from 'styled-components';
import type { Product } from '../../data/products';
import { formatPrice } from '../../data/products';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

const ProductShell = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
    box-shadow: ${({ theme }) => theme.shadows.card};
  }
`;

const ProductArtwork = styled.div<{ $accent: Product['accent'] }>`
  position: relative;
  display: grid;
  min-height: 168px;
  place-items: center;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $accent }) => theme.productAccents[$accent].background};

  &::before,
  &::after {
    position: absolute;
    width: 148px;
    height: 148px;
    border: 1px solid ${({ theme, $accent }) => theme.productAccents[$accent].foreground};
    border-radius: 50%;
    content: '';
    opacity: 0.11;
  }

  &::before {
    transform: translate(-34px, 42px);
  }

  &::after {
    width: 108px;
    height: 108px;
    transform: translate(46px, -38px);
  }
`;

const ProductEmoji = styled.span`
  position: relative;
  z-index: 1;
  font-size: 76px;
  line-height: 1;
  filter: drop-shadow(0 13px 12px ${({ theme }) => theme.colors.shadow});
  transition: transform ${({ theme }) => theme.motion.normal};

  ${ProductShell}:hover & {
    transform: translateY(-5px) rotate(-4deg) scale(1.04);
  }
`;

const ProductBadge = styled.div`
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
`;

const ProductBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px 4px 3px;
`;

const Category = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.075em;
  text-transform: uppercase;
`;

const ProductName = styled.h3`
  margin: 5px 0 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.25;
`;

const Description = styled.p`
  min-height: 38px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.55;
`;

const ProductBottom = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
  padding-top: 17px;
`;

const Price = styled.div`
  display: grid;
  gap: 1px;
`;

const PriceValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 19px;
  font-weight: 850;
  letter-spacing: -0.045em;
`;

const Unit = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 10px;
`;

interface ProductCardProps {
  product: Product;
  loading?: boolean;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, loading = false, onAdd }: ProductCardProps) {
  return (
    <ProductShell>
      <ProductArtwork $accent={product.accent}>
        {product.badge && (
          <ProductBadge>
            <Badge tone={product.badgeTone}>{product.badge}</Badge>
          </ProductBadge>
        )}
        <ProductEmoji aria-hidden="true">{product.emoji}</ProductEmoji>
      </ProductArtwork>
      <ProductBody>
        <Category>{product.category}</Category>
        <ProductName>{product.name}</ProductName>
        <Description>{product.description}</Description>
        <ProductBottom>
          <Price>
            <PriceValue>{formatPrice(product.price)}</PriceValue>
            <Unit>{product.unit}</Unit>
          </Price>
          <Button
            size="sm"
            onClick={() => onAdd(product)}
            loading={loading}
            aria-label={loading ? `Добавляем ${product.name}` : `Добавить ${product.name} в корзину`}
          >
            {loading ? 'Добавляем' : 'В корзину'}
          </Button>
        </ProductBottom>
      </ProductBody>
    </ProductShell>
  );
}
