import CustomTable from '@/components/CustomTable/CustomTable.vue';
import { CustomTableConfig } from '@/components/CustomTable/CustomTableTypes';
import {
	FiltersConfigCollection,
	FiltersMap,
	FiltersValue,
} from '@/components/Filters/FiltersTypes';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import { Vision } from '@/optician';
import ComponentsUtils from '@/services/ComponentsUtils';
import Js from '@/services/JsService';
import { RouteQuery, RouterUtils } from '@/services/RouterUtils';
import _ from 'lodash';
import { Ref } from 'vue-property-decorator';
import { Dictionary } from 'vue-router/types/router';

export default abstract class Listing extends Vision {
	protected get tableFilters(): FiltersMap {
		return this.filters;
	}
	protected set tableFilters(val: FiltersMap) {
		if (this.currentGlobalSearch !== '')
			this.filters = {
				...val,
				...this.getGlobalSearchFilters(this.currentGlobalSearch),
			};
		else this.filters = val;
	}

	protected get rawTableFilters(): Dictionary<FiltersValue> {
		return this.rawFilters;
	}
	protected set rawTableFilters(val: Dictionary<FiltersValue>) {
		if (!val || Object.keys(val).length === 0)
			this.currentGlobalSearch = '';

		this.rawFilters = val;
		RouterUtils.instance.addQueryToCurrentRoute(this.getQueryfiedFilters());
	}

	protected showFilters: boolean = false;
	protected listLength: number = 0;
	protected currentGlobalSearch: string = '';
	protected tableIsLoading: boolean = false;
	protected searchConfig: InputConfig = {
		placeholder: 'Rechercher par mot clé...',
		translate: true,
		search: true,
		multiple: false,
	};

	protected abstract tableConfig: CustomTableConfig | false;
	protected abstract filtersConfig: FiltersConfigCollection;

	@Ref() protected readonly table!: CustomTable;
	private filters: FiltersMap = {};
	private rawFilters: Dictionary<FiltersValue> = {};

	protected onTableUpdate(that: Listing): void {
		that.listLength =
			(that.table as any).length >= 0 ? (that.table as any).length : 0;
		ComponentsUtils.setTitle(that, that.listLength.toString());
		Js.clearHighlightedTextInHTML(that.table.$el);
		if (that.currentGlobalSearch !== '')
			Js.highlightTextInHTML(
				that.currentGlobalSearch,
				Js.defaultHighlightStyle,
				that.table.$el
			);
	}

	protected getQueryfiedFilters(): Dictionary<string | string[]> {
		const query: Dictionary<string | string[]> =
			this.currentGlobalSearch && this.currentGlobalSearch !== ''
				? { search: this.currentGlobalSearch }
				: {};
		for (const key in this.rawFilters) {
			if (this.rawFilters.hasOwnProperty(key)) {
				const val: string | string[] = JSON.stringify(
					this.rawFilters[key]
				);
				if (val.length) query[key] = val;
			}
		}
		return query;
	}

	protected globalSearch(that: Listing): void {
		if (!that.currentGlobalSearch || that.currentGlobalSearch === '')
			that.tableFilters = _.omit(
				that.tableFilters,
				Object.keys(that.getGlobalSearchFilters(''))
			);
		else
			that.tableFilters = {
				...that.tableFilters,
				...that.getGlobalSearchFilters(that.currentGlobalSearch),
			};
		RouterUtils.instance.addQueryToCurrentRoute(this.getQueryfiedFilters());
	}

	protected abstract getGlobalSearchFilters(value: string): FiltersMap;

	protected mandatoryComponentInit(): void {
		const query: RouteQuery | Dictionary<string> =
			RouterUtils.instance.getCurrentRouteQuery();
		for (const key in query) {
			if (Object.prototype.hasOwnProperty.call(query, key)) {
				if (
					(typeof query[key] !== 'string' &&
						!Array.isArray(query[key])) ||
					!query[key]?.length
				)
					delete query[key];
				else if (key === 'search') {
					this.currentGlobalSearch = query[key] as string;
					delete query[key];
				}
				query[key] = JSON.parse((query as Dictionary<string>)[key]);
			}
		}
		if (Object.keys(query).length) this.showFilters = true;
		this.rawFilters = query as Dictionary<string>;
	}

	protected abstract created(): void;
}
