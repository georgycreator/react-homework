import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

const FieldGroup = styled.div`
  display: grid;
  gap: 7px;
  min-width: 0;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 750;
`;

const Field = styled.input<{ $invalid: boolean }>`
  width: 100%;
  min-height: 46px;
  padding: 0 15px;
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  transition:
    border-color ${({ theme }) => theme.motion.fast},
    box-shadow ${({ theme }) => theme.motion.fast},
    background ${({ theme }) => theme.motion.slow};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
  }

  &:focus {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.focus)};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.shadow};
  }
`;

/**
 * .attrs() supplies search-specific HTML defaults in one place.
 * Callers can still override autoComplete explicitly when needed.
 */
const SearchField = styled(Field).attrs((props) => ({
  type: 'search' as const,
  autoComplete: props.autoComplete ?? 'off',
}))``;

const FieldMessage = styled.span<{ $error: boolean }>`
  color: ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.textSoft)};
  font-size: 11px;
`;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: ReactNode;
  error?: string;
}

export function Input({ label, hint, error, id, type = 'text', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const fieldProps = {
    ...props,
    id: inputId,
    $invalid: Boolean(error),
    'aria-invalid': Boolean(error),
    'aria-describedby': message ? `${inputId}-message` : undefined,
  };

  return (
    <FieldGroup>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      {type === 'search' ? (
        <SearchField {...fieldProps} />
      ) : (
        <Field {...fieldProps} type={type} />
      )}
      {message && (
        <FieldMessage id={`${inputId}-message`} $error={Boolean(error)}>
          {message}
        </FieldMessage>
      )}
    </FieldGroup>
  );
}
