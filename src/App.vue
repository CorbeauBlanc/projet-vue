<template>
	<div id="app" :class="environment">
		<nav-sidebar
			v-if="navSidebarOpened"
			:levels="levels"
		/>
		<router-view />
		<results-sidebar />
		<flash-message class="fixed top left" name="general" />
	</div>
</template>

<script lang="ts">
import { levels } from '@/AppConfig';
import { AccordionLevel } from '@/components/Accordion/AccordionTypes';
import Environment from '@/services/EnvironmentService';
import Sidebars from '@/services/SidebarsService';
import NavSidebar from '@/views/NavSidebar.vue';
import ResultsSidebar from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebar.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {
		NavSidebar,
		ResultsSidebar,
	},
})
export default class App extends Vue {
	protected environment: string = Environment.current || '';
	protected sidebarsManager: typeof Sidebars = Sidebars;

	protected navSidebarOpened: boolean = Sidebars.navigation.sidebarOpened;

	protected readonly levels: AccordionLevel[] =
		this.$route.name === 'first login' ? [] : levels;

	private readonly navListenerId: string = 'app-listener';

	private created(): void {
		Sidebars.navigation.listenForOpen(this.navListenerId, (): void => {
			this.navSidebarOpened = true;
		});
		Sidebars.navigation.listenForClose(this.navListenerId, (): void => {
			this.navSidebarOpened = false;
		});
	}

	private beforeDestroy(): void {
		Sidebars.navigation.stopListeningForOpen(this.navListenerId);
		Sidebars.navigation.stopListeningForClose(this.navListenerId);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

@import '@/styles/animations';
@import '@/styles/buttons';
@import '@/styles/core';
@import '@/styles/dnd';
@import '@/styles/flags';
@import '@/styles/general';
@import '@/styles/grid';
@import '@/styles/headers';
@import '@/styles/headings';
@import '@/styles/icons';
@import '@/styles/inputs';
@import '@/styles/list';
@import '@/styles/loaders';
@import '@/styles/modals';
@import '@/styles/segments';
@import '@/styles/stats';
@import '@/styles/tables';
@import '@/styles/tooltip';

#app {
	height: 100%;
	display: flex;
	overflow: hidden;
	position: relative;

	&.development {
		border-left: solid 10px $green;
	}

	&.preproduction {
		border-left: solid 10px $red;
	}
}
</style>
