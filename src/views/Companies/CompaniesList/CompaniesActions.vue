<template>
	<div class="actions">
		<button>
			<tooltip class="top">Archiver</tooltip>
			<icon delete text red />
		</button>
		<router-link :to="'/companies/420/edition'">
			<tooltip class="top">Éditer</tooltip>
			<icon edit />
		</router-link>
		<router-link :to="'/companies/420/offers'">
			<tooltip class="top align right">Voir les offres</tooltip>
			<icon puzzle />
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
export default class CompaniesActions extends Vue {
	@Prop() public readonly data!: number;

	protected id: number = -1;

	private created(): void {
		this.id = this.data;
	}
}
</script>
