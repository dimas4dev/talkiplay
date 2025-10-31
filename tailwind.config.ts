import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Paleta semántica principal
        primary: {
          50: '#EEEEFB',
          100: '#CACCF4', // Indigo/100 de Figma
          200: '#B8B8F3',
          300: '#8C90E6', // Indigo/300 de Figma
          400: '#8282EB',
          500: '#5459DA', // Indigo/500 de Figma - Color principal usado en botones y acentos
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
          100: '#DAEB99', // Schemes/Tertiary Container
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#078339', // Verde de Figma
          600: '#0D9443', // Verde activo de Figma
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
          400: '#FE9200', // Naranja de Figma
          500: '#FEB200', // M3/key-colors/primary (amarillo/dorado)
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
          500: '#FF0000', // Error/error-500 de Figma
          600: '#B3261E', // Schemes/Error de Figma
          700: '#990000',
          800: '#800000',
          900: '#660000',
          950: '#450000',
        },
        neutral: {
          50: '#FEFEFE',
          100: '#FCFCFC',
          200: '#F9F9F9',
          300: '#F0F0F0',
          400: '#D9D9D9',
          500: '#848484',
          600: '#737980',
          700: '#505760',
          800: '#393E44',
          900: '#2C3035',
          950: '#222528',
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
          300: '#82D3E0', // Schemes/Primary Fixed Dim
          400: '#22D3EE',
          500: '#006874', // Schemes/Primary de Figma
          600: '#004F58', // Schemes/On Primary Container
          700: '#0E7490',
          800: '#155E75',
          900: '#001F24', // Schemes/On Primary Fixed
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
          primary: '#5459DA', // Indigo/500
          secondary: '#CC0077', // Magenta/500
          accent: '#4C51C6',
          success: '#078339', // Verde de Figma
          warning: '#FEB200', // M3/key-colors/primary
          danger: '#EF4444',
          error: '#FF0000', // Error/error-500
          info: '#006874', // Schemes/Primary
          purple: '#8B5CF6',
          orange: '#FE9200',
          cyan: '#017F70', // Brand/500
        },
      },
    },
  },
}

export default config

