import globals from 'globals';
import pluginJs from '@eslint/js';
import jest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      // Запрет var
      'no-var': 'error',
      // Предпочитать const/let
      'prefer-const': 'error',
      // Строгое сравнение
      eqeqeq: ['error', 'always'],
      // Запрет alert
      'no-alert': 'error',
      // Стрелочные функции для колбэков
      'prefer-arrow-callback': 'error',
      // Запрет appendChild
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.property.name='appendChild']",
          message: 'Use append() instead of appendChild()',
        },
      ],
    },
  },
  {
    ignores: ['dist/*', 'coverage/*', 'node_modules/*'],
  },
  {
    files: ['**/*.test.js'],
    plugins: { jest },
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
      'jest/expect-expect': 'error',
    },
  },
];
