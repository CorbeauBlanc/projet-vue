import { InputConfig } from '@/components/Inputs/InputsTypes';
import { ContentType, GetListResponse, RESTOperation } from '@/types';
import { Location } from 'vue-router';

/**
 * Interface describing the content a CustomTableCell will be rendering.
 * @export
 */
export interface CustomTableCellData {
	class?: string;
	/**
	 * The key used to track the cell
	 */
	key?: keyof any;
	colspan?: number;
	toggleSubtable?: boolean;
	content: CustomTableCellContent;
}

export interface CustomTableCellContent {
	/**
	 * The type of content this is (number for compatibility). Defaults to STRING
	 */
	type?: ContentType | number;
	/**
	 * The value to be displayed of either a string, a link or the "alt" attribute of an image.
	 */
	value?: string;
	/**
	 * The CSS classe(s) to be injected in the cell
	 */
	class?: string;
	/**
	 * The path for a link
	 */
	href?: string;
	src?: string;
	route?: string | Location;
	icon?: string;
	translate?: boolean;
	component?: {
		name: string;
		/**
		 * The data that will be injected if the cell is holding a custom component
		 */
		data?: { [key: string]: any };
		path: string;
	};
	table?: {
		/**
		 * The config object to be injected if the cell is holding a CustomTable
		 */
		config?: CustomTableConfig;
		/**
		 * The array of labels to be injected if the cell is holding a CustomTable
		 */
		labels?: string[];
		/**
		 * The data that will be injected if the cell is holding another CustomTable
		 */
		data?: any;
	};
	tooltip?: {
		text: string;
		class: string;
	};
}

export interface CustomSubTableData extends CustomTableCellData {
	hidden: boolean;
}

/**
 * Interface describing a single row of data in a CustomTable
 * @export
 */
export interface CustomTableRowData {
	/**
	 * The tracking key / position index of the row in the table
	 */
	index: string | number;
	/**
	 * The array of cell data of the row
	 */
	cells: (CustomTableCellData | string)[];
	subTable?: CustomSubTableData;
}

export interface CustomTableParserConfig<T = any> {
	/**
	 * The list of properties that should be used as a cell for each object. If not specified every iterable property
	 * will be used. The order of the keys in this parameter will force the final order of the columns in the table
	 */
	keys?: (keyof T)[];
	/**
	 * The name of the property of each object which value should be used to track a row
	 */
	trackBy?: keyof T;
	/**
	 * A callback function that will be called every time a new cell is about to be inserted.
	 * Its purpose is to change the value of the cell if necessary.
	 *
	 * @argument value : The current value of the cell
	 * @argument propertyName : The property of the object the value is from (optional)
	 * @argument obj : The object being currently parsed as a row
	 * @argument index : The position in the table of the row the cell will be in (optional)
	 */
	modifier?: (
		value: T[keyof T],
		propertyName: keyof T,
		obj: T,
		index: number
	) => CustomTableCellData | string | number;
}

/**
 * Interface used to pass an array of unknown objects to the parser
 * @export
 */
export interface CustomTableDataGenericInput extends CustomTableParserConfig {
	/**
	 * The array to be parsed
	 */
	data: any[];
}

/**
 * Interface used to configure the functionalities of the CustomTable
 * @export
 */
export interface CustomTableConfig {
	/**
	 * Should the table automatically parse the given data ? (enabled by default)
	 */
	parseData?: boolean;
	/**
	 * Should the UI for row selection be used ? (disabled by default)
	 */
	enableSelection?: boolean;
	/**
	 * Should the user be able to change a the cells directly in the table ? (disabled by default)
	 */
	// prettier-ignore
	enableInlineEdition?:
	| boolean
	| number[]
	| {
		enabled: boolean | number[];
		editFieldConfig?: InputConfig | InputConfig[];
		editionKeys?: (string | string[])[] | 'auto';
	};
	/**
	 * Should user be able to sort the table by clicking the label of a column ? (disabled by default)
	 */
	// prettier-ignore
	enableSorting?:
	| boolean
	| number[]
	| {
		enabled: boolean | number[];
		sortingKeys?: (string | string[])[] | 'auto';
	};
	/**
	 * Should the table split the data into multiple pages ? (disabled by default)
	 */
	enablePagination?: {
		/**
		 * The limit of row per page
		 */
		limit?: number;
		/**
		 * The current row offset the table is at
		 */
		offset?: number;
		page?: number;
		/**
		 * The total number of rows to be expected. If this number can be retrived in the response of a get request
		 * you can set the property name here, by default 'count' is used.
		 * If count is not defined here the lenght of the data array will be used.
		 */
		totalCount?: number;
		totalPages?: number;
		maxNavLinks?: number;
	};
	translate?: boolean;
	/**
	 * should the table perform rest operations to get/update its data ? (disabled by default)
	 */
	restConfig?: CustomTableREST;
	flashMessageId?: string;
}

/**
 * Interface describing the event sent when a cell is manually modified inside the table.
 * @export
 */
export interface CustomTableEditionEvent {
	/**
	 * The tracking key / position index of the row in the table
	 */
	rowIndex?: string | number;
	/**
	 * The tracking key / position index of the cell in the row
	 */
	colIndex?: keyof any;
	oldValue?: any;
	newValue?: any;
}

export interface CustomTableREST {
	get?: RESTOperation<GetListResponse>;
	post?: RESTOperation;
	put?: RESTOperation;
	patch?: RESTOperation;
	delete?: RESTOperation;
	parserConfig?: CustomTableParserConfig;
}
