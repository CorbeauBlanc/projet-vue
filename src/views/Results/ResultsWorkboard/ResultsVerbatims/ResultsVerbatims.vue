<template>
	<div id="results-verbatims">
		<div class="container fluid">
			<div class="heading secondary">
				<div class="title">Liste des verbatims</div>
			</div>
			<div class="heading secondary">
				<div>
					<select-input :config="testSelect" v-model="selectedTest" />
				</div>
				<div>
					<text-input :config="searchInput" v-model="searched" />
					<button class="button icon">
						<icon export file />
					</button>
				</div>
			</div>
		</div>
		<results-tasks-list
			class="container fluid"
			:list="tasksList"
			:select-enabled="selectEnabled"
			:select-model="selectModel"
		/>
		<div class="footer">
			<div>
				<button
					:class="[
						'button',
						selectEnabled ? 'green' : 'primary ghost',
						selectEnabled &&
						selectModel.selectedVerbatims.length < 1
							? 'disabled'
							: '',
					]"
					@click="handleSelectionMode"
				>
					<icon tags />
					{{
						`Associer ${
							selectEnabled
								? selectModel.selectedVerbatims.length
								: 'plusieurs'
						} sources à un constat`
					}}
				</button>
				<button
					v-if="selectEnabled"
					class="button"
					@click="cancelSelection"
				>
					Annuler
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { InputConfig, InputOption } from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Sidebars from '@/services/SidebarsService';
import { TaskData } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResultsTasksList from './ResultsTasksList/ResultsTasksList.vue';
import { VerbatimSelection } from './ResultsVerbatimsTypes';

@Component({
	components: {
		SelectInput,
		TextInput,
		ResultsTasksList,
	},
})
export default class ResultsVerbatims extends Vue {
	protected selectEnabled: boolean = false;
	protected selectModel: VerbatimSelection = { selectedVerbatims: [] };
	protected tasksList: TaskData[] = [
		{ id: '69', timeStamp: 420, html: '', index: -1 },
	];

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
	protected searchInput: InputConfig = {
		placeholder: 'Rechercher par mot clé...',
		multiple: false,
		search: true,
	};

	protected selectedTest: InputOption[] = [{ text: '', value: '1' }];
	protected searched: string[] = [''];

	protected handleSelectionMode(): void {
		if (!this.selectEnabled) this.selectEnabled = true;
		else if (this.selectModel.selectedVerbatims.length)
			Sidebars.results.openSidebar();
	}

	protected cancelSelection(): void {
		this.selectEnabled = false;
		this.selectModel.selectedVerbatims = [];
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results-verbatims {
	position: relative;

	/*.select-input.focused {
		max-height: 2rem;
	}*/

	.text-input {
		display: inline-block;
		vertical-align: middle;
		margin-right: math.div($padding, 2);
	}
}
</style>
