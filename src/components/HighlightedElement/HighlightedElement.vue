<template>
	<div class="highlighted-element" ref="element">
		<span v-if="!search || search === ''">{{ text }}</span>
		<span :style="highlightStyle" v-else-if="search === text">{{
			text
		}}</span>
		<template v-else v-for="(fragment, index) in splitText">
			<span :key="`f${index}`">{{ fragment }}</span>
			<span :style="highlightStyle" :key="`s${index}`">{{
				searchResults[index]
			}}</span>
		</template>
	</div>
</template>

<script lang="ts">
import Js from '@/services/JsService';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class HighlightedElement extends Vue {
	@Prop() public readonly search!: string;
	@Prop() public readonly text!: string;
	@Prop({ default: Js.defaultHighlightStyle })
	public readonly highlightStyle!: string;

	protected get startWithSearch(): boolean {
		return this.text.toLowerCase().startsWith(this.search.toLowerCase());
	}

	public get searchResults(): string[] {
		return this.text.match(new RegExp(this.search, 'ig')) || [];
	}

	public get splitText(): string[] {
		return this.text.split(new RegExp(this.search, 'i'));
	}
}
</script>
