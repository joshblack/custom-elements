'use strict';

module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  bracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['^node:(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};
