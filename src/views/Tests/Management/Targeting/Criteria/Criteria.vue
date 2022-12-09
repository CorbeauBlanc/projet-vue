<template>
	<div class="criteria segments">
		<div class="segment" :style="`border-top: 5px solid ${color};`">
			<div class="grid middle aligned">
				<div class="one wide column">
					<strong :style="{ color }">Critère #{{ index }}</strong>
				</div>
				<div class="seven wide column">
					<datalist-input :config="typeConfig" />
				</div>
				<div class="two wide column">
					<checkbox-input :config="excludeConfig" />
				</div>
				<div class="two wide column">
					<button
						class="button flat icon text red"
						@click="$emit('delete')"
					>
						<icon delete />
					</button>
				</div>
			</div>
		</div>
		<div class="segment">
			<div class="grid">
				<div class="eight wide column">
					<strong>Valeur</strong>
				</div>
				<div class="two wide column">
					<strong>Répartition</strong>
				</div>
			</div>
			<div>
				<criteria-value
					:auto-distribution="false"
					:value-config="valuesConfigs"
				/>
			</div>
			<div>
				<checkbox-input :config="userDistributionConfig" />
			</div>
			<div>
				<button class="button small">Ajouter une valeur</button>
			</div>
		</div>
		<div class="segment secondary">
			<strong>420</strong> testeurs potentiels
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig, InputType } from '@/components/Inputs/InputsTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import CriteriaValue from './CriteriaValue/CriteriaValue.vue';

@Component({
	components: {
		CheckboxInput,
		DatalistInput,
		CriteriaValue,
	},
})
export default class Criteria extends Vue {
	// @Prop() public readonly data!: any
	@Prop() public readonly color!: string;
	@Prop() public readonly index!: number;

	protected valuesConfigs: InputConfig[] = [
		{
			type: InputType.TEXT,
			multiple: false,
		},
	];

	protected typeConfig: InputConfig = {
		multiple: false,
		/* rest: {
			options: {},
		} */
	};

	protected excludeConfig: InputConfig = {
		label: 'Exclure',
		help: 'Les testeurs correspondants à ce critère ne seront pas sollicités',
	};

	protected userDistributionConfig: InputConfig = {
		label: 'Sélectionner les répartitions en %',
	};
}
</script>

<style lang="scss" scoped>

</style>
