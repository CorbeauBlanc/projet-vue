<template>
	<div
		:class="{
			'scroll-zone': true,
			scrolling,
			left,
			right,
			up,
			down,
		}"
		@mouseenter="scroll"
		@mouseleave="clear"
		@dragenter="scroll"
		@dragleave="clear"
	>
		<div class="scroll-zone-content">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ScrollZone extends Vue {
	@Prop() public readonly increment!: number;
	@Prop() public readonly xIncrement!: number;
	@Prop() public readonly yIncrement!: number;
	@Prop() public readonly timeout!: number;
	@Prop() public readonly scrollable!: string;

	@Attr() public readonly left!: boolean;
	@Attr() public readonly right!: boolean;
	@Attr() public readonly up!: boolean;
	@Attr() public readonly down!: boolean;

	protected scrolling: boolean = false;

	private x: number = 0;
	private y: number = 0;
	private scrollId: number = -1;
	private scrollParent: HTMLElement | null = null;

	protected scroll(): void {
		if (this.scrollId !== -1)
			return Logger.dbgWarn(
				'ScrollZone: scroll: this.scrollId !== -1',
				this
			);
		this.scrolling = true;
		this.scrollId = window.setInterval(
			(): void => {
				if (!this.scrollParent) this.setScrollParent();
				this.scrollParent?.scrollBy({
					top: this.y,
					left: this.x,
					behavior: 'smooth',
				});
			},
			this.timeout ? this.timeout : 500
		);
	}

	protected clear(): void {
		if (this.scrollId >= 0) {
			this.scrolling = false;
			window.clearInterval(this.scrollId);
			this.scrollId = -1;
		}
	}

	private setScrollParent(): void {
		if (this.scrollable !== null) {
			if (this.scrollable.charAt(0) === '#')
				this.scrollParent = document.getElementById(
					this.scrollable.slice(1)
				);
			else if (this.scrollable.charAt(0) === '.')
				this.scrollParent = document.getElementsByClassName(
					this.scrollable.slice(1)
				)[0] as HTMLElement;
		} else if ((this.left || this.right) && (this.up || this.down))
			this.scrollParent = Js.getScrollableParent(
				this.$parent.$el as HTMLElement
			);
		else if (this.left || this.right)
			this.scrollParent = Js.getHorizontallyScrollableParent(
				this.$parent.$el as HTMLElement
			);
		else if (this.up || this.down)
			this.scrollParent = Js.getVerticallyScrollableParent(
				this.$parent.$el as HTMLElement
			);
	}

	private created(): void {
		let xInc: number = 0;
		let yInc: number = 0;

		if (this.xIncrement) xInc = this.xIncrement;
		else if (this.increment) xInc = this.increment;
		else xInc = 10;

		if (this.yIncrement) yInc = this.yIncrement;
		else if (this.increment) yInc = this.increment;
		else yInc = 10;

		if (this.left) this.x = -xInc;
		else if (this.right) this.x = xInc;
		if (this.up) this.y = -yInc;
		else if (this.down) this.y = yInc;
	}

	private mounted(): void {
		this.setScrollParent();
	}

	private deactivated(): void {
		this.clear();
	}
	private beforeDestroy(): void {
		this.clear();
	}
}
</script>

<style lang="scss" scoped>
	.scroll-zone-content {
		pointer-events: none;
	}
</style>
