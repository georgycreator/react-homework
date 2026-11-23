export type ThemeName = 'light' | 'dark' | 'berry';
export type ThemePreference = ThemeName | 'system';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeTone = 'neutral' | 'success' | 'warning' | 'accent';
export type ProductAccent = 'leaf' | 'sun' | 'sky' | 'berry';

export interface AppTheme {
  name: ThemeName;
  colorScheme: 'light' | 'dark';
  colors: {
    page: string;
    surface: string;
    surfaceMuted: string;
    surfaceRaised: string;
    text: string;
    textMuted: string;
    textSoft: string;
    border: string;
    borderStrong: string;
    primary: string;
    primaryHover: string;
    primaryText: string;
    accent: string;
    accentText: string;
    focus: string;
    danger: string;
    transparent: string;
    shadow: string;
    heroStart: string;
    heroEnd: string;
  };
  buttonVariants: Record<ButtonVariant, {
    background: string;
    hover: string;
    foreground: string;
    border: string;
  }>;
  buttonSizes: Record<ButtonSize, {
    minHeight: string;
    paddingX: string;
    fontSize: string;
    radius: string;
  }>;
  badgeTones: Record<BadgeTone, {
    background: string;
    foreground: string;
  }>;
  productAccents: Record<ProductAccent, {
    background: string;
    foreground: string;
  }>;
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    pill: string;
  };
  shadows: {
    soft: string;
    card: string;
    popover: string;
  };
  motion: {
    fast: string;
    normal: string;
    slow: string;
  };
}

const shared = {
  buttonSizes: {
    sm: { minHeight: '34px', paddingX: '13px', fontSize: '12px', radius: '11px' },
    md: { minHeight: '42px', paddingX: '17px', fontSize: '14px', radius: '13px' },
    lg: { minHeight: '50px', paddingX: '21px', fontSize: '15px', radius: '15px' },
  },
  radii: {
    sm: '10px',
    md: '16px',
    lg: '22px',
    xl: '30px',
    pill: '999px',
  },
  shadows: {
    soft: '0 8px 30px rgba(24, 44, 33, 0.06)',
    card: '0 16px 42px rgba(24, 44, 33, 0.08)',
    popover: '0 24px 70px rgba(12, 28, 20, 0.18)',
  },
  motion: {
    fast: '140ms ease',
    normal: '220ms ease',
    slow: '360ms ease',
  },
} satisfies Pick<AppTheme, 'buttonSizes' | 'radii' | 'shadows' | 'motion'>;

