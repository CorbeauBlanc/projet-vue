<template>
	<div class="container">
		<div class="segments">
			<div class="segment">
				<div class="stackable grid">
					<div class="four wide column tabs navigation tertiary">
						<div class="menu vertical">
							<tab
								v-for="(tab, i) in informationsTab"
								:key="i"
								:name="tab[0]"
								:disabled="tab[1].disabled"
								v-model="currentTab"
							>
								{{ tab[1].text }}
							</tab>
							<progress-bar class="item" v-model="progress">
								Taux de completion du profil :
							</progress-bar>
						</div>
					</div>
					<div class="eight wide column">
						<keep-alive>
							<component
								:is="informationsTab.get(currentTab).component"
							/>
						</keep-alive>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import Tab from '@/components/Tab/Tab.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TestersInfosPerso from './TestersInfosPerso.vue';

type _InfoTab = {
	component: string;
	text: string;
	disabled: boolean;
};

@Component({
	components: {
		Tab,
		ProgressBar,
		TestersInfosPerso,
	},
})
export default class TestersInfos extends Vue {
	protected currentTab: string = 'personal';
	protected progress: number = 0;

	protected informationsTab: Map<string, _InfoTab> = new Map([
		[
			'personal',
			{
				component: 'TestersInfosPerso',
				text: 'Informations personnelles',
				disabled: false,
			},
		],
		[
			'fam',
			{
				component: '',
				text: 'Ma situation familiale',
				disabled: true,
			},
		],
		[
			'job',
			{
				component: '',
				text: 'Ma situation professionnelle',
				disabled: true,
			},
		],
		[
			'money',
			{
				component: '',
				text: 'Ma situation financière',
				disabled: true,
			},
		],
		[
			'home',
			{
				component: '',
				text: 'Mon logement',
				disabled: true,
			},
		],
		[
			'games',
			{
				component: '',
				text: 'Mes loisirs & voyages',
				disabled: true,
			},
		],
		[
			'gear',
			{
				component: '',
				text: 'Mes équipements informatiques',
				disabled: true,
			},
		],
		[
			'rule_34',
			{
				component: '',
				text: 'Internet & moi',
				disabled: true,
			},
		],
		[
			'apple_sux',
			{
				component: '',
				text: 'Mes usages mobiles',
				disabled: true,
			},
		],
		[
			'gucci_gang',
			{
				component: '',
				text: 'Mes marques favorites',
				disabled: true,
			},
		],
		[
			'fbi_intel',
			{
				component: '',
				text: 'Informations internes',
				disabled: true,
			},
		],
	]);
}
</script>

<style lang="scss" scoped>
	.tab.vertical {
		text-align: left
	}
</style>
