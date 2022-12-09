<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Archiver") }}
block content
	span.text.red
		| {{ `${$t("Souhaitez-vous vraiment archiver l'utilisateur ")} ` }}
	span.id
		| {{ id }}
	| ?
block footer
	div
	div
		button.button.red(@click='confirm')
			| {{ $t("Archiver") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Fermer") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class ArchiveTesterModal extends Modal {
	@Prop() protected readonly id!: number;

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'archive-modal';

	protected hidden: boolean = true;

	protected confirm(): void {
		this.$emit('archive');
		this.hide();
	}

	protected cancel(): void {
		this.hide();
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
