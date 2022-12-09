import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableParserConfig,
} from '@/components/CustomTable/CustomTableTypes';
import {
	FilterConfig,
	FiltersConfigCollection,
} from '@/components/Filters/FiltersTypes';
import { InputOption, InputType } from '@/components/Inputs/InputsTypes';
import { testapicId } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import Languages from '@/services/LanguagesService';
import { RouterUtils } from '@/services/RouterUtils';
import UserUtils from '@/services/UserUtils';
import { ContentType, GetListResponse, LdData } from '@/types';
import { companiesUrl } from '@/views/Companies/CompaniesConfig';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { TestersListItem } from '@/views/Testers/AllTesters/TestersList/TestersListTypes';
import { testersUrl } from '@/views/Testers/TestersConfig';
import { UserState } from '@/views/Users/UsersTypes';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const tableConfig: CustomTableConfig = {
	translate: true,
	enablePagination: {
		maxNavLinks: 10,
	},
	enableSorting: {
		enabled: [0, 1, 2, 3, 4, 6],
		sortingKeys: [
			'id',
			'dateCreation',
			'firstName',
			'lastName',
			'email',
			['state', 'id'],
		],
	},
	restConfig: {
		get: {
			url: testersUrl,
			config: {
				...AxiosUtils.defaultConfig,
				params: { userType: 2 },
			},
			promiseCallback: (
				response?: AxiosResponse<LdData<TestersListItem>>
			): GetListResponse => {
				if (!response?.data) return { data: [] };

				const formattedResponse: GetListResponse =
					LdData.getFormattedResponse(response.data);

				formattedResponse.data.forEach(
					(tester: TestersListItem): void => {
						tester.actions = {
							content: {
								type: ContentType.COMPONENT,
								value: '',
								component: {
									path: 'views/Testers/AllTesters/TestersList/TestersActions.vue',
									name: 'TestersActions',
									data: {
										id: tester.id,
										state: tester.state?.id,
									},
								},
							},
						};
					}
				);
				return formattedResponse;
			},
		},
		put: {
			url: testersUrl,
			config: {
				...AxiosUtils.defaultConfig,
				successMsg: 'Le testeur a bien été modifié.',
				failureMsg: "Le testeur n'a pas été modifié.",
			},
		},
		parserConfig: {
			trackBy: 'id',
			keys: new Array<keyof TestersListItem>(
				'id',
				'dateCreation',
				'firstName',
				'lastName',
				'email',
				'customers',
				'state',
				'actions'
			),
			modifier: (
				value: any,
				key: keyof TestersListItem
			): CustomTableCellData | string | number | undefined => {
				switch (key) {
					case 'id':
						return {
							key,
							content: { value, class: 'id' },
						};
					case 'customers':
						if (!Array.isArray(value) || !value.length) return '';
						value = value[0];
						return {
							key,
							content: {
								value: value.name,
								type: ContentType.ROUTE,
								route: {
									name: 'company edition',
									params: { id: value.id },
								},
							},
						};
					case 'state':
						(value as UserState).value = Languages.t(
							(value as UserState).value || ''
						).toString();
						(value as UserState).class = UserState.getStateClass(
							value.id
						);
						return { key, content: value };
					default:
						return value;
				}
			},
		} as CustomTableParserConfig<TestersListItem>,
	},
	flashMessageId: 'listing',
};

type TestersFilters =
	| InputType.TEXT
	| InputType.DATALIST
	| InputType.CHECKBOXGROUP
	| InputType.NUMBER;
export const filtersConfig: FiltersConfigCollection<TestersFilters> = [
	{
		type: InputType.DATALIST,
		translate: true,
		placeholder: 'Rechercher',
		label: 'Statut',
		class: 'column',
		options: [
			{ text: 'Actif', value: `${UserState.active}` },
			{ text: 'Archivé', value: `${UserState.archived}` },
			{ text: 'Non validé', value: `${UserState.notValidated}` },
		],
		key: ['state', 'id'],
	},
	new Promise<FilterConfig<TestersFilters>>(
		async (
			resolve: (value: FilterConfig<TestersFilters>) => void,
			reject: (reason?: any) => void
		): Promise<void> => {
			await RouterUtils.getRouterInitPromise();

			try {
				const id: number = (
					await UserUtils.instance.currentUserCustomer
				).id;
				const currentCustomer: DefaultCompany = await UserUtils.instance
					.currentUserCustomer;
				const seeAllAccess: boolean =
					await UserUtils.instance.currentUserHasPermission(
						'myaccount/customer/see/all'
					);
				const params: AxiosRequestConfig['params'] = {
					state: {
						id: 0,
					},
					userTestingCustomer: {
						id: currentCustomer.id,
					},
				};
				if (id !== testapicId && !seeAllAccess)
					params.or = {
						id,
						idCustomerRelative: id,
					};
				resolve({
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
									params,
								},
								promiseCallback: (
									response?: AxiosResponse<
										LdData<DefaultCompany>
									>
								): GetListResponse => {
									const ret: GetListResponse<InputOption> =
										GetListResponse.empty;
									if (!response?.data) return ret;

									LdData.getFormattedResponse(
										response?.data || []
									).data.forEach(
										(customer: DefaultCompany): void => {
											ret.data.push({
												text: customer.name,
												value: customer.id.toString(),
											});
										}
									);
									return ret;
								},
							},
							filterBy: [['search', 'name']],
						},
					},
					key: ['userTestingCustomer', 'id'],
				});
			} catch (error) {
				reject(error);
			}
		}
	),
	/* {
		type: InputType.CHECKBOXGROUP,
		translate: true,
		label: 'Support',
		class: 'column',
		placeholder: 'test',
		mergeGroupValues: false,
		checkFormat: 'array',
		subConfigs: [
			{
				placeholder: 'Testeur Desktop',
				name: '1',
			},
			{
				placeholder: 'Testeur Mobile',
				name: '2',
			},
		],
		key: 'desk',
	}, */
];
