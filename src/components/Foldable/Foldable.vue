<template>
	<div v-show="active" v-if="active || !reload">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import ComponentsUtils from '@/services/ComponentsUtils';
import Js from '@/services/JsService';
import { Component, Prop, Vue } from 'vue-property-decorator';
import FoldHeader from './FoldHeader.vue';

@Component({})
export default class Foldable extends Vue {
	@Prop() public readonly name!: string;

	@Attr() public readonly reload!: boolean;

	public uid: string = Js.uid;

	protected active: boolean = false;

	public setActive(val: boolean): void {
		this.active = val;
	}

	private mounted(): void {
		(
			ComponentsUtils.findAllChildren(
				FoldHeader,
				this.$parent
			) as FoldHeader[]
		).forEach((foldHeader: FoldHeader): void => {
			foldHeader.linkFoldableComponent(this);
		});
	}
}
</script>
