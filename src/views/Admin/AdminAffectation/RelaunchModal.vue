<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Lancer / Relancer le processing") }}
block content
	| {{ $t("Relancer le processing de la vidéo présente sur l’affectation ?") }}
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
export default class RelaunchModal extends Modal {
	protected readonly modalId: string = 'relaunch-modal';
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