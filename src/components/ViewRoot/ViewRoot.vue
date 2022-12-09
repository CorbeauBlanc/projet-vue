<template>
	<div class="view">
		<div id="view-heading">
			<div class="heading">
				<div class="item">
					<slot name="heading"></slot>
				</div>
				<user-menu class="item" />
			</div>
			<div
				class="heading secondary"
				v-for="(heading, i) in secondaryHeadings"
				:key="i"
			>
				<slot :name="heading"></slot>
			</div>
		</div>
		<div id="view-content">
			<slot name="content"></slot>
		</div>
		<div id="view-footer">
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import UserMenu from '@/views/UserMenu.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * Component used to put the base structure of all views.
 * Made before the inclusion of pug, may be interesting to replace it now.
 */
@Component({
	components: {
		UserMenu,
	},
})
export default class ViewRoot extends Vue {
	@Prop() public readonly secondaryHeadings!: string[];
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.view {
	flex-basis: 100%;
	display: flex;
	flex-direction: column;
	overflow: auto;

	#view-heading {
		@include z-index(topHeading);
	}

	#view-content {
		position: relative;
		padding-bottom: $padding * 4;
		flex-grow: 1;
	}
}
</style>
