<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Modifier la rémunération") }}
block content
	div
		| {{ $t("Ancienne rémunération") }}
		strong {{ ` : ${oldPrice} €` }}
	div
		| {{ $t("Nouvelle rémunération") }}
		strong {{ ` : ${newPrice} €` }}
	p.hint 
		| {{ $t("Note : cette modification est uniquement valable pour les testeurs n’ayant pas terminé / validé ce test.") }}
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Valider la nouvelle rémunération") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class PriceModal extends Modal {
	@Prop() protected readonly oldPrice!: number;
	@Prop() protected readonly newPrice!: number;

	protected readonly modalId: string = 'price-modal';
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
