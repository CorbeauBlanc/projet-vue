<template>
	<div id="results-user-verbatims">
		<div class="container">
			<div class="heading secondary">
				<h3 class="title">
					<router-link :to="{ name: 'result verbatims' }">
						<icon long arrow left />Liste des verbatims </router-link
					>- Caroline GARY
				</h3>
				<div>
					<button class="button ghost green">
						<icon user validate />Valider
					</button>
					<button class="button flat green disabled">
						<icon user validated />Test validé
					</button>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="listing grid stackable">
				<div
					class="twelve wide column"
					v-for="verbatim in fullVerbatimsList"
					:key="verbatim.id"
				>
					<verbatim :data="verbatim" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Verbatim from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatims.vue';
import { VerbatimData } from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Verbatim,
	},
})
export default class ResultsUserVerbatims extends Vue {
	protected fullVerbatimsList: VerbatimData[] = [
		{
			id: '420',
			answer: 'bidon',
			actions: ['hide', 'link'],
			status: 'bidon',
			task: {
				index: 0,
				total: 5,
				content: '',
			},
		},
		{
			id: '421',
			actions: ['hide', 'link'],
			status: 'bidon',
			task: {
				index: 1,
				total: 5,
				content: '',
			},
		},
		{
			id: '422',
			answer: 'bidon',
			actions: ['hide', 'link'],
			status: 'bidon',
			task: {
				index: 2,
				total: 5,
				content: '',
			},
		},
		{
			id: '423',
			answer: 'bidon',
			actions: ['hide', 'link'],
			status: 'bidon',
			task: {
				index: 3,
				total: 5,
				content: '',
			},
		},
		{
			id: '424',
			actions: ['hide', 'link'],
			status: 'bidon',
			task: {
				index: 4,
				total: 5,
				content: '',
			},
		},
	];
}
</script>

<style lang="scss" scoped>

</style>
