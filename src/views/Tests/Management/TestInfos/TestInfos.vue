<template lang="pug">
#test-infos.container.text
	delete-lang-modal(ref='deleteModal')
	.segments
		#trs-tabs.segment.tabs.alt.navigation.tertiary
			dynamic-tabs.menu(
				v-master:tabs='translationTabs',
				v-master:current='translation',
				:config='translationsConfig'
			)
			help-button.heading-button(bottom)
				a(:href='`${helpUrl}/articles/360020597978`', target='_blank')
					| {{ $t("Comment structurer un test utilisateur ?") }}
				a(:href='`${helpUrl}/articles/360020782898`', target='_blank')
					| {{ $t("Pourquoi associer des tests quantitatifs et des tests qualitatifs ?") }}
				a(:href='`${helpUrl}/articles/360020627358`', target='_blank')
					| {{ $t("De combien de testeurs ai-je besoin ?") }}
				a(:href='`${helpUrl}/articles/360020746058`', target='_blank')
					| {{ $t("Comment créer un test questionnaire desktop ?") }}
				a(:href='`${helpUrl}/articles/360020608917`', target='_blank')
					| {{ $t("Comment créer un test questionnaire mobile ?") }}
				a(:href='`${helpUrl}/articles/360020650298`', target='_blank')
					| {{ $t("Comment créer un test vidéo non modéré ?") }}
				a.button.ghost.small.margin.top.bottom(
					:href='`${helpUrl}/requests/new`',
					target='_blank'
				)
					| {{ $t("Proposer une amélioration") }}
		.segment
			h4 {{ $t("Informations pour les administrateurs") }}
			.grid.stackable
				text-input.twelve.wide.column(
					ref='title',
					:config='titleConfig',
					v-model='values.title'
				)
					template(#hint)
						div
							| {{  $t('Choisissez un nom qui vous parle, par exemple \"Tunnel de vente\".')  }}
						div
							strong
								| {{ $t("Inutile de préciser le type de test ou le device ici.") }}
				radios-input.six.wide.column(
					ref='product',
					:config='productConfig',
					v-model='values.product',
					@change='updateTypePreset($event, true)'
				)
				number-input#quota.six.wide.column(
					ref='quota',
					:config='quotaConfig',
					v-model='values.quota',
					@change='updateCreditsPreview'
				)
					template(#hint)
						tooltip.bottom.badge.blue(
							ref='warningQuotaTooltip',
							intrusive='onlyStyle'
						)
							icon(info)
							span
								| {{ $t("{minQuota} testeurs minimums sont requis pour lancer un test et vous assurer d'une data de qualité.", { minQuota }) }}
				radios-input.six.wide.column(
					ref='device',
					:config='deviceConfig',
					v-model='values.device'
				)
				checkbox-group.six.wide.column(
					ref='os',
					:config='osConfig',
					v-model='values.os',
					v-if='showOs'
				)
				.six.wide.column(v-else)
				datalist-input.six.wide.column(
					ref='customer',
					:config='customerConfig',
					v-model='values.customer',
					@change='clearAndUpdateCustomerPreset'
				)
					template(#hint)
						router-link(:to='{ name: "companies creation" }', target='_blank')
							| {{ $t("Créer une société") }}
				datalist-input.six.wide.column(
					ref='createdBy',
					:config='createdByConfig',
					v-model='values.createdBy'
				)
					template(#hint)
						router-link(:to='{ name: "users creation" }', target='_blank')
							| {{ $t("Créer un utilisateur") }}
				checkbox-input.twelve.wide.column(
					ref='links',
					:config='linksConfig',
					v-model='values.links',
					v-if='linksEnabled'
				)
				text-input.twelve.wide.column(
					ref='linkFinish',
					:config='linkFinishConfig',
					v-model='values.linkFinish',
					v-if='values.links'
				)
				text-input.twelve.wide.column(
					ref='linkQuota',
					:config='linkQuotaConfig',
					v-model='values.linkQuota',
					v-if='values.links'
				)
				text-input.twelve.wide.column(
					ref='linkFilter',
					:config='linkFilterConfig',
					v-model='values.linkFilter',
					v-if='values.links'
				)
					template(#hint)
						i18n(
							path='Ce lien permet de rediriger un testeur en fonction d’une réponse donnée au questionnaire. Dans l’onglet "{t1}", si la réponse est à choix unique, vous pouvez sélectionner "{t2}" dans la liste déroulante "{t3}".'
						)
							template(#t1)
								strong
									| {{ $t("Consigne") }}
							template(#t2)
								strong
									| {{ $t("Aller au lien de filtrage (Screen out)") }}
							template(#t3)
								strong
									| {{ $t("Scénarisation") }}
						span.text.red
							|
							| {{ $t("Ce testeur verra son test refusé et il ne pourra plus réaliser ce test") }}
		.segment
			h4 {{ $t("Informations à destination des testeurs") }}
			.grid.stackable
				text-input.eight.wide.column(
					ref='testerTitle',
					:config='testerTitleConfig',
					v-model='values.testerTitle[formattedTranslation]'
				)
					template(#hint)
						| {{ $t("Ce nom s'affichera dans l'espace personnel du testeur") }}
				number-input.four.wide.column(
					ref='price',
					:config='priceConfig',
					v-model='values.price'
				)
					template(#hint)
						i18n(path='Par testeur.{t}')
							template(#t)
								strong
									|
									| {{ $t("Indiquez 0 pour un test non rémunéré") }}
				wysiwyg-input.twelve.wide.column(
					ref='storyline',
					:config='storylineConfig',
					v-master='values.storyline[getFormattedTranslation()]'
				)
				wysiwyg-input.twelve.wide.column(
					ref='storyline2',
					:config='storylineConfig',
					v-master='values.storyline[getFormattedTranslation()]'
				)
</template>

<script lang="ts">
import DynamicTabs from '@/components/DynamicTabs/DynamicTabs.vue';
import { DynamicTabsConfig } from '@/components/DynamicTabs/DynamicTabsTypes';
import Form from '@/components/Form/Form';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import CheckboxGroup from '@/components/Inputs/CheckboxGroup.vue';
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import {
	InputConfig,
	InputOption,
	InputOptionTree,
	InputType,
	NumberInputConfig,
} from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import WysiwygInput from '@/components/Inputs/WysiwygInput/WysiwygInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { helpUrl, testapicId } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import Logger from '@/services/LoggerService';
import UserUtils from '@/services/UserUtils';
import { companiesUrl } from '@/views/Companies/CompaniesConfig';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import DeleteLangModal from '@/views/Tests/Management/TestInfos/DeleteLangModal.vue';
import {
	FormattedArchiveInfos,
	FormattedCreateInfos,
	FormattedRedirInfos,
	ProductInfos,
	TestInfosFields,
} from '@/views/Tests/Management/TestInfos/TestInfosTypes';
import {
	creditsUrl,
	devicesUrl,
	productsUrl,
	testRedirectionsUrl,
	testStatesUrl,
	testsUrl,
} from '@/views/Tests/TestsConfig';
import { TestDevice, TestProduct, TestState } from '@/views/Tests/TestsTypes';
import { usersUrl } from '@/views/Users/UsersConfig';
import { DefaultUser } from '@/views/Users/UsersTypes';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Component, Ref } from 'vue-property-decorator';
import { Dictionary } from 'vue-router/types/router';
import {
	createdByConfig,
	customerConfig,
	deviceConfig,
	linkFilterConfig,
	linkFinishConfig,
	linkQuotaConfig,
	linksConfig,
	osConfig,
	priceConfig,
	productConfig,
	quotaConfig,
	storylineConfig,
	testerTitleConfig,
	titleConfig,
} from './TestInfosConfig';

type Layers =
	| 'create'
	| 'edit'
	| 'redirect create'
	| 'redirect edit'
	| 'archive'
	| 'activate';

@Component({
	components: {
		Tab,
		TextInput,
		RadiosInput,
		NumberInput,
		WysiwygInput,
		DatalistInput,
		CheckboxInput,
		CheckboxGroup,
		DynamicTabs,
		HelpButton,
		DeleteLangModal,
		Tooltip,
	},
})
export default class TestInfos extends Form<Layers> {
	@Ref() protected readonly deleteModal!: DeleteLangModal;
	@Ref() protected readonly warningQuotaTooltip!: Tooltip;
	@Ref() protected readonly createdBy!: DatalistInput;
	@Ref() protected readonly customer!: DatalistInput;
	@Ref() protected readonly quota!: NumberInput;
	@Ref() protected readonly price!: NumberInput;

	protected readonly initialValues: TestInfosFields = {
		title: '',
		product: '',
		quota: 0,
		device: '',
		os: true,
		customer: '',
		createdBy: '',
		links: false,
		testerTitle: {
			fr: '',
		},
		price: 0,
		storyline: {
			fr: '',
		},
	};
	protected readonly defaultTranslationTabs: InputOption[] = [
		{ text: 'Français', value: 'fr', flag: 'fr' },
	];
	protected readonly helpUrl: string = helpUrl;

	protected titleConfig: InputConfig<InputType.TEXT> = titleConfig;
	protected productConfig: InputConfig<InputType.RADIOS> = productConfig;
	protected quotaConfig: InputConfig<InputType.NUMBER> = quotaConfig;
	protected deviceConfig: InputConfig<InputType.RADIOS> = deviceConfig;
	protected osConfig: InputConfig<InputType.CHECKBOXGROUP> = osConfig;
	protected customerConfig: Promise<InputConfig<InputType.DATALIST>> =
		customerConfig;
	protected createdByConfig: InputConfig<InputType.DATALIST> =
		createdByConfig;
	protected linksConfig: InputConfig<InputType.CHECKBOX> = linksConfig;
	protected linkFinishConfig: InputConfig<InputType.TEXT> = linkFinishConfig;
	protected linkQuotaConfig: InputConfig<InputType.TEXT> = linkQuotaConfig;
	protected linkFilterConfig: InputConfig<InputType.TEXT> = linkFilterConfig;
	protected testerTitleConfig: InputConfig<InputType.TEXT> =
		testerTitleConfig;
	protected priceConfig: Promise<InputConfig<InputType.NUMBER>> = priceConfig;
	protected storylineConfig: InputConfig<InputType.WYSIWYG> = storylineConfig;
	protected translationTabs: InputOption[] = this.defaultTranslationTabs;

	protected translationsConfig: DynamicTabsConfig = {
		tabOptions: [
			{ text: 'Allemand', value: 'de', flag: 'de' },
			{ text: 'Anglais', value: 'en', flag: 'gb' },
			{ text: 'Espagnol', value: 'es', flag: 'es' },
			{ text: 'Français', value: 'fr', flag: 'fr' },
			{ text: 'Italien', value: 'it', flag: 'it' },
			{ text: 'Portugais', value: 'pt', flag: 'pt' },
			{ text: 'Russe', value: 'ru', flag: 'ru' },
		],
	};
	protected typesPresets: Map<string, ProductInfos<'extended'>> = new Map();
	protected currentTypePreset?: ProductInfos<'extended'>;
	protected minQuota: number = 0;

	protected values: TestInfosFields = _.cloneDeep(this.initialValues);
	protected readonly url: Map<Layers, string> = new Map<Layers, string>([
		['create', testsUrl],
		['edit', `${testsUrl}/:id`],
		['redirect create', testRedirectionsUrl],
		['redirect edit', `${testRedirectionsUrl}/:id`],
		['archive', `${testsUrl}/:id`],
		['activate', `${testsUrl}/:id`],
	]);

	private currentTanslation: string | InputOption = 'fr';
	private id?: string;
	private redirectionId?: string;
	private ownerCustomer: Promise<DefaultCompany> =
		UserUtils.instance.currentUserCustomer;
	private owner: Promise<DefaultUser> = UserUtils.instance.currentUser;
	private testState!: number;
	private previousState!: number | null;
	private pLinksEnabled: boolean = false;

	public get translation(): string | InputOption {
		return this.currentTanslation;
	}

	public set translation(val: string | InputOption) {
		this.currentTanslation = val;
	}

	protected get showOs(): boolean {
		return (
			this.values.product === `${TestProduct.video}` &&
			(this.values.device === `${TestDevice.smartphone}` ||
				this.values.device === `${TestDevice.tablet}`)
		);
	}

	protected get linksEnabled(): boolean {
		return this.pLinksEnabled;
	}

	protected get formattedTranslation(): string {
		return typeof this.translation === 'string'
			? this.translation
			: this.translation.value;
	}

	public setId(id: string | number): void {
		this.id = id.toString();
		(this.$refs['storyline'] as WysiwygInput).editEditorConfig({
			simpleUpload: {
				uploadUrl: `${Environment.any.api}/upload/image?idTest=${id}`,
			},
		});
	}

	public setTestState(state: number): void {
		this.testState = state;
		this.quotaConfig.readonly =
			state === TestState.inProgress || state === TestState.ended;
	}

	public setPreviousState(state: number | null): void {
		this.previousState = state;
	}

	public setRedirectionId(id: string | number): void {
		this.redirectionId = id.toString();
	}

	public resetTranslations(): void {
		this.translationTabs = _.cloneDeep(this.defaultTranslationTabs);
		this.currentTanslation = this.translationTabs[0];
	}

	public setTranslationTabs(translations: string[]): void {
		this.translationTabs = [];
		translations.forEach((trs: string): void => {
			const found: string | InputOption | undefined =
				this.translationsConfig.tabOptions.find(
					(val: string | InputOption): boolean =>
						typeof val === 'string'
							? val === trs
							: val.value === trs
				);
			if (
				found &&
				!this.translationTabs.find(
					(tab: InputOption): boolean =>
						tab.value ===
						(typeof found === 'string' ? found : found.value)
				)
			)
				this.translationTabs.push(
					typeof found !== 'string'
						? found
						: { text: found, value: found }
				);
		});
	}

	public redirectionSelected(): boolean {
		return this.values.links || false;
	}

	public async setFieldsValues(values: TestInfosFields): Promise<void> {
		this.values = values;
		await this.updateTypePreset(values.product, false);
		await this.updateCustomerPreset();
	}

	public async resetFieldsValues(): Promise<void> {
		const ownerCustomer: DefaultCompany = await this.ownerCustomer;
		const owner: DefaultUser = await this.owner;

		this.values = _.cloneDeep(this.initialValues);
		this.values.customer = {
			text: ownerCustomer.name,
			value: ownerCustomer.id.toString(),
		};

		await this.updateCustomerPreset();
		this.values.createdBy = {
			text: `${owner.firstName} ${owner.lastName}`,
			value: `${owner.id}`,
		};
	}

	public async getFormattedFieldsValues(
		layer: Layers
	): Promise<
		FormattedCreateInfos | FormattedRedirInfos | FormattedArchiveInfos
	> {
		switch (layer) {
			case 'archive':
				return {
					previousState: this.testState,
					testState: `${testStatesUrl}/${TestState.archived}`,
				};
			case 'activate':
				return {
					previousState: TestState.archived,
					testState: `${testStatesUrl}/${
						this.previousState &&
						this.previousState !== TestState.archived
							? this.previousState
							: TestState.inPreparation
					}`,
				};
			case 'redirect create':
			case 'redirect edit':
				return {
					enable: this.values.links ? 1 : 0,
					quota: this.values.linkQuota,
					filter: this.values.linkFilter,
					finish: this.values.linkFinish,
					test: `${testsUrl}/${this.id}`,
				};
			default:
				const values: FormattedCreateInfos = {
					title: this.values.title,
					expectedTesters: this.values.quota,
					product: `${productsUrl}/${this.values.product}`,
					device: `${devicesUrl}/${this.values.device}`,
					testState: `${testStatesUrl}/${
						this.testState || TestState.inPreparation
					}`,
					customer: `${companiesUrl}/${
						typeof this.values.customer === 'string'
							? this.values.customer
							: this.values.customer.value
					}`,
					price: this.values.price,
					owner: `${companiesUrl}/${(await this.ownerCustomer).id}`,
					userInfo: {},
					createdBy: `${usersUrl}/${
						typeof this.values.createdBy === 'string'
							? this.values.createdBy
							: this.values.createdBy.value
					}`,
				};
				if (this.showOs && this.values.os) {
					values.os = [];
					if (
						this.values.os === true ||
						(this.values.os as Dictionary<InputOptionTree>)['1']
					)
						values.os.push({ id: 1 });
					if (
						this.values.os === true ||
						(this.values.os as Dictionary<InputOptionTree>)['2']
					)
						values.os.push({ id: 2 });
				}
				this.translationTabs.forEach((trs: InputOption): void => {
					values.userInfo[trs.value] = {
						scenario: this.values.storyline[trs.value],
						usertitle: this.values.testerTitle[trs.value],
					};
				});
				if (layer === 'edit') delete values.owner;
				return values;
		}
	}

	protected clearAndUpdateCustomerPreset(): void {
		this.values.createdBy = '';
		this.updateCustomerPreset();
	}

	protected async updateCustomerPreset(): Promise<void> {
		if (!this.createdByConfig.rest?.options?.get.config?.params)
			return Logger.dbgWarn(
				'TestInfos: clearAndUpdateCustomerPreset: this.createdByConfig.rest?.options?.get.config?.params is undefined',
				this
			);
		const id: string =
			typeof this.values.customer === 'string'
				? this.values.customer
				: this.values.customer.value;

		if (id !== '') {
			delete this.createdByConfig.rest.options.get.config.params
				.subCompany;
			this.createdByConfig.rest.options.get.config.params.company = id;
		} else {
			delete this.createdByConfig.rest.options.get.config.params.company;
			if (
				!(await UserUtils.instance.currentUserHasPermission(
					'myaccount/customer/see/all'
				))
			)
				this.createdByConfig.rest.options.get.config.params.subCompany =
					(await this.ownerCustomer).id;
		}

		if (this.createdByConfig.rest?.options)
			this.createdByConfig.rest.options.page = 1;
		this.createdBy.refreshRestOptions();
	}

	protected async updateTypePreset(
		type: string,
		applyPreset: boolean
	): Promise<void> {
		this.currentTypePreset = this.typesPresets.get(type);
		if (!this.currentTypePreset) {
			try {
				const response: AxiosResponse<ProductInfos<'extended'>[]> =
					await Axios.get(creditsUrl, {
						...AxiosUtils.defaultConfig,
						params: { type },
					});
				this.typesPresets.set(type, response.data[0]);
				this.updateTypePreset(type, applyPreset);
			} catch (error) {
				AxiosUtils.defaultErrorCatch(
					error as AxiosError,
					'TestInfos: updateTypePreset'
				);
			}
		} else {
			const minQuota: number =
				(await this.ownerCustomer).id !== testapicId
					? this.currentTypePreset.quota
					: 1;
			const minPrice: number =
				(await this.ownerCustomer).id !== testapicId
					? this.currentTypePreset.price
					: 0;
			const quotaConf: NumberInputConfig<InputType.TEXT> = await this
				.quota.currentConfig;
			const priceConf: NumberInputConfig<InputType.TEXT> = await this
				.price.currentConfig;

			quotaConf.constraints = {
				...quotaConf.constraints,
				min: minQuota,
			};
			if (applyPreset) this.values.quota = this.currentTypePreset.quota;

			priceConf.constraints = {
				...priceConf.constraints,
				min: minPrice,
			};
			if (applyPreset) this.values.price = this.currentTypePreset.price;

			this.updateCreditsPreview(this.values.quota);
		}
	}

	protected async updateCreditsPreview(quota: number): Promise<void> {
		if (this.values.product === '' || Number.isNaN(quota)) return;

		if (
			this.currentTypePreset &&
			quota < this.currentTypePreset.quota &&
			!this.quotaConfig.disabled
		) {
			this.minQuota = this.currentTypePreset.quota;
			this.warningQuotaTooltip.show();
		} else this.warningQuotaTooltip.hide();

		try {
			const infos: ProductInfos = (
				await Axios.get<ProductInfos>(creditsUrl, {
					...AxiosUtils.defaultConfig,
					params: {
						type: this.values.product,
						quota,
					},
				})
			).data;
			if (!this.quotaConfig.tooltip)
				return Logger.dbgWarn(
					'TestInfos: clearAndUpdateCustomerPreset: this.quotaConfig.tooltip is false or undefined',
					this
				);
			this.quotaConfig.tooltip.content = `${infos.credits} ${this.$t(
				'crédits'
			)}`;
		} catch (error) {
			AxiosUtils.defaultErrorCatch(
				error as AxiosError,
				'TestInfos: updateCreditsPreview'
			);
		}
	}

	protected getFormattedTranslation(): string {
		return this.formattedTranslation;
	}

	protected getUrlParams(layer: Layers): Dictionary<string> {
		if (
			(layer === 'edit' || layer === 'archive' || layer === 'activate') &&
			this.id
		)
			return { id: this.id };
		else if (layer === 'redirect edit' && this.redirectionId)
			return { id: this.redirectionId };
		return {};
	}

	protected additionalValidityChecks(): boolean {
		if (this.translationTabs.length === 1) return true;
		return this.translationTabs.every((trs: InputOption): boolean => {
			let valid: boolean = true;
			const testerTitle: TextInput = this.$refs[
				'testerTitle'
			] as TextInput;
			const storyline: WysiwygInput = this.$refs[
				'storyline'
			] as WysiwygInput;

			valid =
				testerTitle.checkConstraints(
					this.values.testerTitle[trs.value] || ''
				) && valid;
			valid =
				storyline.checkConstraints(
					this.values.storyline[trs.value] || ''
				) && valid;

			if (!valid) {
				const titleError: ['valid' | 'error' | '', string] = [
					testerTitle.validity,
					testerTitle.validationMessage,
				];
				const storylineError: ['valid' | 'error' | '', string] = [
					storyline.validity,
					storyline.validationMessage,
				];
				this.translation = trs;
				this.$nextTick().then((): void => {
					[testerTitle.validity, testerTitle.validationMessage] =
						titleError;
					[storyline.validity, storyline.validationMessage] =
						storylineError;
				});
			}
			return valid;
		});
	}

	private async created(): Promise<void> {
		try {
			await this.owner;
			this.pLinksEnabled = (await this.ownerCustomer).id === testapicId;
		} catch (error) {
			AxiosUtils.defaultSilentErrorCatch(
				error as AxiosError,
				'TestInfos: created'
			);
		}
	}

	private mounted(): void {
		this.translationsConfig.deleteModal = this.deleteModal;
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

#test-infos {
	#trs-tabs {
		@include z-index(topElement);

		.help-button {
			position: absolute;
			right: 0;
			top: 0;
			transform: translate(50%, -50%);
		}
	}

	#quota {
		.hint {
			margin-top: $padding;

			.tooltip {
				white-space: initial;
				width: 100%;

				span {
					white-space: initial;
					vertical-align: middle;
				}

				i.icon.info {
					margin-right: .3em;
				}
			}
		}
	}
}
</style>
