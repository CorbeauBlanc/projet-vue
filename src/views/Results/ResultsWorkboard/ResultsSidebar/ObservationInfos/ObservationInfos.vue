<template lang="pug">
	#observation-infos.stackable.grid
		datalist-input.twelve.wide.column(
			ref="localisation"
			:config="localisationInputConfig"
			v-model="values.localisation"
			@blur="handleBlurLocalisation"
			@input:added="handleLocalisationAdded"
		)

		radios-input#valency-input.six.wide.column(
			ref="valency",
			:config="valencyInputConfig",
			v-model="values.valency",
			buttonmode
		)
		radios-input#severity-input.six.wide.column(
			ref="severity",
			:config="severityInputConfig",
			v-if="values.valency === '3'"
			v-model="values.severity",
			buttonmode
		)

		.title.twelve.wide.column.required
			label.label
				strong
					| {{ $t('Titre du constat') }} - {{ titleLength }}/60
		text-input.title-input.twelve.wide.column(
			ref="title"
			:config="titleConfig",
			v-model="values.title",
			@text-input:keyup="onInputChange"
		)

		div.tabs.twelve.wide.column
			div.menu.stretched
				tab(
					name="description",
					v-master="currentTab"
				)
					| {{ $t('Description') }}
				tab(
					name="recommendation",
					v-master="currentTab"
				)
					| {{ $t('Recommandation') }}

		div.tabs.twelve.wide.column
			div.tab(
				v-show="currentTab === 'description'"
			)
				wysiwyg-input(
					ref="description",
					:config="obsDescriptionConfig",
					v-model="values.description"
				)
			div.tab(
				v-show="currentTab === 'recommendation'"
			)
				wysiwyg-input(
					ref="recommendation",
					:config="obsRecommendationConfig",
					v-model="values.recommendation"
				)
</template>

