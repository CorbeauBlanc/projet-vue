<template>
	<div class="actions">
		<router-link
			:to="{ name: 'result user verbatims', params: { userId: '42' } }"
		>
			<tooltip class="top">Voir la vidéo</tooltip>
			<icon long right arrow />
		</router-link>
	</div>
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class ResultsTestersActions extends Vue {}
</script>
