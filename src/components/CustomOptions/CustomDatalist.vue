<template>
	<div class="datalist">
		<div class="cd-input-container">
			<slot name="before"></slot>
			<input
				ref="input"
				type="text"
				v-model="userInput.text"
				v-bind="constraints"
				:placeholder="placeholder"
				:name="name"
				:disabled="disabled"
				:readonly="readonly"
				@focus="emitFocus"
				@blur="emitBlur"
				@input="emitInput"
				@keyup.enter="emitChange"
				@keyup.esc="$refs['input'].blur"
				@keyup.up="updateFocusedOption(-1)"
				@keyup.down="updateFocusedOption(1)"
			/>
			<i
				class="small icon close"
				@click="clear"
				v-show="userInput.text"
			></i>
			<slot name="after"></slot>
		</div>
		<div
			class="cd-suggestions"
			v-show="focused"
			@mousemove="clearFocusedOption"
			@wheel="$emit('wheel', $event)"
		>
			<button
				class="button fluid"
				v-show="strict === false && userInput.text"
				@mousedown="$emit('input:added', userInput.text)"
			>
				<icon class="icon add"/>
				{{ $t('Ajouter ') }}
				<strong>{{ userInput.text }}</strong>
			</button>

			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import { Component, Prop } from 'vue-property-decorator';
import CustomSelect from './CustomSelect.vue';

/**
 * Components that aims to mimic the native datalist html input with additional
 * functionalities and configuration possibilities
 */
@Component({})
export default class CustomDatalist extends CustomSelect {
	/**
	 * @public
	 * Will the datalist trigger a change event when the user presses the enter key, or on input change
	 */
	@Prop() public readonly lazy!: boolean;
	/**
	 * @public
	 * Will the datalist automatically lose focus on user input
	 */
	@Prop() public readonly autoblur!: boolean;
	@Prop() public readonly strict!: boolean;

	/**
	 * Private data used by the CustomOption component.
	 */
	protected readonly pType: 'select' | 'datalist' = 'datalist';

	/**
	 * @public
	 * Set the currently selected option and emits a change event
	 */
	public setSelected(val: string | { text: string; value: string }): void {
		if (this.disabled || this.readonly)
			return Logger.dbgLog(
				'CustomDatalist: setSelected: this.disabled or this.readonly is true',
				this
			);
		this.setUserInput(val);

		if (this.autoblur && this.focused) {
			this.toggleFocus();
			this.emitBlur();
		}

		this.$emit('change', val);
	}

	/**
	 * @public
	 * Clears the currently selected option and emits a change and input event
	 */
	public clear(): void {
		if (this.disabled || this.readonly)
			return Logger.dbgLog(
				'CustomDatalist: clear: this.disabled or this.readonly is true',
				this
			);
		this.setUserInput('');
		this.$emit('change', '');
		this.$emit('input', '');
	}

	/**
	 * TODO: Events emitions could be simplified but I can't be bothered rn
	 */

	protected emitDebouncedChange: () => void = () => 0;

	protected emitChange(): void {
		if (this.disabled || this.readonly)
			return Logger.dbgLog(
				'CustomDatalist: emitChange: this.disabled or this.readonly is true',
				this
			);
		this.clearFocusedOption();
		if (this.currentlyFocusedOption !== '') this.selectFocusedOption();
		else this.$emit('change', this.userInput.text);
	}

	protected created(): void {
		if (!this.disabled && this.value !== undefined)
			this.setUserInput(this.value);
		this.emitDebouncedChange = _.debounce(
			this.emitChange,
			Js.defaultDebounceDelay
		);
	}

	protected emitInput(): void {
		if (this.disabled || this.readonly)
			return Logger.dbgLog(
				'CustomDatalist: emitInput: this.disabled or this.readonly is true',
				this
			);
		this.clearFocusedOption();
		this.$emit('input', this.userInput.text);
		if (!this.lazy) this.emitDebouncedChange();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.datalist {
	.icon.close {
		line-height: unset;
		cursor: pointer;
	}

	.cd-suggestions {
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
