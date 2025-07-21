import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4361ee',       // Azul vibrante
    secondary: '#3f37c9',     // Azul mais escuro
    accent: '#4895ef',        // Azul claro
    background: '#f8f9fa',    // Fundo claro
    surface: '#ffffff',       // Superfícies
    error: '#f72585',         // Rosa/vermelho
    text: '#212529',          // Texto escuro
    disabled: '#adb5bd',      // Cinza para desabilitado
    success: '#4cc9f0',       // Verde-azulado
    warning: '#f8961e',       // Laranja
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4895ef',
    secondary: '#4361ee',
    accent: '#3f37c9',
    background: '#121212',
    surface: '#1e1e1e',
    error: '#f72585',
    text: '#f8f9fa',
    disabled: '#6c757d',
    success: '#4cc9f0',
    warning: '#f8961e',
  },
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};

export type AppTheme = typeof lightTheme;