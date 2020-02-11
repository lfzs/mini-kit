module.exports = {
  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],

  'parser': 'babel-eslint',
  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'legacyDecorators': true
    }
  },

  'env': {
    'es6': true,
    'node': true
  },

  'rules': {
    'import/no-unresolved': 0,
    'import/no-duplicates': 2,
    'eqeqeq': 2,
    'quotes': [2, 'single'],
    'no-console': 1,
    'dot-notation': 2,
    'no-var': 2,
    'no-trailing-spaces': 2,
    'eol-last': 2,
    'no-alert': 2,
    'no-lone-blocks': 2,
    'key-spacing': 2,
    'comma-spacing': 2,
    'space-infix-ops': 2,
    'block-spacing': 2,
    'computed-property-spacing': 2,
    'func-call-spacing': 2,
    'keyword-spacing': 2,
    'switch-colon-spacing': 2,
    'arrow-spacing': 2,
    'rest-spread-spacing': 2,
    'space-in-parens': 2,
    'space-before-blocks': 2,
    'generator-star-spacing': [2, 'after'],
    'object-curly-spacing': [2, 'always'],
    'no-empty': [2, { 'allowEmptyCatch': true }],
    'dot-location': [2, 'property'],
    'no-multi-spaces': 2,
    'no-self-compare': 2,
    'require-await': 2,
    'array-bracket-spacing': 2,
    'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
    'comma-dangle': [2, 'always-multiline'],
    'indent': [2, 2],
    'linebreak-style': 2,
    'lines-between-class-members': [2, 'always', { 'exceptAfterSingleLine': true }],
    'multiline-ternary': [2, 'never'],
    'no-multiple-empty-lines': [2, { 'max': 1 }],
    'no-whitespace-before-property': 2,
    'semi': [2, 'never', { 'beforeStatementContinuationChars': 'never' }],
    'semi-style': [2, 'last'],
    'space-before-function-paren': [1, 'never'],
    'prefer-template': 2,
    'template-curly-spacing': 2
  },

  'globals': {
    'process.env': true,
    'App': true,
    'wx': true,
    'getApp': true,
    'Page': true,
    'Component': true,
    'getCurrentPages': true
  }
}
