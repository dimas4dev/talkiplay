import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Paleta semántica principal
        primary: {
          50: '#EEEEFB',
          100: '#D3D3F7',
          200: '#B8B8F3',
          300: '#9D9DEF',
          400: '#8282EB',
          500: '#5459DA', // Color principal usado en botones y acentos
          600: '#4A4FC7',
          700: '#3F45B4',
          800: '#353BA1',
          900: '#2A318E',
          950: '#1F277B',
        },
        secondary: {
          50: '#F5F5FF',
          100: '#EBEBFF',
          200: '#E1E1FF',
          300: '#D7D7FF',
          400: '#CDCCFF',
          500: '#6355FF',
          600: '#584AF0',
          700: '#4D3FE1',
          800: '#4234D2',
          900: '#3729C3',
          950: '#2C1EB4',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Verde usado en métricas
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Naranja usado en métricas
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444', // Rojo estándar
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        error: {
          50: '#FFE5E5',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#E80000', // Rojo usado en errores de pago
          600: '#CC0000',
          700: '#B30000',
          800: '#990000',
          900: '#800000',
          950: '#660000',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        accent: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Púrpura usado en métricas
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#3B1F6F',
        },
        info: {
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4', // Cyan usado en métricas
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          950: '#083344',
        },
        // Colores específicos para badges y estados
        status: {
          trial: {
            bg: '#E5FFF0',
            text: '#00401A',
          },
          active: {
            bg: '#0D9443',
            text: '#FEFEFE',
          },
          inactive: {
            bg: '#C9CBCE',
            text: '#2C3035',
          },
          blocked: {
            bg: '#FFE5E5',
            text: '#9B1C1C',
          },
          suspended: {
            bg: '#FFE5E5',
            text: '#9B1C1C',
          },
          expired: {
            bg: '#C9CBCE',
            text: '#2C3035',
          },
          'payment-error': {
            bg: '#DF2525',
            text: '#FEFEFE',
          },
          cancelled: {
            bg: '#C9CBCE',
            text: '#2C3035',
          },
        },
        membership: {
          premium: {
            bg: '#F6E6DA',
            text: '#6B2400',
          },
          pro: {
            bg: '#EFB0D5',
            text: '#560032',
          },
          explorador: {
            bg: '#E3F2FD',
            text: '#1976D2',
          },
        },
        // Colores para gráficos (Recharts)
        chart: {
          primary: '#5459DA',
          secondary: '#CC0077',
          accent: '#4C51C6',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          error: '#E80000',
          info: '#06B6D4',
          purple: '#8B5CF6',
          orange: '#FF5500',
          cyan: '#00AA55',
        },
      },
    },
  },
}

export default config

