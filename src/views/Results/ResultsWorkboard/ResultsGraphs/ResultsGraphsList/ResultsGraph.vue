<template>
	<div class="graph-component segments">
		<div class="segment task">
			<strong>{{ index + 1 }}/{{ total }}</strong>
			A propos de votre résidence principale, vous êtes...
		</div>
		<div class="segment graph">
			<div id="tags-button">
				<button class="button rounded icon">
					<icon tag />
				</button>
			</div>
			<div>
				<graph
					:options="{
						chart: {
							type: 'spline',
						},
						title: {
							text: 'Sin chart',
						},
						series: [
							{
								data: [10, 0, 5, 5],
								color: '#6fcd98',
							},
							{
								data: [8, 2, 6, 4],
								color: '#2a33d1',
							},
						],
					}"
				/>
			</div>
		</div>
		<div class="segment actions">
			<div id="graph-options">
				<number-input
					class="compact inline"
					:config="scaleInputConfig"
					v-model="scale"
				/>
			</div>
			<div id="graph-actions">
				<a>
					<icon edit />
				</a>
				<a>
					<icon export png />
				</a>
				<router-link
					:to="{
						name: 'result charts detail',
						params: { chartId: '42' },
					}"
				>
					<icon comment />
				</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Graph from '@/components/Graph/Graph.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		NumberInput,
		Graph,
	},
})
export default class ResultsGraph extends Vue {
	@Prop() public readonly index!: number;
	@Prop() public readonly total!: number;

	protected scaleInputConfig: InputConfig = {
		multiple: false,
		label: 'Echelle',
		constraints: {
			min: 0,
		},
	};

	protected scale: number[] = [100];
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.graph-component {
	.segment {
		&.graph {
			#tags-button {
				text-align: right;

				button {
					z-index: 1;
				}
			}
		}

		&.actions {
			display: flex;
			justify-content: space-between;

			.number-input {
				font-size: math.div($base-font-size, 1.2);

				label.label {
					font-weight: normal;
				}

				.field-container {
					width: 30%;

					input {
						font-size: math.div($base-font-size, 1.2);
					}
				}
			}

			#graph-actions {
				display: flex;
				align-items: center;

				a {
					margin: 0 math.div($padding, 2);
				}
			}
		}
	}
}
</style>
