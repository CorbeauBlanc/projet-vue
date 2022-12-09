<template>
	<div id="results-synthesis">
		<div class="container">
			<results-synthesis-context />
			<results-synthesis-observations />
		</div>
		<div class="container">
			<div class="stackable grid">
				<div class="four wide column">
					<results-synthesis-gender />
					<results-synthesis-age />
					<results-synthesis-device />
				</div>
				<div class="eight wide column">
					<results-synthesis-geolocation />
				</div>
				<div class="twelve wide column center aligned">
					<div class="segment">
						<router-link
							class="button"
							:to="{ name: 'result testers' }"
							>Liste des participants</router-link
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ResultsSynthesisAge from './ResultsSynthesisAge.vue';
import ResultsSynthesisContext from './ResultsSynthesisContext.vue';
import ResultsSynthesisDevice from './ResultsSynthesisDevice.vue';
import ResultsSynthesisGender from './ResultsSynthesisGender.vue';
import ResultsSynthesisGeolocation from './ResultsSynthesisGeolocation.vue';
import ResultsSynthesisObservations from './ResultsSynthesisObservations.vue';

@Component({
	components: {
		ResultsSynthesisContext,
		ResultsSynthesisObservations,
		ResultsSynthesisGender,
		ResultsSynthesisAge,
		ResultsSynthesisDevice,
		ResultsSynthesisGeolocation,
	},
})
export default class ResultsSynthesis extends Vue {}
</script>

<style lang="scss">
#results-synthesis {
	.segment.header {
		display: flex;
		justify-content: space-between;
	}
}
</style>
