<template>
	<div class="actions">
		<router-link class="button icon" :to="'/results/420/workboard'">
			<icon results />
		</router-link>
		<button><icon campaign />Campagnes</button>
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
export default class ResultsActions extends Vue {
	@Prop() public readonly data!: { id: number; subtest: boolean };

	protected id: number = -1;
	protected subtest: boolean = false;

	private created(): void {
		this.id = this.data.id;
		this.subtest = this.data.subtest;
	}
}
</script>
