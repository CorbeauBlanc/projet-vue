<template>
	<view-root id="homepage">
		<template #heading>
			<h2 class="title">Bienvenue</h2>
		</template>
		<template #content>
			<div class="container">
				<div class="grid stackable">
					<home-last-results />
					<home-user-credits />
				</div>
				<div class="grid stackable">
					<home-news />
					<home-testapic-tests />
				</div>
				<home-documents-links />
				<home-rss-feeds />
				<div class="segment empty state">
					<span class="emoji"></span>
					<h4>We need you !</h4>
					<p class="content">
						Nous comptons sur vous pour améliorer votre page
						d'accueil.
					</p>
					<p>
						Si vous souhaitez voir apparaitre certaines informations
						ici, faites-en part à votre CSM.
					</p>
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import HomeDocumentsLinks from './HomeDocumentsLinks.vue';
import HomeLastResults from './HomeLastResults/HomeLastResults.vue';
import HomeNews from './HomeNews.vue';
import HomeRssFeeds from './HomeRssFeeds.vue';
import HomeTestapicTests from './HomeTestapicTests.vue';
import HomeUserCredits from './HomeUserCredits.vue';

@Component({
	components: {
		ViewRoot,
		HomeLastResults,
		HomeUserCredits,
		HomeNews,
		HomeTestapicTests,
		HomeDocumentsLinks,
		HomeRssFeeds,
	},
})
export default class HomePage extends Vue {}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#homepage {
	flex-grow: 1;
	overflow-y: auto;
}
</style>
