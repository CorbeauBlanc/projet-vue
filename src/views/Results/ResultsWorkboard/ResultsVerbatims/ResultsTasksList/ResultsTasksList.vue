<template>
	<div class="section" id="tasks-list">
		<div
			id="checkbox-container"
			class="segment yellow"
			v-if="list.length > 0"
		>
			<checkbox-input
				:config="hideEmptyCheckbox"
				@change="hideEmpty = $event"
			/>
		</div>
		<div class="margin bottom">
			<button
				:class="{ hidden: nbActiveTasks < 1 }"
				class="button ghost small"
				@click="closeAllTasks"
			>
				Replier toutes les tâches
			</button>
		</div>
		<div>
			<results-task
				:ref="`task0`"
				:data="{
					index: 68,
					total: 420,
					content: '',
				}"
				:hide-empty="hideEmpty"
				:select-enabled="selectEnabled"
				:select-model="selectModel"
				@toggle="updateActiveTasks"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import { VerbatimSelection } from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { TaskData } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResultsTask from './ResultsTask.vue';

@Component({
	components: {
		ResultsTask,
		CheckboxInput,
	},
})
export default class ResultsTasksList extends Vue {
	@Prop() public readonly list!: TaskData[];
	@Prop() public readonly search!: string;
	@Prop() public readonly selectEnabled!: boolean;
	@Prop() public readonly selectModel!: VerbatimSelection;

	protected nbActiveTasks: number = 0;
	protected hideEmpty: boolean = false;

	protected hideEmptyCheckbox: InputConfig = {
		label: 'Masquer les réponses vides',
	};

	protected closeAllTasks(): void {
		for (let i: number = 0; i < this.list.length; i++) {
			const task: ResultsTask | undefined = this.$refs[
				`task${i}`
			] as ResultsTask;
			if (task) task.active = false;
		}
	}

	protected updateActiveTasks(value: boolean): void {
		this.nbActiveTasks += value ? 1 : -1;
		if (this.nbActiveTasks < 0) this.nbActiveTasks = 0;
		else if (this.nbActiveTasks > this.list.length)
			this.nbActiveTasks = this.list.length;
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

#tasks-list {

	#checkbox-container {
		padding: 0;

		.checkbox-input {
			.field {
				background: none;

				>label {
					margin-bottom: 0;
				}
			}
		}
	}
}
</style>
