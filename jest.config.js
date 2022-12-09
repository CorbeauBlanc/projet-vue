module.exports = {
	testPathIgnorePatterns: ['/node_modules/', '/*.ignoretest/'],
	"moduleFileExtensions": [
		"js",
		"ts",
		"json",
		"vue"
	],
	"transform": {
		".*\\.(vue)$": "vue-jest"
	},
	"testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	globals: {
		'vue-jest': {
			pug: {
				basedir: __dirname,
				doctype: 'html'
			}
		},
		'ts-jest': {
			babelConfig: 'babel.config.js',
		}
	},
}
