import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
	js.configs.recommended,
	prettier,
	{
		ignores: [
			'src-tauri/target/**',
			'src-tauri/gen/**',
			'.svelte-kit/**',
			'build/**',
			'node_modules/**'
		]
	},
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				// Browser globals
				window: 'readonly',
				document: 'readonly',
				navigator: 'readonly',
				console: 'readonly',
				// ES2017 globals
				Promise: 'readonly',
				// Node.js globals
				process: 'readonly',
				Buffer: 'readonly',
				__dirname: 'readonly',
				__filename: 'readonly',
				module: 'readonly',
				require: 'readonly',
				exports: 'readonly',
				global: 'readonly'
			}
		}
	}
];
