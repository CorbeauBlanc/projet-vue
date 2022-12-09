<template>
	<highcharts class="graph" :options="options" />
</template>

<script lang="ts">
import Logger from '@/services/LoggerService';
import { Options } from 'highcharts';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Graph extends Vue {
	@Prop() public options!: Options;

	private mounted(): void {
		const legend: Element | null = this.$el.querySelector(
			'div.highcharts-legend'
		);
		const items: Element | null | undefined =
			legend?.firstElementChild?.firstElementChild;

		this.$el
			.querySelector('.highcharts-container')
			?.removeAttribute('style');
		legend?.removeAttribute('style');
		legend?.firstElementChild?.removeAttribute('style');
		if (items) {
			items.classList.add('highcharts-legend-items');
			items.removeAttribute('style');
			for (const child of items.children) child.removeAttribute('style');
		}
	}

	private created(): void {
		const nostyle: any = {
			position: '',
			'font-family': '',
			'font-size': '',
			'white-space': '',
			color: '',
			'font-weight': '',
			'text-overflow': '',
			overflow: '',
			'margin-left': '',
			'margin-top': '',
			left: '',
			top: '',
			fill: '',
		};
		if (!this.options)
			return Logger.dbgLog(
				'Graph: created: this.options is undefined',
				this
			);
		this.options.credits = {
			enabled: false,
		};
		this.options.legend = {
			useHTML: true,
			itemHoverStyle: nostyle,
			itemStyle: nostyle,
			itemHiddenStyle: nostyle,
		};
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';
.graph {
	svg {
		& > .highcharts-legend {
			display: none;
		}
	}
}
</style>
