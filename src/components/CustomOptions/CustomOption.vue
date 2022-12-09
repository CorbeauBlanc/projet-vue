<template>
	<div
		:class="{ option: true, disabled, focused }"
		v-show="isInUserInput"
		@mousedown.prevent
		@mouseup="emitSelected"
	>
		<slot>{{ label }}</slot>
	</div>
</template>

<script lang="ts">
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CustomDatalist from './CustomDatalist.vue';
import CustomOptgroup from './CustomOptgroup.vue';
import CustomSelect from './CustomSelect.vue';

/**
 * Component replacing the native "option" tag, to be used in pair with a CustomDatalist or a CustomSelect.
 */
@Component({})
export default class CustomOption extends Vue {
	public readonly uid: string = Js.uid;

	public get isFocused(): boolean {
		return this.focused;
	}

	public set isFocused(val: boolean) {
		this.focused = val;
	}
	/**
	 * The value of the option
	 */
	@Prop() public readonly value!: string;
	/**
	 * The text content of the option
	 */
	@Prop() public readonly label!: string;
	/**
	 * Is the option disabled
	 */
	@Prop({ default: false }) public readonly disabled!: boolean;

	/**
	 * If the option is in a datalist, is it filtered
	 */
	protected isInUserInput: boolean = true;
	protected focused: boolean = false;

	/**
	 * The current user text input of a potential CustomDatalist
	 */
	private userInput: { readonly text: string; readonly value: string } = {
		text: '',
		value: '',
	};
	/**
	 * The method the component will use to set its value in its parent input (i.e. a CustomSelect or a CustomDatalist)
	 */
	private setSelected!: (
		val: string | { text: string; value: string }
	) => void;
	/**
	 * All the content of the option that can be considered text (mostly its label)
	 */
	private textContent: string = '';
	private isInCustomSelect: boolean = true;

	/**
	 * @public
	 * Sets the value of the option as the currently selected value of its parent input
	 */
	public emitSelected(): void {
		if (this.disabled)
			return Logger.dbgLog(
				'CustomOption: emitSelected: this.disabled is true',
				this
			);
		const text: string = this.label ? this.label : this.textContent;
		if (this.value) this.setSelected({ text, value: this.value });
		else this.setSelected(text);
	}

	public isHidden(): boolean {
		return (this.$el as HTMLElement).style.display === 'none';
	}

	/**
	 * If the group is in a CustomDatalist component, checks if the value of the current user text input
	 * matches the text content of the group
	 */
	@Watch('userInput', { deep: true })
	private onUserInputChange(val: { text: string; value: string }): void {
		if (this.isInCustomSelect)
			return Logger.dbgLog(
				'CustomOption: onUserInputChange: this.isInCustomSelect is true',
				this
			);

		const text: string = this.label ? this.label : this.textContent;
		this.isInUserInput = text
			.toLowerCase()
			.includes(val.text.toLowerCase());
	}

	private getParent(root: Vue): CustomSelect | CustomDatalist | undefined {
		if (
			root.$parent === undefined ||
			(root.$parent as CustomSelect | CustomDatalist | CustomOptgroup)
				.type === 'select' ||
			(root.$parent as CustomSelect | CustomDatalist | CustomOptgroup)
				.type === 'datalist'
		)
			return root.$parent as CustomSelect | CustomDatalist | undefined;
		return this.getParent(root.$parent);
	}

	private created(): void {
		const parent: CustomSelect | CustomDatalist | undefined =
			this.getParent(this);
		if (!parent)
			return Logger.dbgError(
				'CustomOption: created: getParent(this) returned undefined',
				this
			);

		this.isInCustomSelect = parent.type === 'select';

		parent.pushNewOption(this);
		this.userInput = parent.userInput;
		this.setSelected = parent.setSelected;
	}

	private mounted(): void {
		this.textContent = this.$el.textContent
			? this.$el.textContent.trim()
			: '';
	}

	private beforeDestroy(): void {
		this.getParent(this)?.removeOption(this);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.option {
	cursor: pointer;
	overflow: hidden;
	padding: math.div($padding, 2.5);
}
</style>
