<template lang="pug">
	div#results-videos-detail(v-if="allowedVideoView")
		flash-message.sticky.top(name='resultsVideosDetail')
		validate-affectation-modal(
			ref="validateModal"
			:affectationId="affectId"
			:resultId="resultId"
			@validate="validate(true)"
		)
		refuse-affectation-modal(
			ref="refuseModal"
			:affectationId="affectId"
			@refuse="refuse(true)"
		)
		#results-videos-detail
			.loading(v-if="isLoading")
				.loader
			div(v-if="!isLoading")
				.heading-container.antipodes.container.fluid
					.heading.secondary.filters.alt
						h3.title
							router-link(
								:to="{ name: 'result videos list', params: { id: resultId } }"
							)
								icon(long, arrow, left)
								span
									| {{ $t('Liste des vidéos') }} 
							p
								| - {{ $t('Vidéo') }} {{ affectId }} - {{ user.firstName || '' }} {{ user.lastName || '' }}
					.right-items
						div(v-if="allowedVideoEdit")
							button.button.ghost.green(@click="validate(false)" v-if="videoState === AffectationState.done")
								icon(user, validate)
								span
									| {{ $t('Valider') }}
							button.button.ghost.red(@click="refuse(false)" v-if="videoState === AffectationState.done")
								icon(user, refuse)
								span
									| {{ $t('Refuser') }}
							span.button.flat.green.disabled(v-if="videoState === AffectationState.validated")
								icon(user, validated)
								span
									| {{ $t('Test validé') }}
							span.button.flat.red.disabled(v-if="videoState === AffectationState.refused")
								icon(user, refused)
								span
									| {{ $t('Test refusé') }}
						help-button(bottom, align, right)
							a(
								:href="`${helpUrl}/articles/360020643697`",
								target="_blank"
							)
								| {{ $t('Comment rédiger un plan d\'analyse ?') }}
							a(
								:href="`${helpUrl}/articles/360020620377`",
								target="_blank"
							)
								| {{ $t('Comment analyser une vidéo modérée efficacement ?') }}
							a(
								:href="`${helpUrl}/articles/360020345957`",
								target="_blank"
							)
								| {{ $t('Pourquoi et comment refuser un testeur ?') }}
							a(
								class="button ghost small margin top bottom",
								href="https://support.testapic.com/hc/fr/requests/new",
								target="_blank"
							)
								| {{ $t('Proposer une amélioration') }}
				.container.fluid
					.segments
						.segment.tabs.alt.navigation.tertiary
							//.menu
							//	tab(name="instructions", v-master="currentTab", toggleMode)
							//		icon(tasks)
							//		span
							//			| {{ $t('Consignes') }}
							//	tab(name="infos", v-master="currentTab", toggleMode)
							//		icon(user)
							//		span
							//			| {{ $t('Infos testeur') }}
							//	tab(name="cuts", v-master="currentTab", toggleMode)
							//		icon(cut)
							//		span
							//			| {{ $t('Extraits') }}
							//		.badge.small.red.bold.notification
							//			| {{ this.cutsLength }}
							//div#video-meta-data
							//	keep-alive
							//		component(
							//			:is="tabs.get(currentTab)",
							//			:videoLdId="videoLdId"
							//			:cuts="retrievedCuts",
							//			:user="user",
							//			:userAgent="userAgent",
							//			:userInfo="userInfo",
							//			:test="testInfos",
							//			:tasks="retrievedTasks",
							//			:videoDuration="videoDuration"
							//			@playCut="playCut",
							//			@editTimestamp="editTimestamp",
							//			@archiveCut="archiveCut",
							//			@downloadCut="downloadCut",
							//			@openSidebar="openSidebar",
							//		)
						video-player(
							ref="player",
							:src="videoSrc",
							:markers="markers",
							:cuts="cuts",
							:stt="stt",
							@marker:reached="updateCurrentTask",
							@seek="updateCurrentTask(player.lastMarkerBefore($event))",
							@cut:created="onCreateNewCut",
							@cut:updated="onUpdateCut",
							@cut:click="onSelectCut",
							@cutsreset:start="resettingCuts = true",
							@cutsreset:end="resettingCuts = false",
							@videoPlayerMounted="bindPlayer"
						)
						div#tasks.segment(v-if="currentTask")
							div#task-index
								button.button.flat.icon(@click="previousTask")
									icon(step, backward)
								| {{ $t('Consigne') }} {{ currentTask.index + 1 }}
								button.button.flat.icon(@click="nextTask")
									icon(step, forward)
							div#task(v-html="currentTask.html")
				.container.text
					.segments
						.segment.header
							| {{ $t('Raccourcis') }}
						.segment.very.compact.center.aligned
							table.table
								tbody
									tr
										td.left.aligned.collapsing
											span.shortcut
												| i
										td
											| {{ $t('Démarrer un extrait') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| o
										td
											| {{ $t('Terminer un extrait') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| {{ $t('espace') }}
										td
											| {{ $t('Lecture / Pause') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| {{ $t('f') }}
										td
											| {{ $t('Plein écran') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| {{ $t('gauche') }}
										td
											| -5 {{ $t('secondes') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| {{ $t('droite') }}
										td
											| +5 {{ $t('secondes') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| alt + {{ $t('gauche') }}
										td
											| {{ $t('Consigne précédente') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| alt + {{ $t('droite') }}
										td
											| {{ $t('Consigne suivante') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| alt + {{ $t('haut') }}
										td
											| {{ $t('Augmenter le volume') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| alt + {{ $t('bas') }}
										td
											| {{ $t('Diminuer le volume') }}
									tr
										td.left.aligned.collapsing
											span.shortcut
												| m
										td
											| {{ $t('Couper / Activer le son') }}
</template>

<script lang="ts">
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import Tab from '@/components/Tab/Tab.vue';
import {
	SttData,
	Word,
} from '@/components/VideoPlayer/SpeechToText/SpeechToTextTypes';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue';
import {
	isVideoCut,
	VideoCut,
	VideoMarker,
} from '@/components/VideoPlayer/VideoPlayerTypes';
import { helpUrl } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import FlashMessages from '@/services/FlashMessagesService';
import Js from '@/services/JsService';
import Languages from '@/services/LanguagesService';
import Sidebars from '@/services/SidebarsService';
import UserUtils from '@/services/UserUtils';
import { GetListResponse, LdData, ReturnStatus } from '@/types';
import RefuseAffectationModal from '@/views/Results/ResultsWorkboard/ResultsAffectationModals/RefuseAffectationModal.vue';
import ValidateAffectationModal from '@/views/Results/ResultsWorkboard/ResultsAffectationModals/ValidateAffectationModal.vue';
import { SourceType } from '@/views/Results/ResultsWorkboard/ResultsSidebar/LinkObservation/LinkObservationTypes';
import ResultsVideosCuts from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosCuts/ResultsVideosCuts.vue';
import {
	RetrievedUser,
	RetrievedUserAgent,
	RetrievedUserInfo,
	RetrievedVideoDetail,
} from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosDetailTypes';
import ResultsVideosTasks from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosTasks/ResultsVideosTasks.vue';
import ResultsVideosUser from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosUser/ResultsVideosUser.vue';
import ResultsWorkboard from '@/views/Results/ResultsWorkboard/ResultsWorkboard.vue';
import {
	videoExtractUrl,
	videosUrl,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardConfig';
import {
	AffectationState,
	RetrievedCut,
	RetrievedTask,
	RetrievedTestInfos,
	TaskData,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { Component, Ref, Vue, Watch } from 'vue-property-decorator';

@Component({
	components: {
		VideoPlayer,
		Tab,
		ResultsVideosCuts,
		ResultsVideosTasks,
		ResultsVideosUser,
		ResultsWorkboard,
		HelpButton,
		ValidateAffectationModal,
		RefuseAffectationModal,
	},
	metaInfo: {
		title: `${Languages.t('Résultat vidéo').toString()}`,
	},
})
export default class ResultsVideosDetail extends Vue {
	@Ref() protected readonly validateModal!: ValidateAffectationModal;
	@Ref() protected readonly refuseModal!: RefuseAffectationModal;

	protected readonly helpUrl: string = helpUrl;

	protected isLoading: boolean = true;

	protected currentTab: string = '';
	protected tabs: Map<string, string> = new Map([
		['instructions', 'ResultsVideosTasks'],
		['infos', 'ResultsVideosUser'],
		['cuts', 'ResultsVideosCuts'],
	]);

	protected resultId: string = this.$route.params.group_id;
	protected affectId: string = this.$route.params.affectation_id;

	/**
	 * 'done' is the affectation status that has not been validated nor refused yet.
	 */
	protected videoState: number | false = false;
	protected readonly AffectationState: typeof AffectationState =
		AffectationState;

	protected testInfos!: RetrievedTestInfos;
	protected user!: RetrievedUser;
	protected userAgent!: RetrievedUserAgent;

	protected userInfo!: RetrievedUserInfo;

	protected videoLdId!: string; // different from affectId
	protected videoSrc!: string;
	protected videoDuration!: number;

	protected cuts: VideoCut[] = [];

	protected retrievedCuts: RetrievedCut[] = [];

	protected get cutsLength(): number {
		return this.retrievedCuts.length;
	}

	protected stt!: SttData;

	protected retrievedTasks!: RetrievedTask[];
	protected videoPlayerTasks: Map<string, TaskData> = new Map();

	protected player!: VideoPlayer;

	protected markers: VideoMarker[] = [];
	protected currentTask: TaskData | false = false;
	protected resettingCuts: boolean = false;

	private newCut: VideoCut | undefined;
	private bypassNextEvent: boolean = false;

	private allowedVideoView: boolean = false;
	private allowedVideoEdit: boolean = false;

	protected getCut(id: string): VideoCut | undefined {
		return this.cuts.find((cut: VideoCut): boolean => cut.id === id);
	}

	protected updateCurrentTask(id: string): void {
		if (this.bypassNextEvent) {
			this.bypassNextEvent = false;
			return;
		}
		const task: TaskData | undefined =
			id !== '' ? this.videoPlayerTasks.get(id) : undefined;
		this.currentTask = task !== undefined ? task : false;
	}

	protected nextTask(): void {
		if (this.currentTask) {
			if (this.currentTask.index === this.markers.length - 1) return;
			this.updateCurrentTask(this.markers[this.currentTask.index + 1].id);
			this.bypassNextEvent = true;
			this.player.seekTo(this.currentTask.timeStamp);
		} else this.updateCurrentTask(this.markers[0].id);
	}

	protected previousTask(): void {
		if (this.currentTask) {
			if (this.currentTask.index === 0) return;
			this.updateCurrentTask(this.markers[this.currentTask.index - 1].id);
			if (this.currentTask) {
				this.bypassNextEvent = true;
				this.player.seekTo(this.currentTask.timeStamp);
			}
		}
	}

	protected onCreateNewCut(newCut: VideoCut): void {
		if (this.resettingCuts) return;
		if (this.newCut === newCut || newCut.end - newCut.start < 1) {
			this.player.deleteCut(newCut.id);
			return;
		}
		this.newCut = newCut;

		this.createNewManualCut(this.newCut);
	}

	protected onUpdateCut(payload: { oldCut: VideoCut; cut: VideoCut }): void {
		if (
			payload.cut.start - payload.cut.end < 1 &&
			!_.isEqual(payload.oldCut, payload.cut)
		) {
			const tempCut: VideoCut = {
				id: payload.oldCut.id,
				start: Math.round(payload.cut.start),
				end: Math.round(payload.cut.end),
			};
			this.editCut(tempCut);
		} else if (this.newCut && this.newCut.id === payload.cut.id)
			Sidebars.results.data = payload.cut;
	}

	protected onSelectCut(cut: VideoCut, isMarker?: boolean): void {
		this.player.resetFocusedRegion();
		this.player.seekTo(cut.start);
		this.player.focusRegion(cut.id);

		if (isMarker) return;

		this.newCut = cut; // Prevents the manipulation/creation of other cuts when a cut has been focused

		Sidebars.results.closeSidebar(ReturnStatus.CANCELED);
		Sidebars.results.openSidebar(
			{ data: cut, resultId: this.resultId },
			(): void => {
				this.newCut = undefined;
				this.player.resetFocusedRegion();
			}
		);

		this.$nextTick().then((): void => {
			this.player.scrollRegionIntoView(cut.id);
		});
	}

	private openSidebar(id: string): void {
		Sidebars.results.closeSidebar(ReturnStatus.CANCELED);

		this.newCut = this.getCut(id);
		Sidebars.results.openSidebar(
			{ data: this.newCut, resultId: this.resultId },
			(): void => {
				this.newCut = undefined;
			}
		);
	}

	protected playCut(id: string): void {
		this.player.playRegion(id);
	}

	private addCut(cut: VideoCut): void {
		this.cuts.push(cut);
	}

	private editTimestamp(event: {
		cutId: number;
		timestamp: string;
		newVal: number;
	}): void {
		const oldCut: VideoCut | undefined = this.getCut(`${event.cutId}`);
		if (
			oldCut &&
			isVideoCut(oldCut) &&
			event.newVal < this.player.getVideoDuration()
		) {
			const newCut: VideoCut = {
				id: oldCut.id,
				start:
					event.timestamp === 'timeStart'
						? event.newVal
						: oldCut.start,
				end: event.timestamp === 'timeEnd' ? event.newVal : oldCut.end,
			};

			if (newCut.start - newCut.end < 1 && !_.isEqual(oldCut, newCut)) {
				this.editCut(newCut);
			}
		}
	}

	private retrieveData(): Promise<void> {
		return Axios.get(videosUrl, {
			...AxiosUtils.defaultConfig,
			params: {
				affectation: {
					id: this.affectId,
				},
				result: {
					id: this.resultId,
				},
			},
		})
			.then(
				(
					response?: AxiosResponse<LdData<RetrievedVideoDetail>>
				): void => {
					if (!response?.data) return;

					const formattedResponse: GetListResponse<RetrievedVideoDetail> =
						LdData.getFormattedResponse(response.data);

					const retrievedVideoDetailData: RetrievedVideoDetail =
						formattedResponse.data[0];

					this.videoLdId = retrievedVideoDetailData['@id'];

					this.videoState = retrievedVideoDetailData.affectationState;

					this.retrievedTasks = retrievedVideoDetailData.tasks;
					this.retrievedTasks.forEach((task: RetrievedTask): void => {
						this.videoPlayerTasks.set(`${task.id}`, {
							id: `${task.id}`,
							index: this.retrievedTasks.indexOf(task),
							html: TaskData.getTaskData(task, 'instruction'),
							timeStamp: task.beginTime,
						} as TaskData);
					});

					this.markers = [
						...this.videoPlayerTasks.values(),
					] as VideoMarker[];

					this.user = retrievedVideoDetailData.user;
					this.userAgent = retrievedVideoDetailData.userAgent;

					this.videoSrc = retrievedVideoDetailData.mediaLink;
					this.videoDuration = retrievedVideoDetailData.duration;

					this.testInfos = retrievedVideoDetailData.test;
					this.userInfo = retrievedVideoDetailData.userInfo;

					this.stt = retrievedVideoDetailData.speechToText;
				}
			)
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot get data from
					${videosUrl}?affectation[id]=${this.affectId}&result[id]=${this.resultId}`,
					error
				);
			});
	}

	private retrieveCuts(): Promise<void> {
		return Axios.get(videoExtractUrl, {
			...AxiosUtils.defaultConfig,
			params: {
				video: {
					key: this.videoLdId.match(/\d+/),
				},
				pagination: false,
			},
		})
			.then((response?: AxiosResponse<LdData<RetrievedCut>>): void => {
				this.retrievedCuts = [];
				this.cuts = [];

				if (!response?.data) return;
				const formattedResponse: GetListResponse<RetrievedCut> =
					LdData.getFormattedResponse(response.data);

				this.retrievedCuts = formattedResponse.data;

				this.retrievedCuts.forEach(
					(retrievedCut: RetrievedCut): void => {
						this.addCut({
							id: `${retrievedCut.id}`,
							start: retrievedCut.timeStart,
							end: retrievedCut.timeEnd,
						} as VideoCut);
					}
				);

				if (this.player) this.player.resetAllRegions();
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot get data from ${videoExtractUrl}?video[key]=${this.videoLdId.match(
						/\d+/
					)}&pagination=false`,
					error
				);
			});
	}

	private createNewManualCut(newCut: VideoCut): void {
		Axios.post(
			`${videoExtractUrl}`,
			{
				video: this.videoLdId,
				duration: Js.formatTime(newCut.end - newCut.start, true),
				timeStart: Js.formatTime(newCut.start, true),
				timeEnd: Js.formatTime(newCut.end, true),
				originId: 1,
			},
			AxiosUtils.defaultConfig
		)
			.then((response?: AxiosResponse<RetrievedCut>): void => {
				if (!response?.data) return;

				const retCut: RetrievedCut = response.data;
				this.newCut = {
					id: `${retCut.id}`,
					start: retCut.timeStart,
					end: retCut.timeEnd,
				};

				this.handleCreatedCut();
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot post on ${videoExtractUrl}`,
					error
				);
			});
	}

	private async handleCreatedCut(): Promise<void> {
		try {
			await this.retrieveCuts();
			if (this.newCut) this.onSelectCut(this.newCut);
		} catch (error) {
			AxiosUtils.defaultErrorLog(
				'ResultsVideosDetail: Cannot handle created cut',
				error
			);
		}
	}

	private editCut(cut: VideoCut): void {
		Axios.put(
			`${videoExtractUrl}/${cut.id}`,
			{
				video: this.videoLdId,
				duration: Js.formatTime(cut.end - cut.start, true),
				timeStart: Js.formatTime(cut.start, true),
				timeEnd: Js.formatTime(cut.end, true),
				originId: 1,
			},
			AxiosUtils.defaultConfig
		)
			.then((): void => {
				this.handleOpenedSidebar(cut.id);
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot put on ${videoExtractUrl}/${cut.id}`,
					error
				);
			});
	}

	private async handleOpenedSidebar(id: string): Promise<void> {
		try {
			await this.retrieveCuts();
			if (
				Sidebars.results.sidebarOpened &&
				`${SourceType.getSourceId(Sidebars.results.data)}` === id
			)
				this.openSidebar(id);
		} catch (error) {
			AxiosUtils.defaultErrorLog(
				'ResultsVideosDetail: Cannot handle opened sidebar',
				error
			);
		}
	}

	private archiveCut(id: string): void {
		if (
			Sidebars.results.sidebarOpened &&
			`${SourceType.getSourceId(Sidebars.results.data)}` === id
		)
			Sidebars.results.closeSidebar(ReturnStatus.CANCELED);

		this.retrieveCuts();

		FlashMessages.success(
			'resultsVideosDetail',
			this.$t("L'extrait a bien été supprimé").toString()
		);
	}

	private async downloadCut(id: string): Promise<void> {
		const cut: VideoCut | undefined = this.getCut(id);

		if (isVideoCut(cut)) {
			this.isLoading = true;

			try {
				this.isLoading = false;

				this.$socket.client.emit('bindUserIdAndSocketId', {
					type: 'isStartProcessConvertingVideo',
					userId: (await UserUtils.instance.currentUser).id,
					attributes: [
						{
							affectationId: `${this.affectId}`,
							timeStartToSecond: (cut as VideoCut).start,
							timeEndToSecond: (cut as VideoCut).end,
						},
					],
				});

				FlashMessages.success(
					'resultsVideosDetail',
					this.$t(
						'Votre demande d’export a bien été prise en compte. Vous recevrez par e-mail votre fichier dans quelques minutes.'
					).toString()
				);
			} catch (error) {
				this.isLoading = false;

				AxiosUtils.defaultErrorLog(
					`ResultsVideosDetail: Cannot download cut:`,
					error
				);
			}
		}
	}

	private validate(confirmed: boolean): void {
		if (confirmed) {
			this.videoState = AffectationState.validated;

			FlashMessages.success(
				'resultsVideosDetail',
				this.$t('Test validé !').toString()
			);
		} else this.validateModal.show();
	}

	private refuse(confirmed: boolean): void {
		if (confirmed) {
			this.videoState = AffectationState.refused;

			FlashMessages.success(
				'resultsVideosDetail',
				this.$t(
					'Ce testeur verra son test refusé et il ne pourra plus réaliser ce test'
				).toString()
			);
		} else this.refuseModal.show();
	}

	/**
	 * If the affectId is changed through the url, updates the page
	 */
	@Watch('$route')
	private onRouteChange(): void {
		this.isLoading = true;
		this.retrieveData();
	}

	private async created(): Promise<void> {
		this.allowedVideoView =
			await UserUtils.instance.currentUserHasPermission(
				'result/workboard/video/view'
			);

		this.allowedVideoEdit =
			await UserUtils.instance.currentUserHasPermission(
				'result/workboard/video/edit'
			);

		try {
			if (this.allowedVideoView) {
				await this.retrieveData();
				await this.retrieveCuts();
			}
			this.isLoading = false;
		} catch (error) {
			this.isLoading = false;
			AxiosUtils.defaultErrorLog(
				'ResultsVideosDetail: Cannot retrieve data/cuts',
				error
			);
		}
	}

	private beforeDestroy(): void {
		Sidebars.results.closeSidebar(ReturnStatus.CANCELED);
	}

	private bindPlayer(): void {
		this.player = this.$refs['player'] as VideoPlayer;
		this.player.addKeyboardShortcut('ArrowLeft', this.previousTask, {
			alt: true,
		});
		this.player.addKeyboardShortcut('ArrowRight', this.nextTask, {
			alt: true,
		});
		this.player.addKeyboardShortcut('ArrowUp', this.player.increaseVolume, {
			alt: true,
		});
		this.player.addKeyboardShortcut(
			'ArrowDown',
			this.player.decreaseVolume,
			{
				alt: true,
			}
		);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results-videos-detail {
	.loading {
		background: $background-color;
		@include z-index(navigation);
	}

	.right-items {
		display: flex;
		flex-wrap: wrap;
		white-space: nowrap;
		padding-top: $padding;

		:not(:last-child) {
			margin-right: math.div($padding, 2);
		}
	}

	.menu .tab.item {
		.icon {
			color: unset !important;
			font-size: unset !important;
			margin-right: math.div($padding, 3);
		}

		&:nth-of-type(3) {
			white-space: nowrap;
		}
	}

	.segments {
		min-width: 750px;
	}

	#tasks {
		align-items: center;
		display: flex;

		#task-index {
			white-space: nowrap;
			margin-right: $padding;

			button.button:first-child {
				margin-right: 0;
			}
		}

		#task {
			max-height: 20vh;
			overflow-y: auto;
			flex-grow: 1;
		}
	}
}
</style>
