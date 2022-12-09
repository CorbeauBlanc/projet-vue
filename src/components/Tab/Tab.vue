<template>
	<div class="tab item" @click="emitChange" :class="{ active, disabled }">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { InputOption } from '@/components/Inputs/InputsTypes';
import { Attr, Master } from '@/decorators';
import { Vision } from '@/optician';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Tab extends Vision {
	@Prop() public readonly name!: string | InputOption;
	@Prop() public readonly disabled!: boolean;
	@Prop() public readonly eventsEnabled!: boolean;

	@Attr() public readonly toggleMode!: boolean;

	@Master('change') protected readonly default: string | InputOption = '';

	protected emitChange(): void {
		if (!this.disabled && this.eventsEnabled !== false) {
			const current: string =
				typeof this.default === 'string'
					? this.default
					: this.default.value;
			const name: string =
				typeof this.name === 'string' ? this.name : this.name.value;

			if (current === name && this.toggleMode) {
				this.$emit('change', '');
			} else if (current !== name) this.$emit('change', name);
		}
	}

	protected get active(): boolean {
		const current: string =
			typeof this.default === 'string'
				? this.default
				: this.default.value;
		const name: string =
			typeof this.name === 'string' ? this.name : this.name.value;
		return current === name && !this.disabled;
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.tabs, .tabs.navigation, .tabs.alt {
	&, &.secondary, &.tertiary {
		.menu {
			display: flex;
			width: 100%;

			&.stretched .item {
				flex-grow: 1;
			}

			&.vertical {
				flex-direction: column;
				border-bottom: none;
			}

			.item {
				font-family: $body-font;
				display: inline;
				font-family: $header-font;
				padding: (math.div($padding, 3)) $padding;
				background: $white;
				position: relative;
				cursor: pointer;
				text-align: center;
				transition: unset;

				&:not(:last-child) {
					margin-right: .1rem;
				}

				&.active {
					font-weight: 700;
					color: $primary-color;

					&:after {
						content: "";
						border-bottom: $border-width solid #fff;
						display: block;
						position: absolute;
						height: 1px;
						width: 100%;
						left: 0;
						bottom: -1px;
					}
				}

				&:not(.active):hover {
					color: $primary-color;
				}

				&.disabled, &.disabled:hover {
					opacity: .3;
					cursor: not-allowed;
					color: $text-muted;
				}

				i.icon, span, .flag {
					vertical-align: middle;
				}

				i.icon:not(:only-child) {
					margin-right: math.div($padding, 2);
				}
			}

			.item.alt {
				font-family: $body-font;
				display: flex;
				align-items: center;
				margin: 0;
				border: none;
				background: none;
				border-radius: 0;
				opacity: .7;
				color: $text-color;

				@include mobile {
					display: inline;
					padding-left: math.div($padding, 3);
					padding-right: math.div($padding, 3);
					border: none;
				}

				&.active {
					color: $primary-color;
					opacity: 1;

					&:after {
						content: none;
					}
				}

				&.link {
					opacity: 1;
					color: $primary-color;
				}

				&:not(:last-of-type) {
					margin: 0;
					border-right: $border-width solid $border-color;
				}

				&:hover {
					opacity: 1;
				}

				&.counter {
					cursor: default;
				}

				a .icon {
					margin: 0;
					font-size: 1rem;

					&.delete {
						margin-left: math.div($padding, 4);
					}
				}

				.flag {
					margin-right: math.div($padding, 4);
				}
			}
		}
	}
}

.tabs {
	&.navigation {
		width: 100%;
		font-family: $body-font;
		background: $white;

		&.secondary {
			.menu {
				.item {
					font-family: $body-font;
					font-weight: bold;
					color: $text-color;
					padding: math.div($padding, 1.5) $padding;

					i {
						opacity: .6;
					}

					&.active, &:hover, &.active i, &:hover i {
						opacity: 1;
					}

					&.disabled:hover {
						color: $text-muted;
					}

					&.active {
						color: $text-color;
						background: $background-color;

						&:after {
							display: none
						}
					}
				}
			}
		}

		&.tertiary {
			.menu {
				.item {
					font-family: $body-font;
					padding: math.div($padding, 3) $padding;
					opacity: .7;

					&.active,
					&:hover {
						opacity: 1;
					}

					&.active {
						color: $primary-color;

						&:after {
							display: none
						}
					}
				}
			}
		}

		.menu {
			border-bottom: $border-width solid $border-color;

			&.vertical .item {
				border-bottom: $border-width solid $border-color;
			}

			.item {
				font-family: $body-font;
				color: $text-color;
				font-weight: normal;
				text-align: left;
				border-radius: 0;
				border: none;

				.icon:not(.text) {
					color: $primary-color;
				}
			}
		}
	}

	&.alt {
		padding: math.div($padding, 4) 0;
		margin: 0;

		@include mobile {
			padding: 0;
		}

		.menu {
			border: none;
			font-family: $body-font;

			@include mobile {
				align-items: center;
			}

			.item:not(:last-of-type) {
				border-right: $border-width solid $border-color;
			}
		}
	}

	.menu {
		border-bottom: $border-width solid $border-color;

		.item {
			font-family: $body-font;
			border-radius: $radius $radius 0 0;
			border: $border-width solid $border-color;
			border-bottom: none;

			&:not(.active) {
				border: none;
			}
		}
	}
}
</style>
