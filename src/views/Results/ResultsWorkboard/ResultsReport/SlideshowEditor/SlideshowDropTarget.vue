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
export default class SlideshowDropTarget extends Vue {
	@Prop() public readonly dragging!: boolean;

	protected dragIn: boolean = false;

	protected onDrop(event: DragEvent): void {
		this.dragIn = false;
		if (event.dataTransfer) {
			const id: string = event.dataTransfer.getData('text/plain');
			this.$emit('dropped', Number.parseInt(id));
		}
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

.section-drop-target {
	$target-space: $padding * 2;
	$placeholder-space: math.div($padding, 4);

	overflow: visible;
	height: 0;
	margin: $placeholder-space 10px;
	position: relative;

	&.active {
		height: $target-space;
	}

	.drop-container {
		padding: $padding * 1.5 0;
		width: 100%;
		transform: translateY(-50%);
		position: absolute;
		top: 50%;

		.drop-target {
			pointer-events: none;
			background: scale-color($light-grey, $lightness: -3%);
			border: 2px dashed $grey;
			height: $target-space;
		}
	}
}

.slide-drop-target {
	$target-space: 18%;
	$placeholder-space: math.div($padding, 4);
	$container-padding: $padding * 5;

	overflow: visible;
	width: 0;
	height: 150px;
	margin: 1% 0;
	position: relative;

	&.active {
		width: $target-space;
		margin: 1%;

		.drop-container {
			width: calc(100% + 2 * #{$container-padding});
		}
	}

	.drop-container {
		padding: 0 $container-padding;
		height: 100%;
		transform: translateX(-50%);
		position: absolute;
		left: 50%;

		.drop-target {
			pointer-events: none;
			border: 2px dashed $grey;
			height: 100%;
		}
	}
}
</style>
