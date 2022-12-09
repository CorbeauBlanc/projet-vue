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
import Environment from '@/services/EnvironmentService';
import Languages from '@/services/LanguagesService';
import { RouterUtils } from '@/services/RouterUtils';
import UserUtils from '@/services/UserUtils';
import { ContentType, GetListResponse, LdData } from '@/types';
import { companiesUrl } from '@/views/Companies/CompaniesConfig';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { testsUrl } from '@/views/Tests/TestsConfig';
import { TestsListItem } from '@/views/Tests/TestsList/TestsListTypes';
import { TestDevice, TestProduct, TestState } from '@/views/Tests/TestsTypes';
import { usersUrl } from '@/views/Users/UsersConfig';
import { DefaultUser } from '@/views/Users/UsersTypes';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const tableConfig: CustomTableConfig = {
	translate: true,
	enablePagination: {
		maxNavLinks: 10,
	},
	enableInlineEdition: [2],
	enableSorting: {
		enabled: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		sortingKeys: [
			'id',
			'dateCreation',
			'title',
			['testState', 'id'],
			'credits',
			'expectedTesters',
			'endedTesters',
			['device', 'id'],
			['product', 'id'],
			['customer', 'name'],
		],
	},
	restConfig: {
		get: {
			url: testsUrl,
			config: AxiosUtils.defaultConfig,
			promiseCallback: (
				response?: AxiosResponse<LdData<TestsListItem>>
			): GetListResponse => {
				if (!response?.data) return { data: [] };

				const formattedResponse: GetListResponse =
					LdData.getFormattedResponse(response.data);

				formattedResponse.data.forEach((test: TestsListItem): void => {
					test.actions = {
						content: {
							type: ContentType.COMPONENT,
							value: '',
							component: {
								path: 'views/Tests/TestsList/TestsActions.vue',
								name: 'TestsActions',
								data: {
									id: test.id,
									title: test.title,
									state: test.testState.id,
									previousState: test.previousState,
								},
							},
						},
					};
				});
				return formattedResponse;
			},
		},
		put: {
			url: testsUrl,
			config: {
				...AxiosUtils.defaultConfig,
				successMsg: 'Le test a bien été modifié.',
				failureMsg: "Le test n'a pas été modifié.",
			},
		},
		post: {
			url: testsUrl,
			config: {
				...AxiosUtils.defaultConfig,
				successMsg: 'Le test a bien été dupliqué.',
				failureMsg: "Le test n'a pas été dupliqué.",
			},
		},
		parserConfig: {
			trackBy: 'id',
			keys: new Array<keyof TestsListItem>(
				'id',
				'dateCreation',
				'title',
				'testState',
				'credits',
				'expectedTesters',
				'endedTesters',
				'device',
				'product',
				'customer',
				'actions'
			),
			modifier: (
				value: any,
				key: keyof TestsListItem
			): CustomTableCellData | string | number => {
				switch (key) {
					case 'id':
						return {
							key,
							content: { value, class: 'id' },
						} as CustomTableCellData;
					case 'dateCreation':
						const date: Date = new Date(value);
						return {
							key,
							content: {
								value: date.toLocaleDateString(),
								tooltip: {
									text: date.toLocaleDateString(undefined, {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
										year: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
									}),
									class: 'top',
								},
							},
						};
					case 'title':
						return {
							key,
							content: {
								value,
								tooltip: {
									text: value,
									class: 'top',
								},
							},
						};
					case 'customer':
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
					case 'expectedTesters':
					case 'endedTesters':
						value = value || '-';
						return {
							key,
							content: { value },
						};
					case 'testState':
						(value as TestState).value = Languages.t(
							(value as TestState).value || ''
						).toString();
						value.class = TestState.getStateClass(value.id);
						return { key, content: value };
					case 'product':
					case 'device':
						return {
							key,
							content: {
								icon: value.icon,
								type: ContentType.ICON,
								tooltip: {
									text: value.name,
									class: 'top',
								},
							},
						};
					default:
						return value;
				}
			},
		} as CustomTableParserConfig<TestsListItem>,
	},
	flashMessageId: 'listing',
};

