<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate

//- Only overloading the `input` block
block input
	//- Input used to display the selected date with the configured format
	input(
		type='text',
		ref='input',
		v-if='!focused',
		@focus='focused = true',
		@mousedown.prevent,
		@mouseup='showModal',
		:external-id='cfg.externalId',
		:id='uid',
		:name='cfg.name',
		:readonly='cfg.readonly',
		:disabled='disabled',
		:value='formattedValue',
		:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
		:class='{ search: cfg.search }'
	)/
	//- Input used to enter a date only with the keyboard navigation
	input(
		type='date',
		ref='input',
		v-else,
		v-bind='cfg.constraints',
		@blur='focused = false',
		@mouseover='focused = false',
		@change='changeEvent($event.target.value)',
		:external-id='cfg.externalId',
		:readonly='cfg.readonly',
		:disabled='disabled',
		:id='uid',
		:name='cfg.name',
		:value='value',
		:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
		:class='{ search: cfg.search }'
	)/
	//- Calendar modal used to select a date with the mouse.
	calendar-modal(v-master='modelValue', ref='modal')
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { DateInputConfig } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component, Ref } from 'vue-property-decorator';
import CalendarModal from './CalendarModal.vue';

/**
 * Date field. Its values are formatted the same way the HTML date inputs format theirs.
 * For example '2020/01/01' for the 1st of January, 2020.
 */
@Component({
	components: {
		Tooltip,
		CalendarModal,
	},
})
export default class DateInput extends CustomInput<string, DateInputConfig> {
	/**
	 * A reference to the calendar modal
	 */
	@Ref() protected modal!: CalendarModal;

	/**
	 * See the declaration of `CustomInput` for more infos
	 */
	protected masterValue: string = '';
	protected readonly uidPrefix: string = 'date-';
	/**
	 * The default format used to display the selected date
	 */
	protected formatConfig: Intl.DateTimeFormatOptions = {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	};

	public emptyValue(val: string | undefined): boolean {
		return !val?.length;
	}

	/**
	 * If using single-value mode, close the calendar modal when a new value is entered
	 * @public
	 */
	protected onModelValueChange(): void {
		if (!this.modal?.isHidden) this.modal?.hide();
	}

	/**
	 * Returns the human-readable formatted value
	 * @public
	 */
	protected get formattedValue(): string {
		return this.value
			? new Date(this.value).toLocaleDateString(
					undefined,
					this.formatConfig
			  )
			: '';
	}

	protected emitChanges(value: string): void {
		this.$emit('change', value);
	}

	protected showModal(): void {
		if (!this.disabled && this.cfg && !this.cfg.readonly) this.modal.show();
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss" scoped>
@import '@/components/Inputs/TextInput/TextInputStyle';

.date-input {
	@include textInputProperties;
}
</style>
