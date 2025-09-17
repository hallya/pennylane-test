module.exports = {
  '*.{ts,tsx}': ['npx eslint --fix'],
  '*': () => './bin/run-related-tests.js'
};