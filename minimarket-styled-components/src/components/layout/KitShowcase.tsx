import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import type { ButtonSize, ButtonVariant } from '../../styles/theme';
import {
  BadgeExamples,
  InputExample,
  KitCard,
  KitCardText,
  KitCardTitle,
  KitGrid,
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
  SectionTopline,
  SizeLabel,
  VariantGroup,
  VariantName,
  VariantRow,
} from './App.styles';

const variants: Array<{ value: ButtonVariant; label: string }> = [
  { value: 'primary', label: 'Основная' },
  { value: 'secondary', label: 'Дополнительная' },
  { value: 'outline', label: 'Контурная' },
  { value: 'ghost', label: 'Без заливки' },
];

const sizes: Array<{ value: ButtonSize; label: string }> = [
  { value: 'sm', label: 'Маленькая' },
  { value: 'md', label: 'Средняя' },
  { value: 'lg', label: 'Большая' },
];

const CardExampleWrap = styled.div`
  margin-top: 18px;
`;

export function KitShowcase() {
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const loadingTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (loadingTimer.current !== null) {
        window.clearTimeout(loadingTimer.current);
      }
    };
  }, []);

  const handleLoadingDemo = () => {
    if (loadingTimer.current !== null) return;

    setIsLoadingDemo(true);
    loadingTimer.current = window.setTimeout(() => {
      setIsLoadingDemo(false);
      loadingTimer.current = null;
    }, 900);
  };

  return (
    <section id="ui-kit" aria-labelledby="kit-title">
      <SectionTopline>
        <div>
          <SectionEyebrow>Маленькая дизайн-система</SectionEyebrow>
          <SectionTitle id="kit-title">Компоненты, из которых всё собрано</SectionTitle>
          <SectionDescription>
            Один набор правил — несколько состояний и размеров. Все цвета и состояния берутся из активной темы.
          </SectionDescription>
        </div>
      </SectionTopline>

      <KitGrid>
        <KitCard>
          <KitCardTitle>Кнопка · 4 варианта × 3 размера</KitCardTitle>
          <SizeLabel>
            <span />
            {sizes.map((size) => <span key={size.value}>{size.label}</span>)}
          </SizeLabel>
          <VariantGroup>
            {variants.map((variant) => (
              <VariantRow key={variant.value}>
                <VariantName>{variant.label}</VariantName>
                {sizes.map((size) => (
                  <Button key={size.value} variant={variant.value} size={size.value}>
                    {size.label}
                  </Button>
                ))}
              </VariantRow>
            ))}
          </VariantGroup>
          <BadgeExamples>
            <Badge tone="neutral">В наличии</Badge>
            <Badge tone="success">Свежий урожай</Badge>
            <Badge tone="warning">Сезонное</Badge>
            <Badge tone="accent">Новинка</Badge>
            <Button size="sm" loading={isLoadingDemo} onClick={handleLoadingDemo}>
              {isLoadingDemo ? 'Загрузка…' : 'Показать загрузку'}
            </Button>
            <Button as="a" href="#catalog" size="sm" variant="outline">
              Кнопка-ссылка ↗
            </Button>
            <KitCardText aria-live="polite">
              Нажмите «Показать загрузку»: индикатор появится на 0,9 секунды и автоматически исчезнет.
            </KitCardText>
          </BadgeExamples>
        </KitCard>

        <KitCard>
          <KitCardTitle>Поля и поверхность</KitCardTitle>
          <InputExample>
            <Input
              label="Название продукта"
              placeholder="Например, свежие яблоки"
              defaultValue="Авокадо хаас"
            />
            <Input
              label="Поле поиска"
              type="search"
              placeholder="Найти продукт"
              hint="Для поискового поля тип и автозаполнение задаются автоматически через .attrs()."
            />
          </InputExample>
          <CardExampleWrap>
            <Card $padding="sm">
              <Badge tone="success">Карточка</Badge>
              <KitCardText>
                Карточка использует ту же тему, скругления и границы, что и карточки товаров в каталоге.
              </KitCardText>
            </Card>
          </CardExampleWrap>
        </KitCard>
      </KitGrid>
    </section>
  );
}
