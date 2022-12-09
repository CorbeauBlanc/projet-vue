<template>
	<div
		class="selected-item"
		tabindex="0"
		@keydown.delete.stop="$emit('remove')"
	>
		<slot></slot>
		<icon close @click="$emit('remove')" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class SelectedItem extends Vue {}
</script>


<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.selected-item {
	cursor: pointer;
	display: inline-block;
	background: scale-color($primary-color, $lightness: 80%);
	padding: 1px math.div($padding, 6) 1px math.div($padding, 6);
	border-radius: $radius;
	font-size: .87rem;
	white-space: nowrap;
	height: fit-content;
	margin-right: math.div($padding, 6);
	margin-bottom: math.div($padding, 6);

	&:focus {
		background: $primary-color;
		color: $white;

		.icon.close { color: $white; }
	}

	.icon.close {
		cursor: pointer;
		font-size: .87rem;
		margin-left: math.div($padding, 6);
		color: $primary-color;
	}
}
</style>
