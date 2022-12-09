<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Réaffecter les testeurs retirés") }}
block content
	i18n(path='Réaffecter les testeurs ayant une affectation en "{t}" ?', tag='p')
		template(#t)
			strong {{ $t("Affectation retirée") }}
	p.hint
		| {{ $t("Note : Une fois réaffectés, les testeurs recevront un email (comme s'il s'agissait de la première sollicitation).") }}
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Reaffecter") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component } from 'vue-property-decorator';

@Component({})
export default class ReassignModal extends Modal {
	protected readonly modalId: string = 'reassign-modal';
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
