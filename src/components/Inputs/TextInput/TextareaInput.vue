<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
include /src/components/Inputs/CustomInput/CustomInputMixins
block field
	.field-container
		textarea.field(:class='{ focused, disabled }'
            ref='input',
            v-model.trim='inputValue',
            v-bind='config.constraints',
            @keyup="$emit('text-input:keyup', inputValue.toString())",
            @keyup.enter='addToSelection',
            @keydown.delete='handleDelete',
            @focus='focused = true',
            @blur='focused = false',
            :external-id='config.externalId',
            :disabled='config.disabled',
            :name='config.name',
            :id='uid',
            :placeholder='config.translate ? $t(config.placeholder) : config.placeholder'
        )
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { InputOption, TextInputConfig } from '@/components/Inputs/InputsTypes';
import SelectedItem from '@/components/Inputs/SelectedItem.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
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
export default class TextareaInput<
	C extends TextInputConfig = TextInputConfig
> extends CustomInput<string | InputOption | (string | InputOption)[], C> {
	protected multipleIsDefault: boolean = true;
	protected inputValue: string | InputOption | undefined = '';
	protected readonly uidPrefix: string = 'textarea-';

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

	protected onModelValueChange(
		val: string | InputOption | (string | InputOption)[]
	): void {
		if (this.preventWatchFeedback) {
			this.preventWatchFeedback = false;
			return;
		}
		if (!this.multipleIsEnabled()) {
			if (this.emptyValue(val)) {
				this.inputValue = undefined;
				return;
			}
			this.setInputValue(val);
		} else if (!Array.isArray(val))
			this.changeEvent(val && val !== '' ? [val] : []);
	}

	protected setInputValue(
		val: string | InputOption | (string | InputOption)[]
	): void {
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
		if (
			this.inputValue === '' &&
			this.multipleIsEnabled() &&
			Array.isArray(this.value) &&
			this.value.length
		)
			this.removeFromSelection(this.value.length - 1);
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss" scoped>
@import './TextInputStyle';

.textarea-input {
	@include textInputProperties;

    .field {
        font-family: inherit;
		font-size: inherit;
    }
}
</style>
