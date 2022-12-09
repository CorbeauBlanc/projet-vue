<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Valider") }}
block content
	span.text
		| {{ `${$t("Souhaitez-vous valider le test de")} ` }}
	strong(v-if="!isLoading")
		| {{ title }}
	span.id(v-if="!isLoading")
		| {{ id }}
	| ?
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Valider") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Fermer") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import { resultsUrl } from '@/views/Results/ResultsConfig';
import { affectationUrl } from '@/views/Results/ResultsWorkboard/ResultsWorkboardConfig';
import { RetrievedResultInfos } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ValidateAffectationModal extends Modal {
	@Prop() protected readonly affectationId!: string;
	@Prop() protected readonly resultId!: string;

	protected id!: number;
	protected title!: string;

	protected isLoading: boolean = true;

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'validate-modal';

	protected hidden: boolean = true;

	protected confirm(): void {
		Axios.post(
			`${affectationUrl}/${this.affectationId}/validate`,
			undefined,
			AxiosUtils.defaultConfig
		)
			.then((): void => {
				this.$emit('validate');
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot post on ${affectationUrl}/${this.affectationId}/validate`,
					error
				);
			});
		this.hide();
	}

	protected cancel(): void {
		this.hide();
	}

	protected created(): void {
		Axios.get(`${resultsUrl}/${this.resultId}`, AxiosUtils.defaultConfig)
			.then((response?: AxiosResponse<RetrievedResultInfos>): void => {
				this.isLoading = false;
				if (!response?.data) return;

				const retrievedResult: RetrievedResultInfos = response.data;

				this.title = retrievedResult.name;
				this.id = retrievedResult.id;
			})
			.catch((error: any): void => {
				this.isLoading = false;
				AxiosUtils.defaultErrorLog(
					`ValidateVideoModal: Cannot get ${this.resultId} from ${resultsUrl}`,
					error
				);
			});
	}
}
</script>

<style lang="scss">
#validate-modal {
	.content {
		text-align: left;
	}
}
</style>
