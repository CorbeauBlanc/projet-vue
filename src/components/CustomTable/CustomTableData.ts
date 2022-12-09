import Logger from '@/services/LoggerService';
import { ContentType } from '@/types';
import {
	CustomTableCellData,
	CustomTableDataGenericInput,
	CustomTableRowData,
} from './CustomTableTypes';

function isGenericCellDisplayed(
	filter: string | string[],
	cell: CustomTableCellData
): boolean {
	const toComp: string = cell.content.value || '';

	if (typeof filter === 'string') return toComp.includes(filter);
	else
		return filter.some((val: string): boolean => {
			return toComp.includes(val);
		});
}

/**
 * Function used to determine if the value of a string cell is including the value(s) of a filter
 */
function isStringCellDisplayed(
	filter: string | string[],
	cell: CustomTableCellData | string
): boolean {
	const toComp: string =
		typeof cell === 'string' ? cell : cell.content.value || '';

	if (typeof filter === 'string') return toComp.includes(filter);
	else
		return filter.some((val: string): boolean => {
			return toComp.includes(val);
		});
}

/**
 * Function used to determine if the path of a link cell is including the value(s) of a filter
 */
function isLinkCellDisplayed(
	filter: string | string[],
	cell: CustomTableCellData
): boolean {
	if (isGenericCellDisplayed(filter, cell)) return true;
	if (cell.content.href === undefined) return false;

	const path: string = cell.content.href;
	if (typeof filter === 'string') return path.includes(filter);
	else
		filter.some((val: string): boolean => {
			return path.includes(val);
		});
	return false;
}

/**
 * Function used to determine if the data passed to a component cell,
 * or any of its property if said data is an object, is including the value(s) of a filter
 */
function isComponentCellDisplayed(
	filter: string | string[],
	cell: CustomTableCellData
): boolean {
	return isGenericCellDisplayed(filter, cell);
}

/**
 * Class describing the formatted data used by the custom table.
 * Parse automatically different kinds of data into a known readable object for the custom table.
 *
 * @export
 */
export default class CustomTableData {
	public static isCustomTableCellData(
		obj: any,
		type?: ContentType
	): obj is CustomTableCellData {
		return (
			obj.hasOwnProperty('content') &&
			typeof obj.content === 'object' &&
			(type === undefined || obj.content.type === type)
		);
	}

	public static isCustomTableRowData(obj: any): obj is CustomTableRowData {
		return (
			obj.hasOwnProperty('index') &&
			(typeof obj.index === 'string' || typeof obj.index === 'number') &&
			obj.hasOwnProperty('cells') &&
			Array.isArray(obj.cells)
		);
	}

	public static isSubTableCellData(obj: any): obj is CustomTableCellData {
		if (CustomTableData.isCustomTableCellData(obj, ContentType.TABLE))
			return true;
		return (
			CustomTableData.isCustomTableCellData(obj) &&
			(obj.content.table?.data || obj.content.table?.config?.restConfig)
		);
	}

	public static isValidCellData(obj: any): boolean {
		return (
			typeof obj === 'string' ||
			typeof obj === 'number' ||
			CustomTableData.isCustomTableCellData(obj)
		);
	}

	public static getDefaultCellFilterFunction(
		type: ContentType
	): (filter: string | string[], cell: any) => boolean {
		return [
			isStringCellDisplayed,
			isGenericCellDisplayed,
			isComponentCellDisplayed,
			isLinkCellDisplayed,
			(filter: string | string[], cell: any): boolean => true,
			isLinkCellDisplayed,
			isGenericCellDisplayed,
		][type];
	}

	/**
	 * Array of all the parsed rows
	 */
	public rows: CustomTableRowData[] = [];

	/**
	 * Offset of the id of each rows
	 *
	 * @private
	 */
	private idOffset: number = 0;

