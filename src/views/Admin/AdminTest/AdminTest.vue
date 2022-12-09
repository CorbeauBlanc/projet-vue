<template lang="pug">
#admin-test.segment
	.h4
		router-link(
			:to='{ name: "test edition", params: { id: currentTest.id } }',
			target='_blank'
		) {{ `${currentTest.title} ` }}
		span.id {{ currentTest.id }}
		i.icon(:class='currentTest.device.icon')/
		i.icon(:class='currentTest.product.icon')/

	.margin.bottom
		assign-modal(ref='assignModal', @confirm='assign(true)')/
		button.button(
			:class='{ disabled: true /*!assignEnabled*/ }',
			@click='assign(false)'
		)
			strong {{ "@" }}
			span.text.inline {{ $t("Affecter de nouveaux testeurs") }}
		.text.dark-grey.margin.top
			| {{ $t("Ciblage auto uniquement - Affecte des testeurs supplémentaires au précédent ciblage auto (critères identiques) et leur ") }}
			strong
				| {{ $t("envoi un email.") }}

	.margin.bottom
		reassign-modal(ref='reassignModal', @confirm='reassign(true)')/
		button.button(@click='reassign(false)')
			strong {{ "@" }}
			span.text.inline {{ $t("Réaffecter les testeurs retirés") }}
		i18n.text.dark-grey.margin.top(
			path='Réaffecte les testeurs ayant une affectation en "{t1}" et relance la campagne en leur {t2}',
			tag='div'
		)
			template(#t1)
				strong {{ $t("Affectation retirée") }}
			template(#t2)
				strong {{ $t("envoyant un email.") }}

	.margin.bottom
		unsolicited-modal(
			ref='unsolicitedModal',
			@confirm='removeUnsolicited(true)'
		)/
		button.button.red(@click='removeUnsolicited(false)')
			span {{ $t("Retirer tous les ") }}
			strong.text.inline {{ $t("non sollicités") }}
		notstarted-modal(ref='notStartedModal', @confirm='removeNotStarted(true)')/
		button.button.red(@click='removeNotStarted(false)')
			span {{ $t("Retirer tous les ") }}
			strong.text.inline {{ $t("non débutés") }}
		inprogress-modal(ref='inProgressModal', @confirm='removeInProgress(true)')/
		button.button.red(@click='removeInProgress(false)')
			span {{ $t("Retirer tous les ") }}
			strong.text.inline {{ $t("en cours") }}
		.text.dark-grey.margin.top
			| {{ $t("Retire les affectations selon le statut précisé dans le bouton.") }}

	.grid.stackable.margin.top
		quota-modal(
			ref='quotaModal',
			@confirm='editQuota(true)',
			:old-quota='currentTest.expectedTesters',
			:new-quota='quota'
		)/
		number-input.column.wide(
			:config='editQuotaConfig',
			v-model='quota',
			@keyup.enter.native='editQuota(false)'
		)
			template(#after)
				button.button.icon(@click='editQuota(false)')
					icon(check)
		price-modal(
			ref='priceModal',
			@confirm='editPrice(true)',
			:old-price='currentTest.price',
			:new-price='price'
		)/
		number-input.column.wide(
			:config='editQuotaPrice',
			v-model='price',
			@keyup.enter.native='editPrice(false)'
		)
			template(#after)
				button.button.icon(@click='editPrice(false)')
					icon(check)
			template(#hint)
				| {{ $t("Uniquement pour les testeurs n’ayant pas terminé / validé ce test") }}
</template>

<script lang="ts">
import Icon from '@/components/Icon/Icon.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import AxiosUtils from '@/services/AxiosUtils';
import FlashMessages from '@/services/FlashMessagesService';
import { TestProcessingInfos } from '@/views/Admin/AdminTest/AdminTestTypes';
import { DefaultTest } from '@/views/Tests/TestsTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import {
	adminTestsUrl,
	editQuotaConfig,
	editQuotaPrice,
} from './AdminTestConfig';
import AssignModal from './AssignModal.vue';
import InprogressModal from './InprogressModal.vue';
import NotstartedModal from './NotstartedModal.vue';
import PriceModal from './PriceModal.vue';
import QuotaModal from './QuotaModal.vue';
import ReassignModal from './ReassignModal.vue';
import UnsolicitedModal from './UnsolicitedModal.vue';

@Component({
	components: {
		AssignModal,
		ReassignModal,
		UnsolicitedModal,
		NotstartedModal,
		InprogressModal,
		QuotaModal,
		PriceModal,
		TextInput,
		NumberInput,
		Icon,
	},
})
export default class AdminTest extends Vue {
	@Prop() protected readonly currentTest!: DefaultTest;

	@Watch('currentTest') protected onCurrentTestChange(): void {
		this.initializeTest();
	}

	protected quota: number = 0;
	protected price: number = 0;

	protected editQuotaConfig: InputConfig = editQuotaConfig;
	protected editQuotaPrice: InputConfig = editQuotaPrice;

	protected assignEnabled: boolean = true;
	protected remindEnabled: boolean = true;

	@Ref() protected readonly assignModal!: AssignModal;
	@Ref() protected readonly reassignModal!: ReassignModal;
	@Ref() protected readonly unsolicitedModal!: UnsolicitedModal;
	@Ref() protected readonly notStartedModal!: NotstartedModal;
	@Ref() protected readonly inProgressModal!: InprogressModal;
	@Ref() protected readonly quotaModal!: QuotaModal;
	@Ref() protected readonly priceModal!: PriceModal;

	protected assign(confirmed: boolean): void {
		if (!this.assignEnabled) return;
		if (!confirmed) this.assignModal.show();
	}

	protected reassign(confirmed: boolean): void {
		if (confirmed)
			axios
				.post(
					`${adminTestsUrl}/${this.currentTest.id}/reassign_testers`,
					undefined,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Les testeurs retirés ont bien été réaffecté au test. Un email leur sera envoyé.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot post on ${adminTestsUrl}/${this.currentTest.id}/reassign_testers:`
					);
				});
		else this.reassignModal.show();
	}

	protected removeUnsolicited(confirmed: boolean): void {
		if (confirmed)
			axios
				.delete(
					`${adminTestsUrl}/${this.currentTest.id}/unsolicited_testers`,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Les testeurs avec le statut "Non sollicité" ont bien été retirés.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot delete ${adminTestsUrl}/${this.currentTest.id}/unsolicited_testers:`
					);
				});
		else this.unsolicitedModal.show();
	}

	protected removeNotStarted(confirmed: boolean): void {
		if (confirmed)
			axios
				.delete(
					`${adminTestsUrl}/${this.currentTest.id}/affectations_not_started`,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Les testeurs avec le statut "Non débuté" ont bien été retirés.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot delete ${adminTestsUrl}/${this.currentTest.id}/affectations_not_started:`
					);
				});
		else this.notStartedModal.show();
	}

	protected removeInProgress(confirmed: boolean): void {
		if (confirmed)
			axios
				.delete(
					`${adminTestsUrl}/${this.currentTest.id}/affectations_in_progress`,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Les testeurs avec le statut "En cours" ont bien été retirés.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot delete ${adminTestsUrl}/${this.currentTest.id}/affectations_in_progress:`
					);
				});
		else this.inProgressModal.show();
	}

	protected editQuota(confirmed: boolean): void {
		if (this.quota <= 0) return;

		if (confirmed)
			axios
				.put(
					`${adminTestsUrl}/${this.currentTest.id}/quota`,
					{ value: this.quota },
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Le quota a bien été modifié.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot put ${{
							value: this.quota,
						}} on ${adminTestsUrl}/${this.currentTest.id}/quota:`
					);
				});
		else this.quotaModal.show();
	}

	protected editPrice(confirmed: boolean): void {
		if (this.price <= 0) return;

		if (confirmed)
			axios
				.put(
					`${adminTestsUrl}/${this.currentTest.id}/price`,
					{ value: this.price },
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'La rémunération a bien été modifiée.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot put ${{
							value: this.price,
						}} on ${adminTestsUrl}/${this.currentTest.id}/price:`
					);
				});
		else this.priceModal.show();
	}

	private initializeTest(): void {
		this.quota = this.currentTest.expectedTesters;
		this.price = this.currentTest.price;
		axios
			.get(adminTestsUrl, {
				...AxiosUtils.defaultConfig,
				params: {
					id: this.currentTest.id,
				},
			})
			.then((response: AxiosResponse<TestProcessingInfos>): void => {
				this.assignEnabled = response.data.hasAutomaticTargeting;
				this.remindEnabled = response.data.relaunchUserIsEnabled;
			});
	}

	private mounted(): void {
		this.initializeTest();
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

#admin-test {
	.h4.title i.icon {
		font-size: 1.5rem;
	}

	& > div {
		&:not(.h4.title) {
			margin-bottom: $padding * 2;
		}

		&.grid:last-child {
			@include form-element-border('', 'top');
		}

		button.button {
			font-size: 1em;
		}
	}
}
</style>
