<template>
	<div class="grid">
		<div class="eight wide column">
			<component
				v-for="(config, i) in valueConfig"
				:is="config.type"
				:config="config"
				:key="i"
				@change="emitValueChange(config.name, $event)"
			/>
		</div>
		<div class="two wide column" v-if="!autoDistribution">
			<number-input
				class="inline"
				:config="distributionConfig"
				@change="emitDistributionChange"
			/>
		</div>
		<div class="two wide column">
			<button class="button flat icon text red" @click="$emit('delete')">
				<icon delete />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import ColorInput from '@/components/Inputs/ColorInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import DateInput from '@/components/Inputs/DateInput/DateInput.vue';
import EmailInput from '@/components/Inputs/EmailInput.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import {
	Color,
	HslColor,
	HsvColor,
	InputConfig,
	InputOption,
	RgbaColor,
} from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import RangeInput from '@/components/Inputs/RangeInput.vue';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TelInput from '@/components/Inputs/TelInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import TimeInput from '@/components/Inputs/TimeInput.vue';
import WysiwygInput from '@/components/Inputs/WysiwygInput/WysiwygInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CheckboxInput,
		ColorInput,
		DatalistInput,
		DateInput,
		EmailInput,
		FileInput,
		NumberInput,
		RadiosInput,
		RangeInput,
		SelectInput,
		TelInput,
		TextInput,
		TimeInput,
		WysiwygInput,
	},
})
export default class CriteriaValue extends Vue {
	@Prop() public readonly autoDistribution!: boolean;
	@Prop() public readonly valueConfig!: InputConfig[];

	protected distributionConfig: InputConfig = {
		label: '%',
		constraints: {
			min: 0,
			max: 100,
		},
	};

	protected emitValueChange(
		name: string,
		payload:
			| string
			| InputOption
			| (string | InputOption)[]
			| boolean
			| number
			| (number | string)[]
			| HslColor
			| RgbaColor
			| HsvColor
			| Color
			| File[]
	): void {
		this.$emit(`valchange:${name}`, payload);
	}

	protected emitDistributionChange(amount: number): void {
		this.$emit('distribchange', amount);
	}
}
</script>

<style lang="scss" scoped>

</style>
