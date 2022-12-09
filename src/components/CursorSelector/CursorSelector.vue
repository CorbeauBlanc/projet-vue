<template>
	<div id="cursor-selector" v-show="selectionStarted"></div>
</template>

<script lang="ts">
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Component, Model, Prop, Vue } from 'vue-property-decorator';

interface Rect {
	top: [DOMPoint, DOMPoint];
	bottom: [DOMPoint, DOMPoint];
	left: [DOMPoint, DOMPoint];
	right: [DOMPoint, DOMPoint];
}

/**
 * Component that aims to mimic the selection rectangle one can do to select multiple items
 * in most GUIs (for example the file explorer of any OS)
 */
@Component({})
export default class CursorSelector extends Vue {
	/**
	 * A collection of the selected components tracked by the value of propName in earch of them
	 */
	@Model('change') public readonly selected!:
		| string[]
		| { [key: string]: boolean };
	/**
	 * The z-index of the selection rectangle
	 */
	@Prop() public readonly zIndex!: number;
	/**
	 * The minimum size the selection rectangle must have to be activated
	 */
	@Prop() public readonly minSize!: number;
	/**
	 * The list of components that can be selected
	 */
	@Prop() public readonly selectables!: Vue[];
	/**
	 * The name of the property to retrieve the value of in each component in order to track them
	 */
	@Prop() public readonly propName!: string;

	protected selectionStarted: boolean = false;
	protected currentSelection: string[] | { [key: string]: boolean } = [];
	protected get selector(): HTMLElement {
		return this.$el as HTMLElement;
	}

	private startPos: [number, number] = [0, 0];
	private parent!: HTMLElement;

	private startSelection(ev: MouseEvent): void {
		ev.preventDefault();
		ev.stopImmediatePropagation();
		if (
			!this.selectables ||
			!this.selectables.length ||
			this.selectionStarted
		)
			return Logger.dbgWarn(
				'CursorSelector: startSelection: this.selectables is undefined, empty, or this.selectionStarted is true',
				this
			);
		const parentRect: DOMRect = this.parent.getBoundingClientRect();

		this.startPos[0] = ev.clientX - parentRect.left;
		this.startPos[1] = ev.clientY - parentRect.top;
		this.selector.style.left = `${this.startPos[0].toString()}px`;
		this.selector.style.top = `${this.startPos[1].toString()}px`;
		this.parent.addEventListener('mousemove', this.updateSelection);
	}

	private updateSelection(ev: MouseEvent): void {
		const parentRect: DOMRect = this.parent.getBoundingClientRect();
		const width: number = ev.clientX - parentRect.left - this.startPos[0];
		const height: number = ev.clientY - parentRect.top - this.startPos[1];
		this.selector.style.scale = `${width} ${height}`;
		if (
			!this.selectionStarted &&
			(Math.abs(width) >= (this.minSize >= 0 ? this.minSize : 0) ||
				Math.abs(height) >= (this.minSize >= 0 ? this.minSize : 0))
		) {
			window.getSelection()?.empty();
			this.selectionStarted = true;
		}

		if (this.selectionStarted) {
			this.checkIntersections(width, height);
			this.$emit('change', this.currentSelection);
		}
	}

	private endSelection(ev: MouseEvent | KeyboardEvent): void {
		if (Js.isTypeOf(ev, KeyboardEvent) && ev.key !== 'Escape')
			return Logger.dbgWarn(
				'CursorSelector: endSelection: ev is not a KeyboardEvent or ev.key is not "Escape"',
				this
			);

		if (this.selectionStarted) {
			ev.preventDefault();
			ev.stopImmediatePropagation();
		}
		this.selectionStarted = false;
		this.selector.style.scale = `0 0`;
		this.parent.removeEventListener('mousemove', this.updateSelection);
	}

	private resetCurrentSelection(): void {
		if (this.selected === undefined || Array.isArray(this.selected))
			this.currentSelection = [];
		else this.currentSelection = {};
	}

	private addToCurrentSelection(propValue: string): void {
		if (Array.isArray(this.currentSelection))
			this.currentSelection.push(propValue);
		else this.currentSelection[propValue] = true;
	}

