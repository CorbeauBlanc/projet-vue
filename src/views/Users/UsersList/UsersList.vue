<template>
	<view-root id="users">
		<template #heading>
			<h2 class="title">
				Liste des utilisateurs
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
							:to="{ name: 'user creation' }"
						>
							<icon add />Créer un utilisateur
						</router-link>
					</div>
				</div>
			</div>
			<div v-if="showFilters">
				<div class="container">
					<filters
						id="advanced-filters"
						class="three columns stackable grid"
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
					<div class="segment very compact" v-show="listLength > 0">
						<custom-table
							class="data"
							ref="table"
							:data="list"
							:config="config"
							:labels="[
								'ID',
								'Nom',
								'Prénom',
								'Société associée',
								'Email',
								'Droits',
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
import Logger from '@/services/LoggerService';
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
export default class TestersList extends Vue {
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
				{ text: 'Actif', value: '1' },
				{ text: 'Non validé', value: '2' },
				{ text: 'Archivé', value: '3' },
			],
			key: 'status',
		},
		{
			type: InputType.SELECT,
			placeholder: 'Rechercher',
			label: 'Droits',
			class: 'column',
			options: [
				{ text: 'Testapic Admin', value: '1' },
				{ text: 'Testapic Editeur', value: '2' },
				{ text: 'Agence Editeur', value: '3' },
				{ text: 'Client Editeur', value: '4' },
				{ text: 'Consultation', value: '5' },
				{ text: 'Custom', value: '6' },
				{ text: 'Aucun', value: '7' },
			],
			key: 'rights',
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
		Axios.get('http://localhost/testapic/users_list/example_data.php').then(
			(result: AxiosResponse<any>): void => {
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
						} else if (propertyName === 'email')
							return {
								content: {
									value,
									type: ContentType.LINK,
									path: `mailto:${value}`,
								},
							} as CustomTableCellData;
						// tslint:disable-next-line:prefer-switch
						else if (propertyName === 'company')
							return {
								content: {
									value,
									type: ContentType.LINK,
									path: `#${obj.company_id}`,
								},
							} as CustomTableCellData;
						else if (propertyName === 'status') {
							return {
								content: {
									value: value === 1 ? 'Actif' : 'Non validé',
									type: ContentType.STRING,
									class: `badge basic ${
										value === 1 ? 'green' : 'orange'
									}`,
								},
							} as CustomTableCellData;
						} else if (propertyName === 'company_id')
							return Logger.dbgWarn(
								"TestersList: globalSearch: propertyName === 'company_id'",
								this
							);
						else return value;
					},
					data: result.data,
				};

				this.list.data.forEach((user: any): void => {
					user.actions = {
						content: {
							type: ContentType.COMPONENT,
							value: '',
							component: {
								path: 'views/Users/UsersList/UsersActions.vue',
								name: 'UsersActions',
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
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#users {
	#search-filter {
		.filters-actions {
			display: none;
		}
	}

	table {


		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:last-child, &:nth-child(7) {
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:last-child, &:first-child {
				width: 3rem;
			}

			&:nth-child(6), &:nth-child(7) {
				width: 7rem;
			}
		}
	}
}
</style>
