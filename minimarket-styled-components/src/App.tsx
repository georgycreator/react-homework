import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Catalog } from './components/catalog/Catalog';
import { KitShowcase } from './components/layout/KitShowcase';
import { CartPopover } from './components/layout/CartPopover';
import type { CartLine } from './data/cart';
import { ThemePicker } from './components/layout/ThemePicker';
import { Button } from './components/ui/Button';
import { products } from './data/products';
import type { Product } from './data/products';
import { formatPrice, formatProductCount } from './data/products';
import { readCart, saveCart } from './data/cartStorage';
import {
  AppShell,
  Brand,
  BrandMark,
  BrandText,
  Container,
  Eyebrow,
  FloatingTag,
  Footer,
  FooterInner,
  HeaderActions,
  HeaderBar,
  HeaderInner,
  HeaderNav,
  Hero,
  HeroActionsRow,
  HeroDescription,
  HeroGrid,
  HeroNote,
  HeroOrb,
  HeroPoster,
  HeroTitle,
  HeroVisual,
  KitSection,
  PosterArt,
  PosterFooter,
  PosterLabel,
  Section,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
  SectionTopline,
} from './components/layout/App.styles';

const featuredProduct = products.find((product) => product.id === 1);

export default function App() {
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState<Set<number>>(() => new Set());
  const [cartItems, setCartItems] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const timers = useRef<Set<number>>(new Set());
  const pendingIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timer = window.setTimeout(() => setCatalogLoading(false), 750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
      pendingIdsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = useCallback((product: Product) => {
    // A ref closes the tiny window before React commits the pending state update.
    // This prevents two rapid events from scheduling duplicate additions.
    if (pendingIdsRef.current.has(product.id)) return;

    pendingIdsRef.current.add(product.id);
    setPendingIds(new Set(pendingIdsRef.current));

    const timer = window.setTimeout(() => {
      setCartItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...current, { product, quantity: 1 }];
      });

      pendingIdsRef.current.delete(product.id);
      setPendingIds(new Set(pendingIdsRef.current));
      timers.current.delete(timer);
    }, 600);

    timers.current.add(timer);
  }, []);

  const handleQuantityChange = useCallback((productId: number, delta: number) => {
    if (delta !== 1 && delta !== -1) return;

    setCartItems((current) =>
      current
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const toggleCart = useCallback(() => setCartOpen((open) => !open), []);

  return (
    <AppShell>
      <a href="#main-content" className="skip-link">Перейти к содержимому</a>
      <HeaderBar>
        <HeaderInner>
          <Brand href="#top" aria-label="NORD Market — на главную">
            <BrandMark>N</BrandMark>
            <BrandText>
              NORD MARKET
              <small>ХОРОШАЯ ЕДА — ХОРОШЕЕ НАСТРОЕНИЕ</small>
            </BrandText>
          </Brand>
          <HeaderNav aria-label="Основная навигация">
            <a href="#catalog">Каталог</a>
            <a href="#ui-kit">Компоненты</a>
          </HeaderNav>
          <HeaderActions>
            <ThemePicker />
            <CartPopover
              items={cartItems}
              itemCount={cartItemCount}
              isOpen={cartOpen}
              onToggle={toggleCart}
              onClose={closeCart}
              onQuantityChange={handleQuantityChange}
            />
          </HeaderActions>
        </HeaderInner>
      </HeaderBar>

      <main id="main-content">
        <Hero id="top">
          <HeroGrid>
            <div>
              <Eyebrow>Небольшой маркет на каждый день</Eyebrow>
              <HeroTitle>
                Хорошие продукты.<br />
                <span>Ничего лишнего.</span>
              </HeroTitle>
              <HeroDescription>
                Собрали вкусное и нужное: сезонные фрукты, любимые завтраки и продукты для простых домашних ужинов.
                Выбирайте — остальное мы берём на себя.
              </HeroDescription>
              <HeroActionsRow>
                <Button as="a" href="#catalog" size="lg">
                  Смотреть каталог <span aria-hidden="true">↗</span>
                </Button>
                <Button variant="outline" size="lg" onClick={() => document.getElementById('ui-kit')?.scrollIntoView({ behavior: 'smooth' })}>
                  Наши компоненты
                </Button>
              </HeroActionsRow>
              <HeroNote>
                <span aria-hidden="true">✳</span>
                <span><strong>12 тщательно выбранных продуктов</strong> · обновляем ассортимент каждую неделю</span>
              </HeroNote>
            </div>

            <HeroVisual role="img" aria-label="Иллюстрация свежих продуктов">
              <HeroOrb $position="left" />
              <HeroOrb $position="right" />
              <FloatingTag $placement="top"><span aria-hidden="true">✦</span> Просто. Свежо. Каждый день.</FloatingTag>
              <HeroPoster>
                <PosterLabel>ВЫБОР НЕДЕЛИ · № 01</PosterLabel>
                {featuredProduct && (
                  <>
                    <PosterArt aria-hidden="true">{featuredProduct.emoji}</PosterArt>
                    <PosterFooter>
                      <div>{featuredProduct.name}<br /><small>выбор недели</small></div>
                      <span data-testid="featured-product-price">{formatPrice(featuredProduct.price)}</span>
                    </PosterFooter>
                  </>
                )}
              </HeroPoster>
              <FloatingTag $placement="bottom"><span aria-hidden="true">✓</span> Только то, что выбрали бы сами</FloatingTag>
            </HeroVisual>
          </HeroGrid>
        </Hero>

        <Section>
          <Container>
            <SectionTopline>
              <div>
                <SectionEyebrow>Небольшой, но хороший выбор</SectionEyebrow>
                <SectionTitle id="catalog-title">Сегодня в корзину</SectionTitle>
                <SectionDescription>
                  Продукты, которые делают обычный день чуточку лучше. Ищите по названию или выберите категорию.
                </SectionDescription>
              </div>
            </SectionTopline>
            <Catalog
              products={products}
              loading={catalogLoading}
              pendingIds={pendingIds}
              onAdd={handleAddToCart}
            />
          </Container>
        </Section>

        <KitSection>
          <Container>
            <KitShowcase />
          </Container>
        </KitSection>
      </main>

      <Footer>
        <FooterInner>
          <span><strong>NORD MARKET</strong> · учебный проект на React и styled-components</span>
          <span>Собрано с заботой о деталях ✳</span>
        </FooterInner>
      </Footer>

      <span className="visually-hidden" aria-live="polite">
        {cartItemCount > 0
          ? `В корзине ${formatProductCount(cartItemCount)} на сумму ${formatPrice(cartTotal)}`
          : 'Корзина пуста'}
      </span>
    </AppShell>
  );
}
