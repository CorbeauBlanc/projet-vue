<template>
	<div class="verbatim">
		<div class="content task" v-if="data.task && taskReady">
			<results-task :data="data.task" standalone />
		</div>
		<div class="content answers">
			<div class="answer text sea-green" v-if="data.answer">
				<icon disc sea-green />
				<span>{{ data.answer }}</span>
			</div>
			<div v-else class="answer">&nbsp;</div>
		</div>
		<div class="content user" v-if="data.user">
			<div>
				<a>{{ data.user.name }}&nbsp;</a>
				<span class="id">{{ data.user.id }}</span>
			</div>
			<div class="text green">Réussite</div>
		</div>
		<div class="content actions">
			<div>
				<div v-if="data.status && !data.user">
					Statut&nbsp;:
					<strong class="text green">Réussite</strong>
				</div>
			</div>
			<div>
				<router-link
					class="button flat icon rounded"
					v-if="data.actions.includes('answers')"
					:to="{
						name: 'result user verbatims',
						params: { userId: 42 },
					}"
				>
					<icon verbatims />
				</router-link>
				<button
					class="button flat icon rounded"
					v-if="data.actions.includes('hide')"
				>
					<icon eye />
				</button>
				<button
					class="button icon rounded"
					@click="linkVerbatim"
					v-if="data.actions.includes('link')"
				>
					<icon tag />
				</button>
			</div>
		</div>
		<generic-selector
			v-if="selectEnabled"
			:value="id"
			v-model="selectModel.selectedVerbatims"
		/>
	</div>
</template>

<script lang="ts">
import GenericSelector from '@/components/GenericSelector/GenericSelector.vue';
import ComponentsUtils from '@/services/ComponentsUtils';
import Sidebars from '@/services/SidebarsService';
import {
	VerbatimData,
	VerbatimSelection,
} from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		GenericSelector,
	},
})
export default class Verbatim extends Vue {
	@Prop() public readonly data!: VerbatimData;
	@Prop() public readonly selectEnabled!: boolean;
	@Prop() public readonly selectModel!: VerbatimSelection;

	protected taskReady: boolean = false;
	protected id: string = '';

	protected linkVerbatim(): void {
		Sidebars.results.openSidebar();
	}

	protected created(): void {
		this.id = this.data.id;
	}

	private beforeCreate(): void {
		ComponentsUtils.loadComponentInComponent(
			this,
			'@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsTasksList/ResultsTask.vue',
			'ResultsTask'
		).then((): void => {
			this.taskReady = true;
		});
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.verbatim {
	display: flex;
	position: relative;
	flex-direction: column;
	background: $white;
	border-radius: $radius;
	border: $border-width solid $border-color;

	.content {
		flex: 0;
		margin: 0;
		padding: math.div($padding, 2);



		&:not(:first-child) {
			border-top: $border-width solid $border-color;
		}

		&.answers {
			flex-grow: 0;

			.answer {
				font-size: 0.7rem;

				i.icon.disc {
					margin-right: .5em;
				}

				&:not(:last-child) {
					margin-right: math.div($padding, 2);
				}
			}
		}

		&.user {
			margin-top: auto;
			display: flex;
			justify-content: space-between;

			.status {
				margin-left: auto;
			}
		}

		&.actions {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
