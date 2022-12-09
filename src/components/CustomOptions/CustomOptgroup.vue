<template>
	<div class="custom-optgroup" v-show="isInUserInput" :class="{ disabled }">
		<div class="custom-optgroup-label" @mousedown.prevent>{{ label }}</div>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import Logger from '@/services/LoggerService';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CustomDatalist from './CustomDatalist.vue';
import CustomSelect from './CustomSelect.vue';

/**
 * Component that aims to mimic the native option-group with additional
 * functionalities and configuration possibilities
 */
@Component({})
export default class CustomOptgroup extends Vue {
	/**
	 * @public
	 * The label of the group
	 */
	@Prop() public readonly label!: string;
	/**
	 * @public
	 * Is the group disabled
	 */
	@Prop({ default: false }) public readonly disabled!: boolean;

	/**
	 * private type used by the CustomOption component
	 */
	public type: string = 'optgroup';

	/**
	 * If the group is in a datalist, is it filtered
	 */
	protected isInUserInput: boolean = true;

	/**
	 * The current user text input of a potential CustomDatalist
	 */
	private userInput: { readonly text: string; readonly value: string } = {
		text: '',
		value: '',
	};
	/**
	 * All the content of the group that can be considered text (mostly the label of the options it contains)
	 */
	private textContent: string = '';
	private isInCustomSelect: boolean = true;

	/**
	 * If the group is in a CustomDatalist component, checks if the value of the current user text input
	 * matches the text content of the group
	 */
	@Watch('userInput', { deep: true })
	private onUserInputChange(val: { text: string; value: string }): void {
		if (this.isInCustomSelect)
			return Logger.dbgLog(
				'CustomOptgroup: onUserInputChange: this.isInCustomSelect is true',
				this
			);

		this.textContent = this.$el.textContent
			? this.$el.textContent.trim()
			: '';
		this.isInUserInput =
			this.textContent !== '' &&
			this.textContent.toLowerCase().includes(val.text.toLowerCase());
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
				'CustomOptgroup: created: getParent(this) returned undefined',
				this
			);

		this.isInCustomSelect = parent.type === 'select';
		this.userInput = parent.userInput;
	}

	private mounted(): void {
		this.textContent = this.$el.textContent
			? this.$el.textContent.trim()
			: '';
	}
}
</script>
