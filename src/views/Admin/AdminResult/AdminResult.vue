<template lang="pug">
#admin-result.segment
	.h4
		| {{ $t("ID Résultat") }}
		| {{ " 3118 " /*currentResult.id*/ }}
		span.text.inline -
		router-link(:to='"#"') {{ /*currentResult.name*/ "BIDON" }}
	.margin.bottom
		data-modal(ref='dataModal', @confirm='relaunchData(true)')/
		button.button(
			:class='{ disabled: !relaunchEnabled }',
			@click='relaunchData(false)'
		)
			| {{ $t("Relancer le calcul des données") }}
		.text.dark-grey.margin.top.bottom
			| {{ $t("Permet de relancer le calcul de toutes les données récoltées sur tous les tests du résultat.") }}
		.text.dark-grey
			.loading.inline
				.loader.small
			strong.text.inline En cours: {{ progress }} %
</template>

<script lang="ts">
import AxiosUtils from '@/services/AxiosUtils';
import FlashMessages from '@/services/FlashMessagesService';
import Logger from '@/services/LoggerService';
import { adminResultsUrl } from '@/views/Admin/AdminResult/AdminResultConfig';
import { ResultProcessingInfos } from '@/views/Admin/AdminResult/AdminResultTypes';
import DataModal from '@/views/Admin/AdminResult/DataModal.vue';
import { DefaultResult } from '@/views/Results/ResultsTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

@Component({
	components: {
		DataModal,
	},
})
export default class AdminResult extends Vue {
	@Prop() protected readonly currentResult!: DefaultResult;

	@Ref() protected readonly dataModal!: DataModal;

	@Watch('currentResult') protected onCurrentResultChange(): void {
		this.initializeResult();
	}

	protected id: number = 3681;
	protected progress: number = 0;
	protected relaunchEnabled: boolean = true;

	protected relaunchData(confirmed: boolean): void {
		if (!this.relaunchEnabled)
			return Logger.dbgWarn(
				'AdminResult: relaunchData: this.relaunchEnabled is false or undefined',
				this
			);

		if (confirmed)
			axios
				.put(
					`${adminResultsUrl}/${this.id}/relaunch_data`,
					undefined,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Le calcul des données a bien été relancé. Merci de patienter environ 15 minutes.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot put on ${adminResultsUrl}/${this.id}/relaunch_data:`
					);
				});
		else this.dataModal.show();
	}

	private initializeResult(): void {
		axios
			.get(
				`${adminResultsUrl}/${this.id}/progression`,
				AxiosUtils.defaultConfig
			)
			.then((response: AxiosResponse<ResultProcessingInfos>): void => {
				this.progress = response.data.progression;
				this.relaunchEnabled = response.data.relaunchDataIsEnabled;
			});
	}

	private mounted(): void {
		this.initializeResult();
	}
}
</script>

<style lang="scss" scoped>

.loading {
	vertical-align: bottom;
}

</style>