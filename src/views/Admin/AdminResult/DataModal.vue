<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Relancer le calcul des données") }}
block content
	div
		span
			| {{ $t("Relancer le calcul de toutes les données récoltées sur tous les tests du résultat ?") }}
	div
		strong.hint
			| {{ $t("Note : Après validation, veuillez patienter environ 15 minutes.") }}
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Relancer") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component } from 'vue-property-decorator';

@Component({})
export default class DataModal extends Modal {
	protected readonly modalId: string = 'data-modal';
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