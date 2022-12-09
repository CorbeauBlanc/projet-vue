<template>
	<div>
		<span>
			<!-- <button class="button secondary small expand"
				v-if="data.nbTests > 1"
				@click="toggle">
				<i :class="[ 'icon chevron', hidden ? 'down' : 'up' ]"></i>
			</button>
			{{ data.name }}
			<span v-if="data.nbTests > 1" class="counter alt">{{ data.nbTests }} test(s)</span> -->
		</span>
	</div>
</template>

<script lang="ts">
import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ResultsListGroup extends Vue {
	// @Prop() public data!: ResultGroupData;

	protected hidden: boolean = true;

	protected toggle(): void {
		this.hidden = !this.hidden;
		this.$emit('toggle:subtable');
	}
}
</script>

<style lang="scss" scoped>
.group-container {
	position: absolute;
	left: 0;
	width: 100%;
}
</style>
