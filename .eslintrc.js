module.exports = {
  extends: ['react-app'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [{
        name: 'src/infrastructure/shared/FormWrapper',
        message: 'FormWrapper should only be imported in test files'
      }]
    }]
  },
  overrides: [{
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }]
}