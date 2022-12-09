<template>
	<div class="actions">
		<button>
			<tooltip class="top">Archiver</tooltip>
			<icon delete text red />
		</button>
		<button>
			<tooltip class="top">Éditer</tooltip>
			<icon edit />
		</button>
		<router-link
			:to="{
				name: 'result observation sources',
				params: { observationId: '42' },
			}"
		>
			<tooltip class="top">Données sources</tooltip>
			<icon data sources />
		</router-link>
		<button>
			<tooltip class="top align right">Voir la slide</tooltip>
			<icon play />
		</button>
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
export default class ResultsObservationsActions extends Vue {}
</script>
