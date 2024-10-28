const typescript = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

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
            semi: ['error', 'always'],
            quotes: ['error', 'double'],
            indent: [
                "error",
                2, // Indent level is 2 spaces
                {
                    ignoredNodes: ["TemplateLiteral *",
                        "VElement",
                        "VAttribute",
                        "VExpressionContainer"],
                    SwitchCase: 1, // Indent case statements in switch blocks
                    VariableDeclarator: 1, // Indent variable declarations
                    outerIIFEBody: 1, // Indent the body of IIFE
                    MemberExpression: 1, // Indent members of object literals
                    FunctionDeclaration: {
                        parameters: 1,
                        body: 1,
                    },
                    FunctionExpression: {
                        parameters: 1,
                        body: 1,
                    },
                    CallExpression: {
                        arguments: 1,
                    },
                    ArrayExpression: 1, // Indent array elements
                    ObjectExpression: 1, // Indent object properties
                    ImportDeclaration: 1, // Indent import statements
                    flatTernaryExpressions: false, // Don't indent ternary expressions
                },
            ],
            "object-curly-spacing": ["error", "always"],
        },
    },
    {
        ignores: ['**/node_modules/**', '**/dist/**'],
    },
];

