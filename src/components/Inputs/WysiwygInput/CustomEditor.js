/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import HtmlEmbed from '@ckeditor/ckeditor5-html-embed/src/htmlembed.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert.js';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
//import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
//import MediaEmbedToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter.js';
import SpecialCharactersOverload from './ckeditor5-special-characters-overload/specialcharacters';
import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js';
//import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';

import { Plugin } from 'ckeditor5/src/core';
import emojisList from './ckeditor5-special-characters-overload/Emojis';
import arrowsList from './ckeditor5-special-characters-overload/Arrows';
import testapicList from './ckeditor5-special-characters-overload/Testapic';

class SpecialCharactersEmojis extends Plugin {
	constructor(editor) {
		super(editor);
		editor.plugins.get('SpecialCharacters').addItems(
			'Emojis',
			emojisList
		);
	}
}

class SpecialCharactersMoreArrows extends Plugin {
	constructor(editor) {
		super(editor);
		editor.plugins.get('SpecialCharacters').addItems(
			'Arrows',
			arrowsList
		);
	}
}

class SpecialCharactersTestapic extends Plugin {
	constructor(editor) {
		super(editor);
		editor.plugins.get('SpecialCharacters').addItems(
			'Testapic',
			testapicList
		);
	}
}

class Editor extends ClassicEditor { }

// Plugins to include in the build.
Editor.builtinPlugins = [
	Alignment,
	AutoImage,
	AutoLink,
	Bold,
	Essentials,
	FontColor,
	FontSize,
	HtmlEmbed,
	Image,
	ImageInsert,
	ImageResize,
	ImageUpload,
	Italic,
	Link,
	List,
	MediaEmbed,
	//MediaEmbedToolbar,
	Paragraph,
	PasteFromOffice,
	RemoveFormat,
	SimpleUploadAdapter,
	SpecialCharactersOverload,
	SpecialCharactersArrows,
	SpecialCharactersEmojis,
	SpecialCharactersMoreArrows,
	SpecialCharactersTestapic,
	Table,
	TableCellProperties,
	TableProperties,
	TableToolbar
];

export default Editor;
