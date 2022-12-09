<template>
	<label :class="{ selector: true, checked }">
		<input type="checkbox" @change="toggleSelected" :checked="checked" />
	</label>
</template>

<script lang="ts">
import Js from '@/services/JsService';
import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class GenericSelector extends Vue {
	@Prop() public readonly value!: string;
	@Model('change') public readonly selected!:
		| boolean
		| string[]
		| { [key: string]: boolean };

	protected id: string = '';

	protected toggleSelected(e: Event): void {
		if (Array.isArray(this.selected)) {
			const tmp: string[] = this.selected.filter(
				(val: string): boolean => val !== this.id
			);
			if (e.target && (e.target as HTMLInputElement).checked)
				tmp.push(this.id);
			this.$emit('change', tmp);
		} else if (typeof this.selected === 'object') {
			const tmp: { [key: string]: boolean } = Object.assign(
				{},
				this.selected
			);
			tmp[this.id] = (e.target as HTMLInputElement).checked;
			this.$emit('change', tmp);
		} else this.$emit('change', (e.target as HTMLInputElement).checked);
	}

	protected get checked(): boolean {
		if (Array.isArray(this.selected))
			return this.selected.includes(this.id);
		else if (typeof this.selected === 'object')
			return this.selected[this.id];
		else return this.selected;
	}

	private created(): void {
		this.id = this.value ? this.value : Js.uid;
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.selector {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
	border-radius: $radius;
	transition: box-shadow $normal-speed;
	cursor: pointer;

	&:hover {
		background: rgba($primary-color, .1);
	}

	&.checked {
		box-shadow: 0 0 0 5px $green, $selected-shadow;
	}

	input {
		display: none;
	}
}
</style>
