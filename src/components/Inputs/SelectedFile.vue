<template>
	<div class="selected-file" tabindex="0" @keypress.delete="$emit('remove')">
		<img :src="src" :alt="source ? source.name : ''" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class SelectedFile extends Vue {
	@Prop() public source!: File;

	protected src: string = '';

	private created(): void {
		if (this.source) this.src = window.URL.createObjectURL(this.source);
	}
}
</script>


<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.selected-file {
	cursor: pointer;
	display: inline-block;
	max-width: 100%;
	margin-top: $padding;
	margin-bottom: $padding;
	background: $light-grey;

	img {
		width: 100%;
		display: block;
		border-radius: $radius;
		box-shadow: $base-shadow;

		&:hover {
			box-shadow: $hover-shadow;
		}
	}
}
</style>
