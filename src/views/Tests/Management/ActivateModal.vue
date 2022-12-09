<template lang="pug">
	extends /src/components/Modal/ModalTemplate
	block header
		| {{ $t('Archiver') }}
	block content
		span
			| {{ `${$t('Souhaitez-vous vraiment activer')} ` }}
		strong
			| {{ title }}
		span.id
			| {{ id }}
		| ?
	block footer
		div
		div
			button.button.green(@click="confirm")
				| {{ $t('Activer') }}
			button.button.secondary(@click="cancel")
				| {{ $t('Fermer') }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ActivateModal extends Modal {
	@Prop() protected readonly id!: number;
	@Prop() protected readonly title!: string;

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'activate-modal';

	protected hidden: boolean = true;

	protected confirm(): void {
		this.$emit('activate');
		this.hide();
	}

	protected cancel(): void {
		this.hide();
	}
}
</script>

<style lang="scss">
#activate-modal {
	.content {
		text-align: left;
	}
}
</style>
