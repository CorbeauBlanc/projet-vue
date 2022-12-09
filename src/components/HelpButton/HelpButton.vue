<template>
	<button class="button icon help-button">
		<tooltip :class="classes" intrusive="onlyEvents" lazy>
			<div class="content" @click.stop="">
				<slot></slot>
			</div>
		</tooltip>
		<icon help circle />
	</button>
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class HelpButton extends Vue {
	protected get classes(): string[] {
		return Object.keys(this.$attrs);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

button.button.help-button {
	position: relative;

	&, &:focus {
		background: scale-color($yellow, $lightness: 56%);
		border: none;
		color: $black;
		border-radius: $rounded;
		box-shadow: 0 0 0 3px white, 0 0 10px rgba(black, 0.27);
	}

	&:hover {
		background: $yellow;
		color: inherit;
		box-shadow: 0 0 0 3px white, 0 0 10px rgba(black, 0.27);
	}

	> i.icon.help.circle {
		font-size: 1.5em;
	}

	.tooltip {
		background: $white;
		color: $black;
		box-shadow: $selected-shadow;

		&::before, &::after {
			color: $white;
		}

		.content {
			display: flex;
			flex-direction: column;
			align-items: stretch;

			a:not(.button) {
				text-align: left;
				padding: math.div($padding, 4);
				color: $black;

				&:hover {
					transition: background $normal-speed;
					color: $primary-color;
					background: rgba($primary-color, .11);
				}
			}

			a.button {
				align-self: center;
			}
		}
	}
}
</style>
