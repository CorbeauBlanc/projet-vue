<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Affecter de nouveaux testeurs (Ciblage auto uniquement)") }}
block content
	i18n(
		path='Affecter des testeurs supplémentaires au précédent ciblage auto (critères identiques) et leur {t} ?'
	)
		template(#t)
			strong.text.red {{ $t("envoyer un email") }}
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Affecter") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component } from 'vue-property-decorator';

@Component({})
export default class AssignModal extends Modal {
	protected readonly modalId: string = 'assign-modal';
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
