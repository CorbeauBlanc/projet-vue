<template>
	<div class="actions">
		<button>
			<tooltip class="top">Télécharger en pdf</tooltip>
			<icon pdf file />
		</button>
		<button>
			<tooltip class="top align right">Télécharger en CSV</tooltip>
			<icon file />
		</button>
	</div>
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class GainsHistoryActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
