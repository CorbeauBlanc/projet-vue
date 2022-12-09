<template lang="pug">
	view-root#results-workboard(:secondary-headings="['nav']")
		template(#heading)
			h2.title
				router-link(:to="{ name: 'results' }")
					icon(long, arrow, left)
					span
						| {{ $t('Résultats') }}
				span.separator
					icon(chevron, right)
				div(v-if="loaded")
					span.last
						| {{ retrievedResult.name }}
					span.id
						| {{ retrievedResult.id }}
		template(#nav)
			.tabs.navigation.secondary
				.menu.left
					router-link.tab.item(:to="{ name: 'result synthesis', params: { id: resultId } }")
						icon(synthesis)
						span
							| {{ $t('Synthèse') }}
					// tab(name="synthesis" v-master="currentTab")
						icon(synthesis)
						span
							| {{ $t('Synthèse') }}
					router-link.tab.item(
						class="active",
						:to="{ name: 'result videos list', params: { id: resultId } }",
						v-if="resultHasVideos"
					)
						icon(video, sound)
						span
							| {{ $t('Vidéos') }}
					// tab(name="videos" v-master="currentTab" v-if="resultHasVideos")
						icon(video, sound)
						span
							| {{ $t('Vidéos') }}
					router-link.tab.item(
						:to="{ name: 'result charts', params: { id: resultId } }"
						v-if="resultHasVerbatims"
					)
						icon(chart, bar)
						span
							| {{ $t('Graphiques') }}
					router-link.tab.item(
						:to="{ name: 'result verbatims', params: { id: resultId } }"
						v-if="resultHasVerbatims"
					)
						icon(verbatims)
						span
							| {{ $t('Verbatims') }}
					// tab(name="charts" v-master="currentTab" v-if="resultHasVerbatims")
						icon(video, sound)
						span
							| {{ $t('Vidéos') }}
					// tab(name="verbatims" v-master="currentTab" v-if="resultHasVerbatims")
						icon(video, sound)
						span
							| {{ $t('Vidéos') }}
				.menu
					router-link.tab.item(
						:to="{ name: 'result observations', params: { id: resultId } }"
					)
						icon(tags)
						span
							| {{ $t('Constats / Recos') }}
					router-link.tab.item(
						:to="{ name: 'result report', params: { id: resultId } }"
					)
						icon(report)
						span
							| {{ $t('Compte rendu') }}
		template(#content)
			keep-alive
				router-view
</template>

<script lang="ts">
import Tab from '@/components/Tab/Tab.vue';
import TabbedView from '@/components/TabbedView/TabbedView';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import AxiosUtils from '@/services/AxiosUtils';
import { resultsUrl } from '@/views/Results/ResultsConfig';
import { DefaultResultTest } from '@/views/Results/ResultsTypes';
import { RetrievedResultInfos } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { TestProduct } from '@/views/Tests/TestsTypes';
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Watch } from 'vue-property-decorator';

type ResultsTabs =
	| 'synthesis'
	| 'videos'
	| 'charts'
	| 'verbatims'
	| 'observations'
	| 'report';

@Component({
	components: {
		ViewRoot,
		Tab,
	},
})
export default class ResultsWorkboard extends TabbedView<ResultsTabs> {
	@Prop() private tab!: ResultsTabs;

	protected defaultTab: ResultsTabs = this.tab;
	protected viewTabs: Map<ResultsTabs, string> = new Map([
		['synthesis', 'result synthesis'],
		['videos', 'result videos'],
		['charts', 'result charts'],
		['verbatims', 'result verbatims'],
		['observations', 'result observations'],
		['report', 'result report'],
	]);
	private retrievedResult!: RetrievedResultInfos;
	private resultId: string = this.$route.params.group_id;
	private loaded: boolean = false;

	private readonly MIN_WIDTH: number = 900;

	private resultHasVideos: boolean = false;
	private resultHasVerbatims: boolean = false;

	private retrieveResultData(): void {
		Axios.get(`${resultsUrl}/${this.resultId}`, AxiosUtils.defaultConfig)
			.then((response?: AxiosResponse<RetrievedResultInfos>): void => {
				if (!response?.data) return;
				this.retrievedResult = response.data;
				this.loaded = true;

				this.retrievedResult.tests.filter(
					(test: DefaultResultTest): boolean => {
						return test.product.id === TestProduct.video;
					}
				).length !== 0 && (this.resultHasVideos = true);

				this.retrievedResult.tests.filter(
					(test: DefaultResultTest): boolean => {
						return (
							test.product.id ===
							(TestProduct.form || TestProduct.survey)
						);
					}
				).length !== 0 && (this.resultHasVerbatims = true);
			})
			.catch((error: any): void => {
				this.loaded = true;
				AxiosUtils.defaultErrorLog(
					`ResultsWorkboard: Cannot get ${this.resultId} from ${resultsUrl}`,
					error
				);
			});
	}

	/**
	 * If the id is changed through the url, updates the component data
	 */
	@Watch('$route')
	protected onRouteChange(): void {
		this.retrieveResultData();
	}

	private created(): void {
		this.retrieveResultData();
		this.updateCurrentTab();
	}
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.tabs.navigation.secondary {
	display: flex;
	justify-content: space-between;

	.menu {
		width: auto;

		.item {
			min-width: 8rem;
		}
	}

	.left {
		flex: 1;
	}
}
</style>
