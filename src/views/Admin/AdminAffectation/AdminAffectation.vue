<template lang="pug">
#admin-affectation.segment
	.h4
		span
			| {{ $t("ID Affectation") }}
			| {{ ` #${currentAffectation.id} - ` }}
			router-link(
				v-if='affectedUser',
				:to='{ name: "users edition", params: { id: affectedUser.id } }',
				target='_blank'
			) {{ `${affectedUser.firstName} ${affectedUser.lastName}` }}
		span#affected-test.normal.text.inline(v-if='affectedTest')
			| {{ `- Test #${affectedTest.id} - ${affectedTest.title}` }}
		i.icon.text.inline(:class='affectedTest ? affectedTest.device.icon : ""')/
		i.icon.text.inline(:class='affectedTest ? affectedTest.product.icon : ""')/
		span.badge.small(
			v-if='isVideoTest && videoStatus',
			:class='videoStatus.class'
		)
			| {{ $t(videoStatus.text) }}
	template(v-if='isVideoTest')
		.margin.bottom
			router-link.button(:to='uploadRoute')
				| {{ $t("Mettre en ligne une vidéo") }}
			.text.dark-grey.short.margin.top
				i18n(
					path='Ajoute une vidéo à l\'affectation - {t} pour qu\'elle apparaisse côté résultats.'
				)
					template(#t)
						strong
							| {{ $t("Il ne sera pas nécessaire de lancer le processing") }}
				div
					strong.text.red
						| {{ $t("Attention, cela écrasera la vidéo déjà existante le cas échéant.") }}
		.margin.bottom
			relaunch-modal(ref='relaunchModal', @confirm='relaunchProcessing(true)')/
			button.button(
				@click='relaunchProcessing(false)',
				:class='{ "loading inline": relaunchLoading }'
			)
				.loader.small
				span(:class='{ "text inline": relaunchLoading }')
					| {{ $t("Lancer / Relancer le processing") }}
			.text.dark-grey.short.margin.top
				| {{ $t("Relance le processing de la vidéo présente sur l'affectation.") }}
				#processing-loader.short.margin.top(v-if='relaunchInProgress')
					.loading.inline
						.loader.small
					strong.text.inline En cours
	.margin.bottom
		remove-affect-modal(
			ref='removeAffectModal',
			@confirm='removeAffectation(true)'
		)/
		button.button.red(@click='removeAffectation(false)')
			| {{ $t("Retirer l'affectation") }}
		.text.dark-grey.short.margin.top
			| {{ $t(`Passe l'affectation du testeur en "Affectation retirée".`) }}
	.margin.bottom
		reject-modal(ref='rejectModal', @confirm='rejectTester(true)')/
		button.button.red(@click='rejectTester(false)')
			| {{ $t("Refuser le testeur") }}
		.text.dark-grey.short.margin.top
			span
				| {{ $t("Force le refus du testeur à ce test, même si celui-ci est déjà validé.") }}
			strong.text.inline
				| {{ $t("Attention, cela n'enverra pas d'email de refus à l'utilisateur.") }}
</template>

<script lang="ts">
import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import FlashMessages from '@/services/FlashMessagesService';
import Logger from '@/services/LoggerService';
import {
	adminAffectationsUrl,
	videoStatus,
} from '@/views/Admin/AdminAffectation/AdminAffectationConfig';
import { AffectationProcessingInfos } from '@/views/Admin/AdminAffectation/AdminAffectationTypes';
import RejectModal from '@/views/Admin/AdminAffectation/RejectModal.vue';
import RelaunchModal from '@/views/Admin/AdminAffectation/RelaunchModal.vue';
import RemoveAffectModal from '@/views/Admin/AdminAffectation/RemoveAffectModal.vue';
import { DefaultAffectation } from '@/views/Testers/TestersAffectations/TestersAffectationsTypes';
import { DefaultTest, TestProduct } from '@/views/Tests/TestsTypes';
import { DefaultUser } from '@/views/Users/UsersTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component({
	components: {
		RelaunchModal,
		RemoveAffectModal,
		RejectModal,
	},
})
export default class AdminAffectation extends Vue {
	@Prop() protected readonly currentAffectation!: DefaultAffectation;

