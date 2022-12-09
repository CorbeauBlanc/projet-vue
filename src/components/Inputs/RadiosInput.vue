<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block field
	.field(:class='{ "buttons fluid": buttonmode, disabled, readonly }')
		template(v-for='(radio, index) in cfg.options')
			input(
				type='radio',
				ref='input',
				v-model='inputValue',
				v-bind='cfg.constraints',
				:external-id='`${cfg.externalId}-${radio.value}`',
				:readonly='cfg.readonly',
				:disabled='disabled',
				:id='`${uid}-${index}`',
				:value='radio.value',
				:name='cfg.name || uid',
				:key='`i${index}`',
				@change='$emit("change", inputValue)'
			)/
			label.radio-input(
				:for='`${uid}-${index}`',
				:key='`l${index}`',
				:class='[buttonmode ? "button" : "", radio.class]'
			)
				i.icon(:class='radio.icon', v-if='radio.icon')
				| {{ cfg.translate ? $t(radio.text) : radio.text }}
		+tooltip
	+after
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { RadiosInputConfig } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Attr } from '@/decorators';
import Logger from '@/services/LoggerService';
import { Component } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class RadiosInput extends CustomInput<
	string,
	RadiosInputConfig
> {
	@Attr() public readonly buttonmode!: boolean;

	protected masterValue: string = '';
	protected inputValue: string = '';
	protected classes: string[] = [];
	protected readonly uidPrefix: string = 'radios-';

	public emptyValue(val: string | undefined): boolean {
		return !val?.length;
	}

	protected onModelValueChange(val: string): void {
		if (this.disabled)
			return Logger.dbgLog(
				'RadiosInput: onModelValueChange: this.disabled is true',
				this
			);
		if (val !== this.inputValue) this.inputValue = val;
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.radios-input {
	&.inline {
		&:not(:last-child) {
			margin-right: math.div($padding, 2);
		}

		.field {
			label {
				width: auto;
			}
		}
	}

	.icon.help {
		position: relative;
		font-size: 1.2em;
		margin-left: 1em;
	}

	.field {
		border: none;
		padding: 0;

		&.buttons {
			padding: 0;
		}

		label {
			width: 100%;

			&:not(.button) {
				display: inline-flex;
				font-family: $body-font;
				border-radius: $rounded;
				padding: math.div($padding, 5) math.div($padding, 3) math.div($padding, 5) math.div($padding, 5);
				cursor: pointer;
				line-height: normal;
				transition: background-color .3s ease;
				margin-bottom: 0.4rem;

				&::before {
					content: "";
					width: 18px;
					height: 18px;
					margin-right: math.div($padding, 4);
					border-radius: $rounded;
					box-shadow: inset 0 0 0 2px $secondary-color;
					transition: box-shadow .3s ease;
				}

				&:hover {
					background: rgba($primary-color, .1);

					&::before {
						box-shadow: inset 0 0 0 2px $primary-color;
					}
				}
			}
		}

		input[type="radio"] {
			display: none;

			&:checked + label:not(.button) {
				color: $primary-color;

				&:before {
					box-shadow: inset 0 0 0 6px $primary-color;
				}
			}

			&:checked + label.button {
				z-index: 1;
				background: $white;
				color: $default-color;
				border-color: $default-color;
				border-left: 2px solid;
				box-shadow: 0 0 0 3px inset rgba($primary-color, .5);

				&:hover {
					border-color: scale-color($default-color, $lightness: -10%);
					background: scale-color($default-color, $lightness: 90%);
				}

				@each $swatch, $color in $swatch {
					&.#{$swatch} {
						color: $color;
						border-color: $color;
						box-shadow: 0 0 0 3px inset rgba($color, .5);

						&:hover {
							border-color: scale-color($color, $lightness: -10%);
							background: scale-color($color, $lightness: 90%);
						}
					}
				}
			}
		}
	}
}
</style>
