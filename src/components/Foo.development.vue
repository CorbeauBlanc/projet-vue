<template>
	<div>
		<!-- <button @click="$emit('change', 'BUTTON')">{{ testMaster }}</button>
		<button @click="$emit('changebidon', 'BUTTON2')">
			{{ testMaster2 }}
		</button> -->
	</div>
</template>

<script lang="ts">
import { Master } from '@/decorators';
import { Component, Vision } from '@/optician';
import { Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class FOO extends Vision {
	/* @Master('change') protected testMaster: string = 'VOID';

	private pTestMaster2: string = 'VOID2';
	@Master('changebidon')
	public set testMaster2(v: string) {
		this.pTestMaster2 = `${v} ${this.pTestMaster2}`;
	}
	public get testMaster2(): string {
		return this.pTestMaster2;
	} */
}
</script>
