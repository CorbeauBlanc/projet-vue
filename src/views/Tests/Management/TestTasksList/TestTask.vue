<template>
	<drag-target
		class="section-drag-target test-task"
		:drag-element="dragIcon"
		:drag-data="{ data: index, type: 'text/plain' }"
		@dragging="$emit('dragging', $event)"
	>
		<div class="segments">
			<div class="segment section inline">
				<div>
					<div
						class="section-dnd-icon"
						draggable="true"
						ref="dragIcon"
					>
						<icon arrows />
					</div>
					<div class="title-container">
						<span class="header">Arupsegture</span>
						<strong class="id">42069</strong>
					</div>
				</div>
				<div class="actions">
					<icon link hide />
					<icon link edit />
					<icon link copy />
					<icon link red delete />
				</div>
			</div>
			<div class="segment task-answers">
				<ul class="unstyled">
					<li>
						<span class="color-display transparent"></span>
						<span>Bidon</span>
					</li>
					<li>
						<span class="color-display transparent"></span>
						<span>Bidon</span>
					</li>
					<li>
						<span class="color-display transparent"></span>
						<span>Bidon</span>
					</li>
				</ul>
			</div>
			<div class="segment inline task-setup">
				<ul class="unstyled inline">
					<li class="icon type input multi">
						<span>Texte multiligne</span>
					</li>
					<li class="icon clock">
						<span>Durée de la consigne limitée</span>
					</li>
				</ul>
				<div>
					<icon split />
					<a>
						<em>Consigne 16</em>
					</a>
				</div>
			</div>
		</div>
	</drag-target>
</template>

<script lang="ts">
import DragTarget from '@/components/DragAndDrop/DragTarget.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		DragTarget,
	},
})
export default class TestTasks extends Vue {
	@Prop() public readonly index!: number;

	protected dragIcon: HTMLElement | null = null;

	private mounted(): void {
		this.dragIcon = this.$refs['dragIcon'] as HTMLElement;
	}
}
</script>

<style lang="scss" scoped>
.test-task {
	.task-answers li span {
		vertical-align: middle;
		margin-left: .5em;
	}

	.task-setup {
		font-size: .8rem;

		span {
			vertical-align: middle;
		}

		li::before {
			font-size: 1.2em;
		}
	}
}
</style>
