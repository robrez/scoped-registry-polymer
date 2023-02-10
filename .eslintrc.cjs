module.exports = {
  plugins: ['@typescript-eslint', 'wc', 'lit', 'lit-a11y', 'chai-expect', 'chai-friendly', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:wc/recommended',
    'plugin:wc/best-practice',
    'plugin:lit/recommended',
    'plugin:lit-a11y/recommended'
  ],
  env: {
    es2021: true,
    browser: true
  },
  reportUnusedDisableDirectives: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  overrides: [
    {
      files: ['rollup.config.cjs', '.eslintrc.cjs', '**/*.cjs', '**/*.cts'],
      env: {
        node: true
      }
    },
    {
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking'
      ],
      files: ['*.ts', '*.cts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn', // or error
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_'
          }
        ]
      }
    },
    {
      extends: ['plugin:chai-expect/recommended', 'plugin:chai-friendly/recommended'],
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    }
  ],
  rules: {
    'no-extra-boolean-cast': 'off',
    'import/no-duplicates': 'warn',
    'import/order': 'warn'
  }
};
