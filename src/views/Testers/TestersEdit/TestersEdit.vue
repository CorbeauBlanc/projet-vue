<template>
	<view-root>
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'testers' }">
					<icon long arrow left />Liste des testeurs
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
					<tab name="informations" v-model="currentTab">
						<icon account box />Informations
					</tab>
					<tab name="affectations" v-model="currentTab">
						<icon affectations />Affectations
					</tab>
					<tab name="bills" v-model="currentTab">
						<icon gain />Factures
					</tab>
					<tab name="kpi" v-model="currentTab"> <icon kpi />KPI </tab>
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
import TestersAffectations from '@/views/Testers/TestersAffectations/TestersAffectations.vue';
import TestersInfos from '@/views/Testers/TestersInfos/TestersInfos.vue';
import TestersKpi from '@/views/Testers/TestersKPI/TestersKPI.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		TestersInfos,
		TestersAffectations,
		TestersKpi,
	},
})
export default class TestersEdit extends Vue {
	protected currentTab: string = 'informations';
	protected tabs: Map<string, string> = new Map([
		['informations', 'TestersInfos'],
		['affectations', 'TestersAffectations'],
		['bills', ''],
		['kpi', 'TestersKpi'],
	]);

	protected created(): void {
		if (this.$route.name === 'tester affectations')
			this.currentTab = 'affectations';
	}
}
</script>

<style lang="scss">

</style>
