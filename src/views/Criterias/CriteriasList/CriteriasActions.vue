<template>
	<div class="actions">
		<button>
			<tooltip class="top">Supprimer</tooltip>
			<icon delete text red />
		</button>
		<button>
			<tooltip class="top align right">Editer</tooltip>
			<icon edit />
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
export default class CriteriasActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
