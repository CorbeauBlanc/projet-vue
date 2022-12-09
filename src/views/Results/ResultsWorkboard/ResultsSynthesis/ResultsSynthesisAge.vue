<template>
	<div class="stackable grid">
		<div class="twelve wide column">
			<div class="segments">
				<div class="segment header">Âge</div>
				<div class="segment">
					<div class="stats age">
						<div class="stat">
							<span class="number">419</span>
							<span class="title">Min</span>
						</div>
						<div class="stat main">
							<span class="number">420</span>
							<span class="title">Moyenne</span>
						</div>
						<div class="stat">
							<span class="number">421</span>
							<span class="title">Max</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ResultsSynthesisAge extends Vue {}
</script>

<style lang="scss" scoped>

</style>
