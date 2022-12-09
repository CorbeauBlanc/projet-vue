<template>
	<i :class="classes" v-on="transparentEvents"></i>
</template>

<script lang="ts">
import { VueListener } from '@/types';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Icon extends Vue {
	protected classes: string[] = ['icon'];
	protected transparentEvents!: VueListener;

	private created(): void {
		Object.entries(this.$attrs).forEach((attr: [string, string]): void => {
			if (attr[1] === '') this.classes.push(attr[0]);
		});

		this.transparentEvents = this.$listeners as VueListener;
	}
}
</script>
