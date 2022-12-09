<template>
	<drag-target
		class="section-drag-target"
		:drag-element="dragIcon"
		:drag-data="{ data: index, type: 'text/plain' }"
		@dragging="emitDragging"
	>
		<div :class="`segment inline section ${active ? 'active' : ''}`">
			<div class="section-dnd-icon" draggable="true" ref="dnd">
				<icon arrows />
			</div>
			<div class="title-container">
				<span class="header" v-if="!editTitle">{{ title[0] }}</span>
				<text-input v-else v-model="title" :config="editConfig" />
				<i
					:class="`icon link ${editTitle ? 'check' : 'edit'}`"
					@click="toggleTitleEdition"
				></i>
			</div>
			<div class="actions">
				<icon link hide v-if="!data.mandatory" />
				<icon
					link
					red
					delete
					v-if="!data.mandatory"
					@click="emitDelete"
				/>
				<i
					:class="`icon link chevron ${active ? 'up' : 'down'}`"
					@click="toggleActive"
				></i>
			</div>
		</div>
		<div class="segment cards" v-if="active">
			<template v-for="(slide, i) in collection">
				<drop-target
					class="slide-drop-target"
					@dropped="insertElement(Number.parseInt($event), i - 1)"
					:key="`target${i}${slide.id}`"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
				<slideshow-slide-card
					@dragging="dragStarted = $event"
					@delete="deleteElement(i)"
					:data="slide"
					:index="i"
					:total="collection.length"
					:key="`slide${i}${slide.id}`"
				/>
			</template>
			<slideshow-slide-card
				:class="{ dragging: dragStarted }"
				:add="true"
				@click="createNewCard"
			>
				<drop-target
					class="slide-drop-target"
					@dropped="
						insertElement(
							Number.parseInt($event),
							collection.length - 1
						)
					"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
			</slideshow-slide-card>
		</div>
	</drag-target>
</template>

<script lang="ts">
import DragAndDropGroup from '@/components/DragAndDrop/DragAndDropGroup';
import DragTarget from '@/components/DragAndDrop/DragTarget.vue';
import DropTarget from '@/components/DragAndDrop/DropTarget.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Js from '@/services/JsService';
import { Component, Prop, Vue } from 'vue-property-decorator';
import SlideshowSlideCard from './SlideshowSlideCard.vue';
import { SlideshowSectionData, SlideshowSlideData } from './SlideshowTypes';

@Component({
	components: {
		TextInput,
		SlideshowSlideCard,
		DragTarget,
		DropTarget,
	},
})
export default class SlideshowSection extends DragAndDropGroup {
	@Prop() public readonly index!: number;
	@Prop() public readonly data!: SlideshowSectionData;

	protected dragIcon: HTMLElement | null = null;
	protected title: string[] = [];
	protected editTitle: boolean = false;
	protected editConfig: InputConfig = { multiple: false };

	private active: boolean = false;

	protected emitDragging(value: boolean): void {
		this.$emit('dragging', value);
	}

	protected emitDelete(): void {
		this.$emit('delete');
	}

	protected toggleActive(): void {
		this.active = !this.active;
		this.data.open = this.active;
	}

	protected toggleTitleEdition(): void {
		this.editTitle = !this.editTitle;
		const tmp: SlideshowSectionData = this.data;
		tmp.title = this.title[0];
		this.$emit('datachanged', tmp);
	}

	protected createNewCard(): void {
		this.collection.push({
			id: Js.uid,
			title: 'new slide',
			html: '<p>CONTENU</p><div onclick="alert(`test`)">New Slide</div>',
		});
	}

	private mounted(): void {
		this.dragIcon = this.$refs['dnd'] as HTMLElement;
	}

	private created(): void {
		this.active = this.data.open !== undefined ? this.data.open : false;
		this.title = [this.data.title];
		this.collection = [
			{
				id: '1',
				title: 'slide1',
				html: '<p>CONTENU</p><div onclick="alert(`test`)">test1</div>',
			},
			{
				id: '2',
				title: 'slide2',
				html: '<p>CONTENU</p><div onclick="alert(`test`)">test2</div>',
			},
			{
				id: '3',
				title: 'slide3',
				html: '<p>CONTENU</p><div onclick="alert(`test`)">test3</div>',
			},
			{
				id: '4',
				title: 'slide4',
				html: '<p>CONTENU</p><div onclick="alert(`test`)">test4</div>',
			},
		];
	}
}
</script>

<style lang="scss">

</style>