	/**
	 * Creates an instance of CustomTableData, parsing at the same time the data to be used in the CustomTable.
	 * If the parameter is an array of CustomTableRowData it won't be parsed.
	 * @param {(CustomTableRowData[]
	 * 			| ((CustomTableCellData | string | any[])[])[]
	 * 			| CustomTableDataGenericInput)} [data]
	 * @param {number} [idOffset]
	 */
	constructor(
		data?:
			| CustomTableRowData[]
			| (CustomTableCellData | string | any[])[][]
			| CustomTableDataGenericInput,
		idOffset?: number
	) {
		if (idOffset) this.idOffset = idOffset;

		if (data) {
			if (
				Array.isArray(data) &&
				!Array.isArray(data[0]) &&
				CustomTableData.isCustomTableRowData(data[0])
			)
				this.rows = data as CustomTableRowData[];
			else if (Array.isArray(data) && Array.isArray(data[0])) {
				this.rows = this.parseArrayData(
					data as (CustomTableCellData | string | any[])[][]
				);
			} else if (data.hasOwnProperty('data')) {
				if (data.keys && data.keys.length)
					this.rows = this.parseData(
						data as CustomTableDataGenericInput
					);
				else
					this.rows = this.parseAllData(
						data as CustomTableDataGenericInput
					);
			} else Logger.error('CustomTableData: unrecognized data', data);
		}
	}

	/**
	 * Returns a new CustomTableCellData describing a table.
	 * If obj is just a generic object, the cell will just be describing a CustomTableDataGenericInput,
	 * otherwise table cell will be created, and a new CustomTableData will be created from obj,
	 * thus recursively calling the parser of CustomTableData.
	 *
	 * @private
	 * @param {*} obj
	 * @returns {CustomTableCellData}
	 */
	private getTableCell(obj: any): CustomTableCellData {
		if (CustomTableData.isSubTableCellData(obj)) {
			obj.content.type = ContentType.TABLE;
			return obj;
		}
		if (
			Array.isArray(obj) &&
			!Array.isArray(obj[0]) &&
			!CustomTableData.isCustomTableRowData(obj[0])
		)
			obj = { data: obj } as CustomTableDataGenericInput;

		return {
			content: {
				value: '',
				type: ContentType.TABLE,
				table: {
					data: new CustomTableData(obj),
				},
			},
		};
	}

	/**
	 * Returns a new CustomTableCellData describing a string (which will be parsed as a link if necessary)
	 * with the addition of a tracking key, usually corresponding to the name of the property it's coming from
	 *
	 * @private
	 * @param {string} str
	 * @param {string} objKey
	 * @returns {CustomTableCellData}
	 */
	private getTrackedStringCell(
		str: string,
		objKey: keyof any
	): CustomTableCellData {
		if (str.indexOf('https://') === 0 || str.indexOf('http://') === 0)
			return {
				content: {
					value: str,
					type: ContentType.LINK,
					href: str,
				},
				key: objKey,
			};
		return {
			content: {
				value: str,
				type: ContentType.STRING,
			},
			key: objKey,
		};
	}

	/**
	 * Parse a generic double array into an array of CustomTableRowData.
	 * Each string that can be a link is parsed as such,
	 * if a cell is an array or an unknown object it will be parsed through getTableCell()
	 * Each row is tracked by its position in the given array + an offset when needed
	 *
	 * @private
	 * @param {(((CustomTableCellData | string | any[])[])[])} data
	 * @returns {CustomTableRowData[]}
	 */
	private parseArrayData(
		data: (CustomTableCellData | string | any[])[][]
	): CustomTableRowData[] {
		const parsed: CustomTableRowData[] = [];

		data.forEach(
			(
				row: (CustomTableCellData | string | any[])[],
				index: number
			): void => {
				parsed.push({
					index: this.idOffset + index,
					cells: [],
				});
				row.forEach(
					(cell: CustomTableCellData | string | any[]): void => {
						if (
							Array.isArray(cell) ||
							CustomTableData.isSubTableCellData(cell)
						)
							parsed[index].cells.push(this.getTableCell(cell));
						else if (CustomTableData.isValidCellData(cell))
							if (
								typeof cell === 'string' &&
								(cell.indexOf('https://') === 0 ||
									cell.indexOf('http://') === 0)
							)
								parsed[index].cells.push({
									content: {
										value: cell,
										type: ContentType.LINK,
										href: cell,
									},
								});
							else parsed[index].cells.push(cell);
					}
				);
			}
		);
		return parsed;
	}

