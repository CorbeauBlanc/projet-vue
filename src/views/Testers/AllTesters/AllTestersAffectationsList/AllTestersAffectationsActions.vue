<template>
	<div class="actions">
		<button>
			<tooltip class="top">Réaliser le test</tooltip>
			<icon rocket />
		</button>
		<button>
			<tooltip class="top align right">Télécharger une vidéo</tooltip>
			<icon upload />
		</button>
		<button>
			<tooltip class="top align right">Voir les réponses</tooltip>
			<icon tform />
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
export default class AllTestersAffectationsActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
