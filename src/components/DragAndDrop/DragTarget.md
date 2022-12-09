```vue
<template>
	<div>
		<drag-target
			class="section-drag-target"
			:drag-element="dragIcon"
			:drag-data="{ data: dragdata, type: 'text/plain' }"
		>
			<div class="section-dnd-icon" draggable="true" ref="dnd">
				<i class="icon arrows"></i>
			</div>
		</drag-target>
		<div
			class="drop-container"
			@drop="onDrop"
		>
			<div class="drop-target" v-show="dragIn"></div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	data: () => {
		return {
			dragdata: 'Dragged data',
			dragIcon: {}
		};
	},
	methods: {
		onDrop: function (even) {
			if (event.dataTransfer)
				alert(event.dataTransfer.getData('text/plain'));
			event.preventDefault();
		}
	}
	mounted: function () {
		this.dragIcon = this.$refs['dnd'];
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.section-drag-target {
	$shadow-size: 10px;

	position: relative;
	padding: 10px 10px 10px 1rem;

	.section-dnd-icon {
		cursor: pointer;
		display: inline-block;
		padding: 0.5rem;
		font-size: 0.8rem;
		border-radius: 50%;
		z-index: 69;
		position: absolute;
		top: .3rem;
		left: -1rem;
		background: scale-color($default-color, $lightness: 73%);

		i.icon {
			vertical-align: bottom;
		}
	}
}

.drop-target {
	pointer-events: none;
	border: 2px dashed $grey;
	height: 500px;
}
</style>
```
