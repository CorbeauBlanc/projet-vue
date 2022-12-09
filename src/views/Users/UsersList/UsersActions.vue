<template>
	<div class="actions">
		<button>
			<tooltip class="top">Archiver</tooltip>
			<icon archive text red />
		</button>
		<button>
			<tooltip class="top">Authentifier</tooltip>
			<icon auth />
		</button>
		<router-link :to="`/users/${id}/edition`">
			<tooltip class="top">Éditer</tooltip>
			<icon edit />
		</router-link>
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
export default class TestersActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
