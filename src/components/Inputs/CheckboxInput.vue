<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
include /src/components/Inputs/CustomInput/CustomInputMixins
block field
	.field(:class='{ disabled, readonly }')
		input(
			type='checkbox',
			ref='input',
			v-model='inputValue',
			v-bind='cfg.constraints',
			@change='toggleChecked',
			:external-id='cfg.externalId',
			:readonly='cfg.readonly',
			:disabled='disabled',
			:id='uid',
			:name='cfg.name'
		)/
		label(:for='uid', :class='{ empty: cfg.placeholder === undefined }')
			icon(check)
			| {{ cfg.translate ? $t(cfg.placeholder) : cfg.placeholder }}
			i.icon.help.circle.primary.text(v-if='cfg.help')
				tooltip.top
					| {{ cfg.help }}
		+tooltip
		+inline-label
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { CheckboxInputConfig } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Switcher } from '@/types';
import { Dictionary } from 'lodash';
import { Component } from 'vue-property-decorator';

type CheckboxValueType = boolean | string | string[] | Dictionary<boolean>;
type Format = 'boolean' | 'string' | 'array' | 'object';
type FormatSwitcher<F extends Format> = Switcher<
	{
		boolean: boolean;
		string: string;
		object: Dictionary<boolean>;
		array: string[];
	},
	F
>;

/**
 * Checkbox field. Uses the same value types as Html checkboxes used with v-model,
 * i.e. a boolean, an array of string containing the value of the checkbox if it is
 * checked, or a generic object (or Dictionary) where the value of the checkbox is the
 * name of a property which value is `true` or `false` depending of the state of the checkbox
 */
@Component({
	components: {
		Tooltip,
	},
})
export default class CheckboxInput extends CustomInput<
	CheckboxValueType,
	CheckboxInputConfig
