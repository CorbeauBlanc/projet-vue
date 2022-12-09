<template>
	<div class="six wide column">
		<div class="segments">
			<fold-header class="segment header" active>
				<span>Répartition des constats par localisation</span>
			</fold-header>
			<foldable class="segment">
				<graph :options="opt" />
				<div>
					Cliquez sur une valence pour filtrer le tableau ci-dessous
				</div>
			</foldable>
		</div>
	</div>
</template>

<script lang="ts">
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import Graph from '@/components/Graph/Graph.vue';
import { Options } from 'highcharts';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		FoldHeader,
		Foldable,
		Graph,
	},
})
export default class ObservationsLocalSpread extends Vue {
	protected opt: Options = {
		title: {
			text: 'Répartition des constats',
		},
		series: [
			{
				type: 'pie',
				innerSize: '85%',
				data: [10, 0, 8, 2, 6, 4, 5, 5],
				color: '#6fcd98',
			},
		],
	};
}
</script>

<style lang="scss" scoped>

</style>
