<template>
	<div id="companies-offers">
		<div class="container">
			<div class="heading secondary">
				<div class="left items">
					<h3 class="title">Synthèse des crédits</h3>
				</div>
				<div class="right items">
					<button class="button">
						<icon add />Créditer une offre
					</button>
					<button class="button ghost">
						<icon interchange />Transfert de crédits
					</button>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="stackable grid">
				<div class="column three">
					<div class="segments">
						<div class="header segment">
							<icon credit green text />Crédit disponible
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
							<icon credit orange text />Crédit utilisé
						</div>
						<div class="segment">
							<div class="stats age">
								<div class="stat main">
									<span class="number orange text">0</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="column three">
					<div class="segments">
						<div class="header segment">
							<icon credit red text />Crédit expiré
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
		<div class="fluid container" v-if="showList">
			<div class="segment very compact">
				<custom-table
					class="data"
					ref="table"
					:data="list"
					:config="config"
					:labels="[
						'ID',
						'Date création',
						'Type d\'offre',
						'Nom de l\'utilisateur',
						'Société',
						'Nombre de crédits',
						'Crédits utilisés',
						'Crédits restants',
						'Début validité',
						'Fin validité',
						'Actions',
					]"
				/>
			</div>
		</div>
		<div class="container" v-else>
			<div class="segment empty state">
				<icon puzzle huge />
				<h4 class="h4 content">Aucune offre disponible</h4>
				<p class="content">Cette société ne compte aucun crédit.</p>
				<button class="button"><icon add />Créditer une offre</button>
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
import { ContentType } from '@/types';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
	},
})
export default class CompaniesOffers extends Vue {
	protected list: CustomTableDataGenericInput = { data: [] };
	protected showList: boolean = false;

	protected config: CustomTableConfig = {
		enablePagination: {
			limit: 25,
		},
	};

	private created(): void {
		Axios.get(
			'http://localhost/testapic/offers_list/example_data.php'
		).then((result: AxiosResponse<any>): void => {
			this.showList = result.data && result.data.length;
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
					} else if (propertyName === 'type')
						return {
							content: {
								value,
								type: ContentType.STRING,
								class: 'badge basic',
							},
						} as CustomTableCellData;
					else if (
						propertyName === 'user' ||
						propertyName === 'company'
					) {
						return {
							content: {
								value,
								type: ContentType.LINK,
								path: `#${propertyName}/${obj.id}`,
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
							path: 'views/Companies/CompaniesOffers/CompaniesOffersActions.vue',
							name: 'CompaniesOffersActions',
							data: { data: user.id },
						},
					},
				} as CustomTableCellData;
			});
		});
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#companies-offers {
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

			&:nth-child(6), &:nth-child(7), &:nth-child(8) {
				text-align: center;
				text-align-last: auto;
				align-items: center;
				justify-content: center;
			}
		}
	}
}
</style>
