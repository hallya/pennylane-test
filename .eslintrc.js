module.exports = {
  ignorePatterns: ['build/**', 'src/domain/types/**'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  env: {
    browser: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['bin/**', '.lintstagedrc.js'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      excludedFiles: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/__tests__/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/shared/FormWrapper'],
                message: 'FormWrapper should only be imported in test files'
              }
            ]
          }
        ]
      }
    },
    {
      files: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/__tests__/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}