type TestsFilters = InputType.DATE | InputType.DATALIST;
export const filtersConfig: FiltersConfigCollection<TestsFilters> = [
	{
		type: InputType.DATE,
		translate: true,
		label: 'Date de création',
		key: ['dateCreation', 'after'],
	},
	{
		type: InputType.DATALIST,
		strict: true,
		translate: true,
		placeholder: 'Rechercher',
		label: 'Statut',
		options: [
			{ text: 'En préparation', value: `${TestState.inPreparation}` },
			{ text: 'Pilote', value: `${TestState.pilot}` },
			{ text: 'En cours', value: `${TestState.inProgress}` },
			{ text: 'Terminé', value: `${TestState.ended}` },
			{ text: 'Archivé', value: `${TestState.archived}` },
		],
		key: ['testState', 'id'],
	},
	{
		type: InputType.DATALIST,
		strict: true,
		translate: true,
		placeholder: 'Rechercher',
		label: 'Type',
		options: [
			{ text: 'Vidéo/Audio', value: `${TestProduct.video}` },
			{
				text: 'Questionnaire contextualisé',
				value: `${TestProduct.form}`,
			},
			{ text: 'Sondage quantitatif', value: `${TestProduct.survey}` },
		],
		key: ['product', 'id'],
	},
	{
		type: InputType.DATALIST,
		strict: true,
		translate: true,
		placeholder: 'Rechercher',
		label: 'Support',
		options: [
			{ text: 'Smartphone', value: `${TestDevice.smartphone}` },
			{ text: 'Tablette', value: `${TestDevice.tablet}` },
			{ text: 'Ordinateur', value: `${TestDevice.computer}` },
		],
		key: ['device', 'id'],
	},
	new Promise<FilterConfig<TestsFilters>>(
		async (
			resolve: (value: FilterConfig<TestsFilters>) => void,
			reject: (reason?: any) => void
		): Promise<void> => {
			await RouterUtils.getRouterInitPromise();

			try {
				const id: number = (
					await UserUtils.instance.currentUserCustomer
				).id;
				const seeAllAccess: boolean =
					await UserUtils.instance.currentUserHasPermission(
						'myaccount/customer/see/all'
					);
				const params: AxiosRequestConfig['params'] = {
					state: { id: 0 },
					userType: 1,
					order: {
						id: 'asc',
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
					key: ['customer', 'id'],
				});
			} catch (error) {
				reject(error);
			}
		}
	),
	new Promise<FilterConfig<TestsFilters>>(
		async (
			resolve: (value: FilterConfig<TestsFilters>) => void,
			reject: (reason?: any) => void
		): Promise<void> => {
			await RouterUtils.getRouterInitPromise();

			try {
				const id: number = (
					await UserUtils.instance.currentUserCustomer
				).id;
				const seeAllAccess: boolean =
					await UserUtils.instance.currentUserHasPermission(
						'myaccount/customer/see/all'
					);
				const params: AxiosRequestConfig['params'] = {
					testManagers: 1,
					state: { id: 0 },
					userType: 1,
					order: {
						id: 'asc',
					},
				};
				if (id !== testapicId && !seeAllAccess) params.company = id;

				resolve({
					type: InputType.DATALIST,
					translate: true,
					multiple: true,
					placeholder: 'Rechercher',
					label: 'Responsable du test',
					rest: {
						options: {
							page: 1,
							get: {
								url: usersUrl,
								config: {
									...AxiosUtils.defaultConfig,
									params,
								},
								promiseCallback: (
									response?: AxiosResponse<
										LdData<DefaultUser>
									>
								): GetListResponse => {
									const ret: GetListResponse<InputOption> =
										GetListResponse.empty;
									if (!response?.data) return ret;

									LdData.getFormattedResponse(
										response?.data || []
									).data.forEach(
										(user: DefaultUser): void => {
											ret.data.push({
												text: `${user.firstName} ${user.lastName}`,
												value: `${user.id}`,
											});
										}
									);
									return ret;
								},
							},
							filterBy: [
								['search', 'firstName'],
								['search', 'lastName'],
							],
						},
					},
					key: 'createdBy',
				});
			} catch (error) {
				reject(error);
			}
		}
	),
];
