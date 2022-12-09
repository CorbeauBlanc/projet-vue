<template>
	<div class="container text">
		<div class="segments">
			<div class="segment tabs alt navigation tertiary">
				<div class="menu">
					<tab>
						<div class="flag country-fr"></div>
						<span>Français</span>
					</tab>
				</div>
			</div>
			<div class="segment">
				<radios-input
					class="inline"
					:config="foldedConfig"
					v-model="folded"
					buttonmode
				/>
				<radios-input
					class="inline"
					:config="displayConfig"
					v-model="display"
					buttonmode
				/>
			</div>
			<div class="segment container" id="tasks">
				<test-task @dragging="dragStarted = $event" />
				<drop-target
					class="section-drop-target"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
				<test-task @dragging="dragStarted = $event" />
				<drop-target
					class="section-drop-target"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
				<test-task @dragging="dragStarted = $event" />
				<drop-target
					class="section-drop-target"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
				<test-task @dragging="dragStarted = $event" />
				<drop-target
					class="section-drop-target"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
				<test-task @dragging="dragStarted = $event" />
				<drop-target
					class="section-drop-target"
					:dragging="dragStarted"
					data-type="text/plain"
				/>
			</div>
		</div>
		<!-- penser à ajouter scrollbar dans consignes et options
	tooltips
	oeil barré
	fond des options
	attention boutons -->
	</div>
</template>

<script lang="ts">
import DragAndDropGroup from '@/components/DragAndDrop/DragAndDropGroup';
import DropTarget from '@/components/DragAndDrop/DropTarget.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import Tab from '@/components/Tab/Tab.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TestTask from './TestTask.vue';

@Component({
	components: {
		RadiosInput,
		Tab,
		TestTask,
		DropTarget,
	},
})
export default class TestTasksList extends DragAndDropGroup {
	protected foldedConfig: InputConfig = {
		options: [
			{
				text: 'Déplié',
				value: 'unfolded',
				class: 'small ghost primary',
				icon: 'fullscreen',
			},
			{
				text: 'Replié',
				value: 'folded',
				class: 'small ghost primary',
				icon: 'fullscreen exit',
			},
		],
	};
	protected displayConfig: InputConfig = {
		options: [
			{
				text: 'Liste',
				value: 'list',
				class: 'small ghost primary',
				icon: 'format align justify',
			},
			{
				text: 'Grille',
				value: 'grid',
				class: 'small ghost primary',
				icon: 'type grid',
			},
		],
	};

	protected folded: any = '';
	protected display: any = '';
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.section-dnd-icon {
	cursor: pointer;
	display: inline-block;
	padding: 0.5rem;
	font-size: 0.8rem;
	border-radius: 50%;
	position: absolute;
	top: .3rem;
	left: -1rem;
	background: scale-color($default-color, $lightness: 73%);

	@include z-index(raisedElement);

	i.icon {
		vertical-align: bottom;
	}
}

.section {
	$shadow-size: 10px;

	display: flex;
	justify-content: space-between;
	padding: math.div($padding, 2);

	&.dragging {
		box-shadow: 0 0 $shadow-size #888;

		@include z-index(topElement);
	}

	.title-container .header {
		font-weight: 700;
		margin-left: math.div($padding, 2);
	}

	.actions {
		i.icon {
			margin-right: math.div($padding, 2);
			cursor: pointer;
		}
	}
}
</style>
