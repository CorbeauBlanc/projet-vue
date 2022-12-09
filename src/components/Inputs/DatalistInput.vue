<template lang="pug">
include /src/components/Inputs/CustomInput/CustomInputMixins
include /src/components/Inputs/SelectInput/SelectInputMixins

.datalist-input.field-component(
	v-if='cfg',
	:class='[validity, focused ? "focused" : undefined, cfg.constraints && cfg.constraints.required ? "required" : ""]',
	:style='{ height }'
)
	+label
	.field-container
		custom-datalist.field(
			ref='input',
			v-model='inputValue',
			:external-id='cfg.externalId',
			:id='uid',
			:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
			:class='{ focused, disabled, readonly, search: cfg.search }',
			:lazy='lazy',
			:name='cfg.name',
			:constraints='cfg.constraints',
			:readonly='cfg.readonly',
			:disabled='disabled',
			:autoblur='!multipleIsEnabled()',
			:strict='cfg.strict'
			@keydown.delete.native='handleDelete',
			@change='addToSelection',
			@input='handleInput',
			@focus='setFocused(true)',
			@blur='handleBlur()',
			@wheel='handleWheelEvent'
			@input:added="$emit('input:added', $event)",
		)
			+select-content
		+after
	+errors
	+hint
</template>

<script lang="ts">
import CustomDatalist from '@/components/CustomOptions/CustomDatalist.vue';
import CustomOptgroup from '@/components/CustomOptions/CustomOptgroup.vue';
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import HighlightedElement from '@/components/HighlightedElement/HighlightedElement.vue';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Trigger from '@/components/Trigger/Trigger.vue';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { GetListResponse, RESTOperation } from '@/types';
import { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { Component } from 'vue-property-decorator';
import { DatalistInputConfig, InputOption, InputType } from './InputsTypes';
import SelectedItem from './SelectedItem.vue';

/**
 * Datalist field. Uses the same type of values than SelectInput.
 */
@Component({
	components: {
		SelectedItem,
		CustomDatalist,
		CustomOption,
		CustomOptgroup,
		HighlightedElement,
		Tooltip,
		Trigger,
	},
})
export default class DatalistInput extends SelectInput<
	DatalistInputConfig<InputType.TEXT>
> {
	/**
	 * Variable storing the value of the input immediately, even if the field
	 * is `lazy` and the events are debounced
	 */
	protected undelayedInputValue: string = '';
	protected multipleIsDefault: boolean = true;
	protected readonly uidPrefix: string = 'datalist-';

	/**
	 * Like TextInput, if the field can select multiple values,
	 * it will remove the last value stored when the user presses
	 * the `backspace` key and the field is empty.
	 * @public
	 */
	protected handleDelete(event?: KeyboardEvent): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'DatalistInput: handleDelete: this.cfg is false',
				this
			);
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgWarn(
				'DatalistInput: handleDelete: this.disabled or this.cfg.readonly is true',
				this
			);
		if (
			this.undelayedInputValue === '' &&
			this.multipleIsEnabled() &&
			Array.isArray(this.value) &&
			this.value.length
		)
			this.removeFromSelection(this.value.length - 1);
	}

	/**
	 * Adds an input to the selected value
	 */
	protected addToSelection(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'DatalistInput: addToSelection: this.cfg is false',
				this
			);
		if (this.inputValue === undefined)
			return Logger.dbgWarn(
				'DatalistInput: addToSelection: this.inputValue is undefined',
				this
			);

		if (this.multipleIsEnabled() && this.inputValue === '') return;
		if (this.optionsPromise !== undefined) {
			this.optionsPromise.then((): void => {
				this.$nextTick().then(this.addToSelection);
			});
			return;
		}
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgWarn(
				'DatalistInput: addToSelection: this.disabled or this.cfg.readonly is true',
				this
			);

		if (typeof this.inputValue === 'string') {
			const option: string | InputOption = this.getOptionFromTxt(
				this.inputValue
			);
			if (option === this.inputValue && this.cfg.strict) return;
			this.inputValue = option;
		}
		this.undelayedInputValue = '';
		if (this.multipleIsEnabled()) this.clearRetrievedOptions();
		this.emitNewOptionsSelection();
	}

	/**
	 * Stores the input event payload and calls the debounced handler function
	 * for this event
	 */
	protected handleInput(undelayedInputValue: string): void {
		this.undelayedInputValue = undelayedInputValue;
		this.handleDebouncedInput();
	}

	/**
	 * Formats the params used to retrieve the options with an api call.
	 * @public
	 */
	protected setRetrieveOptionsParams(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'DatalistInput: setRetrieveOptionsParams: this.cfg is false',
				this
			);
		const rest: RESTOperation<GetListResponse> | undefined =
			this.cfg.rest?.options?.get;
		const keys: (string | string[])[] | undefined =
			this.cfg.rest?.options?.filterBy;
		if (!rest)
			return Logger.dbgError(
				'DatalistInput: setRetrieveOptionsParams: rest is false or undefined',
				this
			);

		if (rest?.config === undefined) rest.config = { params: {} };
		else rest.config = { params: {}, ...rest.config };
		const config: AxiosRequestConfig = rest.config;

		if (keys?.length) {
			if (this.undelayedInputValue === '')
				keys.forEach((key: string | string[]): void => {
					delete config.params[Array.isArray(key) ? key[0] : key];
				});
			else {
				keys.forEach((key: string | string[]): void => {
					if (Array.isArray(key))
						_.merge(
							config.params,
							Js.flatObjFromEntries(key, this.undelayedInputValue)
						);
					else config.params[key] = this.undelayedInputValue;
				});
			}
		}
		if (this.cfg.rest?.options?.page !== undefined)
			config.params['page'] = this.cfg.rest.options.page;
	}

	protected clearRetrievedOptions(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'DatalistInput: clearRetrievedOptions: this.cfg is false',
				this
			);
		if (
			this.cfg.rest?.options?.page !== undefined ||
			this.cfg.rest?.groupedOptions?.page !== undefined
		) {
			this.cfg.options = undefined;
			if (this.cfg.rest?.options?.page !== undefined)
				this.cfg.rest.options.page = 1;
			this.forceUpdate = true;
		}
	}

	protected additionalConfigInit(): void {
		this.handleDebouncedInput = this.lazy
			? _.debounce(this.clearRetrievedOptions, Js.defaultDebounceDelay)
			: this.clearRetrievedOptions;
	}

	/**
	 * Retrieves an option with its given text value.
	 */
	private getOptionFromTxt(txt: string): string | InputOption {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				'',
				'DatalistInput: getOptionFromTxt: this.cfg is false',
				this
			);
		if (this.cfg.options) {
			const opt: InputOption | undefined = (
				Array.isArray(this.cfg.options)
					? this.cfg.options
					: this.cfg.options()
			).find(
				(option: InputOption): boolean =>
					option.text?.toLowerCase() === txt.toLowerCase()
			);
			if (opt) return opt;
		}
		return txt;
	}

	protected handleWheelEvent(event: WheelEvent): void {
		if (
			(event.deltaY > 0 && this.triggerEntered === 'bottom') ||
			(event.deltaY < 0 && this.triggerEntered === 'top')
		) {
			this.fetchGroupsAndOptions();

			/**
			 * Smoother scroll when strict is false and displays a button on top of the suggestions
			 */

			if (!this.cfg) return;
			else if (
				this.triggerEntered === 'top' &&
				(this.cfg.strict || this.cfg.strict === undefined)
			) {
				event.preventDefault();
			}
		}
	}

	protected handleBlur(): void {
		this.$emit('blur');
		this.setFocused(false);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';
@import './SelectInput/SelectInputStyle';

.datalist-input {
	@include selectInputProperties;

	.cd-input-container {
		display: flex;
		flex-wrap: wrap;
		padding: 0 $fields-padding;
	}

	.cd-suggestions {
		.option {
			&:hover, &.focused {
				background: $hovered-item-bg;
			}
		}
	}
}
</style>
