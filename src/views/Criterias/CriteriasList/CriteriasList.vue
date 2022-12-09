<template>
	<view-root id="criterias-list">
		<template #heading>
			<h2 class="title">
				Liste des critères
				<span class="counter">{{ listLength }}</span>
			</h2>
		</template>
		<template #content>
			<div class="container">
				<div class="heading secondary">
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
							:to="{ name: 'criterias creation' }"
						>
							<icon add />Créer un critère
						</router-link>
						<button class="button ghost icon">
							<icon import file />
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
					<div class="segment" v-show="listLength > 0">
						<custom-table
							class="data"
							ref="table"
							:data="list"
							:config="config"
							:labels="['ID', 'Nom', '', 'Actions']"
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
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import Js from '@/services/JsService';
import { ContentType } from '@/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
		Filters,
		ViewRoot,
	},
})
export default class CriteriasList extends Vue {
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
				id: 2,
				name: 'Email',
				company: {
					content: {
						type: ContentType.STRING,
						value: 'Testapic',
						class: 'badge basic small',
					},
				} as CustomTableCellData,
				actions: {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: '@/views/Criterias/CriteriasList/CriteriasActions.vue',
							name: 'CriteriasActions',
						},
					},
				},
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

#criterias-list {
	#search-filter {
		display: inline-block;
		vertical-align: middle;
		margin-right: math.div($padding, 2);

		.filters-actions {
			display: none;
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

			&:first-child ,&:nth-child(2), &:last-child {
				width: 3rem;
			}
		}
	}
}
</style>
