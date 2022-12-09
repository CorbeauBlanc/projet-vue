<template>
	<view-root id="gains-list">
		<template #heading>
			<h2 class="title">
				Liste des gains
				<span class="counter">{{ listLength }}</span>
			</h2>
		</template>
		<template #content>
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
			<div class="container">
				<div class="stackable grid">
					<div class="column three">
						<div class="segments">
							<div class="header segment">
								<icon credit text />Gains totaux
							</div>
							<div class="segment">
								<div class="stats age">
									<div class="stat main">
										<span class="number text">0</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="column three">
						<div class="segments">
							<div class="header segment">
								<icon credit green text />Gains versés
							</div>
							<div class="segment">
								<div class="stats age">
									<div class="stat main">
										<span class="number green text">0</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="column three">
						<div class="segments">
							<div class="header segment">
								<icon credit red text />Gains restants
							</div>
							<div class="segment">
								<div class="stats age">
									<div class="stat main">
										<span class="number red text">0</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="container">
				<div class="segments">
					<!-- <div v-if="listLength < 1" class="segment empty state">
						<icon search huge />
						<h4 class="h4 content">Aucun résultat</h4>
						<p class="content">
							Merci de retenter avec un autre mot clé ou en modifiant les filtres appliqués.
						</p>
						<button class="button submit" @click="tableFilters = {}">Réinitialiser la recherche</button>
					</div>-->
					<div class="segment very compact" v-show="listLength > 0">
						<custom-table
							class="data"
							ref="table"
							:data="list"
							:config="config"
							:labels="[
								'ID',
								'Testeur',
								'2',
								'Requête',
								'Adresse / IBAN',
								'Payé le',
								'Nom du test',
								'Date affectation',
								'Actions',
							]"
							:filters="tableFilters"
							@updated="onTableUpdate"
						>
							<template #label:2>
								Rém.
								<sup>€</sup>
							</template>
						</custom-table>
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
export default class GainsList extends Vue {
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
		Axios.get('http://localhost/testapic/gains_list/example_data.php').then(
			(result: AxiosResponse<any>): void => {
				this.list = {
					modifier: (
						value: any,
						propertyName: string | number | symbol,
						obj: any
					): any => {
						if (propertyName === 'id') {
							return {
								content: {
									value,
									type: ContentType.STRING,
									class: 'id',
								},
							} as CustomTableCellData;
						} else if (propertyName === 'name')
							return {
								content: {
									value,
									type: ContentType.LINK,
									path: `mailto:${value}`,
								},
							} as CustomTableCellData;
						else if (propertyName === 'test')
							return {
								content: {
									value,
									type: ContentType.LINK,
									path: `#${value}`,
								},
							} as CustomTableCellData;
						else if (propertyName === 'iban' && value === '')
							return '-';
						else if (propertyName === 'request') {
							return {
								content: {
									value: value.toString(),
									type: ContentType.ICON,
									class: 'bullhorn',
								},
							} as CustomTableCellData;
						} else return value;
					},
					data: result.data,
				};

				this.list.data.forEach((user: any): void => {
					user.actions = {
						content: {
							type: ContentType.COMPONENT,
							value: '',
							component: {
								path: 'views/Gains/GainsList/GainsActions.vue',
								name: 'GainsActions',
								data: { data: user.id },
							},
						},
					} as CustomTableCellData;
				});
			}
		);
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

#gains-list {
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

			&:last-child, &:first-child, &:nth-child(3), &:nth-child(4), &:nth-child(5) {
				width: 3rem;
			}
		}
	}
}
</style>
