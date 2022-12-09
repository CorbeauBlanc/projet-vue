<template lang="pug">
	#results-sidebar(
		v-if="results.sidebarOpened"
		:class="{ unfolded: results.sidebarUnfolded }"
	)
		fold-header.segment.header(
			v-model="results.sidebarUnfolded"
		)
			div.title
				icon(:class="`${this.dataIsVideoCut ? 'video' : 'verbatims'}`")
				| {{ $t('Constat') }} - {{ this.dataIsVideoCut ? $t('Extrait vidéo') : $t('Verbatim') }}
		flash-message.sticky.top(name='resultsSidebar')
		.loading(v-if='loading')
			.loader
		foldable.segment.details(v-if="dataIsVideoCut")
			strong
				| {{ $t('Détail de l\'extrait vidéo') }} :
			| {{ formatCutTime(data.start) }}
			icon(arrow, right, margin, left, short)
			| {{ formatCutTime(data.end) }}
			strong
				| {{ ` ${$t('Durée')} : ` }}
			| {{ formatCutTime(data.end - data.start) }}
		foldable.segment.content
			div(v-if="!editMode")
				div.description(v-if="dataIsVideoCut")
					label.label
						strong
							| {{ $t('Descriptif de l\'extrait (facultatif)') }} - {{ descriptionLength }}/90
					text-input(
						:config="descriptionConfig"
						v-model="values.videoCutDescription"
						@text-input:keyup="onDescriptionChange"
					)
				div.tabs
					div.menu.stretched
						tab(name="new" v-master="currentTab")
							icon(add)
							| {{ $t('Créer un nouveau constat') }}
						tab(name="link" v-master="currentTab")
							icon(linked)
							| {{ $t('Associer à un constat existant') }}
				keep-alive.rows
					component(
						:ref="currentTab"
						:is="tabs.get(currentTab)"
						@sidebarEvent="handleSidebarEvent($event)"
						@edit="handleOpenObservation($event)"
					)
			div(v-if="editMode")
				observation-infos(
					ref="edit"
				)
		foldable.segment.footer
			div.left
				button(
					:class="`button icon ghost ${values.bookmarked ? 'yellow' : ''}`"
					v-if="currentTab === 'new'"
					@click="toggleBookmark"
				)
					icon(star)
				button.button(v-if="currentTab === 'new' || editMode" @click="save")
					| {{ editMode ? $t('Enregistrer') : $t('Créer le constat') }}
			div
				button(
					:class="`button ghost red`"
					@click="close"
				)
					| {{ $t('Fermer') }}
</template>

