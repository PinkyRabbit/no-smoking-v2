const typescript = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

// @TODO: Fix eslint config!
module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            'prettier': prettierPlugin,
        },
        rules: {
            ...typescript.configs['recommended'].rules,
            ...prettierConfig.rules,
            // You can add custom rules here
        },
    },
];

