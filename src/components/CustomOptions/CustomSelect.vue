<template>
	<div class="select">
		<div class="cs-input-container">
			<slot name="before"></slot>
			<input
				ref="input"
				type="text"
				readonly
				:placeholder="placeholder"
				:name="name"
				:disabled="disabled"
				v-show="!hideInput"
				v-bind="constraints"
				v-model="userInput.text"
				@mousedown.prevent
				@mouseup="toggleFocus"
				@focus="emitFocus"
				@blur="emitBlur"
				@keyup.esc="$refs.input.blur"
				@keyup.enter="selectFocusedOption"
				@keyup.up="updateFocusedOption(-1)"
				@keyup.down="updateFocusedOption(1)"
			/>
			<div
				:class="`icon-container ${focused ? 'active' : ''}`"
				ref="iconContainer"
				@mousedown.prevent
				@mouseup="toggleFocus"
				@focus="emitFocus"
				@blur="emitBlur"
				:tabindex="hideInput ? 0 : ''"
			>
				<i
					v-if="!icon && !iconFocused"
					:class="`icon chevron ${focused ? 'up' : 'down'}`"
				></i>
				<i
					v-else
					:class="`icon ${
						focused ? iconFocused || icon : icon || 'chevron down'
					}`"
				></i>
			</div>
			<slot name="after"></slot>
		</div>
		<div
			class="cs-suggestions"
			v-show="focused"
			@mousemove="clearFocusedOption"
			@wheel="$emit('wheel', $event)"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import Logger from '@/services/LoggerService';
import _, { Dictionary } from 'lodash';
import {
	Component,
	Model,
	Prop,
	Ref,
	Vue,
	Watch,
} from 'vue-property-decorator';
import CustomOption from './CustomOption.vue';

/**
 * Components that aims to mimic the native select html input with additional
 * functionalities and configuration possibilities
 */
@Component({})
export default class CustomSelect extends Vue {
	public get type(): 'select' | 'datalist' {
		return this.pType;
	}

	@Prop() public readonly placeholder!: string;
	@Prop() public readonly name!: string;
	/**
	 * @public
	 * The value constraints, most of the usual attributes for the html imput are covered
	 */
	@Prop() public readonly constraints!: Dictionary<string | boolean | number>;
	/**
	 * @public
	 * The icon class for the icon at the right of the input
	 */
	@Prop() public readonly icon!: string;
	/**
	 * @public
	 * The icon class for the icon at the right of the input. This prop overload the `icon` prop
	 * when the input is focused, but is overloaded by `icon` when unfocused
	 */
	@Prop() public readonly iconFocused!: string;
	/**
	 * @public
	 * Is the input disabled. When disabled it won't accept any value changes, won't emit any event,
	 * won't check for value validity, and will have the "disabled" class
	 */
	@Prop() public readonly disabled!: boolean;
	/**
	 * @public
	 * Is the input read only. When in read only it will accept value changes from script but not from user,
	 * emit events, check for value validity, and have the "readonly" class.
	 */
	@Prop() public readonly readonly!: boolean;
	@Model('change') public readonly value!:
		| string
		| { text: string; value: string };

	/**
	 * @public
	 * A custom validation message (same functionnality as the html input)
	 */
	public validationMessage: string = '';
	public userInput: { text: string; value: string } = { text: '', value: '' };

	/**
	 * @public
	 * Is the incorporated html input hidden. Will only show the icon.
	 */
	@Attr() protected readonly hideInput!: boolean;

	@Ref() protected readonly input!: HTMLInputElement;
	@Ref() protected readonly iconContainer!: HTMLElement;
	protected readonly pType: 'select' | 'datalist' = 'select';
	protected focused: boolean = false;
	protected options: Map<string, CustomOption> = new Map();
	protected currentlyFocusedOption: string = '';

	/**
	 * Not for public use. Used by the CustomOptions to manage themselves in the component
	 */
	public pushNewOption(opt: CustomOption): void {
		this.options.set(opt.uid, opt);
	}
	/**
	 * Not for public use. Used by the CustomOptions to manage themselves in the component
	 */
	public removeOption(opt: CustomOption): void {
		this.options.delete(opt.uid);
	}
	/**
	 * Not for public use. Used by the CustomOptions to manage themselves in the component
	 */
	public numberOfVisibleOptions(): number {
		let ret: number = 0;
		this.options.forEach((option: CustomOption): void => {
			if (!option.isHidden()) ret++;
		});
		return ret;
	}

	/**
	 * @public
	 * Set the currently selected option and emits a change event
	 */
	public setSelected(val: string | { text: string; value: string }): void {
		if (this.disabled || this.readonly)
			return Logger.dbgLog(
				'CustomSelect: setSelected: this.disabled or this.readonly is true',
				this
			);
		this.setUserInput(val);

		if (this.focused) {
			this.toggleFocus();
			this.emitBlur();
		}
		this.$emit('change', val);
	}

	/**
	 * @public
	 * Check for the validity of the current value by using the `checkValidity` function of the html input
	 */
	public checkValidity(): boolean {
		if (this.disabled)
			return Logger.dbgLogRet(
				true,
				'CustomSelect: checkValidity: this.disabled is true',
				this
			);
		this.validationMessage = this.input.validationMessage;
		return this.input.checkValidity();
	}

	@Watch('value', { immediate: true })
	protected onValueChange(
		val: string | { text: string; value: string } | undefined
	): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CustomSelect: onValueChange: this.disabled is true',
				this
			);
		if (val === undefined) this.setUserInput('');
		else if (typeof val === 'string' && val !== this.userInput.value)
			this.setUserInput(val);
		else if (
			typeof val !== 'string' &&
			val.text !== this.userInput.text &&
			val.value !== this.userInput.value
		)
			this.setUserInput(val);
	}

	protected clearFocusedOption(): void {
		if (!this.options.size)
			return Logger.dbgLog(
				'CustomSelect: clearFocusedOption: this.options.size is 0',
				this
			);
		if (this.currentlyFocusedOption !== '') {
			let option: CustomOption | undefined;
			if (
				(option = this.options.get(this.currentlyFocusedOption)) !==
				undefined
			)
				option.isFocused = false;
			this.currentlyFocusedOption = '';
		}
	}

	protected updateFocusedOption(amount: number): void {
		if (!this.options.size || this.disabled)
			return Logger.dbgLog(
				'CustomSelect: updateFocusedOption: this.options.size is 0 or this.disabled is true',
				this
			);

		const keys: string[] = [...this.options.keys()];
		let index: number = keys.indexOf(this.currentlyFocusedOption) + amount;
		let validOption: CustomOption | undefined;
		for (let i: number = 0; i < 2; i++) {
			while (
				index < keys.length &&
				index >= 0 &&
				(validOption = this.options.get(keys[index]))?.isHidden()
			)
				index += amount;

			if (index >= keys.length || index < 0) {
				index -= amount;
				if ((validOption = this.options.get(keys[index]))?.isHidden())
					amount = -amount;
				else break;
			} else break;
		}

		this.clearFocusedOption();
		if (validOption) {
			validOption.isFocused = true;
			validOption.$el.scrollIntoView(false);
		}
		this.currentlyFocusedOption = keys[index];
	}

	protected selectFocusedOption(): void {
		if (
			this.currentlyFocusedOption !== '' &&
			!this.disabled &&
			!this.readonly
		) {
			this.options.get(this.currentlyFocusedOption)?.emitSelected();
			this.clearFocusedOption();
		}
	}

	protected setUserInput(
		val: string | { text: string; value: string }
	): void {
		if (typeof val === 'string') {
			this.userInput.value = val;
			this.userInput.text = val;
		} else {
			this.userInput.value = val.value;
			this.userInput.text = val.text;
		}
	}

	protected toggleFocus(): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CustomSelect: toggleFocus: this.disabled is true',
				this
			);
		if (!this.focused) {
			if (this.hideInput) this.iconContainer.focus();
			else this.input.focus();
		} else {
			if (this.hideInput) this.iconContainer.blur();
			else this.input.blur();
		}
	}

	protected emitFocus(): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CustomSelect: emitFocus: this.disabled is true',
				this
			);
		this.focused = true;
		this.$emit('focus');
	}

	protected emitBlur(): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CustomSelect: emitBlur: this.disabled is true',
				this
			);
		this.focused = false;
		this.clearFocusedOption();
		this.$emit('blur');
	}

	protected created(): void {
		if (!this.disabled && this.value !== undefined)
			this.setUserInput(this.value);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.select {
	input, .icon-container {
		cursor: pointer;
	}

	.cs-suggestions {
		overflow-y: auto;
		overflow-x: hidden;
		max-height: 200px;
		width: 100%;
		position: relative;

		@include z-index(selectize);
		@include scrollbar();
	}
}
</style>
