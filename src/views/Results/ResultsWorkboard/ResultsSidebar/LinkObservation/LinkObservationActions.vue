<template lang="pug">
	.actions
		button(
			:class="`button icon ${linked ? 'active' : ''}`"
			@click="$emit('componentevent', { sidebarEvent: 'link', state: !linked, id: id })"
		)
			tooltip.top
				| {{ linked ? $t('Dissocier') : $t('Associer') }} {{ $t('la source au constat') }}
			icon(
				:class="`linked ${linked ? 'off' : ''}`"
			)
		button(
			:class="`button icon ${linked ? '' : 'disabled'}`"
			@click="linked && $emit('componentevent', { sidebarEvent: 'bookmark', state: !bookmarked, id: associationId })"
		)
			tooltip.top(
				v-show="linked"
			)
				| {{ $t('Mettre en favori') }}
			icon(
				:class="`star ${bookmarked ? 'text yellow' : ''}`"
			)
		button.button.icon(
			@click="$emit('componentevent', { sidebarEvent: 'edit', id: id })"
		)
			tooltip.top
				| {{ $t('Éditer le constat') }}
			icon.edit
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class LinkObservationActions extends Vue {
	/**
	 * Observation id
	 */
	@Prop() public readonly id!: string;
	/**
	 * id of the association between a source (video extract, verbatim...) and an observation once they have been linked
	 */
	@Prop() public readonly associationId?: string;
	@Prop() public readonly linked!: boolean;
	@Prop() public readonly bookmarked!: boolean;
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.button {
	&.active {
		background: $green !important;
		color: $white !important;
	}

	&.disabled {
		opacity: .6;
	}
}
</style>
