import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Import Sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts', '*.config.*'],
  },
];

export default eslintConfig;
