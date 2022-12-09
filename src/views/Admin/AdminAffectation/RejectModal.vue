<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Refuser le testeur") }}
block content
	p
		| {{ $t("Forcer le refus du testeur à ce test, même si celui-ci est déjà validé ?") }}
	p.hint
		| {{ $t("Note : Attention, cela n’enverra pas d’email de refus à l’utilisateur.") }}
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
export default class RejectModal extends Modal {
	protected readonly modalId: string = 'reject-modal';
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