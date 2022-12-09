<template>
	<div :class="{ trigger: true, vertical }">
		<div v-if="top || (!top && !bottom)" class="scroll-fix"></div>
		<div ref="observed"></div>
		<div v-if="bottom || (!top && !bottom)" class="scroll-fix"></div>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

@Component({})
export default class Trigger extends Vue {
	@Prop() public readonly threshold!: number | number[];
	@Prop() public readonly cancelFirst!: 'enter' | 'leave' | 'both';

	@Attr() protected readonly vertical!: boolean;
	@Attr() protected readonly top!: boolean;
	@Attr() protected readonly bottom!: boolean;

	@Ref() protected readonly observed!: HTMLElement;

	private observer!: IntersectionObserver;
	private firstCanceled: boolean = false;

	private onBoundaryVisibilityChange(
		entries: IntersectionObserverEntry[]
	): void {
		if (!entries.length) return;

		const event: 'enter' | 'leave' = entries[0].isIntersecting
			? 'enter'
			: 'leave';
		if (
			(this.cancelFirst === 'both' || this.cancelFirst === event) &&
			!this.firstCanceled
		) {
			this.firstCanceled = true;
			return;
		}
		this.$emit(event);
	}

	private mounted(): void {
		this.observer = new IntersectionObserver(
			this.onBoundaryVisibilityChange,
			{
				root: this.$el.parentElement,
				threshold: this.threshold || 1,
			}
		);
		this.observer.observe(this.observed);
	}

	private destroyed(): void {
		if (this.observer) this.observer.disconnect();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.trigger {
	&:not(.vertical) {
		width: 100%;

		.scroll-fix {
			width: 100%;
			height: 1px;
		}
	}
	&.vertical {
		height: 100%;

		.scroll-fix {
			height: 100%;
			width: 1px;
		}
	}
}
</style>
