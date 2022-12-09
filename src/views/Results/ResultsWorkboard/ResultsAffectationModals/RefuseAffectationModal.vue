<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Motif du refus") }}
block content
	p
		span.text
			| {{ $t("Le testeur recevra un email avec les raisons du refus indiquées ci-dessous.") }}
	p
		strong
			| {{ $t("Indiquez les motivations précises pour lesquelles vous avez souhaité refuser le test et/ou sélectionnez un motif pré-defini dans la liste ci-après.") }}
	div.stackable.grid(v-if="loaded")
		datalist-input.twelve.wide.column(
			ref="refusalInput"
			:config="refusalInputConfig"
			@change="onRefusalInputChange"
			v-model="refusalInputValue"
		)
		textarea-input.twelve.wide.column(
			:config="commentInputConfig"
			v-model="commentInputValue"
		)
block footer
	div
	div
		button.button.red(@click='confirm')
			| {{ $t("Confirmer le refus") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Fermer") }}
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import TextareaInput from '@/components/Inputs/TextInput/TextareaInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Modal from '@/components/Modal/Modal';
import AxiosUtils from '@/services/AxiosUtils';
import { GetListResponse, LdData } from '@/types';
import {
	affectationUrl,
	refuseTemplatesUrl,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardConfig';
import {
	RefusalTemplate,
	RefusalType,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import sanitizeHtml from 'sanitize-html';
import { Component, Prop, Ref } from 'vue-property-decorator';

@Component({
	components: {
		DatalistInput,
		TextInput,
		TextareaInput,
	},
})
export default class RefuseAffectationModal extends Modal {
	@Prop() protected readonly affectationId!: string;

	@Ref() protected readonly refusalInput!: DatalistInput;

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'refuse-modal';

	protected loaded: boolean = false;
	protected hidden: boolean = true;

	protected refusalInputValue: string | InputOption | undefined = '';
	protected commentInputValue: string = '';

	/**
	 * Map that contains the RefusalType number as a string with its default comment
	 */
	protected readonly defaultComments: Map<string, string> = new Map([]);

	protected confirm(): void {
		if (this.refusalInput.checkConstraints()) {
			this.submitRefusal();
			this.hide();
		}
	}

	protected cancel(): void {
		this.hide();
	}

	protected refusalInputConfig: InputConfig<InputType.SELECT> = {
		placeholder: `${this.$t('Rechercher...')}`,
		multiple: false,
		constraints: {
			required: true,
		},
		options: [
			{
				text: 'Commentaires faibles',
				value: `${RefusalType.weakComments}`,
			},
			{
				text: 'Tâche(s) non effectuée(s)',
				value: `${RefusalType.taskNotDone}`,
			},
			{
				text: 'Commentaires écrits insuffisants',
				value: `${RefusalType.weakWrittenComments}`,
			},
			{
				text: 'Son de mauvaise qualité DESKTOP',
				value: `${RefusalType.desktopLowSoundQuality}`,
			},
			{
				text: 'Son de mauvaise qualité MOBILE',
				value: `${RefusalType.mobileLowSoundQuality}`,
			},
			{
				text: 'Ecran noir (double écran)',
				value: `${RefusalType.blackDoubleScreen}`,
			},
			{
				text: 'Vidéo de mauvaise qualité (glitch)',
				value: `${RefusalType.lowVideoQuality}`,
			},
			{ text: 'Autre problème', value: `${RefusalType.other}` },
		],
	};

	protected commentInputConfig: InputConfig = {
		multiple: false,
	};

	protected retrieveDefaultComments(): void {
		Axios.get(refuseTemplatesUrl, AxiosUtils.defaultConfig)
			.then((response?: AxiosResponse<LdData<RefusalTemplate>>): void => {
				this.loaded = true;
				if (!response?.data) return;

				const formattedResponse: GetListResponse<RefusalTemplate> =
					LdData.getFormattedResponse(response.data);

				const refuseTemplates: RefusalTemplate[] =
					formattedResponse.data;

				refuseTemplates.forEach(
					(refuseTemplate: RefusalTemplate): void => {
						this.defaultComments.set(
							`${refuseTemplate.id}`,
							refuseTemplate.content
						);
					}
				);
			})
			.catch((error: any): void => {
				this.loaded = true;
				AxiosUtils.defaultErrorLog(
					`RefuseAffectationModal: Cannot retrieve data from ${refuseTemplatesUrl}`,
					error
				);
			});
	}

	protected submitRefusal(): void {
		Axios.post(
			`${affectationUrl}/${this.affectationId}/refuse`,
			{
				refuse_template: (this.refusalInputValue as InputOption).value,
				content: sanitizeHtml(this.commentInputValue),
			},
			AxiosUtils.defaultConfig
		)
			.then((response: any): void => {
				this.$emit('refuse');
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot post on ${affectationUrl}/${this.affectationId}/refuse`,
					error
				);
			});
	}

	/**
	 * Prefill the refusal comment field depending on the refusal input value
	 */
	protected onRefusalInputChange(): void {
		if (this.refusalInputValue) {
			this.commentInputValue = this.defaultComments.get(
				`${(this.refusalInputValue as InputOption).value}`
			) as string;
		} else this.commentInputValue = '';
	}

	protected created(): void {
		this.retrieveDefaultComments();
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

#refuse-modal {
	.content {
		text-align: left;
	}

	.footer {
		@include z-index(base);
	}
}
</style>
