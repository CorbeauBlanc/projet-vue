<template>
	<table class="table custom-table">
		<custom-table-pagination
			v-if="config.enablePagination && totalPages !== -1"
			v-master:row-offset="currentRowOffset"
			v-master:index="currentPage"
			:total-count="totalCount"
			:limit-per-page="limitPerPage"
			:total-pages="totalPages"
			:max-nav-links="config.enablePagination.maxNavLinks"
			:translate="config.translate"
		/>
		<thead>
			<tr>
				<th v-if="config.enableSelection" class="checkbox-cell">
					<checkbox-input
						v-model="allSelected"
						@change="updateAllSelected"
						:config="{}"
					/>
				</th>
				<th
					v-for="(label, i) in labels"
					:class="`ct-label col${i} ${
						sortingEnabled(i) ? 'sortable' : ''
					}`"
					:key="i"
					v-show="!hideCols || !hideCols.includes(i)"
				>
					<div>
						<span @click="orderByCol(i)">
							<slot :name="`label:${i}`">{{
								config.translate ? $t(label) : label
							}}</slot>
						</span>
						<i
							class="icon carret"
							v-if="
								config.enableSorting &&
								currentOrder.order &&
								currentOrder.col === i
							"
							:class="{
								up: currentOrder.order === 'asc',
								down: currentOrder.order === 'desc',
							}"
						></i>
					</div>
				</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="(row, i) in rows">
				<tr :key="row.index">
					<td v-if="config.enableSelection" class="checkbox-cell">
						<checkbox-input
							type="checkbox"
							v-model="selectedRows"
							:value="row.index"
							:config="{}"
							@change="onSelectionChange()"
						/>
					</td>
					<custom-table-cell
						v-for="(cell, j) in row.cells"
						v-show="!hideCols || !hideCols.includes(j)"
						:ref="`ctCell_${i}_${j}`"
						:class="`ct-cell row${i} col${j}`"
						:key="j"
						:enableInlineEdition="inlineEditionEnabled(j)"
						:subTableHidden="
							!row.subTable ? undefined : row.subTable.hidden
						"
						:cell-data="cell"
						:colspan="cell.colspan"
						:translate="config.translate"
						@change:cell="changeCell(row, cell, i, j, $event)"
						@delete:row="deleteRow(row, i, $event)"
						@post="restRequest(row.index, 'post', $event)"
						@put="restRequest(row.index, 'put', $event)"
						@patch="restRequest(row.index, 'patch', $event)"
						@delete="restRequest(row.index, 'delete', $event)"
						@togglesubtable="toggleSubTable(row.index)"
						@componentevent="$emit('componentevent', $event)"
					/>
				</tr>
				<tr
					v-if="row.subTable && !row.subTable.hidden"
					class="sub-table"
					:key="`st${row.index}`"
				>
					<custom-table-cell
						:enableInlineEdition="config.enableInlineEdition"
						:cell-data="row.subTable"
						:colspan="
							row.subTable.colspan
								? row.subTable
								: row.cells.length
						"
					/>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import { Component, Vision } from '@/optician';
import AxiosUtils from '@/services/AxiosUtils';
import FlashMessages from '@/services/FlashMessagesService';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import {
	ContentType,
	GetListResponse,
	LockedObject,
	RequestConfig,
	RESTOperation,
} from '@/types';
import Axios, {
	AxiosError,
	AxiosRequestConfig,
	AxiosResponse,
	Canceler,
} from 'axios';
import { Prop, Watch } from 'vue-property-decorator';
import CustomTableCell from './CustomTableCell.vue';
import CustomTableData from './CustomTableData';
import CustomTablePagination from './CustomTablePagination.vue';
import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableDataGenericInput,
	CustomTableEditionEvent,
	CustomTableREST,
	CustomTableRowData,
} from './CustomTableTypes';

/**
 * Component aiming to render a table using a large set of functionnalities.
 */
@Component({
	components: {
		CustomTableCell,
		CustomTablePagination,
		CheckboxInput,
	},
})
export default class CustomTable extends Vision {
	/**
	 * Returns the full array of rows, but filtered and sliced according to the parameters if it's not retrieved with get
	 * Also update the total count of rows after filtering.
	 * @public
	 * @returns {CustomTableRowData[]} The content of allRows
	 */
	protected get rows(): CustomTableRowData[] {
		if (this.forceUpdate) this.forceUpdate = false;
		if (this.config.restConfig && this.config.restConfig.get)
			return this.allRows;

		let tmp: CustomTableRowData[] = Array.from(this.allRows);
		if (this.filters && Object.keys(this.filters).length) {
			tmp = tmp.filter((val: CustomTableRowData): boolean => {
				return val.cells.some(
					(
						cell: string | CustomTableCellData,
						i: number
					): boolean => {
						return this.filterCell(cell, i);
					}
				);
			});
		}
		this.totalCount = tmp.length;

		if (this.config.enablePagination?.offset !== undefined) {
			return tmp.slice(
				this.config.enablePagination.offset,
				this.config.enablePagination.offset + this.limitPerPage
			);
		}
		return tmp;
	}

	/**
	 * @public
	 * Returns the total unfiltered count of registered rows of the table
	 */
	public get length(): number {
		return this.totalCount;
	}

	/**
	 * @public
	 * Is the table in loading mode (happens when retrieving data from)
	 */
	protected get isLoading(): boolean {
		return this.loading;
	}

	protected set isLoading(val: boolean) {
		this.loading = val;
		this.$emit('loading', val);
	}
	/**
	 * The data to render.
	 * @type {CustomTableData | CustomTableRowData[] | ((CustomTableCellData | string)[])[]
	 * | CustomTableDataGenericInput}
	 */
	@Prop() public readonly data!:
		| CustomTableData
		| CustomTableRowData[]
		| (CustomTableCellData | string)[][]
		| CustomTableDataGenericInput;

	/**
	 * A `string[]` for the label of each column.
	 * @type {string[]}
	 */
	@Prop() public readonly labels!: string[];

	/**
	 * @public
	 * The configuration object of the table
	 */
	@Prop({
		default: (): CustomTableConfig => {
			return {};
		},
	})
	public readonly config!: CustomTableConfig;

	/**
	 * The indexes of the columns to hide
	 * @type {number[]}
	 */
	@Prop() public readonly hideCols!: number[];

	/**
	 * The filters as an object containing only strings or arrays of strings.
	 * Each key should correspond to the key of the cell to pass through the filter
	 * @type {object}
	 */
	@Prop() public readonly filters!: { [key: string]: string | string[] };

	protected allRows: CustomTableRowData[] = [];
	protected selectedRows: (string | number)[] | boolean = [];
	protected totalCount: number = -1;
	protected limitPerPage: number = -1;
	protected totalPages: number = -1;

	protected get currentRowOffset(): number | undefined {
		return this.config.enablePagination?.offset;
	}
	protected set currentRowOffset(val: number | undefined) {
		if (
			this.config.enablePagination?.offset !== undefined &&
			val !== undefined
		) {
			this.config.enablePagination.offset = val;
			this.forceUpdate = true;
		}
	}
	protected get currentPage(): number | undefined {
		if (this.forceUpdate) this.forceUpdate = this.forceUpdate;
		return this.config.enablePagination?.page;
	}
	protected set currentPage(val: number | undefined) {
		if (this.config.enablePagination) {
			this.config.enablePagination.page = val;
			this.retrieveData();
		}
	}

	private loading: boolean = false;
	private initialRows: CustomTableRowData[] = [];
	private allSelected: boolean = false;
	private allRowsIDs: (string | number)[] = [];
	private currentOrder: {
		col: number;
		order?: string;
	} = { col: -1 };

	private cancelCurrentGetRequest?: () => void;

	public emitSelection(): void {
		/**
		 * Emitted on row selection. Contain an array containing the keys/ids of the selected rows
		 * @type {(string | number)[] | boolean}
		 */
		this.$emit('row:selected', this.selectedRows);
	}

	public emitAllSelected(): void {
		/**
		 * Emitted when all rows are selected
		 * @type {boolean}
		 */
		this.$emit('row:all-selected', this.allSelected);
		this.emitSelection();
	}

	/**
	 * @public
	 * Executes a REST request predefined in the config object
	 * @param rowIndex The index of the row that might potentially be affected by the request
	 * (will automatically be sent as a parameter of the request)
	 * @param method The method to use. Will be used to retrieve the configuration of the request.
	 * @param reqConfig (optional) Additional configuration for the request that will overload the predefined one.
	 */
	public restRequest(
		rowIndex: number | string,
		method: Exclude<keyof CustomTableREST, 'parserConfig'>,
		reqConfig?: RequestConfig
	): void {
		if (!this.config.restConfig || !this.config.restConfig[method])
			return Logger.dbgWarn(
				'CustomTable: restRequest: this.config.restConfig or this.config.restConfig[method] is undefined',
				this
			);

		this.isLoading = true;

		const request: RESTOperation = this.config.restConfig[
			method
		] as RESTOperation;
		const url: string = `${request.url}${
			request.url.endsWith('/') || method === 'post' ? '' : '/'
		}${method === 'post' ? '' : rowIndex}`;
		const config: RequestConfig = {
			...request.config,
			url,
			method,
			...reqConfig,
		};

		Axios.request(config)
			.then((response: AxiosResponse): void => {
				if (request.promiseCallback) request.promiseCallback(response);
				this.isLoading = false;
				if (this.config.flashMessageId && config.successMsg)
					FlashMessages.success(
						this.config.flashMessageId,
						this.$t(config.successMsg).toString()
					);

				this.retrieveData();
			})
			.catch((error: AxiosError): void => {
				this.isLoading = false;
				if (this.config.flashMessageId && config.failureMsg)
					FlashMessages.error(
						this.config.flashMessageId,
						this.$t(config.failureMsg).toString()
					);
				AxiosUtils.defaultSilentErrorCatch(
					error,
					`CustomTable: restRequest: request to ${request.url} failed `
				);
			});

		this.$emit(method, config);
	}

	/**
	 * @public
	 * Unselect every rows. Not sur why I did that tho, seems kinda redundant.
	 */
	public clearSelected(): void {
		if (this.allSelected) this.setAllSelected(false);
		else {
			this.selectedRows = [];
			this.emitSelection();
		}
	}

	public setAllSelected(value: boolean): void {
		this.allSelected = value;
		this.updateAllSelected();
	}

	public toggleAllSelected(): void {
		this.setAllSelected(!this.allSelected);
	}

	/**
	 * Select/unselect all rows.
	 * If pagination and rest are set, the table cannot select what it doesn't have, it will then simply emit `true`
	 * @public
	 */
	public updateAllSelected(): void {
		if (
			this.config.restConfig &&
			this.config.restConfig.get &&
			this.config.enablePagination
		)
			this.selectedRows = this.allSelected ? true : [];
		else this.selectedRows = this.allSelected ? this.allRowsIDs : [];
		this.emitAllSelected();
	}

	/**
	 * @public
	 * Shows/hides a subtable
	 * @param index The index of the row where the subtable is registered
	 */
	public toggleSubTable(index: string): void {
		const stRow: CustomTableRowData | undefined = this.allRows.find(
			(row: CustomTableRowData): boolean => row.index === index
		);
		if (stRow && stRow.subTable)
			stRow.subTable.hidden = !stRow.subTable.hidden;
	}

	/**
	 * @public
	 * Sort the table using the order of a specific column
	 * @param col The index of the column to order
	 */
	public orderByCol(col: number): void {
		if (!this.sortingEnabled(col))
			return Logger.dbgLog(
				'CustomTable: orderByCol: this.sortingEnabled(col) returned false',
				this
			);

		if (this.currentOrder.col !== col) this.currentOrder.order = 'asc';
		else
			switch (this.currentOrder.order) {
				case undefined:
					this.currentOrder.order = 'asc';
					break;
				case 'asc':
					this.currentOrder.order = 'desc';
					break;
				case 'desc':
					this.currentOrder.order = undefined;
					break;
			}
		this.currentOrder.col = col;
		if (
			this.config.restConfig &&
			this.config.restConfig.get &&
			this.config.enablePagination
		)
			this.retrieveData();
		else {
			if (!this.currentOrder.order)
				this.allRows = Array.from(this.initialRows);
			else {
				this.allRows.sort(
					(a: CustomTableRowData, b: CustomTableRowData): number => {
						const str1: string =
							typeof a.cells[col] === 'string'
								? (a.cells[col] as string)
								: (a.cells[col] as CustomTableCellData).content
										.value || '';
						const str2: string =
							typeof b.cells[col] === 'string'
								? (b.cells[col] as string)
								: (b.cells[col] as CustomTableCellData).content
										.value || '';
						let n1: number, n2: number;
						if (
							!isNaN((n1 = Number(str1))) &&
							!isNaN((n2 = Number(str2)))
						)
							return this.currentOrder.order === 'asc'
								? n1 - n2
								: n2 - n1;
						return this.currentOrder.order === 'asc'
							? str1.localeCompare(str2)
							: str2.localeCompare(str1);
					}
				);
			}
		}
	}

	public getCustomTableCell(row: number, col: number): CustomTableCell {
		return (this.$refs[`ctCell_${row}_${col}`] as CustomTableCell[])[0];
	}

	public getCustomTableCellData(
		row: number,
		col: number
	): CustomTableCellData {
		return (this.initialRows[row] as CustomTableRowData).cells[
			col
		] as CustomTableCellData;
	}

	@Watch('data', { deep: true })
	protected onDataChange(): void {
		this.resetData();
	}

	@Watch('filters', { deep: true })
	protected onFiltersChange(): void {
		if (this.config.restConfig && this.config.restConfig.get) {
			if (this.config.enablePagination)
				this.config.enablePagination.page = 0;
			this.resetData();
		}
	}

	/**
	 * Emits the changes made on a cell. It will first set the column index of the cell or
	 * use the key of the cell instead if it exists, set the row id, save the changes on the data it currently
	 * holds, emit the `change:cell` event, then call the `patch` operation if set.
	 * @public
	 */
	protected changeCell(
		row: CustomTableRowData,
		cell: string | CustomTableCellData,
		rowIndex: number,
		colIndex: number,
		event?: CustomTableEditionEvent
	): void {
		if (event === undefined) event = {};
		if (typeof cell !== 'string') {
			event.colIndex = cell.key || colIndex;
			(
				this.allRows[rowIndex].cells[colIndex] as CustomTableCellData
			).content.value = event.newValue || '';
		} else {
			event.colIndex = colIndex;
			(this.allRows[rowIndex].cells[colIndex] as string) =
				event.newValue || '';
		}
		event.rowIndex = row.index;
		/**
		 * Emitted when a cell is manually changed.
		 * Contain an object containing all the informations about a change that's been made on a cell by the user
		 * @type {CustomTableEditionEvent}
		 */
		this.$emit('change:cell', event);

		if (this.config.restConfig && this.config.restConfig.put) {
			const config: RequestConfig = { data: {} };
			config.data[event.colIndex.toString()] = event.newValue;
			this.restRequest(event.rowIndex, 'put', config);
		}
	}

	protected deleteRow(
		row: CustomTableRowData,
		rowIndex: number,
		event?: CustomTableEditionEvent
	): void {
		if (event === undefined) event = {};
		event.rowIndex = row.index;

		this.allRows.splice(rowIndex, 1);
		this.allRowsIDs.splice(rowIndex, 1);
		this.initialRows.splice(rowIndex, 1);

		this.$emit('delete:row', event);

		if (this.config.restConfig && this.config.restConfig.delete)
			this.restRequest(event.rowIndex.toString(), 'delete');
	}

	protected sortingEnabled(col: number): boolean {
		if (!this.config.enableSorting) return false;
		if (
			Array.isArray(this.config.enableSorting) &&
			!this.config.enableSorting.includes(col)
		)
			return false;
		if (
			typeof this.config.enableSorting !== 'boolean' &&
			!Array.isArray(this.config.enableSorting)
		) {
			if (!this.config.enableSorting.enabled) return false;
			if (
				Array.isArray(this.config.enableSorting.enabled) &&
				!this.config.enableSorting.enabled.includes(col)
			)
				return false;
		}
		return true;
	}

	protected inlineEditionEnabled(col: number): boolean | InputConfig {
		if (this.config.enableInlineEdition === undefined) return false;

		const { enabled, editFieldConfig } =
			typeof this.config.enableInlineEdition !== 'boolean' &&
			!Array.isArray(this.config.enableInlineEdition)
				? this.config.enableInlineEdition
				: {
						enabled: this.config.enableInlineEdition,
						editFieldConfig: true,
				  };
		if (
			enabled === true ||
			(Array.isArray(enabled) && enabled.includes(col))
		) {
			if (!editFieldConfig) return false;
			if (!Array.isArray(editFieldConfig)) return editFieldConfig;
			else {
				const i: number = enabled === true ? col : enabled.indexOf(col);
				return i < editFieldConfig.length ? editFieldConfig[i] : true;
			}
		} else return false;
	}

	protected onSelectionChange(): void {
		if (this.allSelected) this.disableAllSelected();
		else this.emitSelection();
	}

	public retrieveData(): void {
		if (!this.config.restConfig?.get)
			return Logger.dbgWarn(
				'CustomTable: retrievData: this.config.restConfig?.get is undefined',
				this
			);
		if (this.cancelCurrentGetRequest !== undefined)
			this.cancelCurrentGetRequest();

		this.deleteAllRows();
		this.isLoading = true;

		const get: RESTOperation = this.config.restConfig.get;
		const requestConfig: AxiosRequestConfig = get.config
			? { params: { ...get.config.params }, ...Js.clone({}, get.config) }
			: { params: {} };

		if (this.config.enablePagination) {
			requestConfig.params.limit = this.config.enablePagination.limit;
			requestConfig.params.offset = this.config.enablePagination.offset;
			requestConfig.params.page = this.config.enablePagination.page
				? this.config.enablePagination.page + 1
				: undefined;
		}

		if (this.currentOrder.order)
			requestConfig.params.order = this.getOrderObject();
		else delete requestConfig.params.order;

		if (this.filters) {
			for (const key in this.filters) {
				if (this.filters.hasOwnProperty(key))
					requestConfig.params[key] = this.filters[key];
			}
		}

		requestConfig.cancelToken = new Axios.CancelToken(
			(cancel: Canceler): void => {
				this.cancelCurrentGetRequest = cancel;
			}
		);

		Axios.get(get.url, requestConfig)
			.then((response: AxiosResponse): void => {
				this.cancelCurrentGetRequest = undefined;
				this.handleRetrievedData(response, requestConfig);
				this.isLoading = false;
			})
			.catch((error: AxiosError): void => {
				this.cancelCurrentGetRequest = undefined;
				if (Axios.isCancel(error))
					Logger.dbgWarn(
						`CustomTable: retrieveData: request from ${get.url} canceled`,
						error
					);
				else {
					this.isLoading = false;
					AxiosUtils.defaultErrorCatch(
						error,
						`CustomTable: retrieveData: cannot get data from ${get.url}`
					);
				}
			});
	}

	private getOrderObject(): LockedObject<string> | undefined {
		if (this.config.enableSorting === undefined || !this.currentOrder.order)
			return Logger.dbgErrorRet(
				undefined,
				'CustomTable: getOrderObject: this.config.enableSorting or this.currentOrder.order is undefined',
				this
			);

		let col: string | string[];
		const colIndex: number = this.currentOrder.col;
		if (
			typeof this.config.enableSorting === 'boolean' ||
			Array.isArray(this.config.enableSorting)
		)
			col = colIndex.toString();
		else {
			if (!this.config.enableSorting.sortingKeys)
				col = colIndex.toString();
			else if (this.config.enableSorting.sortingKeys === 'auto') {
				if (this.config.restConfig?.parserConfig?.keys)
					col =
						this.config.restConfig.parserConfig.keys[
							colIndex
						].toString();
				else col = colIndex.toString();
			} else {
				if (Array.isArray(this.config.enableSorting.enabled))
					col =
						this.config.enableSorting.sortingKeys[
							this.config.enableSorting.enabled.indexOf(colIndex)
						];
				else col = this.config.enableSorting.sortingKeys[colIndex];
			}
		}

		return typeof col === 'string'
			? Object.fromEntries([[col, this.currentOrder.order]])
			: Js.flatObjFromEntries(col, this.currentOrder.order);
	}

	/**
	 * Filter function for each cell of a row.
	 * If the cell doesn't have a key, it will try to use its column index as a key.
	 */
	private filterCell(cell: string | CustomTableCellData, i: number): boolean {
		let filter: string | string[];
		if (
			typeof cell === 'object' &&
			cell.key &&
			this.filters[cell.key.toString()]
		)
			filter = this.filters[cell.key.toString()];
		else if (this.filters[i.toString()])
			filter = this.filters[i.toString()];
		else return false;

		return CustomTableData.getDefaultCellFilterFunction(
			typeof cell === 'string' || cell.content.type === undefined
				? ContentType.STRING
				: cell.content.type
		)(filter, cell);
	}

	private disableAllSelected(): void {
		this.allSelected = false;
		if (
			this.config.restConfig &&
			this.config.restConfig.get &&
			this.config.enablePagination
		) {
			this.selectedRows = [];
			this.emitAllSelected();
		} else this.emitSelection();
	}

	private deleteAllRows(): void {
		this.allRows = [];
		this.initialRows = [];
		this.allRowsIDs = [];
	}

	/**
	 * Extract all the current rows ids into a separate array. Used later to toggle select all the rows.
	 */
	private resetAllRowsIDs(): void {
		this.allRowsIDs = [];
		if (this.allRows.length)
			this.allRows.forEach((row: CustomTableRowData): void => {
				this.allRowsIDs.push(row.index);
			});
	}

	private initCustomTable(): void {
		if (this.allRows.length && !this.initialRows.length)
			this.initialRows = Array.from(this.allRows);
		this.resetAllRowsIDs();
		if (this.config.enablePagination) {
			if (this.totalPages === undefined)
				return Logger.dbgLog(
					'CustomTable: initCustomTable: this.totalPages is undefined',
					this
				);

			this.limitPerPage = this.config.enablePagination.limit || -1;
			if (
				!this.config.restConfig?.get ||
				this.totalCount < 0 ||
				this.totalPages < 0
			) {
				if (this.config.enablePagination.totalCount !== undefined)
					this.totalCount = this.config.enablePagination.totalCount;
				else this.totalCount = this.allRows.length;
				if (this.config.enablePagination.totalPages !== undefined)
					this.totalPages = this.config.enablePagination.totalPages;
			}
		}
		this.forceUpdate = true;
	}

	/**
	 * Parse (or not) and set all the given data, whatever it might be. If data is a valid parsable object or array,
	 * a new CustomTableData will be created with ids set according to the current offset in the pagination.
	 */
	private parseData(
		data:
			| CustomTableData
			| CustomTableRowData[]
			| (CustomTableCellData | string)[][]
			| CustomTableDataGenericInput
	): void {
		if (data instanceof CustomTableData) {
			this.allRows = Array.from(data.rows);
		} else if (this.config.parseData !== false) {
			if (Js.isTypeOfInterface<CustomTableDataGenericInput>(data, 'data'))
				this.allRows = new CustomTableData(
					data,
					this.currentRowOffset
				).rows;
			else if (
				Array.isArray(data) &&
				data.length &&
				Array.isArray(data[0])
			)
				this.allRows = new CustomTableData(
					data,
					this.currentRowOffset
				).rows;
			else {
				Logger.error(
					'CustomTable: empty data or wrong data format',
					data
				);
			}
		} else if (
			Array.isArray(data) &&
			CustomTableData.isCustomTableRowData(data[0])
		)
			this.allRows = data as CustomTableRowData[];
		else {
			Logger.error(
				'CustomTable: data is empty or not an instance of CustomTableData',
				data
			);
		}

		this.initCustomTable();
	}

	/**
	 * When receiving the data, it will automatically try to set the total count of rows using
	 * the property `count` in the data.
	 * If a callback function exists, it will call it before parsing. It will in any case send
	 * the whole data as a CustomTableDataGenericInput to the parser with the given options (if any).
	 */
	private handleRetrievedData(
		response: AxiosResponse,
		requestConfig: AxiosRequestConfig
	): void {
		this.currentRowOffset = requestConfig.params.offset;

		let resp: GetListResponse = {
			data: [],
			totalCount: this.config.enablePagination?.totalCount,
			totalPages: this.config.enablePagination?.totalPages,
		};
		if (this.config.restConfig?.get?.promiseCallback)
			resp = this.config.restConfig?.get.promiseCallback(response);
		else if (Array.isArray(response.data)) resp.data = response.data;
		else {
			let foundArray: any[] | undefined;
			if (typeof response.data === 'object')
				foundArray = Js.getFirstPropOfType(response.data, Array);
			if (typeof response.data !== 'object' || !foundArray)
				return Logger.error(
					'CustomTable: retrieveData: unsupported data:',
					response.data
				);
			else resp.data = foundArray;
		}

		if (resp.totalCount !== undefined) this.totalCount = resp.totalCount;
		if (resp.totalPages !== undefined) this.totalPages = resp.totalPages;
		if (this.totalPages === 0 && this.currentPage) this.currentPage = 0;
		this.parseData({
			data: resp.data,
			...this.config.restConfig?.parserConfig,
		} as CustomTableDataGenericInput);
	}

	private resetData(): void {
		if (!this.data && this.config.restConfig?.get) this.retrieveData();
		else if (this.data) {
			this.isLoading = true;
			this.parseData(this.data);
			this.isLoading = false;
		} else
			return Logger.dbgWarn(
				'CustomTable: resetData: this.data and this.config.restConfig?.get are undefined',
				this
			);
	}

	/**
	 * Upon creation retrieve the data and/or initialize it, and sets watchers for live updates.
	 */
	private created(): void {
		if (
			this.config.enablePagination &&
			this.config.enablePagination.page === undefined
		)
			this.config.enablePagination.page = 0;

		this.resetData();
	}

	private updated(): void {
		this.$nextTick().then((): void => {
			this.$emit('updated');
		});
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.custom-table {
	.checkbox-cell {
		width: 1rem;

		.checkbox-input {
			display: inline-block;

			.field {
				padding: 0;
				display: inline-block;

				label {
					margin-bottom: 0;
				}
			}
		}
	}
}
</style>
