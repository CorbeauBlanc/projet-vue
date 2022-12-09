const webfontsGenerator = require('webfonts-generator');
const fs = require('fs');
const Handlebars = require('handlebars');
const iconPath = 'icons/svg';
const svgFiles = fs.readdirSync(iconPath);
// console.log(svgFiles);

Handlebars.registerHelper('dotreplace', function (options) {
	return options.fn(this).replace(/\./g, " ");
});

webfontsGenerator({
	files: svgFiles.map(f => `${iconPath}/${f}`),
	dest: '../public/icons/',
	cssDest: '../public/icons/_icons-codes.css',
	html: true,
	templateOptions: {
		classPrefix: 'icon',
		baseSelector: '.icon'
	},
	htmlTemplate: "icons/templates/html.hbs",
	cssTemplate: "icons/templates/css.hbs",
	fontName: "ds-icons"

}, function (error) {
	if (error) {
		console.log('Icons compilation FAILED !', error);
	} else {
		console.log('Icons compilation done !');
	}
})
