<template lang="pug">
	extends /src/components/Modal/ModalTemplate
	block header
		| {{ $t('Suppression d\'une langue') }}
	block content
		span
			| {{ $t('Confirmez-vous la suppression de la langue') }}
		strong
			|  {{ $t(tabToDelete) }}
		|  ?
	block footer
		div
		div
			button.button.red(@click="confirm")
				| {{ $t('Supprimer') }}
			button.button.secondary(@click="cancel")
				| {{ $t('Annuler') }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component } from 'vue-property-decorator';

@Component({})
export default class DeleteLangModal extends Modal {
	protected readonly modalId: string = 'delete-lang-modal';
	protected readonly keepalive: boolean = true;

	protected hidden: boolean = true;

	protected tabToDelete: string = '';

	protected onShow(tab: string): void {
		this.tabToDelete = tab;
	}

	protected confirm(): void {
		this.hide(true);
	}

	protected cancel(): void {
		this.hide(false);
	}
}
</script>

<style lang="scss">
#archive-modal {
	.content {
		text-align: left;
	}
}
</style>
