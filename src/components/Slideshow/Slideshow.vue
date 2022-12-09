<template>
	<div
		:class="{ slideshow: true, fullscreen }"
		ref="componentContainer"
		@fullscreenchange="updateFullscreen"
	>
		<progress-bar
			class="compact no-background"
			:value="((index + 1) / slides.length) * 100"
		/>
		<div
			:class="['slides', `next-${next}`, `previous-${previous}`]"
			ref="slidesContainer"
			@animationend="updateAnimation"
		>
			<div
				class="slide"
				:style="{
					width: `${SLIDE_WIDTH}px`,
					height: `${SLIDE_HEIGHT}px`,
				}"
				ref="slide"
				v-html="slides[index].html"
			></div>
		</div>
		<div class="controls">
			<div class="buttons attached">
				<button
					:class="{ 'button icon primary': true, ghost: !fullscreen }"
					@click="previousSlide"
				>
					<icon icon chevron left />
				</button>
				<button
					:class="{
						'button index primary': true,
						ghost: !fullscreen,
					}"
				>
					<span
						><span class="current-slide">{{ index + 1 }}</span> /
						{{ slides.length }}</span
					>
				</button>
				<button
					:class="{ 'button icon primary': true, ghost: !fullscreen }"
				>
					<icon icon squares />
				</button>
				<button
					:class="{ 'button icon primary': true, ghost: !fullscreen }"
					@click="toggleFullscreen"
				>
					<i
						:class="{ 'icon fullscreen': true, exit: fullscreen }"
					></i>
				</button>
				<button
					:class="{ 'button icon primary': true, ghost: !fullscreen }"
				>
					<icon icon edit />
				</button>
				<button
					:class="{ 'button icon primary': true, ghost: !fullscreen }"
					@click="nextSlide"
				>
					<icon icon chevron right />
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import { Master } from '@/decorators';
import { Vision } from '@/optician';
import Logger from '@/services/LoggerService';
import { Component, Prop, Ref } from 'vue-property-decorator';
import { Slide, SlideLegacy } from './SlideshowTypes';

@Component({
	components: {
		ProgressBar,
	},
})
export default class Slideshow extends Vision {
	@Master('change') protected get index(): number {
		if (this.forceUpdate) this.forceUpdate = false;
		return this.pIndex || 0;
	}
	protected set index(i: number) {
		this.forceUpdate = true;
		this.pIndex = i;
	}

	public get fullscreen(): boolean {
		return this.fullscreenActive;
	}
	@Prop() protected readonly slides!: (Slide | SlideLegacy)[];

	@Ref() protected readonly componentContainer!: HTMLElement;
	@Ref() protected readonly slidesContainer!: HTMLElement;
	@Ref() protected readonly slide!: HTMLElement;

	protected next: 'hide' | 'show' | '' = '';
	protected previous: 'hide' | 'show' | '' = '';
	protected pIndex: number = 0;

	protected readonly SLIDE_WIDTH: number = 1280;
	protected readonly SLIDE_HEIGHT: number = 720;

	private resizeObs!: ResizeObserver;
	private fullscreenActive: boolean = false;
	private nextIndex: number = 0;

	public toggleFullscreen(): void {
		if (!document.fullscreenElement) {
			try {
				this.$el.requestFullscreen();
			} catch (err) {
				Logger.error('Could not enter fullscreen: ', err);
			}
		} else {
			try {
				document.exitFullscreen();
			} catch (err) {
				Logger.error('Could not exit fullscreen: ', err);
			}
		}
	}

	public nextSlide(): void {
		if (this.index + 1 >= this.slides.length) return;
		this.next = 'hide';
		this.nextIndex = this.index + 1;
	}

	public previousSlide(): void {
		if (this.index - 1 < 0) return;
		this.previous = 'hide';
		this.nextIndex = this.index - 1;
	}

	protected updateAnimation(): void {
		if (this.nextIndex === this.index) {
			this.next = '';
			this.previous = '';
		} else {
			if (this.next === 'hide') this.next = 'show';
			if (this.previous === 'hide') this.previous = 'show';
			this.$emit('change', this.nextIndex);
		}
	}

	protected updateFullscreen(ev: Event): void {
		this.fullscreenActive = document.fullscreenElement === ev.target;
	}

	protected mounted(): void {
		this.resizeSlide();
		try {
			this.resizeObs = new ResizeObserver(this.resizeSlide);
			this.resizeObs.observe(this.componentContainer);
		} catch (err) {
			Logger.warn('ResizeObserver not supported.', err);
			const interval: number = window.setInterval(this.resizeSlide, 500);
			this.$destroy = (): void => {
				window.clearInterval(interval);
			};
		}
	}

	private resizeSlide(): void {
		if (
			this.slidesContainer.clientWidth / this.SLIDE_WIDTH < 1 &&
			this.slidesContainer.clientHeight / this.SLIDE_HEIGHT < 1
		) {
			this.slide.style.transform = `scale(${Math.max(
				this.slidesContainer.clientWidth / this.SLIDE_WIDTH,
				this.slidesContainer.clientHeight / this.SLIDE_HEIGHT
			)})`;
		} else {
			this.slide.style.transform = `scale(${Math.min(
				this.slidesContainer.clientWidth / this.SLIDE_WIDTH,
				this.slidesContainer.clientHeight / this.SLIDE_HEIGHT
			)})`;
		}
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';
@import '@/styles/slides_legacy';


.slideshow {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding-bottom: $padding;
	background: scale-color($black, $lightness: -72%, $saturation: -40%);
	overflow: hidden;

	&.fullscreen {
		padding: 0;

		.controls {
			position: fixed;
			bottom: 0;
			opacity: 0;
			transition: opacity $normal-speed;
			width: 100%;
			display: flex;
			justify-content: center;
			margin-bottom: 0;
			padding-bottom: $padding;

			&:hover {
				opacity: 1;
			}
		}

		.progress-bar {
			position: fixed;
			top: 0;
			opacity: .3;
			transition: opacity $normal-speed;
			padding-bottom: 15%;
			@include z-index(raisedElement);

			&:hover {
				opacity: 1;
			}
		}

		.slides {
			margin: 0;
		}
	}

	.progress-bar {
		margin-bottom: $padding;
		width: 100%;
	}

	.controls {
		margin: $padding 0;

		.current-slide {
			color: $white;
		};

		.button.index {
			pointer-events: none;
		}
	}

	.slides {
		flex-grow: 1;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: $padding 0;

		&.next-hide {
			animation: slideLeft $normal-speed;
		}

		&.next-show {
			animation: slideRight $normal-speed reverse;
		}

		&.previous-hide {
			animation: slideRight $normal-speed;
		}

		&.previous-show {
			animation: slideLeft $normal-speed reverse;
		}

		.slide {
			flex-shrink: 0;
			background: $white;
			box-shadow: 0 0 50px rgba(black, .9);
			position: relative;
		}
	}
}
</style>