	/**
	 * Insert a new tracked by key cell into an array of CustomTableRowData. Every type of data will be parsed.
	 *
	 * @private
	 * @param {CustomTableDataGenericInput} input
	 * @param {CustomTableRowData[]} parsed
	 * @param {number} index
	 * @param {*} element
	 * @param {string} key
	 */
	private insertNewCell(
		input: CustomTableDataGenericInput,
		parsed: CustomTableRowData[],
		index: number,
		element: any,
		key: keyof any
	): void {
		let obj: any;

		if (!element.hasOwnProperty(key))
			return Logger.dbgError(
				'CustomTableData: insertNewCell: element.hasOwnProperty(key) returned false',
				this
			);
		obj = input.modifier
			? input.modifier(element[key], key, element, index)
			: element[key];
		if (obj === null || obj === undefined)
			return Logger.dbgError(
				'CustomTableData: insertNewCell: obj is null or undefined',
				this
			);

		let type: string = typeof obj;
		if (type === 'object') {
			if (Array.isArray(obj) || CustomTableData.isSubTableCellData(obj))
				type = 'array';
			else if (CustomTableData.isCustomTableCellData(obj)) type = 'cell';
		}

		switch (type) {
			case 'array':
				parsed[index].subTable = {
					hidden: true,
					...this.getTableCell(obj),
				};
				return Logger.dbgLog(
					'CustomTableData: insertNewCell: type is equal to "array"'
				);
			case 'cell':
				(obj as CustomTableCellData).key = key;
				break;
			case 'object':
				return Logger.dbgLog(
					'CustomTableData: insertNewCell: type is equal to "object"'
				);
			default:
				obj = this.getTrackedStringCell(obj.toString(), key);
				break;
		}
		parsed[index].cells.push(obj);
	}

	/**
	 * Parse all the data contained in a CustomTableDataGenericInput into an array of usable CustomTableRowData.
	 * Every iterable property of every object in the array will be a cell tracked by its key.
	 * Each row will be tracked by the value of the property given through input.trackBy,
	 * or, if the latter is undefined, by its position in the array of the given CustomTableDataGenericInput
	 *
	 * @private
	 * @param {CustomTableDataGenericInput} input
	 * @returns {CustomTableRowData[]}
	 */
	private parseAllData(
		input: CustomTableDataGenericInput
	): CustomTableRowData[] {
		const parsed: CustomTableRowData[] = [];

		input.data.forEach((element: any, index: number): void => {
			parsed.push({
				index: input.trackBy
					? element[input.trackBy].toString()
					: this.idOffset + index,
				cells: [],
			});
			for (const key in element) {
				if (element.hasOwnProperty(key))
					this.insertNewCell(input, parsed, index, element, key);
			}
		});
		return parsed;
	}

	/**
	 * Parse some of the data contained in a CustomTableDataGenericInput into an array of usable CustomTableRowData.
	 * Only the properties of the objects in the array that match the given keys will be transformed in cells
	 * tracked by their key.
	 * Each row will be tracked by the value of the property given through input.trackBy,
	 * or, if the latter is undefined, by its position in the array of the given CustomTableDataGenericInput
	 *
	 * @private
	 * @param {CustomTableDataGenericInput} input
	 * @returns {CustomTableRowData[]}
	 */
	private parseData(
		input: CustomTableDataGenericInput
	): CustomTableRowData[] {
		const parsed: CustomTableRowData[] = [];

		input.data.forEach((element: any, index: number): void => {
			if (element === null || element === undefined)
				return Logger.dbgWarn(
					'CustomTable: parseData: element is null or undefined',
					this
				);

			parsed.push({
				index:
					input.trackBy && element.hasOwnProperty(input.trackBy)
						? element[input.trackBy].toString()
						: this.idOffset + index,
				cells: [],
			});
			if (input.keys) {
				input.keys.forEach((key: keyof any): void => {
					this.insertNewCell(input, parsed, index, element, key);
				});
			}
		});
		return parsed;
	}
}
