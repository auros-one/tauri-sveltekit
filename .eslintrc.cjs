module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	ignorePatterns: [
		'src-tauri/target/**',
		'src-tauri/gen/**',
		'.svelte-kit/**',
		'build/**',
		'node_modules/**'
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
