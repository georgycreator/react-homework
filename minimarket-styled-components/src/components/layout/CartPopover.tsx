import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { CartLine } from '../../data/cart';
import { formatPrice, formatProductCount } from '../../data/products';
import { Badge } from '../ui/Badge';

const CartRoot = styled.div`
  position: relative;
`;

const CartTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 800;
  transition: border-color ${({ theme }) => theme.motion.fast}, background ${({ theme }) => theme.motion.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceRaised};
  }

  @media (max-width: 420px) {
    padding: 0 9px;

    .cart-label {
      display: none;
    }
  }
`;

const CartCount = styled.span`
  display: grid;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: 10px;

  @media (max-width: 420px) {
    padding-right: 4px;
    padding-left: 4px;
    font-size: 9px;
  }
`;

const Popover = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 12px);
  right: 0;
  width: min(380px, calc(100vw - 28px));
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.popover};
`;

const PopoverHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const PopoverTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  letter-spacing: -0.035em;
`;

const CloseButton = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CartItems = styled.div`
  display: grid;
  max-height: min(340px, 48vh);
  gap: 11px;
  overflow-y: auto;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ItemEmoji = styled.div`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 22px;
`;

const ItemDetails = styled.div`
  min-width: 0;
`;

const ItemName = styled.div`
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemPrice = styled.div`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  line-height: 1.4;
`;

const ItemSubtotal = styled.div`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 11px;
  font-weight: 800;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const QuantityButton = styled.button`
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 1;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Quantity = styled.span`
  min-width: 16px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 800;
  text-align: center;
`;

const CartTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    letter-spacing: -0.04em;
  }
`;

const CartBadgeWrap = styled.div`
  margin-top: 14px;
`;

const CartEmpty = styled.div`
  padding: 22px 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  text-align: center;

  span {
    display: block;
    margin-bottom: 8px;
    font-size: 30px;
  }
`;

interface CartPopoverProps {
  items: CartLine[];
  itemCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onQuantityChange: (productId: number, delta: number) => void;
}

export function CartPopover({
  items,
  itemCount,
  isOpen,
  onToggle,
  onClose,
  onQuantityChange,
}: CartPopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function closeAndRestoreFocus() {
    onClose();
    triggerRef.current?.focus();
  }

  return (
    <CartRoot ref={rootRef}>
      <CartTrigger
        ref={triggerRef}
        type="button"
        aria-label={`Открыть корзину, ${formatProductCount(itemCount)}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? 'cart-popover' : undefined}
        onClick={onToggle}
      >
        <span aria-hidden="true">🛍</span>
        <span className="cart-label">Корзина</span>
        <CartCount aria-hidden="true">{itemCount}</CartCount>
      </CartTrigger>
      {isOpen && (
        <Popover id="cart-popover" role="dialog" aria-labelledby="cart-title" aria-modal="false">
          <PopoverHead>
            <PopoverTitle id="cart-title">Ваша корзина · {formatProductCount(itemCount)}</PopoverTitle>
            <CloseButton ref={closeButtonRef} type="button" onClick={closeAndRestoreFocus} aria-label="Закрыть корзину">
              <span aria-hidden="true">✕</span>
            </CloseButton>
          </PopoverHead>
          {items.length === 0 ? (
            <CartEmpty role="status">
              <span aria-hidden="true">🧺</span>
              Здесь пока пусто. Добавьте что-нибудь вкусное!
            </CartEmpty>
          ) : (
            <>
              <CartItems role="list" aria-label="Товары в корзине">
                {items.map(({ product, quantity }) => (
                  <CartItem key={product.id} role="listitem">
                    <ItemEmoji aria-hidden="true">{product.emoji}</ItemEmoji>
                    <ItemDetails>
                      <ItemName title={product.name}>{product.name}</ItemName>
                      <ItemPrice>{formatPrice(product.price)} / {product.unit}</ItemPrice>
                      <ItemSubtotal>Сумма: {formatPrice(product.price * quantity)}</ItemSubtotal>
                    </ItemDetails>
                    <QuantityControls role="group" aria-label={`Количество: ${product.name}`}>
                      <QuantityButton
                        type="button"
                        aria-label={quantity === 1 ? `Удалить из корзины: ${product.name}` : `Уменьшить количество: ${product.name}`}
                        onClick={() => onQuantityChange(product.id, -1)}
                      >
                        −
                      </QuantityButton>
                      <Quantity>{quantity}</Quantity>
                      <QuantityButton
                        type="button"
                        aria-label={`Увеличить количество: ${product.name}`}
                        onClick={() => onQuantityChange(product.id, 1)}
                      >
                        +
                      </QuantityButton>
                    </QuantityControls>
                  </CartItem>
                ))}
              </CartItems>
              <CartTotal role="group" aria-label="Итого к оплате">
                <span>Итого</span>
                <strong>{formatPrice(total)}</strong>
              </CartTotal>
              <CartBadgeWrap>
                <Badge tone="neutral">Количество можно изменить</Badge>
              </CartBadgeWrap>
            </>
          )}
        </Popover>
      )}
    </CartRoot>
  );
}
