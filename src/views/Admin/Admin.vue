<template lang="pug">
include /src/mixins

#admin.view
	flash-message.sticky.top(name='admin')
	+view-heading
		.h2.title
			| {{ $t("Administration") }}
	#view-content
		.container
			.segment
				.h3.title
					| {{ $t("Rechercher") }}
				.grid.stackable
					text-input.four.wide.column(
						:config='testConfig',
						v-model='testId',
						@keyup.enter.native='getTest'
					)
						template(#after)
							button.button.icon.primary(@click='getTest')
								icon(search)
					text-input.four.wide.column(
						:config='resultConfig',
						v-model='resultId',
						@keyup.enter.native='getResult'
					)
						template(#after)
							button.button.icon.primary(@click='getResult')
								icon(search)
					text-input.four.wide.column(
						:config='affectationConfig',
						v-model='affectationId',
						@keyup.enter.native='getAffectation'
					)
						template(#after)
							button.button.icon.primary(@click='getAffectation')
								icon(search)
			admin-test(v-if='retrievedTest', :current-test='retrievedTest || undefined')/
			admin-result(
				v-if='retrievedResult',
				:current-result='retrievedResult || undefined'
			)/
			admin-affectation(
				v-if='retrievedAffectation',
				:current-affectation='retrievedAffectation || undefined'
			)
			.segment.loading(v-if='loading')
				.loader
			.segment.red.inverted(v-if='error')
				| {{ $t("Pas de résultat pour cet ID. Merci de vérifier que celui-ci est correct.") }}
</template>

<script lang="ts">
import FlashMessage from '@/components/FlashMessage/FlashMessage.vue';
import Icon from '@/components/Icon/Icon.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import AdminAffectation from '@/views/Admin/AdminAffectation/AdminAffectation.vue';
import AdminResult from '@/views/Admin/AdminResult/AdminResult.vue';
import AdminTest from '@/views/Admin/AdminTest/AdminTest.vue';
import { resultsUrl } from '@/views/Results/ResultsConfig';
import { DefaultResult } from '@/views/Results/ResultsTypes';
import { affectationsUrl } from '@/views/Testers/TestersAffectations/TestersAffectationsConfig';
import { DefaultAffectation } from '@/views/Testers/TestersAffectations/TestersAffectationsTypes';
import { testsUrl } from '@/views/Tests/TestsConfig';
import { DefaultTest } from '@/views/Tests/TestsTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { affectationConfig, resultConfig, testConfig } from './AdminConfig';

@Component({
	components: {
		FlashMessage,
		TextInput,
		Icon,
		AdminTest,
		AdminResult,
		AdminAffectation,
	},
})
export default class Monitoring extends Vue {
	protected testConfig: InputConfig = testConfig;
	protected resultConfig: InputConfig = resultConfig;
	protected affectationConfig: InputConfig = affectationConfig;

	protected testId: string = '';
	protected resultId: string = '';
	protected affectationId: string = '';
	protected retrievedTest: DefaultTest | false = false;
	protected retrievedResult: DefaultResult | false = false;
	protected retrievedAffectation: DefaultAffectation | false = false;
	protected error: boolean = false;
	protected loading: boolean = false;

	protected getTest(): void {
		if (this.testId === '') return;

		this.loading = true;
		this.error = false;
		this.retrievedResult = false;
		this.retrievedAffectation = false;
		axios
			.get(`${testsUrl}/${this.testId}`, AxiosUtils.defaultConfig)
			.then((response: AxiosResponse<DefaultTest>): void => {
				this.retrievedTest = response.data;
				this.loading = false;
			})
			.catch((error: AxiosError): void => {
				this.loading = false;
				this.error = true;
				AxiosUtils.defaultErrorCatch(
					error,
					`Cannot get ${this.testId} from ${testsUrl}:`
				);
			});
	}

	protected getResult(): void {
		if (this.resultId === '') return;

		this.loading = true;
		this.error = false;
		this.retrievedTest = false;
		this.retrievedAffectation = false;
		axios
			.get(`${resultsUrl}/${this.resultId}`, AxiosUtils.defaultConfig)
			.then((response: AxiosResponse<DefaultResult>): void => {
				this.retrievedResult = response.data;
				this.loading = false;
			})
			.catch((error: AxiosError): void => {
				this.loading = false;
				this.error = true;
				AxiosUtils.defaultErrorCatch(
					error,
					`Cannot get ${this.resultId} from ${resultsUrl}:`
				);
			});
	}

	protected getAffectation(): void {
		if (this.affectationId === '')
			return Logger.dbgWarn(
				"Monitoring: getAffectation: this.affectationId === ''",
				this
			);

		this.loading = true;
		this.error = false;
		this.retrievedTest = false;
		this.retrievedResult = false;
		axios
			.get(
				`${affectationsUrl}/${this.affectationId}`,
				AxiosUtils.defaultConfig
			)
			.then((response: AxiosResponse<DefaultAffectation>): void => {
				this.retrievedAffectation = response.data;
				this.loading = false;
			})
			.catch((error: AxiosError): void => {
				this.loading = false;
				this.error = true;
				AxiosUtils.defaultErrorCatch(
					error,
					`Cannot get ${this.affectationId} from ${affectationsUrl}:`
				);
			});
	}
}
</script>