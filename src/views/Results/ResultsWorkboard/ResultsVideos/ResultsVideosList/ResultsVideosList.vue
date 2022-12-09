<template>
	<div id="results-video-list">
		<div class="container">
			<div class="heading secondary">
				<h3 class="title">
					<router-link :to="{ name: 'result videos' }">
						<icon long arrow left />Synthèse </router-link
					>- Liste des vidéos
					<span class="counter">{{ listLength }}</span>
				</h3>
			</div>
		</div>
		<div class="container">
			<div class="heading secondary alt">
				<filters
					id="test-filter"
					:inputs="testInput"
					@change="tableFilters = $event"
				/>
				<div>
					<filters
						id="search-filter"
						:inputs="search"
						@change="globalSearch($event)"
					/>
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
						Merci de retenter avec un autre mot clé ou en modifiant
						les filtres appliqués.
					</p>
					<button class="button submit" @click="tableFilters = {}">
						Réinitialiser la recherche
					</button>
				</div>
				<div class="segment" v-show="listLength > 0">
					<custom-table
						class="data"
						ref="table"
						:data="list"
						:config="config"
						:labels="[
							'Participant',
							'Durée',
							'% d\'échec',
							'Visionnage',
							'Extraits associés',
							'Statut',
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
import Js from '@/services/JsService';
import { ContentType } from '@/types';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
		Filters,
	},
})
export default class ResultsVideosList extends Vue {
	protected showFilters: boolean = false;
	protected listLength: number = 1;

	protected currentGlobalSearch: string = '';

	protected isLoading: boolean = false;
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

	protected testInput: FilterConfig[] = [
		{
			type: InputType.SELECT,
			options: [
				{
					text: 'Tous les tests',
					value: '',
				},
				{
					text: 'Test 1',
					value: '1',
				},
				{
					text: 'Test 2',
					value: '2',
				},
			],
			key: 'test',
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

	protected list: CustomTableDataGenericInput = {
		data: [
			{
				tester: 'Steffi Nicolaïdes',
				length: '00:16:07',
				failure: '0%',
				watch: {
					content: {
						type: ContentType.COMPONENT,
						value: '100',
						component: {
							name: 'ProgressBar',
							path: '@/components/ProgressBar/ProgressBar.vue',
							data: {
								value: 100,
								hideValue: true,
							},
						},
					},
				} as CustomTableCellData,
				extracts: 7,
				status: {
					content: {
						type: ContentType.STRING,
						value: 'Validé',
						class: 'badge small basic green',
					},
				} as CustomTableCellData,
				actions: {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosList/ResultsVideosActions.vue',
							name: 'ResultsVideosActions',
						},
					},
				} as CustomTableCellData,
			},
		],
	};

	protected onTableUpdate(): void {
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

#results-video-list {
	#search-filter, #test-filter {
		.filters-actions {
			display: none;
		}
	}

	#search-filter {
		display: inline-block;
		vertical-align: middle;
		margin-right: math.div($padding, 2);
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
