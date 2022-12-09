<template>
	<div
		ref="tooltip"
		:class="{ active: !hidden, invisible: !initialized, tooltip: true }"
	>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

@Component({})
export default class Tooltip extends Vue {
	@Prop() public readonly intrusive!: boolean | 'onlyStyle' | 'onlyEvents';

	@Attr() public readonly lazy!: boolean;

	@Ref() protected tooltip!: HTMLElement;

	protected hidden: boolean = true;
	protected initialized: boolean = false;

	/**
	 * Hide the tooltip
	 * @public
	 */
	public hide(): void {
		this.hidden = true;
	}

	/**
	 * Show the tooltip
	 * @public
	 */
	public show(): void {
		this.hidden = false;
	}

	public toggle(): void {
		this.hidden = !this.hidden;
	}

	// Fix for the blurry text in the tooltip;
	private fixBlurryText(): void {
		this.tooltip.style.height = `${
			Math.trunc(this.tooltip.clientHeight / 2) * 2
		}px`;
		this.tooltip.style.width = `${
			Math.trunc(this.tooltip.clientWidth / 2) * 2
		}px`;
	}

	private clearFixBlurryText(): void {
		this.tooltip.style.height = '';
		this.tooltip.style.width = '';
	}

	private updated(): void {
		this.clearFixBlurryText();
		this.$nextTick().then(this.fixBlurryText);
	}

	private mounted(): void {
		if (this.intrusive !== false && this.$el.parentElement) {
			if (this.intrusive !== 'onlyEvents')
				this.$el.parentElement.style.position = 'relative';
			if (this.intrusive !== 'onlyStyle') {
				if (!this.lazy) {
					this.$el.parentElement.addEventListener(
						'mouseenter',
						this.show
					);
					this.$el.parentElement.addEventListener(
						'mouseleave',
						this.hide
					);
				} else
					this.$el.parentElement.addEventListener(
						'click',
						this.toggle
					);
			}
		}
		this.fixBlurryText();
		this.initialized = true;
	}

	private beforeDestroy(): void {
		if (this.$el.parentElement) {
			this.$el.parentElement.removeEventListener('mouseenter', this.show);
			this.$el.parentElement.removeEventListener('mouseleave', this.hide);
			this.$el.parentElement.addEventListener('click', this.toggle);
		}
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';
</style>
