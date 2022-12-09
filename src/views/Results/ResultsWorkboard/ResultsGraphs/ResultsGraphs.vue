<template>
	<div id="results-graphs">
		<div class="container">
			<div class="heading secondary">
				<h3 class="title">Liste des graphiques</h3>
			</div>
			<div class="heading secondary">
				<select-input
					id="test-selector"
					:config="testSelect"
					v-model="selectedTest"
				/>
			</div>
		</div>
		<results-graphs-list class="container" />
	</div>
</template>

<script lang="ts">
import { InputConfig, InputOption } from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResultsGraphsList from './ResultsGraphsList/ResultsGraphsList.vue';

@Component({
	components: {
		SelectInput,
		ResultsGraphsList,
	},
})
export default class ResultsGraphs extends Vue {
	protected testSelect: InputConfig = {
		options: [
			{
				text: 'test1',
				value: '1',
			},
			{
				text: 'test2',
				value: '2',
			},
			{
				text: 'test3',
				value: '3',
			},
		],
	};

	protected selectedTest: InputOption[] = [{ text: '', value: '1' }];
}
</script>

<style lang="scss">
/*#results-graphs {
	#test-selector {
		&.focused {
			max-height: 2.65rem;
		}
	}
}*/
</style>
