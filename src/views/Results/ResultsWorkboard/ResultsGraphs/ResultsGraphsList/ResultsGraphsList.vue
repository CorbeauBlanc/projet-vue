<template>
	<div>
		<results-graph v-for="i in 3" :index="i - 1" :total="3" :key="i" />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResultsGraph from './ResultsGraph.vue';

@Component({
	components: {
		ResultsGraph,
	},
})
export default class ResultsGraphsList extends Vue {}
</script>

<style lang="scss" scoped>

</style>
