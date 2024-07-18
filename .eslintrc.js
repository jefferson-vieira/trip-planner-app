module.exports = {
  extends: [
    'expo',
    'prettier',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:perfectionist/recommended-natural',
  ],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['*.js'],
    },
  ],
  parserOptions: {
    project: true,
  },
  plugins: ['prettier', 'import', 'perfectionist', 'unused-imports'],
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        'custom-groups': {
          type: {
            components: '@/components/**',
          },
          value: {
            components: '@/components/**',
          },
        },
        groups: [
          'type',
          ['builtin', 'external'],
          ['internal-type', 'internal'],
          'components',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        'internal-pattern': ['@/**'],
      },
    ],
    'perfectionist/sort-jsx-props': [
      'error',
      {
        'custom-groups': {
          callback: 'on[A-Z]*',
        },
        groups: ['unknown', 'callback'],
      },
    ],
    'prettier/prettier': 'error',
    'react/jsx-max-props-per-line': 'error',
    'react/jsx-newline': 'error',
    'react/self-closing-comp': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
  },
};
