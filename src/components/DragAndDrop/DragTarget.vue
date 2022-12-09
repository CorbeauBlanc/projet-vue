<template>
	<div class="drag-canvas" ref="canvas" v-show="!dragging">
		<div class="drag-content" ref="content">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import Logger from '@/services/LoggerService';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class DragTarget extends Vue {
	@Prop() public readonly dragElement!: HTMLElement;
	@Prop() public readonly dragData!: { data: any; type: string };

	protected dragging: boolean = false;
	protected content!: Element;

	@Watch('dragElement', { immediate: true })
	protected onDragElementChange(val: HTMLElement | undefined): void {
		if (!val)
			return Logger.dbgLog(
				'DragTarget: onDragElementChange: val is undefined',
				this
			);
		val.ondragstart = this.onDragStart;
		val.ondragend = this.onDragEnd;
		val.ondrag = this.onDrag;
	}

	protected onDragStart(this: any, event: DragEvent): void {
		if (!event.dataTransfer || !this.dragData)
			return Logger.dbgWarn(
				'DragTarget: onDragStart: event.dataTransfer or this.dragData is undefined',
				this
			);
		event.dataTransfer.setData(this.dragData.type, this.dragData.data);
		this.content.children[0].className += ' dragging ';
		event.dataTransfer.setDragImage(this.$refs['canvas'] as Element, 0, 0);
		this.$emit('dragging', true);
	}

	protected onDrag(): void {
		this.dragging = true;
	}

	protected onDragEnd(this: any, event: DragEvent): void {
		this.dragging = false;
		this.content.children[0].className = (
			this.content.children[0].className as string
		).replace(' dragging ', '');
		this.$emit('dragging', false);
	}

	private mounted(): void {
		this.content = this.$refs['content'] as Element;
	}
}
</script>
