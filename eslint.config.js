import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Evitar colores literales: usar Tailwind tokens o variables CSS
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}$/]",
          message: 'Evita colores hex; usa clases Tailwind o var(--color-*)',
        },
        {
          selector: "Literal[value=/^(?:rgb|rgba|hsl|hsla)\\(/]",
          message: 'Evita rgb/rgba/hsl; usa clases Tailwind o var(--color-*)',
        },
      ],
    },
  },
  // Permitir colores literales en configuraciones de tema/estilos base
  {
    files: ['tailwind.config.ts', 'src/styles/globals.css'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
])