export const themes: Record<ThemeName, AppTheme> = {
  light: {
    ...shared,
    name: 'light',
    colorScheme: 'light',
    colors: {
      page: '#f4f6ef',
      surface: '#ffffff',
      surfaceMuted: '#edf1e8',
      surfaceRaised: '#fbfcf8',
      text: '#1d2b22',
      textMuted: '#657469',
      textSoft: '#8b978d',
      border: '#e1e8de',
      borderStrong: '#cbd7ca',
      primary: '#245b43',
      primaryHover: '#194a35',
      primaryText: '#ffffff',
      accent: '#d7ed8b',
      accentText: '#203222',
      focus: '#7d9d4d',
      danger: '#bd5353',
      transparent: 'transparent',
      shadow: 'rgba(25, 48, 34, 0.08)',
      heroStart: '#eaf1df',
      heroEnd: '#dce9cf',
    },
    buttonVariants: {
      primary: { background: '#245b43', hover: '#194a35', foreground: '#ffffff', border: 'transparent' },
      secondary: { background: '#d7ed8b', hover: '#c8e274', foreground: '#203222', border: 'transparent' },
      outline: { background: 'transparent', hover: '#edf1e8', foreground: '#245b43', border: '#bdcdbb' },
      ghost: { background: 'transparent', hover: '#edf1e8', foreground: '#526456', border: 'transparent' },
    },
    badgeTones: {
      neutral: { background: '#edf1e8', foreground: '#526456' },
      success: { background: '#e4f3e5', foreground: '#347447' },
      warning: { background: '#fff2d9', foreground: '#94631b' },
      accent: { background: '#f3e8f2', foreground: '#8e5484' },
    },
    productAccents: {
      leaf: { background: '#e4efdc', foreground: '#426a43' },
      sun: { background: '#f8edcf', foreground: '#96702c' },
      sky: { background: '#e1edf0', foreground: '#527984' },
      berry: { background: '#f2e2e9', foreground: '#98596f' },
    },
  },
  dark: {
    ...shared,
    name: 'dark',
    colorScheme: 'dark',
    colors: {
      page: '#121a16',
      surface: '#1b2720',
      surfaceMuted: '#243329',
      surfaceRaised: '#202e26',
      text: '#edf3e9',
      textMuted: '#b0bdb1',
      textSoft: '#87978a',
      border: '#34453a',
      borderStrong: '#526657',
      primary: '#a4d6ad',
      primaryHover: '#8bc69a',
      primaryText: '#17251c',
      accent: '#d7ed8b',
      accentText: '#203222',
      focus: '#c3e79c',
      danger: '#f08b83',
      transparent: 'transparent',
      shadow: 'rgba(0, 0, 0, 0.24)',
      heroStart: '#263b2e',
      heroEnd: '#314b37',
    },
    buttonVariants: {
      primary: { background: '#a4d6ad', hover: '#8bc69a', foreground: '#17251c', border: 'transparent' },
      secondary: { background: '#d7ed8b', hover: '#c8e274', foreground: '#203222', border: 'transparent' },
      outline: { background: 'transparent', hover: '#2b3b30', foreground: '#c4e6c8', border: '#526657' },
      ghost: { background: 'transparent', hover: '#2b3b30', foreground: '#c0cdc1', border: 'transparent' },
    },
    badgeTones: {
      neutral: { background: '#2d3d32', foreground: '#c0cdc1' },
      success: { background: '#274532', foreground: '#a9ddb2' },
      warning: { background: '#4d4029', foreground: '#f0cc83' },
      accent: { background: '#4a3445', foreground: '#e0b2d2' },
    },
    productAccents: {
      leaf: { background: '#2d4632', foreground: '#b9d8ae' },
      sun: { background: '#4b4129', foreground: '#f0d28c' },
      sky: { background: '#2b4148', foreground: '#b2d8e1' },
      berry: { background: '#4a3440', foreground: '#e5b8ca' },
    },
  },
  berry: {
    ...shared,
    name: 'berry',
    colorScheme: 'light',
    colors: {
      page: '#f8f1f5',
      surface: '#fffafd',
      surfaceMuted: '#f1e6ee',
      surfaceRaised: '#fff7fb',
      text: '#352333',
      textMuted: '#806b7d',
      textSoft: '#a18d9e',
      border: '#eadce7',
      borderStrong: '#d8c1d3',
      primary: '#82476d',
      primaryHover: '#6d3859',
      primaryText: '#ffffff',
      accent: '#f0c9d9',
      accentText: '#4a2d3d',
      focus: '#b36c91',
      danger: '#b94d63',
      transparent: 'transparent',
      shadow: 'rgba(70, 35, 58, 0.08)',
      heroStart: '#f3e3ed',
      heroEnd: '#e8d4e4',
    },
    buttonVariants: {
      primary: { background: '#82476d', hover: '#6d3859', foreground: '#ffffff', border: 'transparent' },
      secondary: { background: '#f0c9d9', hover: '#e8b7cc', foreground: '#4a2d3d', border: 'transparent' },
      outline: { background: 'transparent', hover: '#f1e6ee', foreground: '#82476d', border: '#d8c1d3' },
      ghost: { background: 'transparent', hover: '#f1e6ee', foreground: '#806b7d', border: 'transparent' },
    },
    badgeTones: {
      neutral: { background: '#f1e6ee', foreground: '#806b7d' },
      success: { background: '#e7f0e4', foreground: '#54774e' },
      warning: { background: '#fff0d9', foreground: '#94631b' },
      accent: { background: '#f6dfeb', foreground: '#944c75' },
    },
    productAccents: {
      leaf: { background: '#e3eddf', foreground: '#54774e' },
      sun: { background: '#f7ebd3', foreground: '#96702c' },
      sky: { background: '#e3edf0', foreground: '#527984' },
      berry: { background: '#f4dfe9', foreground: '#98516f' },
    },
  },
};
