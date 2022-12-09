<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
include /src/components/Inputs/CustomInput/CustomInputMixins
block field
	.field-container
		.field(:class='{ focused, disabled, readonly }')
			icon(search, v-if='cfg.search')/
			+selected-items
			input(
				type='text',
				ref='input',
				v-model.trim='inputValue',
				v-bind='cfg.constraints',
				@input='handleDebouncedInput',
				@keyup="$emit('text-input:keyup', inputValue.toString())",
				@keyup.enter='addToSelection',
				@keydown.delete='handleDelete',
				@focus='focused = true',
				@blur='focused = false',
				:external-id='cfg.externalId',
				:readonly='cfg.readonly',
				:disabled='disabled',
				:name='cfg.name',
				:id='uid',
				:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
				:class='{ search: cfg.search }'
			)/
			+tooltip
			+inline-label
		+after
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { InputOption, TextInputConfig } from '@/components/Inputs/InputsTypes';
import SelectedItem from '@/components/Inputs/SelectedItem.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import { Component } from 'vue-property-decorator';

@Component({
	components: {
		SelectedItem,
		Tooltip,
	},
})
/**
 * Text input field.
 * Uses values of types string, InputOption, or an array of string or InputOption
 */
export default class TextInput<
	C extends TextInputConfig = TextInputConfig
> extends CustomInput<string | InputOption | (string | InputOption)[], C> {
	protected multipleIsDefault: boolean = true;
	protected inputValue: string | InputOption | undefined = '';
	protected readonly uidPrefix: string = 'text-';

	protected masterValue: string | InputOption | (string | InputOption)[] = '';

	/**
	 * Check if a given value is considered "empty", i.e. unusable and unsendable.
	 * @public
	 */
	public emptyValue(
		val: string | InputOption | (string | InputOption)[] | undefined
	): boolean {
		if (!val) return true;
		else if (typeof val === 'string' || Array.isArray(val)) {
			if (!val.length) return true;
		} else if (val.text === '' && val.value === '') return true;
		return false;
	}
	/**
	 * Function initialized and used when the text input is not lazy to debounce the value entered
	 * @public
	 */
	protected handleDebouncedInput: () => void = () => 0;

	protected onModelValueChange(
		val: string | InputOption | (string | InputOption)[]
	): void {
		if (this.preventWatchFeedback) {
			this.preventWatchFeedback = false;
			return;
		}
		if (this.disabled) return;
		if (!this.multipleIsEnabled()) {
			if (this.emptyValue(val)) {
				this.inputValue = undefined;
				return;
			}
			this.setInputValue(val);
		}
	}

	protected setInputValue(
		val: string | InputOption | (string | InputOption)[]
	): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'TextInput: setInputValue: this.cfg is false',
				this
			);
		if (this.cfg.readonly || this.disabled) return;
		if (Array.isArray(val)) val = val[0];
		if (typeof val === 'string') this.inputValue = val;
		else this.inputValue = val.text;
	}

	/**
	 * If the field can select multiple values, will remove the last value stored
	 * when the user presses the `backspace` key and the field is empty
	 * @public
	 */
	protected handleDelete(): void {
		if (!this.cfg)
			return Logger.dbgError(
				'TextInput: handleDelete: this.cfg is false',
				this
			);
		if (this.cfg.readonly || this.disabled) return;
		if (
			this.inputValue === '' &&
			this.multipleIsEnabled() &&
			Array.isArray(this.value) &&
			this.value.length
		)
			this.removeFromSelection(this.value.length - 1);
	}

	/**
	 * Adds the value of the input to the array of selected values.
	 * @public
	 */
	protected addToSelection(): void {
		if (!this.cfg)
			return Logger.dbgError(
				'TextInput: addToSelection: this.cfg is false',
				this
			);
		if (this.lazy !== true) return;
		if (this.inputValue === undefined) return;
		if (this.cfg.readonly || this.disabled) return;
		if (this.multipleIsEnabled() && this.inputValue === '') return;
		if (!this.checkConstraints(this.inputValue)) return;

		if (this.multipleIsEnabled()) {
			if (Array.isArray(this.value)) {
				this.value.push(this.inputValue);
				this.changeEvent(this.value);
			} else if (!this.emptyValue(this.value))
				this.changeEvent([this.inputValue, this.value]);
			else this.changeEvent([this.inputValue]);
			this.inputValue = '';
		} else {
			this.changeEvent(this.inputValue);
		}
	}

	protected additionalConfigInit(): void {
		if (this.lazy !== true)
			this.handleDebouncedInput = _.debounce((): void => {
				if (!this.cfg)
					return Logger.dbgError(
						'TextInput: handleDebouncedInput: this.cfg is false',
						this
					);
				if (this.disabled || this.cfg.readonly) return;
				if (
					this.multipleIsEnabled() &&
					this.inputValue &&
					Array.isArray(this.value)
				)
					this.changeEvent([this.inputValue, ...this.value]);
				else this.changeEvent(this.inputValue);
			}, Js.defaultDebounceDelay);
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss" scoped>
@import './TextInputStyle';

.text-input {
	@include textInputProperties;
}
</style>
