<template>
	<div class="testers-quota">
		<div v-if="quota >= testers">
			<span class="text green">{{ testers }} / {{ quota }}</span>
		</div>
		<progress-bar
			class="small red"
			:hide-value="true"
			:value="(testers / quota) * 100"
			v-else
		>
			<span class="text red">{{ testers }} / {{ quota }}</span>
		</progress-bar>
	</div>
</template>

<script lang="ts">
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ProgressBar,
	},
})
export default class ResultsTestersQuota extends Vue {
	@Prop() public data!: { testers: number; quota: number };

	protected get testers(): number {
		return this.data ? this.data.testers : -1;
	}

	protected get quota(): number {
		return this.data ? this.data.quota : -1;
	}
}
</script>

<style lang="scss">
.testers-quota {
	white-space: nowrap;
}
</style>
