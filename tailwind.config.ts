import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Paleta Material Design 3 (M3)
        primary: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#006874', // M3 Primary
          600: '#004F58', // M3 On Primary Container
          700: '#003D44',
          800: '#002B30',
          900: '#001F24', // M3 On Primary Fixed
          950: '#001419',
          container: '#9EEFFD', // M3 Primary Container
          'on-container': '#004F58', // M3 On Primary Container
          fixed: '#9EEFFD', // M3 Primary Fixed
          'fixed-dim': '#82D3E0', // M3 Primary Fixed Dim
          inverse: '#82D3E0', // M3 Inverse Primary
        },
        secondary: {
          50: '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65',
          500: '#566422', // M3 Tertiary (usado como secondary)
          600: '#3F4C0A', // M3 On Tertiary Container
          700: '#2E3807',
          800: '#1D2404',
          900: '#171E00', // M3 On Tertiary Fixed
          950: '#0F1200',
          container: '#DAEB99', // M3 Tertiary Container
          'on-container': '#3F4C0A', // M3 On Tertiary Container
        },
        success: {
          50: '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65',
          500: '#566422', // M3 Tertiary
          600: '#3F4C0A',
          700: '#2E3807',
          800: '#1D2404',
          900: '#171E00',
          950: '#0F1200',
          container: '#DAEB99', // M3 Tertiary Container
          'on-container': '#3F4C0A',
        },
        warning: {
          50: '#FFF8F3',
          100: '#FFE5D0',
          200: '#FFCCAD',
          300: '#FFB386',
          400: '#FF9A5F',
          500: '#FF8C42',
          600: '#E67E3A',
          700: '#CC702F',
          800: '#B36225',
          900: '#99541A',
          950: '#7D460F',
        },
        danger: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#BA1A1A', // M3 Error
          600: '#93000A', // M3 On Error Container
          700: '#7A0008',
          800: '#610006',
          900: '#480004',
          950: '#2F0002',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#BA1A1A', // M3 Error
          600: '#93000A', // M3 On Error Container
          700: '#7A0008',
          800: '#610006',
          900: '#480004',
          950: '#2F0002',
          container: '#FFDAD6', // M3 Error Container
          'on-container': '#93000A', // M3 On Error Container
        },
        neutral: {
          50: '#F5FAFB', // M3 Background/Surface
          100: '#E9EFF0',
          200: '#DBE4E6', // M3 Surface Variant
          300: '#BFC8CA', // M3 Outline Variant
          400: '#9FA8AA',
          500: '#6F797A', // M3 Outline
          600: '#3F484A', // M3 On Surface Variant
          700: '#2B3133', // M3 Inverse Surface
          800: '#171D1E', // M3 On Background/On Surface
          900: '#0F1314',
          950: '#080A0B',
        },
        accent: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#4DD0E1',
          400: '#26C6DA',
          500: '#006874', // M3 Primary
          600: '#004F58',
          700: '#003D44',
          800: '#002B30',
          900: '#001F24',
          950: '#001419',
        },
        info: {
          50: '#E0F7FA',
          100: '#B2EBF2',
          200: '#80DEEA',
          300: '#82D3E0', // M3 Primary Fixed Dim
          400: '#26C6DA',
          500: '#006874', // M3 Primary
          600: '#004F58', // M3 On Primary Container
          700: '#003D44',
          800: '#002B30',
          900: '#001F24', // M3 On Primary Fixed
          950: '#001419',
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
        // Colores para gráficos (Recharts) - Basados en M3
        chart: {
          primary: '#006874', // M3 Primary
          secondary: '#566422', // M3 Tertiary
          accent: '#82D3E0', // M3 Primary Fixed Dim
          success: '#566422', // M3 Tertiary
          warning: '#FF8C42',
          danger: '#BA1A1A', // M3 Error
          error: '#BA1A1A', // M3 Error
          info: '#006874', // M3 Primary
          purple: '#8B5CF6',
          orange: '#FF8C42',
          cyan: '#006874', // M3 Primary
        },
      },
    },
  },
}

export default config

