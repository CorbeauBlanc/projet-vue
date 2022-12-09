<template lang="pug">
	extends /src/components/Modal/ModalTemplate
	block header
		| {{ $t('Dupliquer') }}
	block content
		text-input(:config="nameConfig" :lazy="false" v-model="tmpName")/
	block footer
		div
		div
			button.button(@click="confirm")
				| {{ $t('Valider') }}
			button.button.secondary(@click="cancel")
				| {{ $t('Fermer') }}
</template>

<script lang="ts">
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Modal from '@/components/Modal/Modal';
import { Master } from '@/decorators';
import { Component } from 'vue-property-decorator';

@Component({
	components: {
		TextInput,
	},
})
export default class DuplicateModal extends Modal {
	@Master('change') protected get name(): string {
		return this.masterName;
	}
	protected set name(val: string) {
		this.masterName = val;
		this.tmpName = val;
	}

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'duplicate-modal';

	protected masterName: string = '';
	protected tmpName: string = '';
	protected hidden: boolean = true;

	protected nameConfig: InputConfig = {
		translate: true,
		label: 'Nouveau nom',
		multiple: false,
	};

	protected confirm(): void {
		this.$emit('change', this.tmpName);
		this.$emit('duplicate');
		this.hide();
	}

	protected cancel(): void {
		this.hide();
	}
}
</script>

<style lang="scss">
#duplicate-modal {
	.text-input {
		text-align: left;
	}
}
</style>
