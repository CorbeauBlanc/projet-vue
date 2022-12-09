<template>
	<div class="actions">
		<archive-cut-modal
			ref="archiveModal"
			id="prout"
			title="title"
			@archive="archive(true)"
		/>
		<button
			v-if="allowedVideoEdit"
			class="button icon"
			@click="archive(false)"
		>
			<tooltip class="top">{{ $t('Archiver') }}</tooltip>
			<icon delete text red />
		</button>
		<button
			v-if="allowedVideoEdit"
			class="button icon"
			@click="$emit('componentevent', { id: id, action: 'editObservations' })"
		>
			<tooltip class="top">{{ $t('Éditer les constats associés') }}</tooltip>
			<icon tag />
		</button>
		<button class="button icon" @click="$emit('componentevent', { id: id, action: 'play' })">
			<tooltip class="top">{{ $t('Lire') }}</tooltip>
			<icon play />
		</button>
		<button class="button icon" @click="download()">
			<tooltip class="top">{{ $t('Télécharger') }}</tooltip>
			<icon download />
		</button>
	</div>
</template>

<script lang="ts">
import ListingActions from '@/components/Listing/ListingActions';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import AxiosUtils from '@/services/AxiosUtils';
import UserUtils from '@/services/UserUtils';
import ArchiveCutModal from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosCuts/ArchiveCutModal.vue';
import { videoExtractUrl } from '@/views/Results/ResultsWorkboard/ResultsWorkboardConfig';
import Axios from 'axios';
import { Component, Prop, Ref } from 'vue-property-decorator';

@Component({
	components: {
		ArchiveCutModal,
		Tooltip,
	},
})
export default class ResultsVideosCutsActions extends ListingActions {
	@Prop() public readonly id!: string;
	@Ref() protected readonly archiveModal!: ArchiveCutModal;

	protected archive(confirmed: boolean): void {
		if (confirmed) {
			Axios.delete(
				`${videoExtractUrl}/${this.id}`,
				AxiosUtils.defaultConfig
			)
				.then((response: any): void => {
					this.deleteRow();

					this.$emit('componentevent', {
						id: this.id,
						action: 'archive',
					});
				})
				.catch((error: any): void => {
					AxiosUtils.defaultErrorLog(
						`ResultsVideosCutsActions: Cannot delete on ${videoExtractUrl}/${this.id}`,
						error
					);
				});
		} else this.archiveModal.show();
	}

	protected download(): void {
		this.$emit('componentevent', {
			id: this.id,
			action: 'download',
		});
	}

	private allowedVideoEdit: boolean = false;

	private async created(): Promise<void> {
		this.allowedVideoEdit =
			await UserUtils.instance.currentUserHasPermission(
				'result/workboard/video/edit'
			);
	}
}
</script>

<style lang="scss" scoped>

</style>
