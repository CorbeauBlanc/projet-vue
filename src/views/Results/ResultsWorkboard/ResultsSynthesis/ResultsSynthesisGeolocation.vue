<template>
	<div class="stackable grid">
		<div class="twelve wide column">
			<div class="segments">
				<div class="segment header">Géolocalisation</div>
				<div class="segment very compact">
					<google-map :markers="tmp" />
				</div>
				<div class="yellow segment">
					<p>
						<em>
							<strong>Note</strong> : Ces données ne concernent
							que les participants validés
						</em>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import GoogleMap from '@/components/GoogleMap/GoogleMap.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		GoogleMap,
	},
})
export default class ResultsSynthesisGeolocation extends Vue {
	public tmp: google.maps.LatLngLiteral[] = [
		{ lat: 48.7698403, lng: 2.2617509 },
		{ lat: 48.8934955, lng: 2.1089728 },
		{ lat: 48.8585799, lng: 2.2847017 },
		{ lat: 47.4178159, lng: -1.6344852 },
		{ lat: 45.8454077, lng: 2.1703277 },
		{ lat: 44.7943058, lng: -0.1307797 },
		{ lat: 43.5264742, lng: 5.2579968 },
		{ lat: 46.7922672, lng: -0.9541366 },
		{ lat: 48.822241, lng: 2.4062528 },
		{ lat: 43.6931912, lng: 0.658333 },
		{ lat: 47.5340147, lng: -0.4533086 },
		{ lat: 48.9008079, lng: 2.2553567 },
		{ lat: 48.6622037, lng: 2.2448341 },
		{ lat: 45.9018461, lng: 6.8012212 },
		{ lat: 39.399872, lng: -8.224454 },
		{ lat: 44.8391346, lng: -0.6867939 },
		{ lat: 49.2442751, lng: 4.0346212 },
		{ lat: 46.1705765, lng: 0.2729377 },
		{ lat: 44.151745, lng: 0.5446912 },
		{ lat: 49.1364797, lng: 6.1371111 },
		{ lat: 43.5667679, lng: 7.1224782 },
		{ lat: 43.4574538, lng: 1.2698475 },
		{ lat: 43.6589621, lng: 1.2987349 },
		{ lat: 50.5766743, lng: 4.7707367 },
		{ lat: 43.25424, lng: 5.3819969 },
	];
}
</script>

<style lang="scss" scoped>

</style>
