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
				<span class="last">Créer un utilisateur</span>
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
						:disabled="rightsDisabled"
						v-model="currentTab"
					>
						<icon lock />Droits / privilèges
					</tab>
				</div>
			</div>
			<users-infos />
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
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		Tab,
		UsersInfos,
	},
})
export default class UsersCreate extends Vue {
	protected currentTab: string = 'informations';
	protected rightsDisabled: boolean = true;
}
</script>

<style lang="scss">

</style>
