// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier', 'plugin:perfectionist/recommended-natural'],
  plugins: ['prettier', 'perfectionist'],
  rules: {
    'prettier/prettier': 'error',
  },
};
