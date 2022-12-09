<template>
	<div class="actions">
		<button>
			<tooltip class="top">Annuler</tooltip>
			<icon undo />
		</button>
		<button>
			<tooltip class="top align right">Télécharger la facture</tooltip>
			<icon download />
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
export default class GainsActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
