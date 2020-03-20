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
    'import/no-duplicates': 1,
    'array-bracket-spacing': 1,
    'arrow-spacing': 1,
    'block-spacing': 1,
    'brace-style': [1, '1tbs', { 'allowSingleLine': true }],
    'comma-dangle': [1, 'always-multiline'],
    'comma-spacing': 1,
    'computed-property-spacing': 1,
    'dot-location': [1, 'property'],
    'dot-notation': 1,
    'eol-last': 1,
    'eqeqeq': 1,
    'for-direction': 1,
    'func-call-spacing': 1,
    'generator-star-spacing': [1, 'after'],
    'indent': [1, 2],
    'keyword-spacing': 1,
    'key-spacing': 1,
    'linebreak-style': 1,
    'lines-between-class-members': [1, 'always', { 'exceptAfterSingleLine': true }],
    'multiline-ternary': [1, 'never'],
    'no-alert': 1,
    'no-console': 1,
    'no-empty': [1, { 'allowEmptyCatch': true }],
    'no-lone-blocks': 1,
    'no-multiple-empty-lines': [1, { 'max': 1 }],
    'no-multi-spaces': 1,
    'no-new-wrappers': 1,
    'no-return-await': 1,
    'no-self-compare': 1,
    'no-trailing-spaces': 1,
    'no-unused-vars': 1,
    'no-useless-concat': 1,
    'no-var': 1,
    'no-void': 1,
    'no-whitespace-before-property': 1,
    'object-curly-spacing': [1, 'always'],
    'prefer-template': 1,
    'quotes': [1, 'single'],
    'require-await': 1,
    'rest-spread-spacing': 1,
    'semi': [1, 'never', { 'beforeStatementContinuationChars': 'never' }],
    'semi-style': [1, 'last'],
    'space-before-blocks': 1,
    'space-before-function-paren': [1, 'never'],
    'space-infix-ops': 1,
    'space-in-parens': 1,
    'switch-colon-spacing': 1,
    'template-curly-spacing': 1,
  },

  'globals': {
    'App': true,
    'wx': true,
    'getApp': true,
    'Page': true,
    'Component': true,
    'getCurrentPages': true
  }
}
