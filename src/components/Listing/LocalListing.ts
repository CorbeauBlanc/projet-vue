import CustomTable from '@/components/CustomTable/CustomTable.vue';
import { CustomTableConfig } from '@/components/CustomTable/CustomTableTypes';
import { FiltersMap } from '@/components/Filters/FiltersTypes';
import _ from 'lodash';
import Vue from 'vue';
import { Ref } from 'vue-property-decorator';

export default abstract class LocalListing extends Vue {
	protected get tableFilters(): FiltersMap {
		return this.filters;
	}
	protected set tableFilters(val: FiltersMap) {
		this.filters = val;
	}

	protected abstract tableConfig: CustomTableConfig | false;

	protected tableIsLoading: boolean = false;
	protected listLength: number = 0;
	protected currentLocalSearch: string = '';
	private filters: FiltersMap = {};

	@Ref() protected readonly table!: CustomTable;

	protected onTableUpdate(that: LocalListing): void {
		that.listLength =
			(that.table as any).length >= 0 ? (that.table as any).length : 0;
	}
}
