<template>
	<div>
		<gmap-map
			:center="{ lat: 0, lng: 0 }"
			:zoom="1"
			style="width: 600px; height: 400px"
			ref="map"
		>
			<gmap-cluster ref="cluster">
				<gmap-marker
					v-for="(marker, i) in markers"
					:key="i"
					:position="marker"
				/>
			</gmap-cluster>
		</gmap-map>
	</div>
</template>

<script lang="ts">
import Logger from '@/services/LoggerService';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class GoogleMap extends Vue {
	@Prop() public readonly markers!: google.maps.LatLngLiteral[];

	private markersNumber: number = -1;
	private clusterer!: MarkerClusterer;
	private map!: google.maps.Map;

	private readonly FR_BOUNDS!: google.maps.LatLngBounds;
	private readonly FR_FOCUS_RATIO: number = 0.8;

	@Watch('markers', { immediate: true })
	private onMarkersChange(val: google.maps.LatLngLiteral[]): void {
		this.markersNumber = val.length;
	}

	private mounted(): void {
		const mapRef: any = this.$refs['map'] as any;
		const clusterRef: any = this.$refs['cluster'] as any;

		(mapRef.$mapPromise as Promise<google.maps.Map>).then(
			(map: google.maps.Map): void => {
				this.map = map;
				(this.FR_BOUNDS as google.maps.LatLngBounds) =
					new google.maps.LatLngBounds(
						{ lat: 42.3, lng: -4.8 },
						{ lat: 51.1, lng: 8.25 }
					);

				(clusterRef.$clusterPromise as Promise<MarkerClusterer>).then(
					(clusterer: MarkerClusterer): void => {
						this.clusterer = clusterer;

						google.maps.event.addListenerOnce(
							this.clusterer,
							'clusteringend',
							(): void => {
								this.zoomOnFrance();
							}
						);
					}
				);
			}
		);
	}

	private setMaxClusterNEBounds(
		cluster: Cluster,
		northEastMax: google.maps.LatLngLiteral,
		index: number
	): void {
		const northEastCrd: google.maps.LatLng = cluster
			.getBounds()
			.getNorthEast();
		const neBounds: google.maps.LatLngLiteral = {
			lat: northEastCrd.lat(),
			lng: northEastCrd.lng(),
		};
		if (index === 0) {
			northEastMax.lat = neBounds.lat;
			northEastMax.lng = neBounds.lng;
		} else {
			if (neBounds.lat > northEastMax.lat)
				northEastMax.lat = neBounds.lat;
			if (neBounds.lng > northEastMax.lng)
				northEastMax.lng = neBounds.lng;
		}
	}

	private setMaxClusterSWBounds(
		cluster: Cluster,
		southWestMax: google.maps.LatLngLiteral,
		index: number
	): void {
		const southWestCrd: google.maps.LatLng = cluster
			.getBounds()
			.getSouthWest();
		const swBounds: google.maps.LatLngLiteral = {
			lat: southWestCrd.lat(),
			lng: southWestCrd.lng(),
		};

		if (index === 0) {
			southWestMax.lat = swBounds.lat;
			southWestMax.lng = swBounds.lng;
		} else {
			if (swBounds.lat < southWestMax.lat)
				southWestMax.lat = swBounds.lat;
			if (swBounds.lng < southWestMax.lng)
				southWestMax.lng = swBounds.lng;
		}
	}

	private zoomOnFrance(): void {
		const clusters: Cluster[] = this.clusterer.getClusters();
		if (!clusters.length)
			return Logger.dbgLog(
				'GoogleMap: zoomOnFrance: clusters.length is equal to 0',
				this
			);

		let foundOutOfFrance: boolean = false;
		let foundInFrance: number = 0;
		const northEastMax: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
		const southWestMax: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

		clusters.forEach((cluster: Cluster, index: number): void => {
			const center: google.maps.LatLng = cluster.getCenter();

			this.setMaxClusterNEBounds(cluster, northEastMax, index);
			this.setMaxClusterSWBounds(cluster, southWestMax, index);

			if (!this.FR_BOUNDS.contains(center)) foundOutOfFrance = true;
			else foundInFrance += cluster.getSize();
		});

		this.clusterer.resetViewport_();
		if (
			foundOutOfFrance &&
			foundInFrance / this.markersNumber >= this.FR_FOCUS_RATIO
		)
			this.map.fitBounds(this.FR_BOUNDS);
		else
			this.map.fitBounds(
				new google.maps.LatLngBounds(southWestMax, northEastMax)
			);
	}
}
</script>

<style lang="scss" scoped>

</style>
