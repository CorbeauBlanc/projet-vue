const path = require('path');
const fs = require('fs');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const {
	styles
} = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			config.externals = function (
				context,
				request, callback) {
				if (/.*\.development\..*$/.test(request))
					callback(null, 'commonjs ' + request);
				else
					callback();
			};
			config.devtool = false;
		}
	},
	configureWebpack: {
		plugins: [
			new CKEditorWebpackPlugin({
				language: 'en',
				translationsOutputFile: /app/
			})
		],
		optimization: {
			splitChunks: {
				chunks: process.env.NODE_ENV === 'development' ? 'all' : 'async'
			}
		},
		devtool: false,
	},
	productionSourceMap: false,
	transpileDependencies: [
		/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
	],
	parallel: false,
	chainWebpack: (config) => {
		config.module.rule('svg').exclude.add(path.join(__dirname, 'node_modules', '@ckeditor'));

		config.module
			.rule('cke-svg')
			.test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
			.use('raw-loader')
			.loader('raw-loader');

		config.module
			.rule('cke-css')
			.test(/ckeditor5-[^/\\]+[/\\].+\.css$/)
			.use('postcss-loader')
			.loader('postcss-loader')
			.tap(() => {
				return styles.getPostCssConfig({
					themeImporter: {
						themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
					},
					minify: true
				});
			});

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
	transpileDependencies: [
		/ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
	],
	parallel: false,
	devServer: {
		
		disableHostCheck: process.env.NODE_ENV === 'development',
		https: process.env.VUE_APP_HTTPS === 'true' ? {
			key: fs.readFileSync('./dev-leo.testapic.com-key.pem'),
			cert: fs.readFileSync('./dev-leo.testapic.com.pem'),
		} : false,
	},
	pluginOptions: {
		pluginOptions: {
			i18n: {
				locale: 'fr',
				fallbackLocale: 'fr',
				localeDir: 'locales',
				enableInSFC: true,
				enableLegacy: false
			}
		},
		compression: {
			brotli: {
				filename: '[path].br[query]',
				algorithm: 'brotliCompress',
				include: /\.(js|css|html|svg|json)(\?.*)?$/i,
				compressionOptions: {
					level: 11,
				},
				minRatio: 0.8,
			},
			gzip: {
				filename: '[path].gz[query]',
				algorithm: 'gzip',
				include: /\.(js|css|html|svg|json)(\?.*)?$/i,
				minRatio: 0.8,
			}
		}
	}
}
