<template>
	<div>
		<div class="segment">
			<div class="stackable grid">
				<div class="four wide column">
					<text-input :config="nameInput" v-model="values.name" />
				</div>
				<div class="four wide column">
					<text-input :config="labelInput" v-model="values.label" />
				</div>
				<div class="four wide column">
					<datalist-input
						:config="companyInput"
						v-model="values.company"
					/>
				</div>
			</div>
		</div>
		<div class="segment checkbox-group">
			<checkbox-input
				:config="mandatoryInput"
				v-model="values.mandatory"
			/>
			<checkbox-input :config="displayInput" v-model="values.display" />
			<checkbox-input
				:config="managementInput"
				v-model="values.management"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CriteriasInfosFields } from './CriteriasInfosTypes';

@Component({
	components: {
		TextInput,
		DatalistInput,
		CheckboxInput,
	},
})
export default class CriteriasInfos extends Vue {
	protected nameInput: InputConfig = {
		label: 'Nom unique du critère',
		multiple: false,
	};
	protected labelInput: InputConfig = {
		label: 'Libellé du critère',
		multiple: false,
	};
	protected companyInput: InputConfig = {
		label: 'Société associée',
		options: [
			{
				text: 'Société 1',
				value: '1',
			},
			{
				text: 'Société 2',
				value: '2',
			},
			{
				text: 'Société 3',
				value: '3',
			},
		],
	};
	protected mandatoryInput: InputConfig = {
		label: 'Rendre la réponse obligatoire',
	};
	protected displayInput: InputConfig = {
		label: 'Afficher dans les critères de ciblage',
	};
	protected managementInput: InputConfig = {
		label: 'Gestion par intervalle des sous-critères de ciblage ',
	};
	protected values: CriteriasInfosFields = {
		name: '',
		label: '',
		company: '',
		mandatory: false,
		display: false,
		management: false,
	};
}
</script>

<style lang="scss" scoped>

</style>
