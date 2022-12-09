<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Retirer tous les non débutés") }}
block content
	i18n(path='Retirer les affectations avec le statut "{t}" ?', tag='p')
		template(#t)
			strong {{ $t("non débuté") }}
block footer
	div
	div
		button.button.red(@click='confirm')
			| {{ $t("Retirer") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component } from 'vue-property-decorator';

@Component({})
export default class NotstartedModal extends Modal {
	protected readonly modalId: string = 'not-started-modal';
	protected readonly keepalive: boolean = true;

	protected hidden: boolean = true;

	protected confirm(): void {
		this.$emit('confirm');
		this.hide();
	}

	protected cancel(): void {
		this.hide();
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

</style>