	@Ref() protected readonly relaunchModal!: RelaunchModal;
	@Ref() protected readonly removeAffectModal!: RemoveAffectModal;
	@Ref() protected readonly rejectModal!: RejectModal;

	protected affectedTest: DefaultTest | false = false;
	protected affectedUser: DefaultUser | false = false;
	protected videoStatus: { text: string; class: string } | false = false;
	protected relaunchInProgress: boolean = false;
	protected isVideoTest: boolean = false;
	protected relaunchLoading: boolean = false;
	protected uploadRoute: RawLocation | false = false;

	@Watch('currentAffectation') protected onCurrentAffectationChange(): void {
		this.initializeAffectation();
	}

	protected relaunchProcessing(confirmed: boolean): void {
		if (this.relaunchLoading)
			return Logger.dbgWarn(
				'AdminAffectation: relaunchProcessing: this.relaunchLoading',
				this
			);

		if (confirmed) {
			this.relaunchLoading = true;
			axios
				.put(
					`${adminAffectationsUrl}/${this.currentAffectation.id}/relaunch_processing`,
					undefined,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					this.relaunchLoading = false;
					FlashMessages.success(
						'admin',
						'Le calcul des données a bien été relancé. Merci de patienter environ 15 minutes.'
					);
				})
				.catch((error: AxiosError): void => {
					this.relaunchLoading = false;
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot put on ${adminAffectationsUrl}/${this.currentAffectation.id}/relaunch_processing:`
					);
				});
		} else this.relaunchModal.show();
	}

	protected removeAffectation(confirmed: boolean): void {
		if (confirmed)
			axios
				.delete(
					`${adminAffectationsUrl}/${this.currentAffectation.id}`,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						"L'affectation a bien été retirée"
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot delete ${adminAffectationsUrl}/${this.currentAffectation.id}:`
					);
				});
		else this.removeAffectModal.show();
	}

	protected rejectTester(confirmed: boolean): void {
		if (confirmed)
			axios
				.put(
					`${adminAffectationsUrl}/${this.currentAffectation.id}/refuse`,
					undefined,
					AxiosUtils.defaultConfig
				)
				.then((): void => {
					FlashMessages.success(
						'admin',
						'Le testeur a bien été refusé.'
					);
				})
				.catch((error: AxiosError): void => {
					AxiosUtils.defaultErrorCatch(
						error,
						`Cannot put on ${adminAffectationsUrl}/${this.currentAffectation.id}/refuse:`
					);
				});
		else this.rejectModal.show();
	}

	private initializeAffectation(): void {
		axios
			.get(
				`${Environment.any.api.replace('/api', '')}${
					this.currentAffectation.test
				}`,
				AxiosUtils.defaultConfig
			)
			.then((response: AxiosResponse<DefaultTest>): void => {
				this.affectedTest = response.data;
				this.isVideoTest =
					this.affectedTest.product.id === TestProduct.video;
			})
			.catch(AxiosUtils.defaultErrorCatch);
		axios
			.get(
				`${Environment.any.api.replace('/api', '')}${
					this.currentAffectation.user
				}`,
				AxiosUtils.defaultConfig
			)
			.then((response: AxiosResponse<DefaultUser>): void => {
				this.affectedUser = response.data;
			})
			.catch(AxiosUtils.defaultErrorCatch);
		axios
			.get(adminAffectationsUrl, {
				...AxiosUtils.defaultConfig,
				params: { id: this.currentAffectation.id },
			})
			.then(
				(response: AxiosResponse<AffectationProcessingInfos>): void => {
					this.videoStatus = videoStatus[response.data.statusVideo];
					this.relaunchInProgress = response.data.relaunchInProgress;
					this.uploadRoute = {
						name: 'legacy iframe',
						query: { url: response.data.urlUpload },
					};
				}
			)
			.catch(AxiosUtils.defaultErrorCatch);
	}

	private mounted(): void {
		this.initializeAffectation();
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.h4 {
	display: flex;
	align-items: center;

	span:not(#affected-test), i.icon {
		flex-shrink: 0;
	}

	i.icon {
		font-size: 1.5rem;

		&::before {
			vertical-align: middle;
		}
	}

	#affected-test {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

#processing-loader {
	.loading, strong.text.inline {
		vertical-align: middle;
	}
}

</style>