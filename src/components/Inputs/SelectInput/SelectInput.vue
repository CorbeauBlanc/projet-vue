<template lang="pug">
include /src/components/Inputs/CustomInput/CustomInputMixins
include SelectInputMixins

.select-input.field-component(
	v-if='cfg',
	:class='[validity, focused ? "focused" : undefined, cfg.constraints && cfg.constraints.required ? "required" : ""]',
	:style='{ height }'
)
	+label
	.field-container
		custom-select.field(
			ref='input',
			v-model='inputValue',
			:class='{ focused, disabled, readonly }',
			:id='uid',
			:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
			:name='cfg.name',
			:disabled='disabled',
			:readonly='cfg.readonly',
			:constraints='cfg.constraints',
			:external-id='cfg.externalId',
			@change='addToSelection',
			@focus='setFocused(true)',
			@blur='setFocused(false)',
			@wheel='handleWheelEvent'
		)
			+select-content
		+after
	+errors
	+hint
</template>

<script lang="ts">
import CustomOptgroup from '@/components/CustomOptions/CustomOptgroup.vue';
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import CustomSelect from '@/components/CustomOptions/CustomSelect.vue';
import {
	InputGroup,
	InputOption,
	InputOptionProvider,
	InputOptionRest,
	InputType,
	SelectInputConfig,
} from '@/components/Inputs/InputsTypes';
import SelectedItem from '@/components/Inputs/SelectedItem.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Trigger from '@/components/Trigger/Trigger.vue';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { Component } from 'vue-property-decorator';

/**
 * Filter using a text input and a datalist.
 * Most of its interactions are identical to the TextInputFilter, which it inherits from.
 */
@Component({
	components: {
		SelectedItem,
		CustomSelect,
		CustomOption,
		CustomOptgroup,
		Tooltip,
		Trigger,
	},
})
export default class SelectInput<
	C extends SelectInputConfig<InputType.TEXT> = SelectInputConfig<InputType.TEXT>
