/// <reference types="@types/ckeditor/index.d.ts" />
/// <reference types="@types/ckeditor__ckeditor5-media-embed/index.d.ts/index.d.ts" />

// tslint:disable-next-line:no-namespace
declare namespace CKEDITOR {
	interface AlignmentFormat {
		// The CSS class used to represent the style in the view. Used to override default, inline styling for alignment.
		className: string;

		// One of the alignment names options.
		name: 'left' | 'right' | 'center' | 'justify';
	}

	// tslint:disable-next-line:class-name
	interface config {
		toolbar: string[] | { items: string[] };
		fontColor?: {
			// Available font colors defined as an array of strings or objects.
			colors?: (
				| string
				| { color: string; label: string; hasBorder?: boolean }
			)[];

			// Represents the number of columns in the font color dropdown.
			columns?: number;

			// Determines the maximum number of available document colors.
			// Setting it to 0 will disable the document colors feature.
			documentColors?: number;
		};
		fontSize?: { options: string[] };
		alignement?: {
			options: (string | AlignmentFormat)[];
		};
		emoji?: { name: string; text: string }[];
		simpleUpload?: {
			// The URL that the images are uploaded to.
			uploadUrl: string;

			// Enable the XMLHttpRequest.withCredentials property.
			withCredentials?: boolean;

			// Headers sent along with the XMLHttpRequest to the upload server.
			headers?: { [key: string]: string };
		};
		mediaEmbed?: {
			// Overrides the element name used for "semantic" data.
			elementName?: string;

			// The additional media providers supported by the editor. This configuration helps extend the default providers.
			extraProviders?: MediaEmbedProvider[];

			// Controls the data format produced by the feature.
			previewsInData?: boolean;

			// The default media providers supported by the editor.
			providers?: MediaEmbedProvider[];

			// The list of media providers that should not be used despite being available in config.mediaEmbed.providers and
			// config.mediaEmbed.extraProviders
			removeProviders?: string[];

			// Items to be placed in the media embed toolbar. This option requires adding MediaEmbedToolbar to the plugin list.
			toolbar?: string[];
		};
		table?: {
			// Items to be placed in the table content toolbar. The TableToolbar plugin is required to make this toolbar work.
			contentToolbar?: string[];

			// The configuration of the table cell properties user interface (balloon). It allows to define:
			tableCellProperties?: {
				borderColors?: (string | { color: string; label: string })[];
				backgroundColors?: (
					| string
					| { color: string; label: string }
				)[];
				defaultProperties?: {
					// The default background-color of the table cell.
					backgroundColor?: string;

					// The default border-color of the table cell.
					borderColor?: string;

					// The default border-style of the table cell.
					borderStyle?: string;

					// The default border-width of the table cell.
					borderWidth?: string;

					// The default height of the table cell.
					height?: string;

					// The default horizontalAlignment of the table cell.
					horizontalAlignment?: string;

					// The default padding of the table cell.
					padding?: string;

					// The default verticalAlignment of the table cell.
					verticalAlignment?: string;

					// The default width of the table cell.
					width?: string;
				};
			};

			// The configuration of the table properties user interface (balloon). It allows to define:
			tableProperties?: {
				borderColors?: (string | { color: string; label: string })[];
				backgroundColors?: (
					| string
					| { color: string; label: string }
				)[];
				defaultProperties?: {
					// The default alignment of the table.
					alignment?: string;

					// The default background-color of the table.
					backgroundColor?: string;

					// The default border-color of the table.
					borderColor?: string;

					// The default border-style of the table.
					borderStyle?: string;

					// The default border-width of the table.
					borderWidth?: string;

					// The default height of the table.
					height?: string;

					// The default width of the table.
					width?: string;
				};
			};

			// Items to be placed in the table toolbar. The TableToolbar plugin is required to make this toolbar work.
			tableToolbar?: string[];
		};
	}
}
