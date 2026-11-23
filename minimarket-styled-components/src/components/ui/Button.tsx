import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import styled, { css } from 'styled-components';
import type { ButtonSize, ButtonVariant } from '../../styles/theme';
import { spin } from '../../styles/animations';

interface StyledButtonProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: ${({ theme, $size }) => theme.buttonSizes[$size].minHeight};
  padding: 0 ${({ theme, $size }) => theme.buttonSizes[$size].paddingX};
  border: 1px solid ${({ theme, $variant }) => theme.buttonVariants[$variant].border};
  border-radius: ${({ theme, $size }) => theme.buttonSizes[$size].radius};
  background: ${({ theme, $variant }) => theme.buttonVariants[$variant].background};
  color: ${({ theme, $variant }) => theme.buttonVariants[$variant].foreground};
  font-size: ${({ theme, $size }) => theme.buttonSizes[$size].fontSize};
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.motion.fast},
    border-color ${({ theme }) => theme.motion.fast},
    color ${({ theme }) => theme.motion.fast},
    transform ${({ theme }) => theme.motion.fast},
    opacity ${({ theme }) => theme.motion.fast};

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background: ${({ theme, $variant }) => theme.buttonVariants[$variant].hover};
    transform: translateY(-1px);
  }

  &:active:not(:disabled):not([aria-disabled='true']) {
    transform: translateY(0);
  }

  &:disabled,
  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.64;
  }

  ${({ $variant }) => $variant === 'ghost' && css`
    font-weight: 650;
  `}
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  border: 2px solid currentColor;
  border-right-color: ${({ theme }) => theme.colors.transparent};
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;
`;

type SharedButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
};

export type ButtonElementProps = SharedButtonProps
  & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>
  & { as?: 'button'; disabled?: boolean };

export type ButtonAnchorProps = SharedButtonProps
  & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>
  & { as: 'a'; href: string };

/**
 * Public API keeps regular props (variant/size) while the styled element
 * receives transient props ($variant/$size), so styling details never leak
 * into the rendered HTML.
 */
export type ButtonProps = ButtonElementProps | ButtonAnchorProps;

export function Button(props: ButtonAnchorProps): ReactElement;
export function Button(props: ButtonElementProps): ReactElement;
export function Button(props: ButtonProps): ReactElement {
  if (props.as === 'a') {
    const {
      as: elementType,
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      onClick,
      ...anchorProps
    } = props;
    const isDisabled = disabled || loading;

    const handleAnchorClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <StyledButton
        as={elementType}
        {...anchorProps}
        onClick={handleAnchorClick}
        $variant={variant}
        $size={size}
        aria-busy={loading}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : anchorProps.tabIndex}
      >
        {loading && <Spinner aria-hidden="true" />}
        {children}
      </StyledButton>
    );
  }

  const {
    as: elementType = 'button',
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    ...buttonProps
  } = props;

  return (
    <StyledButton
      {...buttonProps}
      as={elementType}
      type={type}
      $variant={variant}
      $size={size}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <Spinner aria-hidden="true" />}
      {children}
    </StyledButton>
  );
}
