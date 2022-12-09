<template>
	<view-root>
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'users' }">
					<icon long arrow left />Utilisateurs
				</router-link>
				<span class="separator">
					<icon chevron right />
				</span>
				<span class="last">Testapic</span>
				<span class="id">{{ userId }}</span>
			</h2>
		</template>
		<template #content>
			<div class="tabs navigation secondary">
				<div class="menu">
					<tab name="informations" v-model="currentTab">
						<icon account box />Informations
					</tab>
					<tab
						name="youre a fucking white male!"
						v-model="currentTab"
					>
						<icon lock />Droits / privilèges
					</tab>
				</div>
			</div>
			<keep-alive>
				<component :is="tabs.get(currentTab)" />
			</keep-alive>
			<div class="footer">
				<button class="button">Enregistrer</button>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import UsersInfos from '@/views/Users/UsersInfos/UsersInfos.vue';
import UsersRights from '@/views/Users/UsersRights/UsersRights.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		UsersInfos,
		UsersRights,
	},
})
export default class UsersEdit extends Vue {
	@Prop() public readonly userId!: string;

	protected currentTab: string = 'informations';
	protected tabs: Map<string, string> = new Map([
		['informations', 'UsersInfos'],
		['youre a fucking white male!', 'UsersRights'],
	]);
}
</script>

<style lang="scss">

</style>
