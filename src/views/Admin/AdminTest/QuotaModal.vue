<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Modifier le quota") }}
block content
	div
		| {{ $t("Ancien quota") }}
		strong {{ ` : ${oldQuota}` }}
	div
		| {{ $t("Nouveau quota") }}
		strong {{ ` : ${newQuota}` }}
	p.hint 
		| {{ $t("Note : Il vous faudra relancer le moteur d’affectation (ciblage auto) pour que les testeurs ajoutés soient sollicités.") }}
	p.hint
		| {{ $t("Dans le cas d’un ciblage manuel, il vous faudra ajouter les nouveaux testeurs manuellement.") }}
block footer
	div
	div
		button.button(@click='confirm')
			| {{ $t("Valider le nouveau quota") }}
		button.button.secondary(@click='cancel')
			| {{ $t("Annuler") }}
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class QuotaModal extends Modal {
	@Prop() protected readonly oldQuota!: number;
	@Prop() protected readonly newQuota!: number;

	protected readonly modalId: string = 'quota-modal';
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
