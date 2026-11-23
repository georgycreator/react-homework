import styled from 'styled-components';

type CardPadding = 'sm' | 'md' | 'lg';

export const Card = styled.article<{ $padding?: CardPadding }>`
  min-width: 0;
  padding: ${({ $padding = 'md' }) => ({ sm: '14px', md: '20px', lg: '26px' })[$padding]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.soft};
  transition:
    border-color ${({ theme }) => theme.motion.normal},
    box-shadow ${({ theme }) => theme.motion.normal},
    background ${({ theme }) => theme.motion.slow};
`;
