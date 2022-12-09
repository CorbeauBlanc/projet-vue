<template>
	<div id="results-videos-synthesis">
		<div class="container">
			<div class="heading secondary filters alt">
				<h3 class="title">Synthèse des vidéos</h3>
				<router-link
					class="button"
					:to="{ name: 'result videos list' }"
				>
					<icon list alt />Liste des vidéos
				</router-link>
			</div>
		</div>
		<div class="container">
			<div class="grid stackable">
				<div class="twelve wide column">
					<div class="segments">
						<div class="header segment">Statistiques</div>
						<div class="segment">
							<div class="stats vertical">
								<div class="stat">
									<div class="title">Vidéos validées</div>
									<div class="number">33/30</div>
								</div>
								<div class="stat">
									<div class="title">Quota attendu</div>
									<div class="number"></div>
								</div>
								<div class="stat">
									<div class="title">Echecs</div>
									<div class="number">0%</div>
								</div>
								<div class="stat">
									<div class="title">Temps moyen</div>
									<div class="number">00:00:00</div>
								</div>
								<div class="stat">
									<div class="title">Temps total</div>
									<div class="number">00:00:00</div>
								</div>
							</div>
						</div>
						<div class="segment">
							<div class="stats vertical">
								<div class="stat">
									<div class="title">
										1
										<sup>ère</sup> vidéo reçue le
									</div>
									<div class="number">
										26 Avril 2017 à 14:57
									</div>
								</div>
								<div class="stat">
									<div class="title">
										Dernière vidéo reçue le
									</div>
									<div class="number">1 Mai 2017 à 20:59</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="twelve column wide column">
					<div class="segments">
						<div class="header segment">
							Dernières vidéos reçues
						</div>
						<div class="segment">
							<div id="last-videos" class="four column grid">
								<div
									class="column middle aligned thumbnail"
									v-for="video in lastVids"
									:key="video.id"
								>
									<div>
										<router-link
											class="overlay"
											:to="{
												name: 'result videos detail',
												params: { affectation_id: video.id },
											}"
										>
											<icon play big />
											<span
												>{{ video.tester }} ({{
													video.duration
												}})</span
											>
										</router-link>
										<img :src="video.thumbnail" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { LastVideo } from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ResultsVideosSynthesis extends Vue {
	protected lastVids: LastVideo[] = [
		{
			id: '1',
			thumbnail: '/video1.png',
			duration: '00:04:12',
			tester: 'Arthur LORRAIN',
		},
		{
			id: '2',
			thumbnail: '/video2.png',
			duration: '00:04:12',
			tester: 'Arthur LORRAIN',
		},
		{
			id: '3',
			thumbnail: '/video3.png',
			duration: '00:04:12',
			tester: 'Arthur LORRAIN',
		},
		{
			id: '4',
			thumbnail: '/video4.png',
			duration: '00:04:12',
			tester: 'Arthur LORRAIN',
		},
	];
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

#last-videos {
	height: 24vh;

	.thumbnail {
		height: 100%;

		&>div {
			position: relative;
			overflow: hidden;
			height: 100%;
			min-height: 100%;
			border-radius: $radius;

			&:hover {
				.overlay {
					opacity: 1;
				}
			}

			.overlay {
				display: flex;
				position: absolute;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background: rgba(white, .9);
				box-shadow: 0 0 80px 0 inset rgba(0, 0, 0, 0.3), 0 0 0 2px $primary-color inset;
				opacity: 0;
				transition: opacity $normal-speed;
				width: 100%;
				height: 100%;
				border-radius: $radius;
			}

			img {
				border-radius: $radius;
				max-width: 100%;
			}
		}
	}
}
</style>