<script lang="ts">
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import Form from '@/components/Form/Form';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import {
	isVideoCut,
	VideoCut,
} from '@/components/VideoPlayer/VideoPlayerTypes';
import AxiosUtils from '@/services/AxiosUtils';
import FlashMessages from '@/services/FlashMessagesService';
import Js from '@/services/JsService';
import Sidebars from '@/services/SidebarsService';
import { ReturnStatus } from '@/types';
import LinkObservation from '@/views/Results/ResultsWorkboard/ResultsSidebar/LinkObservation/LinkObservation.vue';
import ObservationInfos from '@/views/Results/ResultsWorkboard/ResultsSidebar/ObservationInfos/ObservationInfos.vue';
import {
	linkSourceUrl,
	observationsUrl,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarConfig';
import {
	FormattedCreateObservation,
	ObservationFields,
	OptionalObservationFields,
	SidebarEvent,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarTypes';
import { VerbatimData } from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { RetrievedObservation } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import _, { Dictionary } from 'lodash';
import { Component, Ref, Watch } from 'vue-property-decorator';

type Layers = 'create' | 'edit';

@Component({
	components: {
		Tab,
		LinkObservation,
		ObservationInfos,
		Foldable,
		FoldHeader,
		TextInput,
	},
})
export default class ResultsSidebar extends Form<Layers> {
	@Ref() protected new!: ObservationInfos;
	@Ref() protected link!: LinkObservation;
	@Ref() protected edit!: ObservationInfos;

	private descriptionLength: number = 0;

	protected currentTab: string = 'link';
	protected dataIsVideoCut: boolean = false;
	protected editMode: boolean = false;
	protected loading: boolean = false;

	protected currentObservation: RetrievedObservation | false = false;

	protected initalValues: OptionalObservationFields = {
		bookmarked: false,
		videoCutDescription: '',
	};

	protected values: OptionalObservationFields = _.cloneDeep(
		this.initalValues
	);

	protected url: Map<Layers, string> = new Map<Layers, string>([
		['create', linkSourceUrl],
		['edit', `${observationsUrl}/:id`],
	]);

	protected results: typeof Sidebars.results = Sidebars.results;
	protected data!: VerbatimData[] | VideoCut;

	protected tabs: Map<string, string> = new Map([
		['new', 'ObservationInfos'],
		['link', 'LinkObservation'],
	]);

	@Watch('results.data', { immediate: true })
	protected onDataChange(val: VerbatimData[] | VideoCut): void {
		this.data = this.results.data;
		this.dataIsVideoCut = !Array.isArray(val) && isVideoCut(val);
	}

	protected descriptionConfig: InputConfig<InputType.TEXT> = {
		multiple: false,
		constraints: {
			maxlength: 90,
		},
	};

	protected close(): void {
		if (this.editMode) this.editMode = false;
		else Sidebars.results.closeSidebar(ReturnStatus.SUCCESS);
	}

	protected formatCutTime(time: number): string {
		return Js.formatTime(time);
	}

	protected onDescriptionChange(value: string): void {
		this.descriptionLength = value.length;
	}

	private handleSidebarEvent(event: SidebarEvent): void {
		switch (event.type) {
			case 'success':
				FlashMessages.success(
					'resultsSidebar',
					`${this.$t(event.message)}`
				);
				break;
			case 'error':
				FlashMessages.error(
					'resultsSidebar',
					`${this.$t(event.message)}`
				);
				break;
			case 'warning':
				FlashMessages.warning(
					'resultsSidebar',
					`${this.$t(event.message)}`
				);
				break;
			default:
				break;
		}
	}

	private toggleBookmark(): void {
		this.values.bookmarked = !this.values.bookmarked;
	}

	protected retrieveCurrentObservation(
		id: string
	): Promise<AxiosResponse<RetrievedObservation>> {
		return Axios.get(`${observationsUrl}/${id}`, AxiosUtils.defaultConfig);
	}

	protected handleOpenObservation(event: { id: string }): void {
		this.editMode = true;
		this.loading = true;

		this.$nextTick().then((): void => {
			this.retrieveCurrentObservation(event.id)
				.then((value: AxiosResponse<RetrievedObservation>): void => {
					this.loading = false;
					this.currentObservation = value.data;
					this.updateForm();
				})
				.catch((error: any): void => {
					this.loading = false;
					AxiosUtils.defaultErrorLog(
						`Cannot get ${event.id} from ${observationsUrl}:`,
						error
					);
				});
		});
	}

	protected getUrlParams(layer: Layers): Dictionary<string> {
		if (this.currentObservation !== false && layer === 'edit')
			return { id: `${this.currentObservation.id}` };
		return {};
	}

	protected updateForm(): void {
		if (this.currentObservation) {
			const values: ObservationFields = {
				localisation:
					this.currentObservation.localisationDto?.hasOwnProperty(
						'id'
					) &&
					this.currentObservation.localisationDto?.hasOwnProperty(
						'name'
					)
						? ({
								text: this.currentObservation.localisationDto
									.name,
								value: `${this.currentObservation.localisationDto.id}`,
						  } as InputOption)
						: '',
				valency: `${this.currentObservation.valency}`,
				severity: this.currentObservation.severity
					? `${this.currentObservation.severity}`
					: undefined,
				title: this.currentObservation.title,
				description: this.currentObservation.description,
				recommendation:
					this.currentObservation.recommendation || undefined,
			};
			this.edit.setFieldsValues(values);
		}
	}

	public getFormattedFieldsValues(): FormattedCreateObservation {
		if (this.editMode) return this.edit.getFormattedFieldsValues();
		return _.merge(this.new.getFormattedFieldsValues(), {
			favorite: this.values.bookmarked,
			sourceHeader: this.values.videoCutDescription || null,
		});
	}

	protected resetFieldsValues(): void {
		this.descriptionLength = 0;
		this.values = _.cloneDeep(this.initalValues);
	}

	protected async createObservation(): Promise<void> {
		try {
			this.loading = true;
			await this.sendForm('post', 'create');
			this.loading = false;
			FlashMessages.success(
				'resultsSidebar',
				this.$t('Le constat a été créé avec succès').toString()
			);
			this.new.resetFieldsValues();
			this.resetFieldsValues();
			this.currentTab = 'link';
			this.$nextTick().then((): void => {
				this.link.refreshObservationTable();
				this.results.refreshSidebar(true);
			});
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog('Cannot create observation:', error);
		}
	}

	protected async editObservation(): Promise<void> {
		if (!this.currentObservation) return;

		try {
			this.loading = true;
			await this.sendForm('put', 'edit');
			this.loading = false;
			FlashMessages.success(
				'resultsSidebar',
				this.$t('Le constat a bien été sauvegardé.').toString()
			);
			this.edit.resetFieldsValues();
			this.editMode = false;
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog('Cannot edit observation:', error);
		}
	}

	private save(): void {
		if (this.editMode) {
			if (this.edit.checkFieldsValidity()) this.editObservation();
			else
				FlashMessages.error(
					'resultsSidebar',
					this.$t(
						'Erreur dans le formulaire. Merci de vérifier les données renseignées.'
					).toString()
				);
		} else if (this.new.checkFieldsValidity()) this.createObservation();
		else
			FlashMessages.error(
				'resultsSidebar',
				this.$t(
					'Erreur dans le formulaire. Merci de vérifier les données renseignées.'
				).toString()
			);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results-sidebar {
	display: flex;
	flex-direction: column;
	background: $white;
	border: 1px solid rgba(88, 90, 250, 0.2);
	position: relative;

	&.unfolded {
		height: 100%;
		width: 550px;
		flex-shrink: 0;
	}

	&:not(.unfolded) {
		@include z-index(navigation);
		position: fixed;
		bottom: 0;
		right: 0;
		box-shadow: $selected-shadow;

		.title {
			margin-right: $padding * 2;
		}

		.flash-message {
			display: none;
		}
	}

	.segment {
		border-radius: 0;
		border-left: none;
		border-right: none;
		border-top: none;
		margin-bottom: 0;
		padding: math.div($padding, 2);
		font-size: $sidebar-font-size;

		&.header {
			justify-content: space-between;

			.title {
				white-space: nowrap;

				i.icon {
					margin-right: .5em;
				}
			}

			i.icon, .button {
				font-size: inherit;
			}
		}

		&.details {
			text-align: center;
		}

		&.content {
			flex-grow: 1;
			overflow-y: auto;
			@include scrollbar;

			padding-top: 0 !important;

			i.icon {
				font-size: inherit;
				margin-right: .5em;

				&.add::before {
					display: inline-block;
					margin-top: -1px;
				}
			}

			.description {
				padding-top: math.div($padding, 2);
				margin-bottom: $padding;
			}
		}

		&.footer {
			border-bottom: none;

			.button {
				font-size: inherit;
			}
		}
	}

	.footer {
		display: flex;

		.left {
			flex: 1;
		}
	}

	.flash-message {
		height: unset;
	}
}
</style>
