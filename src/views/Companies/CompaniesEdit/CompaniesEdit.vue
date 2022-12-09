<template>
	<view-root>
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'companies' }">
					<icon long arrow left />Sociétés
				</router-link>
				<span class="separator">
					<icon chevron right />
				</span>
				<span class="last">Testapic</span>
				<span class="id">42069</span>
			</h2>
		</template>
		<template #content>
			<div class="tabs navigation secondary">
				<div class="menu">
					<tab name="informations" v-master="currentTab">
						<icon account box />
						<span>Informations</span>
					</tab>
					<tab name="offers" v-master="currentTab">
						<icon puzzle />
						<span>Offres</span>
					</tab>
				</div>
			</div>
			<keep-alive>
				<component :is="tabs.get(currentTab)" />
			</keep-alive>
			<div class="footer" v-if="currentTab === 'informations'">
				<button class="button">Enregistrer</button>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import CompaniesInfos from '@/views/Companies/CompaniesInfos/CompaniesInfos.vue';
import CompaniesOffers from '@/views/Companies/CompaniesOffers/CompaniesOffers.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		CompaniesInfos,
		CompaniesOffers,
	},
})
export default class CompaniesCreate extends Vue {
	protected currentTab: string = 'informations';
	protected tabs: Map<string, string> = new Map([
		['informations', 'CompaniesInfos'],
		['offers', 'CompaniesOffers'],
	]);

	private created(): void {
		if (this.$route.name === 'company offers') this.currentTab = 'offers';
	}
}
</script>

<style lang="scss">

</style>
