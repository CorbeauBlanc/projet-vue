import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js';
import specialCharactersIcon from './select-all.svg.js';

export default class SpecialCharactersOverload extends SpecialCharacters {
	init() {
		super.init();

		const editor = this.editor;
		const t = editor.t;
		const initialDropdownView = editor.ui.componentFactory._components.get('specialcharacters').callback;
		editor.ui.componentFactory.add('specialCharacters', (locale) => {
			const dropdownView = initialDropdownView(locale);
			dropdownView.buttonView.set({
				label: t('Special characters'),
				icon: specialCharactersIcon,
				tooltip: true
			});

			return dropdownView;
		})
	}
}