<template>
	<div id="results-testers">
		<div class="container">
			<div class="heading secondary">
				<h3 class="title">
					<router-link :to="{ name: 'result synthesis' }">
						<icon long arrow left />Synthèse </router-link
					>Liste des participants
					<span class="counter">{{ listLength }}</span>
				</h3>
			</div>
			<div class="heading secondary alt">
				<div>
					<select-input
						:config="observationSelect"
						v-model="selectedObservation"
					/>
				</div>
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
					<button class="button ghost">
						<icon export file />Exporter
					</button>
				</div>
			</div>
		</div>
		<div v-if="showFilters">
			<div class="container">
				<filters
					id="advanced-filters"
					class="six columns stackable grid"
					:inputs="filters"
					:lazy="true"
				/>
			</div>
		</div>
		<div class="container">
			<div class="segments">
				<div v-if="listLength < 1" class="segment empty state">
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
				<div class="segment tabs alt">
					<div class="menu">
						<tab name="validated" v-model="currentTab"
							>Validés (420)</tab
						>
						<tab name="refused" v-model="currentTab"
							>Refusés (69)</tab
						>
					</div>
				</div>
				<div class="segment" v-show="listLength > 0">
					<custom-table
						class="data"
						ref="table"
						:data="list"
						:config="config"
						:labels="[
							'Test',
							'Participant',
							'Support',
							'Type',
							'Genre',
							'Age',
							'Pays',
							'Note',
							'Durée du test',
							'Date',
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
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import Js from '@/services/JsService';
import { ContentType } from '@/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
		SelectInput,
		Filters,
		Tab,
	},
})
export default class ResultsTesters extends Vue {
	protected currentTab: string = 'validated';
	protected observationSelect: InputConfig = {
		options: [
			{
				text: 'constat1',
				value: '1',
			},
			{
				text: 'constat2',
				value: '2',
			},
			{
				text: 'constat3',
				value: '3',
			},
		],
	};
	protected selectedObservation: InputOption[] = [{ text: '', value: '1' }];

	protected showFilters: boolean = false;
	protected listLength: number = 1;

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
			type: InputType.DATALIST,
			placeholder: 'Rechercher...',
			label: 'Test',
			class: 'column',
			key: 'id',
			options: [
				{ text: 'Actif', value: '1' },
				{ text: 'Non validé', value: '2' },
				{ text: 'Archivé', value: '3' },
			],
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher...',
			label: 'Support',
			class: 'column',
			options: [
				{ text: 'Actif', value: '1' },
				{ text: 'Non validé', value: '2' },
				{ text: 'Archivé', value: '3' },
			],
			key: 'status',
		},
		{
			type: InputType.SELECT,
			placeholder: 'Rechercher...',
			label: 'Genre',
			class: 'column',
			key: 'mark',
			options: [
				{ text: 'Homme', value: '1' },
				{ text: 'Femme', value: '0' },
			],
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher...',
			label: 'Age',
			class: 'column',
			key: 'mark_cnrs',
			options: [
				{ text: 'Actif', value: '1' },
				{ text: 'Non validé', value: '2' },
				{ text: 'Archivé', value: '3' },
			],
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher...',
			label: 'Country',
			class: 'column',
			options: [
				{ text: 'Oui', value: '1' },
				{ text: 'Non', value: '0' },
			],
			key: 'desk',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher...',
			label: 'Note',
			class: 'column',
			options: [
				{ text: 'Oui', value: '1' },
				{ text: 'Non', value: '0' },
			],
			key: 'mob',
		},
	];

	protected tableFilters: { [key: string]: string | string[] } = {};

	protected list: CustomTableDataGenericInput = {
		data: [
			{
				test: "Test d'essai NEW iOS - iPhone",
				tester: 'Christelle LAGAN',
				device: {
					content: {
						value: 'mobile',
						type: ContentType.ICON,
					},
				} as CustomTableCellData,
				type: {
					content: {
						value: 'video',
						type: ContentType.ICON,
					},
				} as CustomTableCellData,
				Gender: 'Apache Helicopter',
				age: 40,
				country: {
					content: {
						type: ContentType.STRING,
						value: '',
						class: 'flag country-fr',
					},
				} as CustomTableCellData,
				note: 0,
				length: '00:12:17',
				date: '03/08/2018 13:18',
				actions: {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Results/ResultsWorkboard/ResultsTesters/ResultsTestersActions.vue',
							name: 'ResultsTestersActions',
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

	private updated(): void {
		this.listLength = (this.$refs['table'] as CustomTable).length;
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results-testers {
	#search-filter {
		display: inline-block;
		vertical-align: middle;
		margin-right: math.div($padding, 2);

		.filters-actions {
			display: none;
		}
	}

	.tabs {
		.item {
			border-top: none;

			&.active {
				&:first-child {
					border-left: none;
				}
				&:last-child {
					border-right: none;
				}
			}
		}
	}

	table {


		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:nth-child(9), &:nth-child(10), &:last-child {
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:nth-child(3), &:nth-child(4), &:nth-child(5),
			&:nth-child(6), &:nth-child(7), &:nth-child(8) {
				text-align: center;
				text-align-last: auto;
				align-items: center;
				justify-content: center;
			}

			&:nth-child(3), &:nth-child(4), &:nth-child(6),
			&:nth-child(7), &:nth-child(8), &:last-child {
				width: 3rem;
			}
		}
	}
}
</style>
