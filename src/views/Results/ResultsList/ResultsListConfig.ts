import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableParserConfig,
} from '@/components/CustomTable/CustomTableTypes';
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import { InputOption, InputType } from '@/components/Inputs/InputsTypes';
import AxiosUtils from '@/services/AxiosUtils';
import { ContentType, GetListResponse, LdData } from '@/types';
import { companiesUrl } from '@/views/Companies/CompaniesConfig';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { resultsUrl } from '@/views/Results/ResultsConfig';
import { ResultsListItem } from '@/views/Results/ResultsList/ResultsListTypes';
import { DefaultResultTest } from '@/views/Results/ResultsTypes';

import { AxiosResponse } from 'axios';

export const tableConfig: CustomTableConfig = {
	translate: true,
	enablePagination: {
		maxNavLinks: 10,
	},
	enableSorting: {
		enabled: [0, 1],
		sortingKeys: ['id', 'name'],
	},
	restConfig: {
		get: {
			url: resultsUrl,
			config: AxiosUtils.defaultConfig,
			promiseCallback: (
				response?: AxiosResponse<LdData<ResultsListItem>>
			): GetListResponse => {
				if (!response?.data) return { data: [] };

				const formattedResponse: GetListResponse =
					LdData.getFormattedResponse(response.data);

				formattedResponse.data.forEach(
					(result: ResultsListItem): void => {
						result.actions = {
							content: {
								type: ContentType.COMPONENT,
								value: '',
								component: {
									path: 'views/Results/ResultsList/ResultsActions.vue',
									name: 'ResultsActions',
									data: { id: result.id, title: result.name },
								},
							},
						};
					}
				);
				return formattedResponse;
			},
		},
		put: {
			url: resultsUrl,
			config: {
				...AxiosUtils.defaultConfig,
				successMsg: 'Le résultat a bien été modifié.',
				failureMsg: "Le résultat n'a pas été modifié.",
			},
		},
		parserConfig: {
			trackBy: 'id',
			keys: new Array<keyof ResultsListItem>(
				'id',
				'name',
				'tests',
				'validatedTesters',
				'quota',
				'actions'
			),
			modifier: (
				value: any,
				key: keyof ResultsListItem,
				obj: ResultsListItem
			): CustomTableCellData | string | number | undefined => {
				switch (key) {
					case 'id':
						return {
							key,
							content: { value, class: 'id' },
						};
					case 'name':
						return {
							key,
							content: {
								value,
								type: ContentType.ROUTE,
								route: {
									name: 'result workboard',
									params: {
										id: obj.id.toString(),
									},
								},
							},
							toggleSubtable: obj.tests.length > 1,
						};
					case 'tests':
						if (obj.tests.length < 2) return undefined;
						return {
							key,
							content: {
								table: {
									config: { translate: true },
									data: {
										...resultGroupDataConfig,
										data: value,
									},
									labels: [
										'Tests associés',
										'Support',
										'Type',
										'Testeurs Validés',
									],
								},
							},
						};
					default:
						return value;
				}
			},
		} as CustomTableParserConfig<ResultsListItem>,
	},
	flashMessageId: 'listing',
};

const resultGroupDataConfig: CustomTableParserConfig<DefaultResultTest> = {
	trackBy: 'id',
	keys: new Array<keyof DefaultResultTest>(
		'title',
		'device',
		'product',
		'expectedTesters'
	),
	modifier: (
		value: any,
		key: keyof DefaultResultTest,
		obj: DefaultResultTest
	): CustomTableCellData | string | number => {
		switch (key) {
			case 'title':
				return {
					key,
					content: {
						value,
						type: ContentType.ROUTE,
						route: {
							name: 'test edition',
							params: {
								id: obj.id.toString(),
							},
						},
					},
				};
			case 'product':
			case 'device':
				return {
					key,
					content: {
						translate: true,
						icon: value.icon,
						type: ContentType.ICON,
						tooltip: {
							text: value.name,
							class: 'top',
						},
					},
				};
			case 'expectedTesters':
				return {
					key,
					content: {
						value: value ? value : '-',
					},
				};
			default:
				return value;
		}
	},
};

// tslint:disable-next-line: prettier
export const filtersConfig: FilterConfig<InputType.DATALIST | InputType.CHECKBOX>[] = [
	{
		type: InputType.DATALIST,
		translate: true,
		multiple: false,
		placeholder: 'Rechercher',
		label: 'Type',
		options: [
			{ text: 'Groupement', value: '1' },
			{ text: 'Comparaison', value: '3' },
		],
		key: ['type'],
	},
	{
		type: InputType.DATALIST,
		strict: true,
		translate: true,
		placeholder: 'Rechercher',
		label: 'Société associée',
		rest: {
			options: {
				page: 1,
				get: {
					url: companiesUrl,
					config: {
						...AxiosUtils.defaultConfig,
						params: { state: 0 },
					},
					promiseCallback: (
						response?: AxiosResponse<LdData<DefaultCompany>>
					): GetListResponse => {
						const ret: GetListResponse<InputOption> =
							GetListResponse.empty;
						if (!response?.data) return ret;

						LdData.getFormattedResponse(
							response?.data || []
						).data.forEach((customer: DefaultCompany): void => {
							ret.data.push({
								text: customer.name,
								value: customer.id.toString(),
							});
						});
						return ret;
					},
				},
				filterBy: [['search', 'name']],
			},
		},
		key: ['tests', 'customer'],
	},
	{
		type: InputType.CHECKBOX,
		label: 'Statut',
		translate: true,
		placeholder: 'Uniquement les archivés',
		name: '3',
		checkFormat: 'string',
		key: ['state', 'id'],
	},
];
