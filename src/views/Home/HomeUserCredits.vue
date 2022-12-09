<template>
	<div class="four wide column">
		<div class="segments stretched" id="credits">
			<div class="segment header">Crédits Testapic</div>
			<div class="segment center aligned quota">
				<div class="stats">
					<div class="stat">
						<div class="number green text">
							<icon infinity />
						</div>
						<div class="title green text">Crédits illimités</div>
					</div>
				</div>
			</div>
			<div class="segment equivalence">
				<ul class="unstyled">
					<li class="icon tvideo">
						<strong>178</strong> vidéos commentés à voix haute
					</li>
					<li class="icon tform">
						<strong>536</strong> questionnaires contextualisés
					</li>
					<li class="icon tsurvey"><strong>1431</strong> sondages</li>
				</ul>
			</div>
			<div class="segment">
				<button class="button ghost inverted small">
					<icon add />Ajouter des crédits
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class HomeUserCredits extends Vue {}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#credits {
	background: $menu-background-color;

	.segment {
		background: $menu-background-color;
		color: $white;

		.number {
			.icon.infinity {
				margin-top: -$padding;
			}

			.icon:not(.infinity) {
				font-size: 3.5rem;
				height: auto;
				vertical-align: -10%;
			}
		}

		&.equivalence {

			ul {
				font-size: .8rem;
				color: #878C91;
				line-height: 2;

				li {
					.icon {
						font-size: .9rem;
						margin-right: math.div($padding, 4);
					}
				}
			}
		}
	}
}
</style>
