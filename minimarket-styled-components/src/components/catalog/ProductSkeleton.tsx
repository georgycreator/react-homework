import styled from 'styled-components';
import { shimmer } from '../../styles/animations';
import { Card } from '../ui/Card';
import { Grid } from '../ui/Grid';

const SkeletonContent = styled.div`
  display: grid;
  gap: 10px;
  padding-top: 16px;
`;

const SkeletonBlock = styled.div<{ $height: string; $width?: string }>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: linear-gradient(
    100deg,
    ${({ theme }) => theme.colors.surfaceMuted} 25%,
    ${({ theme }) => theme.colors.surfaceRaised} 40%,
    ${({ theme }) => theme.colors.surfaceMuted} 65%
  );
  background-size: 220% 100%;
  animation: ${shimmer} 1.3s linear infinite;
`;

function SkeletonCard() {
  return (
    <Card aria-hidden="true">
      <SkeletonBlock $height="168px" />
      <SkeletonContent>
        <SkeletonBlock $height="9px" $width="34%" />
        <SkeletonBlock $height="18px" $width="72%" />
        <SkeletonBlock $height="12px" />
        <SkeletonBlock $height="12px" $width="82%" />
      </SkeletonContent>
    </Card>
  );
}

export function ProductSkeleton() {
  return (
    <Grid role="status" aria-label="Загрузка товаров" aria-busy="true">
      {Array.from({ length: 8 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
}
