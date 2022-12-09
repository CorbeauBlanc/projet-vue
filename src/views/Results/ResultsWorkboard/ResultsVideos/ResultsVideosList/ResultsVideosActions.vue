<template>
	<div class="actions">
		<router-link :to="{ name: 'result videos detail', params: { affectation_id: '42' } }">
			<tooltip class="top align right">Voir la video</tooltip>
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
export default class ResultsVideosActions extends Vue {}
</script>
