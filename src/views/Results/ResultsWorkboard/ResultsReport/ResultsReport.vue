<template>
	<div id="results-report">
		<div class="container">
			<div class="heading secondary">
				<div class="left items">
					<h3 class="title">Compte rendu</h3>
				</div>
				<div class="right items">
					<button class="button">
						<icon play slides />Lancer la lecture
					</button>
					<button class="button ghost" @click="createNewSection">
						<icon add />Ajouter une section
					</button>
					<button class="button ghost icon">
						<icon file pdf />
					</button>
					<button class="button ghost icon">
						<icon settings />
					</button>
				</div>
			</div>
		</div>
		<div class="container section">
			<slideshow-workspace ref="slideshow" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SlideshowWorkspace from './SlideshowEditor/SlideshowWorkspace.vue';

@Component({
	components: {
		SlideshowWorkspace,
	},
})
export default class ResultsReport extends Vue {
	protected slideshow!: SlideshowWorkspace;

	protected createNewSection(): void {
		if (this.slideshow) this.slideshow.createNewSection();
	}

	private mounted(): void {
		this.slideshow = this.$refs['slideshow'] as SlideshowWorkspace;
	}
}
</script>

<style lang="scss" scoped>
</style>