<script lang="ts">
import Form from '@/components/Form/Form';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import WysiwygInput from '@/components/Inputs/WysiwygInput/WysiwygInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import AxiosUtils from '@/services/AxiosUtils';
import ComponentsUtils from '@/services/ComponentsUtils';
import Sidebars from '@/services/SidebarsService';
import { GetListResponse, LdData } from '@/types';
import { SourceType } from '@/views/Results/ResultsWorkboard/ResultsSidebar/LinkObservation/LinkObservationTypes';
import {
	obsDescriptionConfig,
	obsRecommendationConfig,
	severityInputConfig,
	titleConfig,
	valencyInputConfig,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/ObservationInfos/ObservationInfosConfig';
import { RetrievedCreatedObservation } from '@/views/Results/ResultsWorkboard/ResultsSidebar/ObservationInfos/ObservationInfosTypes';
import { localisationsUrl } from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarConfig';
import {
	FormattedCreateObservation,
	ObservationFields,
	SidebarEvent,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarTypes';
import { RetrievedObsLocalisation } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import { Component } from 'vue-property-decorator';

type Layers = 'create' | 'edit';

@Component({
	components: {
		DatalistInput,
		TextInput,
		RadiosInput,
		Tab,
		WysiwygInput,
	},
})
export default class ObservationInfos extends Form<Layers> {
	protected readonly initialValues: ObservationFields = {
		localisation: '',
		valency: '',
		title: '',
		description: '',
		recommendation: '',
	};

	protected currentTab: string = 'description';
	protected titleLength: number = 0;

	protected results: typeof Sidebars.results = Sidebars.results;

	protected localisationInputConfig: InputConfig<InputType.DATALIST> = {
		label: 'Localisation',
		placeholder: 'Sélectionner une localisation',
		translate: true,
		multiple: false,
		strict: false,
		rest: {
			options: {
				page: 1,
				get: {
					url: localisationsUrl,
					config: {
						...AxiosUtils.defaultConfig,
						params: { result: Sidebars.results.resultId },
					},
					promiseCallback: (
						response?: AxiosResponse<
							LdData<RetrievedObsLocalisation>
						>
					): GetListResponse => {
						const ret: GetListResponse<InputOption> =
							GetListResponse.empty;
						if (!response?.data) return ret;

						LdData.getFormattedResponse(
							response?.data || []
						).data.forEach(
							(localisation: RetrievedObsLocalisation): void => {
								ret.data.push({
									text: localisation.name,
									value: localisation.id.toString(),
								});
							}
						);
						return ret;
					},
				},
				filterBy: [['search', 'name']],
			},
		},
	};
	protected valencyInputConfig: InputConfig<InputType.RADIOS> =
		valencyInputConfig;
	protected severityInputConfig: InputConfig<InputType.RADIOS> =
		severityInputConfig;
	protected titleConfig: InputConfig<InputType.TEXT> = titleConfig;
	protected obsDescriptionConfig: InputConfig<InputType.WYSIWYG> =
		obsDescriptionConfig;
	protected obsRecommendationConfig: InputConfig<InputType.WYSIWYG> =
		obsRecommendationConfig;

	protected values: ObservationFields = _.cloneDeep(this.initialValues);
	protected readonly url: Map<Layers, string> = new Map<Layers, string>();

	protected onInputChange(value: string): void {
		this.titleLength = value.length;
	}

	protected handleLocalisationAdded(localisation: string): void {
		Axios.post(
			`${localisationsUrl}`,
			{
				name: localisation,
				result: `/api/results/${Sidebars.results.resultId}`,
			},
			AxiosUtils.defaultConfig
		)
			.then(
				(
					response: AxiosResponse<RetrievedCreatedObservation>
				): void => {
					this.values.localisation = {
						text: response.data.name,
						value: `${response.data.id}`,
					};
					this.$emit('sidebarEvent', {
						type: 'success',
						message: 'La localisation a été créée',
					} as SidebarEvent);
				}
			)
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot post on ${localisationsUrl}`,
					error
				);
				this.$emit('sidebarEvent', {
					type: 'error',
					message:
						'Une erreur est survenue lors de la création de la localisation, veuillez réessayer ultérieurement ou contacter Testapic si le problème persiste.',
				} as SidebarEvent);
			});
	}

	public getFormattedFieldsValues(): FormattedCreateObservation {
		return {
			resultId: Number.parseInt(this.results.resultId),
			sourceId: SourceType.getSourceId(this.results.data),
			sourceType: SourceType.getSourceType(this.results.data),
			title: sanitizeHtml(
				this.values.title,
				ComponentsUtils.defaultSanitizerOptions
			),
			localisationId:
				this.values.localisation === ''
					? null
					: Number.parseInt(
							(this.values.localisation as InputOption).value
					  ),
			valency: Number.parseInt(this.values.valency),
			severity:
				this.values.severity && this.values.valency === '3'
					? Number.parseInt(this.values.severity)
					: null,
			description: sanitizeHtml(
				this.values.description,
				ComponentsUtils.defaultSanitizerOptions
			),
			recommendation: this.values.recommendation
				? sanitizeHtml(
						this.values.recommendation,
						ComponentsUtils.defaultSanitizerOptions
				  )
				: null,
			chartJson: null,
			sourceFilterOverload: null,
			sourceHeader: null,
		} as FormattedCreateObservation;
	}

	public setFieldsValues(values: ObservationFields): void {
		this.values = values;
	}

	public resetFieldsValues(): void {
		this.titleLength = 0;
		this.values = _.cloneDeep(this.initialValues);
	}

	protected additionalValidityChecks(): boolean {
		return (
			(this.values.localisation !== '' &&
				this.values.localisation.hasOwnProperty('value')) ||
			this.values.localisation === ''
		);
	}

	private handleBlurLocalisation(): void {
		if (!this.additionalValidityChecks()) this.values.localisation = '';
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#observation-infos {
	margin-top: 0;

	.title {
		padding-bottom: 0;
	}

	.title-input {
		padding-top: 0;
	}

	.radios-input {
		label.label {
			width: 100%;
		}

		.radio-input {
			font-size: .8rem;

			i.icon {
				font-size: inherit;
				margin-right: .5em;
			}
		}

		input[type="radio"]:checked + .radio-input {
			&:nth-of-type(3) {
				color: scale-color($red, $lightness: -10%);
				border-color: scale-color($red, $lightness: -10%);
				background: scale-color($red, $lightness: 90%);
				box-shadow: 0 0 0 3px inset rgba($red, .95);
			}
		}
	}

	.radio-input {
		margin-right: -2px;
	}

	#valency-input {
		input[type="radio"]:checked + .radio-input {
			&:nth-of-type(1) {
				color: scale-color($green, $lightness: -10%);
				border-color: scale-color($green, $lightness: -10%);
				background: scale-color($green, $lightness: 90%);
				box-shadow: 0 0 0 3px inset rgba($green, .95);
			}

			&:nth-of-type(2) {
				color: scale-color($secondary-color, $lightness: -30%);
				border-color: scale-color($secondary-color, $lightness: -10%);
			}
		}
	}

	#severity-input {
		input[type="radio"]:checked + .radio-input {
			&:nth-of-type(1) {
				color: scale-color($yellow, $lightness: -10%);
				border-color: scale-color($yellow, $lightness: -10%);
				background: scale-color($yellow, $lightness: 90%);
				box-shadow: 0 0 0 3px inset rgba($yellow, .95);
			}

			&:nth-of-type(2) {
				color: scale-color($orange, $lightness: -10%);
				border-color: scale-color($orange, $lightness: -10%);
				background: scale-color($orange, $lightness: 90%);
				box-shadow: 0 0 0 3px inset rgba($orange, .95);
			}
		}
	}

	.ck-dropdown__panel_sw, .ck-dropdown__panel_nw {
		right: -100px!important;
	}
}
</style>
