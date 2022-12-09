<template lang="pug">
	extends /src/components/Modal/ModalTemplate
	block content
		calendar(v-master="selectedDate")/
	block footer
		div
		div
			button.button(@click="selectToday")
				| {{ $t('Aujourd\'hui') }}
			button.button.ghost.red(@click="clearSelection")
				| {{ $t('Effacer') }}
			button.button.ghost(@click="hide")
				| {{ $t('Fermer') }}
		div
</template>

<script lang="ts">
import Calendar from '@/components/Calendar/Calendar.vue';
import Modal from '@/components/Modal/Modal';
import { Master } from '@/decorators';
import { Component } from 'vue-property-decorator';

/**
 * Custom modal containing a Calendar component, used by the DateInput component to select a date.
 */
@Component({
	components: {
		Calendar,
	},
})
export default class CalendarModal extends Modal {
	/**
	 * v-master directive for the selected date
	 */
	@Master('change') protected readonly selectedDate: string = '';

	/**
	 * See the declaration of `Modal` for more infos
	 */
	protected readonly keepalive: boolean = true;
	protected readonly noheader: boolean = true;

	protected hidden: boolean = true;

	/**
	 * @public
	 */
	protected selectToday(): void {
		this.$emit('change', new Date().toDateString());
	}

	/**
	 * @public
	 */
	protected clearSelection(): void {
		this.$emit('change', '');
	}
}
</script>
