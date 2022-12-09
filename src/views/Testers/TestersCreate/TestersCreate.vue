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
				<span class="last">Créer un testeur</span>
			</h2>
		</template>
		<template #content>
			<div class="tabs navigation secondary">
				<div class="menu">
					<tab name="informations" v-model="currentTab">
						<icon account box />Informations
					</tab>
					<tab
						name="affectations"
						:disabled="true"
						v-model="currentTab"
					>
						<icon affectations />Affectations
					</tab>
					<tab name="bills" :disabled="true" v-model="currentTab">
						<icon gain />Factures
					</tab>
					<tab name="kpi" :disabled="true" v-model="currentTab">
						<icon kpi />KPI
					</tab>
				</div>
			</div>
			<testers-infos />
		</template>
	</view-root>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import TestersInfos from '@/views/Testers/TestersInfos/TestersInfos.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		TestersInfos,
	},
})
export default class TestersCreate extends Vue {
	protected readonly currentTab: string = 'informations';
}
</script>

<style lang="scss">

</style>
