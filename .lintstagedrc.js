module.exports = {
  '*.{ts,tsx}': ['npx eslint --fix', 'npx tsc --noEmit --project .'],
  '*': () => './bin/run-related-tests.js'
};