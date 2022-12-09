<template>
	<div>
		<div class="segment"></div>
		<div class="segment secondary">
			<h4>Collection</h4>
		</div>
		<div class="segment">
			<datalist-input :config="childrenInput" />
		</div>
		<div class="segment checkbox-group">
			<checkbox-input :config="singleInput" />
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CheckboxInput,
		DatalistInput,
	},
})
export default class CriteriasCollection extends Vue {
	protected childrenInput: InputConfig = {
		label: 'Critères enfants',
		options: [
			{
				text: 'Critère 1',
				value: '1',
			},
			{
				text: 'Critère 2',
				value: '2',
			},
			{
				text: 'Critère 3',
				value: '3',
			},
		],
	};
	protected singleInput: InputConfig = {
		label: 'Rendre la collection unique',
	};
}
</script>

<style lang="scss" scoped>

</style>
