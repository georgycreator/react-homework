import styled from 'styled-components';
import type { ReactNode } from 'react';
import type { BadgeTone } from '../../styles/theme';

const StyledBadge = styled.span<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  padding: 4px 9px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $tone }) => theme.badgeTones[$tone].background};
  color: ${({ theme, $tone }) => theme.badgeTones[$tone].foreground};
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.045em;
  text-transform: uppercase;
`;

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <StyledBadge $tone={tone}>{children}</StyledBadge>;
}
