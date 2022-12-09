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
				<span class="last">Créer une société</span>
			</h2>
		</template>
		<template #content>
			<div class="tabs navigation secondary">
				<div class="menu">
					<tab name="informations" v-master="currentTab">
						<icon account box />Informations
					</tab>
					<tab name="offers" :disabled="true" v-master="currentTab">
						<icon puzzle />Offres
					</tab>
				</div>
			</div>
			<companies-infos />
			<div class="footer">
				<button class="button">Enregistrer</button>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import CompaniesInfos from '@/views/Companies/CompaniesInfos/CompaniesInfos.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		CompaniesInfos,
	},
})
export default class CompaniesCreate extends Vue {
	protected currentTab: string = 'informations';
}
</script>

<style lang="scss">

</style>
