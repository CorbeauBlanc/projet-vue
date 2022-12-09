<template>
	<div class="grid stackable">
		<div class="twelve wide column container">
			<div class="segments">
				<fold-header class="segment header" active>
					<span>Contexte</span>
				</fold-header>
				<foldable class="segment empty state">
					<icon huge synthesis />
					<p class="content">Pas de données pour le moment</p>
					<button class="button">Ajouter la problématique</button>
				</foldable>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		FoldHeader,
		Foldable,
	},
})
export default class ResultsSynthesisContext extends Vue {}
</script>

<style lang="scss" scoped>

</style>
