<template>
	<div :class="{ active: dragIn }">
		<div
			:class="{ 'drop-container': true, dragging }"
			@dragover.prevent="dragIn = true"
			@dragleave="dragIn = false"
			@drop="onDrop"
		>
			<div class="drop-target" v-show="dragIn"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class DropTarget extends Vue {
	@Prop() public readonly dragging!: boolean;
	@Prop() public readonly dataType!: string;

	protected dragIn: boolean = false;

	protected onDrop(event: DragEvent): void {
		this.dragIn = false;
		if (event.dataTransfer)
			this.$emit('dropped', event.dataTransfer.getData(this.dataType));
		event.preventDefault();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.drop-container {
	@include z-index(invisible);

	&.dragging {
		@include z-index(topElement);
	}
}
</style>
