<template>
	<div class="actions">
		<archive-result-modal
			ref="archiveModal"
			:id="id"
			:title="title"
			@archive="archive(true)"
		/>
		<button class="button icon" @click="archive(false)">
			<tooltip class="top">{{ $t('Archiver') }}</tooltip>
			<icon delete text red />
		</button>
		<router-link
			class="button icon"
			:to="{ name: 'edit results group', params: { id } }"
		>
			<tooltip class="top">{{ $t('Éditer') }}</tooltip>
			<icon edit />
		</router-link>
		<router-link
			class="button icon"
			:to="{ name: 'result workboard', params: { id } }"
		>
			<tooltip class="top">{{ $t('Résultats') }}</tooltip>
			<icon long results />
		</router-link>
	</div>
</template>

<script lang="ts">
import ListingActions from '@/components/Listing/ListingActions';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import ArchiveResultModal from '@/views/Results/ArchiveResultModal.vue';
import { resultsStatesUrl } from '@/views/Results/ResultsConfig';
import { Component, Prop, Ref } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
		ArchiveResultModal,
	},
})
export default class ResultsActions extends ListingActions {
	@Prop() public readonly id!: number;
	@Prop() public readonly title!: string;

	@Ref() protected readonly archiveModal!: ArchiveResultModal;

	protected archive(confirmed: boolean): void {
		if (confirmed) {
			this.put({
				data: {
					state: `${resultsStatesUrl}/3`,
				},
				successMsg: 'Le résultat a bien été archivé.',
				failureMsg: "Le résultat n'a pas été archivé.",
			});
			this.deleteRow();
		} else this.archiveModal.show();
	}
}
</script>
