<template>
	<div id="slideshow-workspace">
		<scroll-zone
			v-if="dragStarted && hasScroll()"
			scrollable="#results-workboard"
			:style="{ top: topHeight }"
			:increment="100"
			:timeout="10"
			up
		>
			<icon carret circle up />
		</scroll-zone>
		<drop-target
			class="section-drop-target"
			@dropped="insertElement(Number.parseInt($event), -1)"
			:dragging="dragStarted"
			data-type="text/plain"
		/>
		<template v-for="(section, i) in collection">
			<slideshow-section
				@dragging="dragStarted = $event"
				@delete="deleteElement(i)"
				@datachanged="collection[i] = $event"
				:data="section"
				:index="i"
				:key="`section${i}${section.id}`"
			/>
			<drop-target
				class="section-drop-target"
				@dropped="insertElement(Number.parseInt($event), i)"
				:key="`target${i}${section.id}`"
				:dragging="dragStarted"
				data-type="text/plain"
			/>
		</template>
		<scroll-zone
			v-if="dragStarted && hasScroll()"
			scrollable="#results-workboard"
			:increment="100"
			:timeout="10"
			down
		>
			<icon carret circle down />
		</scroll-zone>
	</div>
</template>

<script lang="ts">
import DragAndDropGroup from '@/components/DragAndDrop/DragAndDropGroup';
import DropTarget from '@/components/DragAndDrop/DropTarget.vue';
import ScrollZone from '@/components/ScrollZone/ScrollZone.vue';
import Js from '@/services/JsService';
import { Component, Prop, Vue } from 'vue-property-decorator';
import SlideshowSection from './SlideshowSection.vue';
import { SlideshowSectionData } from './SlideshowTypes';

@Component({
	components: {
		SlideshowSection,
		ScrollZone,
		DropTarget,
	},
})
export default class SlideshowWorkspace extends DragAndDropGroup {
	@Prop() public readonly createButton!: HTMLButtonElement;

	protected collection: SlideshowSectionData[] = [];

	protected resultsWorkboard!: HTMLElement | null;
	protected topHeight: string = '0px';

	public createNewSection(): void {
		this.collection.push({
			id: Js.uid,
			title: 'Nouvelle localisation',
		});
	}

	protected hasScroll(): boolean {
		if (!this.resultsWorkboard) return false;
		return (
			this.resultsWorkboard.scrollHeight >
			this.resultsWorkboard.clientHeight
		);
	}

	private mounted(): void {
		if (this.createButton)
			this.createButton.onclick = this.createNewSection;

		this.topHeight = `
		${document.getElementById('view-heading')?.clientHeight || 0}px
		`;

		this.resultsWorkboard = document.getElementById('results-workboard');
	}

	private created(): void {
		this.collection = [
			{
				id: '1',
				title: 'section 1',
			},
			{
				id: '2',
				title: 'section 2',
			},
			{
				id: '3',
				title: 'section 3',
			},
			{
				id: '4',
				title: 'section 4',
			},
		];

		this.collection.forEach((section: SlideshowSectionData): void => {
			section.open = false;
		});
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

.empty.section {
	min-height: $padding;
}

.scroll-zone {
	position: sticky;
	width: 100%;
	height: 10vh;
	opacity: .3;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1.5rem;

	@include z-index(modal);

	&.scrolling {
		opacity: 1;
	}

	&.down {
		bottom: 0;
	}
}
</style>
