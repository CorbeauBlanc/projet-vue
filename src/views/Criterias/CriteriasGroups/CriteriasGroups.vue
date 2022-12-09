<template>
	<view-root id="results">
		<template #heading>
			<h2 class="title">
				Liste des groupes de critères
				<span class="counter">{{ listLength }}</span>
			</h2>
		</template>
		<template #content>
			<div class="container">
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
						<router-link
							class="button"
							:to="{ name: 'create results group' }"
						>
							<icon folder open />Grouper
						</router-link>
					</div>
				</div>
			</div>
			<div v-if="showFilters">
				<div class="container">
					<filters
						id="advanced-filters"
						class="four columns stackable grid"
						:inputs="filters"
						:lazy="true"
						@change="tableFilters = $event"
					/>
				</div>
			</div>
			<div class="container">
				<div class="segments">
					<div class="loading active" v-if="isLoading">
						<div class="loader"></div>
					</div>
					<div
						v-if="listLength < 1 && !isLoading"
						class="segment empty state"
					>
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
							:hide-cols="hideCols"
							:labels="[
								'ID',
								'Nom',
								'Nombre de critères',
								'Pages',
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
import { FilterConfig, FiltersMap } from '@/components/Filters/FiltersTypes';
import { InputType } from '@/components/Inputs/InputsTypes';
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
	},
})
export default class ResultsList extends Vue {
	protected showFilters: boolean = false;

	protected list: CustomTableDataGenericInput = {
		data: [
			{
				id: '1',
				name: 'Info perso (EP)',
				number: '11',
				pages: 'Espace Personnel Testeurs (EP)',
				actions: {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Results/ResultsList/ResultsListActions.vue',
							name: 'ResultsListActions',
						},
					},
				} as CustomTableCellData,
			},
		],
	};
	protected listLength: number = 0;

	protected currentGlobalSearch: string = '';

	protected isLoading: boolean = true;
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
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Type',
			class: 'column',
			options: [
				{ text: 'Agrégat', value: 'Agrégat' },
				{ text: 'Simple', value: 'Par défaut' },
				{ text: 'Comparaison', value: '3' },
			],
			key: 'type',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Support',
			class: 'column',
			options: [
				{ text: 'Smartphone', value: 'mobile' },
				{ text: 'Tablette', value: 'mobile' },
				{ text: 'Ordinateur', value: 'desktop' },
			],
			key: 'tests_support',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Société associée',
			class: 'column',
			options: [
				{ text: 'AccordHotel', value: '1' },
				{ text: 'ACMIS', value: '2' },
				{ text: 'ACS', value: '3' },
				{ text: 'Adagios', value: '4' },
			],
			key: 'company',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Statut',
			class: 'column',
			options: [
				{ text: 'En cours', value: 'En cours' },
				{ text: 'Terminé', value: 'Terminé' },
				{ text: 'Abandonné', value: 'Abandonné' },
			],
			key: 'status',
		},
	];

	protected tableFilters: FiltersMap = {};

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
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results {
	#search-filter {
		.filters-actions {
			display: none;
		}
	}

	table {


		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:nth-child(3), &:nth-child(4), &:last-child{
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			//DEMO
			&:nth-child(5) {
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
				padding-right: 1.5rem;
				width: 3rem;
			}

			&:last-child, &:first-child {
				width: 3rem;
			}
		}

		&.sub {
			td, th{
				&:first-child {
					width: 10rem;
				}

				&:last-child {
					width: 5rem;
				}

				&:nth-child(2), &:nth-child(3) {
					width: 3rem;
					text-align: center;
					text-align-last: auto;
					align-items: center;
					justify-content: center;
				}

				&:nth-child(4), &:last-child{
					text-align: right;
					text-align-last: auto;
					align-items: flex-end;
					justify-content: flex-end;
				}
			}
		}
	}
}
</style>
