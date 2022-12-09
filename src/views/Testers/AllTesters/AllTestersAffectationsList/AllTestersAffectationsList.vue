<template>
	<view-root id="testers">
		<template #heading>
			<h2 class="title">
				Liste des affectations
				<span class="counter">{{ listLength }}</span>
			</h2>
		</template>
		<template #content>
			<div class="container fluid">
				<div class="heading secondary alt">
					<filters
						id="search-filter"
						:inputs="search"
						@change="globalSearch($event)"
					/>
					<div>
						<button
							:class="[
								'button ghost filter',
								showFilters ? 'active' : '',
							]"
							@click="showFilters = !showFilters"
						>
							<icon filter />Filtrer
						</button>
					</div>
				</div>
			</div>
			<div v-if="showFilters">
				<div class="container fluid">
					<filters
						id="advanced-filters"
						class="six columns stackable grid"
						:inputs="filters"
						:lazy="true"
					/>
				</div>
			</div>
			<div class="container fluid">
				<div class="segments">
					<div v-if="listLength < 1" class="segment empty state">
						<icon search huge />
						<h4 class="h4 content">Aucun résultat</h4>
						<p class="content">
							Merci de retenter avec un autre mot clé ou en
							modifiant les filtres appliqués.
						</p>
						<button
							class="button submit"
							@click="tableFilters = {}"
						>
							Réinitialiser la recherche
						</button>
					</div>
					<div class="segment very compact" v-show="listLength > 0">
						<custom-table
							class="data"
							ref="table"
							:data="list"
							:config="config"
							:labels="[
								'ID',
								'Date',
								'Testeur',
								'ID test',
								'Nom du test',
								'Type',
								'Payé',
								'Début',
								'Fin',
								'Durée',
								'Note',
								'Statut',
								'Actions',
							]"
							:filters="tableFilters"
							@updated="onTableUpdate"
						/>
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
		Filters,
		Tooltip,
	},
})
export default class AllTestersAffectationsList extends Vue {
	protected showFilters: boolean = false;

	protected list: CustomTableDataGenericInput = { data: [] };
	protected listLength: number = 0;

	protected currentGlobalSearch: string = '';

	protected config: CustomTableConfig = {
		enablePagination: {
			limit: 25,
		},
	};

	protected search: FilterConfig[] = [
		{
			type: InputType.TEXT,
			placeholder: 'Rechercher par mot-clé',
			search: true,
			multiple: false,
		},
	];

	protected filters: FilterConfig[] = [
		{
			type: InputType.TEXT,
			placeholder: 'Rechercher',
			label: 'ID testeur',
			class: 'column',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Test',
			class: 'column',
			options: [
				{ text: 'Actif', value: '1' },
				{ text: 'Non validé', value: '2' },
				{ text: 'Archivé', value: '3' },
			],
			key: 'status',
		},
		{
			type: InputType.DATE,
			label: 'Date de début',
			class: 'column',
			key: 'mark',
		},
		{
			type: InputType.DATE,
			label: 'Date de fin',
			class: 'column',
			key: 'mark_cnrs',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Type',
			class: 'column',
			options: [
				{ text: 'Oui', value: '1' },
				{ text: 'Non', value: '0' },
			],
			key: 'desk',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Statut',
			class: 'column',
			options: [
				{ text: 'Oui', value: '1' },
				{ text: 'Non', value: '0' },
			],
			key: 'mob',
		},
	];

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

	protected globalSearch(value: { 0: string }): void {
		this.currentGlobalSearch = value['0'];
		if (!value['0'] || value['0'] === '') this.tableFilters = {};
		else
			this.tableFilters = {
				id: value['0'],
				name: value['0'],
				testers: value['0'],
				quota: value['0'],
			};
	}

	private created(): void {
		Axios.get(
			'http://localhost/testapic/testers_affectations_list/example_data.php'
		).then((result: AxiosResponse<any>): void => {
			this.list = {
				modifier: (
					value: any,
					propertyName: string | number | symbol,
					obj: any
				): any => {
					// tslint:disable-next-line:prefer-switch
					if (propertyName === 'id') {
						return {
							content: {
								value,
								type: ContentType.STRING,
								class: 'id',
							},
						} as CustomTableCellData;
					} else if (
						propertyName === 'login' ||
						propertyName === 'payed' ||
						propertyName === 'date_test_end' ||
						propertyName === 'time_spent' ||
						propertyName === 'grade'
					) {
						return value === '' || value === 0 ? '-' : value;
						// tslint:disable-next-line:prefer-switch
					} else if (propertyName === 'tester') {
						return {
							content: {
								value,
								type: ContentType.LINK,
								path: `#${obj.id}`,
							},
						} as CustomTableCellData;
					} else if (propertyName === 'test_id')
						return {
							content: {
								value,
								type: ContentType.LINK,
								path: `#${value}`,
							},
						} as CustomTableCellData;
					else if (propertyName === 'type') {
						return {
							content: {
								value,
								type: ContentType.ICON,
								class: value,
							},
						} as CustomTableCellData;
					} else if (propertyName === 'status') {
						return {
							content: {
								value,
								type: ContentType.STRING,
							},
							class: value === 'En cours' ? 'yellow' : 'green',
						} as CustomTableCellData;
					} else return value;
				},
				data: result.data,
			};

			this.list.data.forEach((affectation: any): void => {
				affectation.actions = {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Testers/All/AllTestersAffectationsList/AllTestersAffectationsActions.vue',
							name: 'AllTestersAffectationsActions',
							data: { data: affectation.id },
						},
					},
				} as CustomTableCellData;
			});
		});
	}

	private updated(): void {
		this.listLength = (this.$refs['table'] as CustomTable).length;
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#testers {
	#search-filter {
		.filters-actions {
			display: none;
		}
	}

	table {


		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:last-child{
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:last-child, &:first-child {
				width: 3rem;
			}

			&:nth-child(3) {
				white-space: nowrap;
			}

			&:nth-child(2), &:nth-child(4), &:nth-child(8) {
				width: 5rem;
			}

			&:nth-child(6), &:nth-child(7),
			&:nth-child(9), &:nth-child(10), &:nth-child(11) {
				width: 3rem;
				text-align: center;
			}
		}
	}
}
</style>