> {
	protected masterValue: boolean | string[] | Dictionary<boolean> = false;
	protected checkId: string = '';
	protected inputValue: boolean = false;
	protected readonly uidPrefix: string = 'checkbox-';

	public emptyValue(val: CheckboxValueType | undefined): boolean {
		if (!val) return true;
		if (Array.isArray(val) || typeof val === 'string')
			return !val.includes(this.checkId);
		else return (val as Dictionary<boolean>)[this.checkId];
	}

	/**
	 * Toggles the checkbox and emits the changes. Will automatically use the format
	 * of the current state of the checkbox (boolean, array or Dictionary).
	 * @public
	 */
	protected toggleChecked(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'CheckboxInput: toggleChecked: this.cfg is false',
				this
			);
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgLog(
				'CheckboxInput: toggleChecked: this.disabled or this.cfg.readonly is true',
				this
			);
		let tmp: CheckboxValueType;

		switch (this.checkFormat) {
			case 'array':
				tmp = this.valueToArray().filter(
					(val: string): boolean => val !== this.checkId
				);
				if (this.inputValue) tmp.push(this.checkId);
				this.$emit('change', tmp);
				break;
			case 'object':
				tmp = Object.assign(
					{},
					this.valueToObject()
				) as Dictionary<boolean>;
				tmp[this.checkId] = this.inputValue;
				this.$emit('change', tmp);
				break;
			case 'boolean':
				this.$emit('change', this.inputValue);
				break;
			case 'string':
				this.$emit('change', this.inputValue ? this.checkId : '');
				break;
		}
	}

	protected onModelValueChange(val: CheckboxValueType): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CheckboxInput: onModelValueChange: this.disabled is true',
				this
			);
		this.inputValue = this.valueToBoolean(val);
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}

	protected additionalConfigInit(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'CheckboxInput: toggleChecked: this.cfg is false',
				this
			);
		this.checkId = this.cfg.name || Js.uid;
	}

	private get checkFormat(): Format {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				'object',
				'CheckboxInput: get checkFormat: this.cfg is false',
				this
			);
		if (this.cfg.checkFormat !== undefined) return this.cfg.checkFormat;
		if (Array.isArray(this.value)) return 'array';
		switch (typeof this.value) {
			case 'boolean':
				return 'boolean';
			case 'string':
				return 'string';
			default:
				return 'object';
		}
	}

	private valueToFormat<F extends Format>(
		format: F,
		val?: CheckboxValueType
	): FormatSwitcher<F> {
		switch (format) {
			case 'array':
				return this.valueToArray(val) as FormatSwitcher<typeof format>;
			case 'string':
				return this.valueToString(val) as FormatSwitcher<typeof format>;
			case 'boolean':
				return this.valueToBoolean(val) as FormatSwitcher<
					typeof format
				>;
			default:
				return this.valueToObject(val) as FormatSwitcher<typeof format>;
		}
	}

	private valueToArray(val?: CheckboxValueType): string[] {
		const value: CheckboxValueType = val !== undefined ? val : this.value;
		if (Array.isArray(value)) return value;
		switch (typeof value) {
			case 'boolean':
				return value ? [this.checkId] : [];
			case 'string':
				return [value];
			default:
				return value[this.checkId] ? [this.checkId] : [];
		}
	}

	private valueToObject(val?: CheckboxValueType): Dictionary<boolean> {
		const value: CheckboxValueType = val !== undefined ? val : this.value;
		if (Array.isArray(value))
			return value.reduce(
				(
					initialValue: Dictionary<boolean>,
					currentValue: string
				): Dictionary<boolean> => {
					initialValue[currentValue] = true;
					return initialValue;
				},
				{}
			);
		switch (typeof value) {
			case 'boolean':
				return Object.fromEntries([[this.checkId, value]]);
			case 'string':
				return Object.fromEntries([[value, true]]);
			default:
				return value;
		}
	}

	private valueToBoolean(val?: CheckboxValueType): boolean {
		const value: CheckboxValueType = val !== undefined ? val : this.value;
		if (Array.isArray(value)) return value.includes(this.checkId);
		switch (typeof value) {
			case 'boolean':
				return value;
			case 'string':
				return value === this.checkId;
			default:
				return value[this.checkId];
		}
	}

	private valueToString(val?: CheckboxValueType): string {
		const value: CheckboxValueType = val !== undefined ? val : this.value;
		if (Array.isArray(value))
			return value.includes(this.checkId) ? this.checkId : '';
		switch (typeof value) {
			case 'boolean':
				return value ? this.checkId : '';
			case 'string':
				return value;
			default:
				return value[this.checkId] ? this.checkId : '';
		}
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.checkbox-input {
	.icon.help {
		position: relative;
		font-size: 1.2em;
		margin-left: 1em;
	}

	.field {
		border: none;
		padding: 0;

		$icon-size: 18px;

		label {
			vertical-align: text-top;
			font-family: $body-font;
			padding: math.div($padding, 5) math.div($padding, 3) math.div($padding, 5) math.div($padding, 5);
			position: relative;
			display: inline-flex;
			line-height: normal;
			border-radius: $radius;
			cursor: pointer;
			transition: background-color .3s ease;
			width: 100%;

			/* &::after {
				position: absolute;
				top: 7px;
			}

			&::before {
				content: "";
				width: $icon-size;
				height: $icon-size;
				margin-right: math.div($padding, 4);
				border-radius: $radius;
				box-shadow: inset 0 0 0 2px #ccc;
				transition: box-shadow .3s ease;
				align-self: baseline;
			} */

			&:hover {
				background: rgba($primary-color, .1);

				i.icon.check {
					box-shadow: inset 0 0 0 2px $primary-color;
				}
			}

			&.empty {
				padding: math.div($padding, 5);

				i.icon.check {
					margin-right: 0;
				}
			}

			i.icon.check {
				color: transparent;
				width: $icon-size;
				height: $icon-size;
				font-size: .9em;
				margin-right: math.div($padding, 4);
				border-radius: $radius;
				box-shadow: inset 0 0 0 2px #ccc;
				transition: box-shadow .3s ease;
				align-self: baseline;

				&::before {
					line-height: 1.3;
				}
			}
		}

		input[type="checkbox"] {
			display: none;

			&:checked + label {
				color: $primary-color;

				i.icon.check {
					color: $white;
					background: $primary-color;
					box-shadow: inset 0 0 0 2px $primary-color;

					&:hover {
						&:before {
							box-shadow: inset 0 0 0 2px $primary-color;
						}
					}
				}
			}
		}
	}

	&.inline {
		.field {
			label {
				width: auto;
			}
		}
	}
}
</style>
