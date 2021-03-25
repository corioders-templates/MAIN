process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const fs = require('fs');

const config = require('./config/config');

const commonConfig = {
	'no-unused-vars': ['error', { varsIgnorePattern: '_', argsIgnorePattern: '_', caughtErrorsIgnorePattern: '_' }],
};
const common = {};
common.js = {
	extends: ['eslint:recommended'],
	rules: {
		'no-empty': 'off',
		'require-yield': 'off',

		'no-unused-vars': commonConfig['no-unused-vars'],
		'no-unreachable': 'warn',

		// 'no-console': config.IS_PRODUCTION ? 'error' : 'off',
		// 'no-debugger': config.IS_PRODUCTION ? 'error' : 'off',
	},
};
common.ts = {
	extends: [...common.js.extends, 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
	rules: {
		...common.js.rules,

		// =========================================================================
		// disable some rules as we would have duplicates with common.js.rules
		'no-unused-vars': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		// =========================================================================

		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-namespace': 'off',

		'@typescript-eslint/no-unused-vars': commonConfig['no-unused-vars'],
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-implicit-any-catch': 'error',
		'@typescript-eslint/no-unsafe-assignment': 'error',
		'@typescript-eslint/no-unsafe-call': 'error',
		'@typescript-eslint/no-unsafe-member-access': 'error',
		'@typescript-eslint/no-unsafe-return': 'error',
	},
};

module.exports = {
	root: true,
	// Ignore every file and folder except src.
	ignorePatterns: [...fs.readdirSync(__dirname).filter((name) => name != 'src')],
	env: {
		browser: true,
		es6: true,
	},
	overrides: [
		{
			files: ['*.js'],
			// ignore protobuf generated files
			excludedFiles: [`./src/api/proto/generated/**/*`],
			parser: '@babel/eslint-parser',
			parserOptions: {
				babelOptions: { configFile: path.resolve(config.CONFIG_PATH, 'babel.config.js') },
			},
			rules: common.js.rules,
			extends: common.js.extends,
		},
		{
			files: ['*.ts'],
			excludedFiles: [`*.test.ts`],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: config.ROOT_PATH,
			},
			rules: common.ts.rules,
			extends: common.ts.extends,
		},
		{
			files: ['*.test.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: './config/tsconfig/tsconfig.jest.json',
				tsconfigRootDir: config.ROOT_PATH,
			},
			rules: {
				...common.ts.rules,
				// allow @ts-ignore for tests
				'@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': false }],
			},
			extends: common.ts.extends,
		},
	],
};
