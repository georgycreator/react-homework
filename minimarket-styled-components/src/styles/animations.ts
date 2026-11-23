import { keyframes } from 'styled-components';

export const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const shimmer = keyframes`
  100% {
    background-position: -200% 0;
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;
