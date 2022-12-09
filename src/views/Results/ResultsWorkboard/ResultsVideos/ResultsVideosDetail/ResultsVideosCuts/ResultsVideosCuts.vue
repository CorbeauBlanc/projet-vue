<template lang="pug">
	#results-videos-cuts(v-if='tableConfig')
		custom-table.data(
			v-show="listLength > 0 && !tableIsLoading"
			ref="table"
			:config="tableConfig"
			:labels="[$t('Lié au(x) constat(s)'), $t('ID'), $t('Début'), $t('Fin'), $t('Durée'), $t('Action'),]"
			:hideCols="[1]"
			@loading="tableIsLoading = $event",
			@updated="onTableUpdate($vnode.componentInstance)"
			@change:cell="onCellChange"
			@componentevent="handleCutEvent"
		)
		.container(v-if="tableIsLoading")
			.segment.empty.state
				.loading
					.loader
		.container(v-if="listLength < 1 && !tableIsLoading")
			.segment.empty.state
				icon(cut, huge)
				p.content
					| {{ $t('Aucun extrait disponible pour cette vidéo') }}
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableConfig,
	CustomTableEditionEvent,
} from '@/components/CustomTable/CustomTableTypes';
import { InputType } from '@/components/Inputs/InputsTypes';
import LocalListing from '@/components/Listing/LocalListing';
import Js from '@/services/JsService';
import Sidebars from '@/services/SidebarsService';
import { tableConfig } from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosCuts/ResultsVideosCutsConfig';
import { RetrievedCut } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
	},
})
export default class ResultsVideosCuts extends LocalListing {
	@Prop() private cuts!: RetrievedCut[];
	@Prop() private videoLdId!: string;
	@Prop() private readonly videoDuration!: number;

	protected tableConfig: CustomTableConfig | false = false;
	protected results: typeof Sidebars.results = Sidebars.results;

	protected handleCutEvent(event: { id: string; action: string }): void {
		switch (event.action) {
			case 'archive':
				this.$emit('archiveCut', event.id);
				break;
			case 'editObservations':
				this.$emit('openSidebar', event.id);
				break;
			case 'play':
				this.$emit('playCut', event.id);
				break;
			case 'download':
				this.$emit('downloadCut', event.id);
		}
	}

	/**
	 * Emit the cut id to the parent when the timestamp is edited within a table row
	 */
	protected onCellChange(event: CustomTableEditionEvent): void {
		if (
			typeof event.rowIndex === 'string' &&
			event.rowIndex.match(/[0-9]+/)
		) {
			const cutId: string = event.rowIndex;
			const timestamp: string = event.colIndex as string;
			const newVal: number | false = Js.convertTime(
				event.newValue as string
			);
			if (newVal)
				this.$emit('editTimestamp', { cutId, timestamp, newVal });
		} else return;
	}

	/**
	 * When a cut is created/altered from the video player component, updates the cuts list
	 */
	@Watch('cuts', { deep: true })
	protected onCutsChange(): void {
		this.table.retrieveData();
	}

	protected onSidebarRefresh(): void {
		if (this.results.refresh) {
			this.table.retrieveData();
			this.results.refreshSidebar(false);
		}
	}

	private get hasCuts(): boolean {
		return this.cuts.length > 0;
	}

	private created(): void {
		this.$watch('results.refresh', this.onSidebarRefresh, {
			immediate: true,
		});

		const config: CustomTableConfig = { ...tableConfig };

		if (config.restConfig?.get?.config)
			config.restConfig.get.config.params = {
				...config.restConfig.get.config.params,
				video: {
					key: `${this.videoLdId.match(/\d+/)}`,
				},
			};

		config.enableInlineEdition = {
			enabled: [2, 3],
			editFieldConfig: {
				type: InputType.TIME,
				multiple: false,
				constraints: {
					step: '1',
					min: '00:00:00',
					max: Js.formatTime(this.videoDuration, true),
				},
				autofocus: true,
			},
		};
		this.tableConfig = config;
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';

#results-videos-cuts {
	.loading {
		background: rgba($white, .85) !important;
	}

	table {
		.ct-cell, .ct-label {
			&.col2, &.col3, &.col4, &.col5 {
				text-align: right;
			}

			&.col5 {
				width: 3rem;
			}

			&.col0 { width: 33rem; }
		}
	}
}
</style>