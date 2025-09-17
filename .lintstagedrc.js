module.exports = {
  '*.{ts,tsx}': ['npx eslint --fix', 'npx tsc --noEmit'],
  '*': () => './bin/run-related-tests.js'
};