<template>
	<view-root id="gains-history">
		<template #heading>
			<h2 class="title">
				Historique des gains
				<span class="counter">{{ listLength }}</span>
			</h2>
		</template>
		<template #content>
			<div>
				<!-- <div class="container">
					<div class="heading secondary alt">
						<filters id="search-filter" :inputs="search" @change="globalSearch($event)" />
						<div>
							<button
								:class="['button ghost filter', showFilters ? 'active' : '']"
								@click="showFilters = !showFilters"
							>
								<icon filter />
								Filtrer
							</button>
						</div>
					</div>
				</div>
				<div v-if="showFilters">
					<div class="container">
						<filters id="advanced-filters" class="three columns stackable grid" :inputs="filters" :lazy="true" />
					</div>
				</div>-->
				<div class="container text">
					<div class="segments">
						<!-- <div v-if="listLength < 1" class="segment empty state">
							<icon search huge />
							<h4 class="h4 content">Aucun résultat</h4>
							<p class="content">
								Merci de retenter avec un autre mot clé ou en modifiant les filtres appliqués.
							</p>
							<button class="button submit" @click="tableFilters = {}">Réinitialiser la recherche</button>
						</div>-->
						<div
							class="segment very compact"
							v-show="listLength > 0"
						>
							<custom-table
								class="data"
								ref="table"
								:data="list"
								:config="config"
								:labels="[
									'Année',
									'Mois',
									'Montant',
									'Actions',
								]"
								:filters="tableFilters"
								@updated="onTableUpdate"
							/>
						</div>
					</div>
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableDataGenericInput,
} from '@/components/CustomTable/CustomTableTypes';
import Filters from '@/components/Filters/Filters.vue';
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import { InputType } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import Js from '@/services/JsService';
import { ContentType } from '@/types';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		CustomTable,
		// Filters,
		Tooltip,
	},
})
export default class GainsHistory extends Vue {
	// protected showFilters: boolean = false;

	protected list: CustomTableDataGenericInput = { data: [] };
	protected listLength: number = 0;

	protected currentGlobalSearch: string = '';

	protected config: CustomTableConfig = {
		enablePagination: {
			limit: 25,
		},
	};

	/* protected search: FilterConfig[] = [
		{
			type: InputType.TEXT,
			placeholder: 'Rechercher par mot-clé',
			search: true,
			multiple: false,
		},
	]; */
	// protected filters: FilterConfig[] = [];

	protected tableFilters: { [key: string]: string | string[] } = {};

	protected onTableUpdate(): void {
		this.listLength = (this.$refs['table'] as CustomTable).length;
		setTimeout((): void => {
			Js.clearHighlightedTextInHTML(
				(this.$refs['table'] as CustomTable).$el
			);
			if (this.currentGlobalSearch !== '')
				Js.highlightTextInHTML(
					this.currentGlobalSearch,
					Js.defaultHighlightStyle,
					(this.$refs['table'] as CustomTable).$el
				);
		}, 1);
	}

	private created(): void {
		Axios.get(
			'http://localhost/testapic/gains_history/example_data.php'
		).then((result: AxiosResponse<any>): void => {
			this.list = { data: result.data };

			this.list.data.forEach((user: any): void => {
				user.actions = {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Gains/GainsHistory/GainsHistoryActions.vue',
							name: 'GainsHistoryActions',
							data: { data: user.id },
						},
					},
				} as CustomTableCellData;
			});
		});
	}

	private updated(): void {
		this.listLength = (this.$refs['table'] as CustomTable).length;
	}
	/*
	protected globalSearch(value: { 0: string }) {
		this.currentGlobalSearch = value['0'];
		if (!value['0'] || value['0'] === '') this.tableFilters = {};
		else
			this.tableFilters = {
				id: value['0'],
				name: value['0'],
				testers: value['0'],
				quota: value['0'],
			};
	} */
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#gains-history {
	#search-filter {
		.filters-actions {
			display: none;
		}
	}

	table {


		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:last-child {
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:last-child, &:first-child {
				width: 3rem;
			}
		}
	}
}
</style>
