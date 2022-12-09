<template>
	<div class="fold-header" v-if="!icon" @click="toggleActive">
		<slot></slot>
		<i :class="`icon chevron double ${isActive() ? 'down' : 'up'}`"></i>
	</div>
	<i
		v-else
		:class="`fold-header icon chevron ${isActive() ? 'down' : 'up'}`"
		@click="toggleActive"
	></i>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import ComponentsUtils from '@/services/ComponentsUtils';
import Logger from '@/services/LoggerService';
import { Component, Model, Prop, Vue, Watch } from 'vue-property-decorator';
import Foldable from './Foldable.vue';

@Component({})
export default class FoldHeader extends Vue {
	@Prop() public readonly name!: string;

	@Attr() public readonly icon!: boolean;

	@Model('toggle') public readonly modelActive!: boolean;
	protected active: boolean = false;

	private foldableComponents: Map<string, Foldable> = new Map();

	public isActive(): boolean {
		return this.modelActive !== undefined ? this.modelActive : this.active;
	}

	public linkFoldableComponent(component: Foldable): void {
		if (
			!this.foldableComponents.has(component.uid) &&
			(this.name === undefined || component.name === this.name)
		) {
			this.foldableComponents.set(component.uid, component);
			component.setActive(this.active);
		} else
			Logger.dbgWarn(
				'FoldHeader: linkFoldableComponent: this.foldableComponents.has(component.uid) returned true or this.name is a string equals to component.name',
				this
			);
	}

	@Watch('modelActive', { immediate: true })
	protected onModelActiveChange(val: boolean): void {
		this.setActive(val);
	}

	protected toggleActive(): void {
		this.active = !this.active;
		this.$emit('toggle', this.active);
		this.foldableComponents.forEach((component: Foldable): void => {
			component.setActive(this.active);
		});
	}

	protected setActive(value: boolean): void {
		this.active = value;
		this.foldableComponents.forEach((component: Foldable): void => {
			component.setActive(this.active);
		});
	}

	private mounted(): void {
		(
			ComponentsUtils.findAllChildren(
				Foldable,
				this.$parent
			) as Foldable[]
		).forEach(this.linkFoldableComponent);
		if (this.$attrs['active'] !== undefined && !this.modelActive)
			this.setActive(true);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.fold-header {
	@include clickable-text;
}
</style>
