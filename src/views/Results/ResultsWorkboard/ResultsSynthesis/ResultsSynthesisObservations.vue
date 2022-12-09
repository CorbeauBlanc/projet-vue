<template>
	<div class="stackable grid">
		<div class="twelve wide column container">
			<div class="segments">
				<fold-header class="segment header" active>
					<span>Résultats</span>
				</fold-header>
				<foldable class="segment">
					<div class="stackable grid">
						<div class="six wide column">
							<graph
								:options="{
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
								}"
							/>
						</div>
						<div class="six wide column">
							<graph
								:options="{
									title: {
										text:
											'Répartition des constats par localisation',
									},
									series: [
										{
											type: 'bar',
											stacking: 'normal',
											data: [10, 0, 5, 5],
											color: '#6fcd98',
										},
										{
											type: 'bar',
											stacking: 'normal',
											data: [8, 2, 6, 4],
											color: '#2a33d1',
										},
									],
								}"
							/>
						</div>
						<div class="twelve wide column aligned center">
							<button class="button">
								Voir tous les constats
							</button>
							<button class="button">Lire le compte-rendu</button>
						</div>
					</div>
				</foldable>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import Graph from '@/components/Graph/Graph.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		FoldHeader,
		Foldable,
		Graph,
	},
})
export default class ResultsSynthesisObservations extends Vue {}
</script>

<style lang="scss" scoped>

</style>
