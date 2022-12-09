<template lang="pug">
		extends /src/components/Modal/ModalTemplate
		block header
			| Fusionner les constats
		block content
			.container.fluid
				.stackable.grid
					.six.wide.column
						datalist-input(:config="datalistConfig")/
					.six.wide.column
						text-input(:config="textConfig")/
		block footer
			div
			div
				button.button.disabled
					| Confirmer
				button.button.secondary(@click="close")
					| Fermer
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Modal from '@/components/Modal/Modal';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		DatalistInput,
		TextInput,
	},
})
export default class ResultsObservationsFusion extends Modal {
	protected datalistConfig: InputConfig = {
		label: 'Constat de référence',
		placeholder: 'Rechercher...',
		options: [
			{
				text: 'constat 1',
				value: '1',
			},
			{
				text: 'constat 2',
				value: '2',
			},
			{
				text: 'constat 3',
				value: '3',
			},
		],
	};

	protected textConfig: InputConfig = {
		label: 'Constats à rattacher',
		multiple: true,
	};
}
</script>
