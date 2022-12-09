<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
include /src/components/Inputs/CustomInput/CustomInputMixins
block field
	.field-container
		.picker-container(
			@mouseenter='preventBlur = true',
			@mouseleave='onColorMouseLeave'
		)
			chrome-picker(
				v-if='!disabled && focused',
				v-model='inputValue',
				@change='lazy ? null : emitChanges'
			)
		.field(:class='{ focused, disabled, readonly }')
			input(
				type='button',
				ref='input',
				v-bind='cfg.constraints',
				:external-id='cfg.externalId',
				:style='`background: ${cssColor}`',
				:name='cfg.name',
				:id='uid',
				:readonly='cfg.readonly',
				:disabled='disabled',
				@click='toggleColorPicker',
				@blur='toggleColorPicker(undefined, false)'
			)/
			+tooltip
			+inline-label
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import { Chrome } from 'vue-color';
import { Component, Prop } from 'vue-property-decorator';
import {
	Color,
	ColorInputConfig,
	HslColor,
	HsvColor,
	RgbaColor,
} from './InputsTypes';

/**
 * Color picker field. Uses the `vue-color` plugin and uses values of type
 * string, HslColor, RgbaColor, HsvColor and Color.
 */
@Component({
	components: {
		'chrome-picker': Chrome,
		Tooltip,
	},
})
export default class ColorInput extends CustomInput<
	string | HslColor | RgbaColor | HsvColor | Color,
	ColorInputConfig
> {
	/**
	 * Returns the value formatted for css properties.
	 * @public
	 */
	protected get cssColor(): string {
		if (!this.inputValue) return '';
		switch (Color.getColorType(this.inputValue)) {
			case 'hsl':
				return `hsl(
					${(this.inputValue as HslColor).h},
					${(this.inputValue as HslColor).s},
					${(this.inputValue as HslColor).l},
					${(this.inputValue as HslColor).a})`;
				break;
			case 'rgba':
				return `rgba(
					${(this.inputValue as RgbaColor).r},
					${(this.inputValue as RgbaColor).g},
					${(this.inputValue as RgbaColor).b},
					${(this.inputValue as RgbaColor).a})`;
			case 'hsv':
				return '';
				break;
			case 'color':
				return (this.inputValue as Color).hex || '';
			default:
				return this.inputValue as string;
				break;
		}
	}

	/**
	 * The format used by the field
	 */
	@Prop() public readonly format!: 'hsl' | 'hex' | 'hex8' | 'rgba' | 'hsv';

	protected masterValue: string | HslColor | RgbaColor | HsvColor | Color =
		'';
	protected inputValue: string | HslColor | RgbaColor | HsvColor | Color =
		'#FFF';
	protected readonly uidPrefix: string = 'color-';

	protected preventBlur: boolean = false;

	public emptyValue(
		val: string | HslColor | RgbaColor | HsvColor | Color | undefined
	): boolean {
		return typeof val === 'string' ? !val?.length : val === undefined;
	}

	protected onModelValueChange(
		val: string | HslColor | RgbaColor | HsvColor | Color
	): void {
		if (this.disabled)
			return Logger.dbgLog(
				'ColorInput: onModelValueChange: this.disabled is true',
				this
			);
		this.inputValue = val ? val : '#FFF';
	}

	protected onColorMouseLeave(): void {
		this.preventBlur = false;
		(this.$refs['input'] as HTMLElement).focus();
	}

	protected emitChanges(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'ColorInput: emitChanges: this.cfg is false',
				this
			);
		if (
			this.disabled ||
			this.cfg.readonly ||
			!this.inputValue ||
			this.inputValue === ''
		)
			return Logger.dbgLog(
				'ColorInput: onModelValueChange: this.disabled or this.cfg.readonly is true, or this.inputValue is undefined, or this.inputValue is empty string',
				this
			);
		this.$emit(
			'change',
			Object.assign(
				{},
				this.format
					? (this.inputValue as any)[this.format]
					: this.inputValue
			)
		);
	}

	/**
	 * Toggles the color picker plugin.
	 */
	protected toggleColorPicker(e: never, val?: boolean): void {
		if (this.disabled)
			return Logger.dbgLog(
				'ColorInput: toggleColorPicker: this.disabled is true',
				this
			);
		if (this.preventBlur) {
			this.preventBlur = false;
			return;
		}
		if (val === this.focused)
			return Logger.dbgWarn(
				'ColorInput: toggleColorPicker: val === this.focused',
				this
			);
		this.focused = val !== undefined ? val : !this.focused;
		if (!this.focused) this.emitChanges();
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}

	protected created(): void {
		if (!this.disabled && this.value) this.inputValue = this.value;
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.color-input {

	.icon.help {
		position: relative;
	}

	.picker-container {
		position: absolute;
	}

	&.top {
		.picker-container {
			bottom: calc(100% + #{math.div($padding, 2)});
		}
	}
	&.bottom {
		.picker-container {
			top: calc(100% + #{math.div($padding, 2)});
		}
	}
	&.left {
		.picker-container {
			right: calc(100% + #{math.div($padding, 2)});
		}
	}
	&.right {
		.picker-container {
			left: calc(100% + #{math.div($padding, 2)});
		}
	}

	.field-container {
		display: inline-block;
		position: relative;

		.field {
			padding: 2px;
			border-radius: 50%;

			input {
				border: none;
				padding: 0;
				background: none;
				display: block;
				width: 1.5rem;
				height: 1.5rem;
				border-radius: 50%;
			}
		}
	}
}

.color-display {
	display: inline-block;
	width: 1.2rem;
	height: 1.2rem;
	border-radius: $rounded;
	border: $border-width solid $grey;
	box-shadow: 0 0 0 2px $white inset;

	&.transparent {
		@include transparent-background();
	}
}
</style>
