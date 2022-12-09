<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block input
	input(
		type='number',
		ref='input',
		v-model='inputValue',
		v-bind='cfg.constraints',
		@input='handleDebouncedInput',
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
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import { Component } from 'vue-property-decorator';
import { InputOption, InputType, NumberInputConfig } from './InputsTypes';
import SelectedItem from './SelectedItem.vue';
import TextInput from './TextInput/TextInput.vue';

@Component({
	components: {
		SelectedItem,
		Tooltip,
	},
})
export default class NumberInput extends TextInput<
	NumberInputConfig<InputType.TEXT>
> {
	protected readonly uidPrefix: string = 'number-';
	protected multipleIsDefault: boolean = false;
	protected inputValue: string | undefined = '';
	protected emitDebouncedChange: (() => void) | 0 = 0;

	public emptyValue(
		val:
			| number
			| string
			| InputOption
			| (InputOption | number | string)[]
			| undefined
	): boolean {
		if (typeof val === 'number') return false;
		else if (val === undefined) return true;
		else if (typeof val === 'string' || Array.isArray(val)) {
			if (!val.length) return true;
		} else if (val.text === '' && val.value === '') return true;
		return false;
	}

	protected changeEvent(
		payload?:
			| number
			| string
			| InputOption
			| (InputOption | number | string)[]
	): void {
		if (this.disabled)
			return Logger.dbgLog(
				'NumberInput: changeEvent: this.disabled is true',
				this
			);

		if (payload && payload !== '') this.preventWatchFeedback = true;
		this.$emit(CustomInput.mutationEvent, payload);
	}

	protected setInputValue(
		val: number | string | InputOption | (InputOption | number | string)[]
	): void {
		if (Array.isArray(val)) val = val[0];
		if (typeof val === 'string' || typeof val === 'number')
			this.inputValue = val.toString();
		else this.inputValue = val.text;
	}

	/**
	 * Adds the value of the input to the array of selected values.
	 * @public
	 */
	protected addToSelection(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'NumberInput: addToSelection: this.cfg is false',
				this
			);
		if (this.lazy !== true)
			return Logger.dbgWarn(
				'NumberInput: addToSelection: this.lazy !== true',
				this
			);
		if (this.inputValue === undefined)
			return Logger.dbgWarn(
				'NumberInput: addToSelection: this.inputValue is undefined',
				this
			);
		if (this.cfg.readonly || this.disabled)
			return Logger.dbgWarn(
				'NumberInput: addToSelection: this.disabled or this.cfg.readonly is true',
				this
			);
		if (this.multipleIsEnabled() && this.inputValue === undefined) return;
		if (!this.checkConstraints(this.inputValue))
			return Logger.dbgWarn(
				'NumberInput: addToSelection: this.checkConstraints(this.inputValue) returned false',
				this
			);

		if (this.multipleIsEnabled()) {
			if (Array.isArray(this.value)) {
				this.value.push(this.inputValue);
				this.changeEvent(this.value);
			} else if (!this.emptyValue(this.value))
				this.changeEvent([
					Number.parseInt(this.inputValue),
					this.value,
				]);
			else this.changeEvent([Number.parseInt(this.inputValue)]);
			this.inputValue = '';
		} else this.changeEvent(Number.parseInt(this.inputValue));
	}

	protected additionalConfigInit(): void {
		if (this.lazy !== true)
			this.handleDebouncedInput = _.debounce((): void => {
				if (!this.cfg)
					return Logger.dbgWarn(
						'NumberInput: handleDebouncedInput: this.cfg is false',
						this
					);
				if (this.cfg.readonly || this.disabled)
					return Logger.dbgWarn(
						'NumberInput: additionalConfigInit: this.disabled or this.cfg.readonly is true',
						this
					);
				if (
					this.multipleIsEnabled() &&
					this.inputValue &&
					Array.isArray(this.value)
				)
					this.changeEvent([
						Number.parseInt(this.inputValue),
						...this.value,
					]);
				else
					this.changeEvent(
						this.inputValue !== undefined
							? Number.parseInt(this.inputValue)
							: undefined
					);
			}, Js.defaultDebounceDelay);
	}
}
</script>

<style lang="scss" scoped>
@import './TextInput/TextInputStyle';

.number-input {
	@include textInputProperties;
}
</style>