	private checkIntersections(width: number, height: number): void {
		if (!this.propName)
			return Logger.dbgError(
				'CursorSelector: checkIntersections: this.propName is undefined',
				this
			);

		this.resetCurrentSelection();
		const selectRect: Rect = {
			top: [
				new DOMPoint(this.startPos[0], this.startPos[1]),
				new DOMPoint(this.startPos[0] + width, this.startPos[1]),
			],
			bottom: [
				new DOMPoint(this.startPos[0], this.startPos[1] + height),
				new DOMPoint(
					this.startPos[0] + width,
					this.startPos[1] + height
				),
			],
			left: [
				new DOMPoint(this.startPos[0], this.startPos[1]),
				new DOMPoint(this.startPos[0], this.startPos[1] + height),
			],
			right: [
				new DOMPoint(this.startPos[0] + width, this.startPos[1]),
				new DOMPoint(
					this.startPos[0] + width,
					this.startPos[1] + height
				),
			],
		};
		this.selectables.forEach((comp: Vue): void => {
			if (comp.$data[this.propName] === undefined)
				return Logger.dbgWarn(
					'CursorSelector: checkIntersections: comp.$data[this.propName] is undefined',
					comp,
					this
				);
			const left: number = (comp.$el as HTMLElement).offsetLeft;
			const top: number = (comp.$el as HTMLElement).offsetTop;
			const right: number =
				(comp.$el as HTMLElement).offsetLeft +
				(comp.$el as HTMLElement).offsetWidth;
			const bot: number =
				(comp.$el as HTMLElement).offsetTop +
				(comp.$el as HTMLElement).offsetHeight;

			const compRect: Rect = {
				top: [new DOMPoint(left, top), new DOMPoint(right, top)],
				bottom: [new DOMPoint(left, bot), new DOMPoint(right, bot)],
				left: [new DOMPoint(left, top), new DOMPoint(left, bot)],
				right: [new DOMPoint(right, top), new DOMPoint(right, bot)],
			};

			if (
				this.rectIntersection(selectRect, compRect) ||
				this.rectInclusion(selectRect, compRect) ||
				this.rectInclusion(compRect, selectRect)
			)
				this.addToCurrentSelection(comp.$data[this.propName]);
		});
	}

	private rectInclusion(rect1: Rect, rect2: Rect): boolean {
		return (
			Math.min(rect1.left[0].x, rect1.right[0].x) <
				Math.min(rect2.left[0].x, rect2.right[0].x) &&
			Math.max(rect1.left[0].x, rect1.right[0].x) >
				Math.max(rect2.left[0].x, rect2.right[0].x) &&
			Math.min(rect1.top[0].y, rect1.bottom[0].y) <
				Math.min(rect2.top[0].y, rect2.bottom[0].y) &&
			Math.max(rect1.top[0].y, rect1.bottom[0].y) >
				Math.max(rect2.top[0].y, rect2.bottom[0].y)
		);
	}

	private rectIntersection(rect1: Rect, rect2: Rect): boolean {
		if (this.lineIntersection(rect1.top, rect2.left)) return true;
		if (this.lineIntersection(rect1.top, rect2.right)) return true;
		if (this.lineIntersection(rect1.bottom, rect2.left)) return true;
		if (this.lineIntersection(rect1.bottom, rect2.right)) return true;

		if (this.lineIntersection(rect2.top, rect1.left)) return true;
		if (this.lineIntersection(rect2.top, rect1.right)) return true;
		if (this.lineIntersection(rect2.bottom, rect1.left)) return true;
		if (this.lineIntersection(rect2.bottom, rect1.right)) return true;

		return false;
	}

	private lineIntersection(
		hLine: [DOMPoint, DOMPoint],
		vLine: [DOMPoint, DOMPoint]
	): boolean {
		if (hLine[0].x === hLine[1].x || vLine[0].y === vLine[1].y)
			return false;
		const t: number = (hLine[0].x - vLine[0].x) / (hLine[0].x - hLine[1].x);
		const u: number =
			-(hLine[0].y - vLine[0].y) / (vLine[0].y - vLine[1].y);
		if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
		return false;
	}

	private mounted(): void {
		this.parent = this.$parent.$el as HTMLElement;
		this.parent.addEventListener('mousedown', this.startSelection, true);
		this.parent.addEventListener('mouseup', this.endSelection, true);
		document.addEventListener('keyup', this.endSelection, true);
		if (this.zIndex !== undefined)
			this.selector.style.zIndex = this.zIndex.toString();
	}

	private destroyed(): void {
		this.parent.removeEventListener('mousedown', this.startSelection, true);
		this.parent.removeEventListener('mouseup', this.endSelection, true);
		document.removeEventListener('keyup', this.endSelection, true);
		this.parent.removeEventListener('mousemove', this.updateSelection);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#cursor-selector {
	position: absolute;
	background: rgba($primary-color, .3);
	transform-origin: top left;
	width: 1px;
	height: 1px;

	@include z-index(modal);
}
</style>
