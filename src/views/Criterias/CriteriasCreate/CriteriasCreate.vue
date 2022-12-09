<template>
	<view-root id="criterias-create">
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'criterias' }">
					<icon long arrow left />Liste des critères
				</router-link>
				<span class="separator">
					<icon chevron right />
				</span>
				<span class="last">Créer un critère</span>
			</h2>
		</template>
		<template #content>
			<div class="container">
				<div class="segments">
					<div
						data-v-708d1fd1
						class="segment tabs alt navigation tertiary"
					>
						<div data-v-708d1fd1 class="menu">
							<tab name="fr" v-master="currentTab">
								<span class="flag country-fr"></span> Français
							</tab>
							<tab name="en" v-master="currentTab">
								<span class="flag country-gb"></span> Anglais
							</tab>
						</div>
					</div>
					<criterias-infos />
					<criterias-collection />
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import CriteriasCollection from '@/views/Criterias/CriteriasCollection/CriteriasCollection.vue';
import CriteriasInfos from '@/views/Criterias/CriteriasInfos/CriteriasInfos.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		CriteriasInfos,
		CriteriasCollection,
		ViewRoot,
		Tab,
	},
})
export default class CriteriasCreate extends Vue {
	protected currentTab: string = 'fr';
	protected tabs: Map<string, string> = new Map([
		['fr', ''],
		['en', ''],
	]);
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

</style>
