import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import { testapicId } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import { RouterUtils } from '@/services/RouterUtils';
import UserUtils from '@/services/UserUtils';
import { GetListResponse, LdData } from '@/types';
import { companiesUrl } from '@/views/Companies/CompaniesConfig';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { usersUrl } from '@/views/Users/UsersConfig';
import { DefaultUser } from '@/views/Users/UsersTypes';
import { AxiosError, AxiosResponse } from 'axios';

export const titleConfig: InputConfig<InputType.TEXT> = {
	label: 'Nom pour les administrateurs',
	externalId: 'title',
	translate: true,
	multiple: false,
	constraints: {
		required: true,
	},
};

export const productConfig: InputConfig<InputType.RADIOS> = {
	label: 'Type',
	externalId: 'product',
	translate: true,
	options: [
		{
			text: 'Vidéo/Audio',
			value: '5',
		},
		{
			text: 'Questionnaire contextualisé',
			value: '6',
		},
		{
			text: 'Sondage quantitatif',
			value: '7',
		},
	],
	constraints: {
		required: true,
	},
};

export const quotaConfig: InputConfig<InputType.NUMBER> = {
	label: 'Quota attendu',
	externalId: 'quota',
	translate: true,
	constraints: {
		required: true,
	},
	multiple: false,
	tooltip: {
		class: 'bottom badge blue small',
		content: '',
	},
};

export const deviceConfig: InputConfig<InputType.RADIOS> = {
	label: 'Support',
	externalId: 'device',
	translate: true,
	options: [
		{
			text: 'Ordinateur',
			value: '3',
		},
		{
			text: 'Smartphone',
			value: '1',
		},
		{
			text: 'Tablette',
			value: '2',
		},
	],
	constraints: {
		required: true,
	},
};

export const osConfig: InputConfig<InputType.CHECKBOXGROUP> = {
	label: 'OS',
	translate: true,
	constraints: {
		required: true,
	},
	subConfigs: [
		{
			placeholder: 'Android',
			name: '1',
			externalId: 'android',
		},
		{
			placeholder: 'iOS',
			name: '2',
			externalId: 'ios',
		},
	],
};

export const customerConfig: Promise<InputConfig<InputType.DATALIST>> =
	new Promise(
		async (
			resolve: (value: InputConfig<InputType.DATALIST>) => void,
			reject: (reason: AxiosError) => void
		): Promise<void> => {
			await RouterUtils.getRouterInitPromise();
			const seeAllAccess: boolean =
				await UserUtils.instance.currentUserHasPermission(
					'myaccount/customer/see/all'
				);

			try {
				const id: number = (
					await UserUtils.instance.currentUserCustomer
				).id;
				const config: InputConfig<InputType.DATALIST> = {
					label: 'Société associée',
					externalId: 'customer',
					translate: true,
					multiple: false,
					rest: {
						options: {
							page: 1,
							get: {
								url: companiesUrl,
								config: {
									...AxiosUtils.defaultConfig,
									params: {
										state: { id: 0 },
									},
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
					constraints: {
						required: true,
					},
				};

				if (
					id !== testapicId &&
					config.rest?.options?.get.config &&
					!seeAllAccess
				) {
					config.rest.options.get.config.params.or = {
						id,
						idCustomerRelative: id,
					};
				}
				resolve(config);
			} catch (error) {
				reject(error as AxiosError);
			}
		}
	);

export const createdByConfig: InputConfig<InputType.DATALIST> = {
	label: 'Responsable du test',
	externalId: 'createdBy',
	translate: true,
	multiple: false,
	rest: {
		options: {
			page: 1,
			get: {
				url: usersUrl,
				config: {
					...AxiosUtils.defaultConfig,
					params: {
						testManagers: 1,
						state: { id: 0 },
						userType: 1,
						order: {
							id: 'asc',
						},
					},
				},
				promiseCallback: (
					response?: AxiosResponse<LdData<DefaultUser>>
				): GetListResponse => {
					const ret: GetListResponse<InputOption> =
						GetListResponse.empty;
					if (!response?.data) return ret;

					LdData.getFormattedResponse(
						response?.data || []
					).data.forEach((user: DefaultUser): void => {
						ret.data.push({
							text: `${user.firstName} ${user.lastName}`,
							value: `${user.id}`,
						});
					});
					return ret;
				},
			},
			filterBy: [
				['search', 'firstName'],
				['search', 'lastName'],
			],
		},
	},
	constraints: {
		required: true,
	},
};

export const linksConfig: InputConfig<InputType.CHECKBOX> = {
	placeholder: 'Ajouter des liens de redirection',
	externalId: 'links',
	translate: true,
};

export const linkFinishConfig: InputConfig<InputType.TEXT> = {
	label: 'Lien de redirection lorsque le test est terminé',
	externalId: 'linkFinish',
	translate: true,
	multiple: false,
};

export const linkQuotaConfig: InputConfig<InputType.TEXT> = {
	label: 'Lien de redirection si le quota est atteint',
	externalId: 'linkQuota',
	translate: true,
	multiple: false,
};

export const linkFilterConfig: InputConfig<InputType.TEXT> = {
	label: 'Lien de redirection du filtrage (screen out)',
	externalId: 'linkFilter',
	translate: true,
	multiple: false,
};

export const testerTitleConfig: InputConfig<InputType.TEXT> = {
	label: 'Nom pour les testeurs',
	externalId: 'testerTitle',
	translate: true,
	multiple: false,
	constraints: {
		required: true,
	},
};

export const priceConfig: Promise<InputConfig<InputType.NUMBER>> = new Promise<
	InputConfig<InputType.NUMBER>
>(
	async (
		resolve: (value: InputConfig<InputType.NUMBER>) => void,
		reject: (reason: AxiosError) => void
	): Promise<void> => {
		await RouterUtils.getRouterInitPromise();

		try {
			const id: number = (await UserUtils.instance.currentUserCustomer)
				.id;
			const config: InputConfig<InputType.NUMBER> = {
				label: 'Rémunération (€)',
				externalId: 'price',
				translate: true,
				readonly: true,
				constraints: {
					min: 0,
				},
				multiple: false,
			};
			if (id === testapicId && config.constraints) {
				config.constraints.required = true;
				config.readonly = false;
			}
			resolve(config);
		} catch (error) {
			reject(error as AxiosError);
		}
	}
);

export const storylineConfig: InputConfig<InputType.WYSIWYG> = {
	label: 'Scénario',
	externalId: 'storyline',
	translate: true,
	constraints: {
		required: true,
	},
};
