<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Retirer l’affectation") }}
block content
	i18n(path='Passer l’affectation du testeur en "{t}" ?')
		template(#t)
			strong
				| {{ $t("Affectation retirée") }}
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
export default class RemoveAffectModal extends Modal {
	protected readonly modalId: string = 'remove-affect-modal';
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