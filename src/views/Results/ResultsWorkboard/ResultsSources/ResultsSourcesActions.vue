<template>
	<div class="actions">
		<button>
			<tooltip class="top">Ajouter aux favoris</tooltip>
			<icon icon star />
		</button>
		<button>
			<tooltip class="top">Attacher à un autre constat</tooltip>
			<icon interchange />
		</button>
		<button>
			<tooltip class="top">Télécharger les sources</tooltip>
			<icon download />
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
export default class ResultsSourcesActions extends Vue {}
</script>
