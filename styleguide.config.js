const path = require('path');

module.exports = {
	// set your styleguidist configuration here
	title: 'Leo Vue Components Documentation',
	components: 'src/components/**/[A-Z]*.vue',
	styleguideDir: 'docs/components',
	defaultExample: false,
	propsParser(filePath) {
		const res = require('vue-docgen-api').parse(filePath);
		for (const key in res.props) {
			if (res.props.hasOwnProperty(key)) {
				const prop = res.props[key];
				if (prop.tags.type && prop.tags.type[0].type && prop.tags.type[0].type.name)
					res.props[key].type.name = prop.tags.type[0].type.name;
			}
		}
		return res;
	},
	template: {
		body: {
			raw: `
				<div style="background-color: rgba(58, 55, 55, 0.87);
							padding: 16px; position: fixed;
							top: 0; right: 0;">
					<a class="rsg--button-32" href="${path.resolve(__dirname, 'docs/typescript/index.html')}">
						typescript modules
					</a>
				</div>`
		}
	},
	theme: {
		color: {
			base: '#D4D4D4',
			light: '#767676',
			lightest: '#ccc',
			link: '#9CDCFE',
			linkHover: '#569cd6',
			focus: 'rgba(22, 115, 177, 0.25)',
			border: '#ccc',
			name: '#9CDCFE',
			type: '#4EC9B0',
			error: '#f44747',
			baseBackground: '#1E1E1E',
			codeBackground: '#252526',
			sidebarBackground: '#1E1E1E',
			ribbonBackground: '#1E1E1E',
			ribbonText: '#D4D4D4',
			codeBase: '#D4D4D4',
			codeComment: '#6A9955',
			codePunctuation: '#808080',
			codeProperty: '#9cdcfe',
			codeDeleted: '#ce9178',
			codeString: '#ce9178',
			codeInserted: '#b5cea8',
			codeOperator: '#D4D4D4',
			codeKeyword: '#569cd6',
			codeFunction: '#DCDCAA',
			codeVariable: '#9CDCFE',
		}
	}
}
