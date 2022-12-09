<template>
	<div class="stackable grid">
		<div class="twelve wide column">
			<div class="segments">
				<div class="segment header">Genre</div>
				<div class="segment">
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
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Graph from '@/components/Graph/Graph.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Graph,
	},
})
export default class ResultsSynthesisGender extends Vue {}
</script>

<style lang="scss" scoped>

</style>