> extends TextInput<C> {
	public forceUpdate: boolean = false;

	protected height: string = '';
	protected multipleIsDefault: boolean = false;
	protected readonly uidPrefix: string = 'select-';
	protected triggerEntered: 'top' | 'bottom' | undefined;
	protected retrievingOptions: boolean = false;
	protected optionsPromise: Promise<AxiosResponse<any>> | undefined;

	private pCurrentHeight: number = -1;
	protected get currentHeight(): number {
		if (this.pCurrentHeight < 0)
			this.pCurrentHeight = this.$el.getBoundingClientRect().height;
		return this.pCurrentHeight;
	}
	protected set currentHeight(val: number) {
		this.pCurrentHeight = val;
	}

	protected getCalcOptions(
		dest: {
			options?: InputOption[] | InputOptionProvider;
		},
		restConfig: InputOptionRest | undefined
	): InputOption[] {
		if (this.disabled) return [];
		let calcOptions: InputOption[];

		if (!dest.options) {
			dest.options = [];
			this.retrieveOptions(dest, restConfig);
			return [];
		} else if (!Array.isArray(dest.options)) {
			calcOptions = dest.options(this.triggerEntered);
			this.$nextTick().then((): void => {
				this.triggerEntered = undefined;
			});
		} else calcOptions = dest.options;
		if (this.multipleIsEnabled() && this.value)
			return calcOptions.filter((val: InputOption): boolean => {
				if (typeof this.value === 'string')
					return this.value !== val.value;
				else if (Array.isArray(this.value))
					return !this.value.some(
						(selected: string | InputOption): boolean =>
							typeof selected === 'string'
								? selected === val.value
								: selected.value === val.value
					);
				else return this.value.value !== val.value;
			});
		else return calcOptions;
	}

	/**
	 * Return the predefined values that have not been already selected
	 */
	protected get options(): InputOption[] {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				[],
				'SelectInput: get options: this.cfg is false',
				this
			);
		if (this.forceUpdate) this.forceUpdate = false;
		return this.getCalcOptions(this.cfg, this.cfg.rest?.options);
	}

	protected get groups(): InputGroup[] {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				[],
				'SelectInput: get groups: this.cfg is false',
				this
			);
		if (this.disabled) return [];
		let calcGroups: InputGroup[];

		if (this.forceUpdate) this.forceUpdate = false;
		if (!this.cfg.groupedOptions) {
			this.cfg.groupedOptions = [];
			this.retrieveGroups();
			return [];
		} else if (!Array.isArray(this.cfg.groupedOptions)) {
			calcGroups = this.cfg.groupedOptions(this.triggerEntered);
			this.$nextTick().then((): void => {
				this.triggerEntered = undefined;
			});
		} else calcGroups = this.cfg.groupedOptions;
		calcGroups.forEach((group: InputGroup): void => {
			this.getCalcOptions(group, group.rest?.options);
		});
		return calcGroups;
	}

	protected get triggersActive(): boolean {
		return (
			(this.groups.length > 0 || this.options.length > 0) &&
			this.hasVisibleOptions() &&
			!this.retrievingOptions
		);
	}

	protected hasVisibleOptions(): boolean {
		return this.$refs['input']
			? (this.$refs['input'] as CustomSelect).numberOfVisibleOptions() > 0
			: false;
	}

	protected setInputValue(
		val: string | InputOption | (string | InputOption)[]
	): void {
		if (this.disabled)
			return Logger.dbgLog(
				'SelectInput: setInputValue: this.disabled is true',
				this
			);
		if (Array.isArray(val)) val = val[0];
		if (typeof val !== 'string') this.inputValue = val;
		else this.inputValue = this.getOptionFromVal(val);
	}

	protected emitNewOptionsSelection(): void {
		if (this.disabled)
			return Logger.dbgLog(
				'SelectInput: emitNewOptionsSelection: this.disabled is true',
				this
			);
		if (this.multipleIsEnabled()) {
			if (!this.value) this.changeEvent([this.inputValue || '']);
			else if (Array.isArray(this.value)) {
				this.value.push(this.inputValue || '');
				this.changeEvent(this.value);
			} else this.changeEvent([this.inputValue || '', this.value]);
			this.$nextTick().then((): void => {
				this.inputValue = '';
			});
		} else this.changeEvent(this.inputValue);
	}

	protected addToSelection(): void {
		if (this.inputValue === undefined || this.disabled) return;
		this.emitNewOptionsSelection();
	}

	protected setFocused(val: boolean): void {
		if (this.disabled)
			return Logger.dbgLog(
				'SelectInput: setFocused: this.disabled is true',
				this
			);

		this.focused = val;
		if (!val) this.height = '';
		else {
			if (this.$el.getBoundingClientRect().height !== this.currentHeight)
				this.currentHeight = this.$el.getBoundingClientRect().height;
			this.height = `${this.currentHeight}px`;
		}
	}

	protected setRetrieveOptionsParams(restConfig: InputOptionRest): void {
		if (restConfig.get.config === undefined)
			restConfig.get.config = { params: {} };
		else restConfig.get.config = { params: {}, ...restConfig.get.config };
		if (restConfig.page !== undefined)
			restConfig.get.config.params['page'] = restConfig.page;
	}

	protected retrieveOptions(
		dest: { options?: InputOption[] | InputOptionProvider },
		restConfig?: InputOptionRest,
		appendResponse?: boolean
	): void {
		if (!restConfig)
			return Logger.dbgWarn(
				'SelectInput: retrieveOptions: restConfig is false or undefined',
				this
			);

		this.setRetrieveOptionsParams(restConfig);
		this.retrievingOptions = true;
		this.optionsPromise = Axios.get(
			restConfig.get.url,
			restConfig.get.config
		);
		this.optionsPromise
			.then((response: AxiosResponse<any>): void => {
				const data: InputOption[] = restConfig.get.promiseCallback
					? restConfig.get.promiseCallback(response).data
					: response.data;
				dest.options =
					appendResponse && Array.isArray(dest.options)
						? dest.options.concat(data)
						: data;
				this.optionsPromise = undefined;
				this.retrievingOptions = false;
				this.forceUpdate = true;
			})
			.catch((error: AxiosError): void => {
				this.optionsPromise = undefined;
				this.retrievingOptions = false;
				AxiosUtils.defaultErrorCatch(
					error,
					`${this.uid}: retrieveOptions: cannot retrieve options from ${restConfig.get.url}`
				);
			});
	}

	protected setRetrieveGroupsParams(restConfig: InputOptionRest): void {
		if (restConfig.get.config === undefined)
			restConfig.get.config = { params: {} };
		else restConfig.get.config = { params: {}, ...restConfig.get.config };
		if (restConfig.page !== undefined)
			restConfig.get.config.params['page'] = restConfig.page;
	}

	protected retrieveGroups(appendResponse?: boolean): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'SelectInput: retrieveGroups: this.cfg is false',
				this
			);
		const restConfig: InputOptionRest | undefined =
			this.cfg.rest?.groupedOptions;
		if (!restConfig)
			return Logger.dbgWarn(
				'SelectInput: retrieveGroups: restConfig is false or undefined',
				this
			);

		this.setRetrieveGroupsParams(restConfig);
		Axios.get(restConfig.get.url, restConfig.get.config)
			.then((response: AxiosResponse<any>): void => {
				if (!this.cfg)
					return Logger.dbgError(
						'SelectInput: retrieveGroups: this.cfg is false',
						this
					);
				const data: InputGroup[] = restConfig.get.promiseCallback
					? restConfig.get.promiseCallback(response).data
					: response.data;
				this.cfg.groupedOptions =
					appendResponse && Array.isArray(this.cfg.groupedOptions)
						? this.cfg.groupedOptions.concat(data)
						: data;
				this.forceUpdate = true;
			})
			.catch((error: AxiosError): void => {
				AxiosUtils.defaultErrorCatch(
					error,
					`${this.uid}: retrieveGroups: cannot retrieve groups from ${restConfig.get.url}`
				);
			});
	}

	protected handleWheelEvent(event: WheelEvent): void {
		if (
			(event.deltaY > 0 && this.triggerEntered === 'bottom') ||
			(event.deltaY < 0 && this.triggerEntered === 'top')
		) {
			this.fetchGroupsAndOptions();
			event.preventDefault();
		}
	}

	protected fetchGroupsAndOptions(): void {
		if (!this.cfg)
			return Logger.dbgError(
				'SelectInput: fetchGroupsAndOptions: this.cfg is false',
				this
			);
		if (!this.triggersActive)
			return Logger.dbgWarn(
				'SelectInput: fetchGroupsAndOptions: this.triggersActive is false or undefined',
				this
			);

		if (
			this.cfg.rest?.options?.get &&
			this.cfg.rest?.options.page !== undefined &&
			this.triggerEntered === 'bottom'
		) {
			this.cfg.rest.options.page++;
			this.retrieveOptions(this.cfg, this.cfg.rest.options, true);
		} else if (typeof this.cfg.options === 'function')
			this.forceUpdate = true;
		if (
			this.cfg.rest?.groupedOptions?.get &&
			this.cfg.rest?.groupedOptions.page !== undefined &&
			this.triggerEntered === 'bottom'
		) {
			this.cfg.rest.groupedOptions.page++;
			this.retrieveGroups(true);
		} else if (typeof this.cfg.groupedOptions === 'function')
			this.forceUpdate = true;
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}

	public refreshRestOptions(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'SelectInput: refreshRestOptions: this.cfg is false',
				this
			);
		this.cfg.options = undefined;
		this.cfg.groupedOptions = undefined;
		this.forceUpdate = true;
	}
}
</script>

<style lang="scss">
@import './SelectInputStyle';

.select-input {
	@include selectInputProperties;
}
</style>
