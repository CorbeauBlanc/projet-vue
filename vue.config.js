const fs = require('fs');

module.exports = {
	configureWebpack: {
		optimization: {
			splitChunks: {
				chunks: process.env.NODE_ENV === 'development' ? 'all' : 'async'
			}
		},
		devtool: false,
	},
	productionSourceMap: false,
	parallel: false,
	chainWebpack: (config) => {
		config.module
			.rule('pug')
			.oneOf('pug-vue')
			.use('pug-plain-loader')
			.loader('pug-plain-loader')
			.tap((options) => {
				options = {
					basedir: __dirname,
				};
				return options;
			})
	},
	devServer: {
		disableHostCheck: process.env.NODE_ENV === 'development',
		https: process.env.VUE_APP_HTTPS === 'true' ? {
			key: fs.readFileSync('./localhost-key.pem'),
			cert: fs.readFileSync('./localhost.pem'),
		} : false,
	},
}
