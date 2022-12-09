<template>
	<div class="eight wide column">
		<div class="segments streched">
			<div class="header segment">Derniers résultats</div>
			<div class="segment very compact" id="last-results">
				<custom-table class="data" :data="list" :config="{}" />
			</div>
			<div class="segment">
				<router-link
					class="button ghost small"
					:to="{ name: 'results' }"
					>Voir tous les résultats</router-link
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableCellData,
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
export default class HomeLastResults extends Vue {
	protected list: CustomTableDataGenericInput = { data: [] };
	private created(): void {
		Axios.get(
			'http://localhost/testapic/last_results/example_data.php'
		).then((result: AxiosResponse<any>): void => {
			this.list = {
				modifier: (
					value: any,
					propertyName: string | number | symbol,
					obj: any
				): any => {
					if (
						// tslint:disable-next-line:prefer-switch
						propertyName === 'id' ||
						propertyName === 'nbTests' ||
						propertyName === 'testers'
					)
						return undefined;
					else if (propertyName === 'name') {
						return {
							tooltip: {
								text: value,
								class: 'top',
							},
							content: {
								value,
								type: ContentType.COMPONENT,
								component: {
									path: 'views/Results/ResultsList/ResultsListGroup.vue',
									name: 'ResultsListGroup',
									data: {
										data: {
											name: value,
											nbTests: obj.nbTests,
										},
									},
								},
							},
						} as CustomTableCellData;
					} else if (propertyName === 'groupId') {
						return {
							content: {
								value: '',
								type: ContentType.TABLE,
								class: 'sub',
								table: {
									config: {
										restOperations: {
											get: {
												url: 'http://localhost/testapic/last_results/example_subdata.php',
												promiseCallback: (
													value0: AxiosResponse
												): any => {
													value0.data.forEach(
														(test: any): void => {
															test.actions = {
																content: {
																	type: ContentType.COMPONENT,
																	value: '',
																	component: {
																		path: 'views/Home/HomeLastResults/HomeResultsActions.vue',
																		name: 'HomeResultsActions',
																		data: {
																			data: {
																				id: test.id,
																				subtest:
																					true,
																			},
																		},
																	},
																},
															} as CustomTableCellData;
														}
													);
													return {
														modifier: (
															value2: any,
															propertyName2: string,
															obj2: any
														): any => {
															if (
																// tslint:disable-next-line:prefer-switch
																propertyName2 ===
																	'id' ||
																propertyName2 ===
																	'testers'
															)
																return undefined;
															else if (
																propertyName2 ===
																	'device' ||
																propertyName2 ===
																	'type'
															)
																return {
																	content: {
																		value: value2,
																		class: value2,
																		type: ContentType.ICON,
																	},
																} as CustomTableCellData;
															else if (
																propertyName2 ===
																'quota'
															) {
																return {
																	content: {
																		value: '',
																		type: ContentType.COMPONENT,
																		component:
																			{
																				path: 'views/Results/ResultsTestersQuota.vue',
																				name: 'ResultsTestersQuota',
																				data: {
																					data: {
																						testers:
																							obj2.testers,
																						quota: obj2.quota,
																					},
																				},
																			},
																	},
																} as CustomTableCellData;
															} else
																return value2;
														},
														data: value0.data,
													};
												},
											},
										},
									},
								},
							},
						} as CustomTableCellData;
					} else if (propertyName === 'quota') {
						return {
							content: {
								value: '',
								type: ContentType.COMPONENT,
								class:
									obj.groupId !== undefined ? 'strong' : '',
								component: {
									path: 'views/Results/ResultsTestersQuota.vue',
									name: 'ResultsTestersQuota',
									data: {
										data: {
											testers: obj.testers,
											quota: obj.quota,
										},
									},
								},
							},
						} as CustomTableCellData;
					} else return value;
				},
				data: result.data,
			} as CustomTableDataGenericInput;

			this.list.data.forEach((tester: any): void => {
				tester.actions = {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Home/HomeLastResults/HomeResultsActions.vue',
							name: 'HomeResultsActions',
							data: {
								data: {
									id: tester.id,
									subtest: false,
								},
							},
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

#last-results {
	table {
		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:nth-child(2) {
				width: 3rem;
				text-align: center;
				text-align-last: auto;
				align-items: center;
				justify-content: center;
			}

			&:last-child{
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:last-child {
				width: 3rem;
			}
		}

		&.sub {
			td, th{
				&:nth-child(2), &:nth-child(3), &:nth-child(4) {
					width: 3rem;
					text-align: center;
					text-align-last: auto;
					align-items: center;
					justify-content: center;
				}

				&:last-child{
					width: 3rem;
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
