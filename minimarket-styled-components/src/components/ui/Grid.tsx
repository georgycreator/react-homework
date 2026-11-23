import styled from 'styled-components';

export const Grid = styled.div<{ $gap?: 'sm' | 'md' | 'lg' }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ $gap = 'md' }) => ({ sm: '12px', md: '18px', lg: '24px' })[$gap]};

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 850px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1160px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;
