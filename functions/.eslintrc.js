module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:mocha/recommended',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/tests/**/*',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
