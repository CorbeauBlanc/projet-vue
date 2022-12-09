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
				<span class="last"
					>Recrutement personnalisé de votre panel</span
				>
			</h2>
		</template>
		<template #content>
			<div class="container">
				<div class="segments">
					<div class="segment"></div>
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

type _LangTab = {
	text: string;
	flag: string;
};

@Component({
	components: {
		ViewRoot,
	},
})
export default class TestersRecruitment extends Vue {
	protected tabs: _LangTab[] = [
		{
			text: 'Français',
			flag: 'fr',
		},
	];
}
</script>

<style lang="scss" scoped>

</style>
