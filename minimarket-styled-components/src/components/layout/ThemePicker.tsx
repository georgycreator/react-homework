import styled from 'styled-components';
import { useThemeMode } from '../../context/ThemeProvider';
import type { ThemePreference } from '../../styles/theme';

const Picker = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 700;

  @media (max-width: 420px) {
    gap: 0;

    .theme-label,
    .theme-icon {
      display: none;
    }
  }
`;

const Select = styled.select`
  min-height: 38px;
  padding: 0 30px 0 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  @media (max-width: 420px) {
    width: 66px;
    padding-right: 4px;
    padding-left: 8px;
    font-size: 11px;
  }
`;

function isThemePreference(value: string): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark' || value === 'berry';
}

const themeOptions: Array<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'Авто' },
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'berry', label: 'Ягодная' },
];

export function ThemePicker() {
  const { preference, setPreference } = useThemeMode();

  return (
    <Picker>
      <span className="theme-icon" aria-hidden="true">◐</span>
      <span className="theme-label">Тема</span>
      <Select
        aria-label="Цветовая тема"
        value={preference}
        onChange={(event) => {
          const value = event.currentTarget.value;
          if (isThemePreference(value)) setPreference(value);
        }}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </Picker>
  );
}
