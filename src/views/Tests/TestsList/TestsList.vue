<template lang="pug">
include /src/components/Listing/ListingMixins
include /src/mixins

#tests.view
	+flash-message
	+view-heading
		+heading
			| {{ $t("Liste des tests") }}
	#view-content
		+heading-secondary("fluid")
			router-link.button.heading-button(:to='creationRoute' :class='{ disabled: creationRoute === "" }')
				icon(add)/
				| {{ $t("Créer un test") }}
			help-button.heading-button(bottom, align, right)
				a(:href='`${helpUrl}/articles/360020590398`', target='_blank')
					| {{ $t("Comment structurer un test utilisateur ?") }}
				a(:href='`${helpUrl}/articles/360020590398`', target='_blank')
					| {{ $t("De la création de test aux résultats : quelles sont les grandes étapes ?") }}
				a(:href='`${helpUrl}/articles/360020746058`', target='_blank')
					| {{ $t("Comment créer un test questionnaire desktop ?") }}
				a(:href='`${helpUrl}/articles/360020608917`', target='_blank')
					| {{ $t("Comment créer un test questionnaire mobile ?") }}
				a(:href='`${helpUrl}/articles/360020650298`', target='_blank')
					| {{ $t("Comment créer un test vidéo non modéré ?") }}
				a.button.ghost.small.margin.top.bottom(
					href='https://support.testapic.com/hc/fr/requests/new',
					target='_blank'
				)
					| {{ $t("Proposer une amélioration") }}

		+table("fluid", "very compact", "[ 'ID', 'Date Création', 'Nom', 'Statut', 'Crédits', 'Testeurs attendus', 'Testeurs finalisés', 'Type', 'Support', 'Société', 'Actions' ]")
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import { CustomTableConfig } from '@/components/CustomTable/CustomTableTypes';
import Filters from '@/components/Filters/Filters.vue';
import {
	FiltersConfigCollection,
	FiltersMap,
} from '@/components/Filters/FiltersTypes';
import HelpButton from '@/components/HelpButton/HelpButton.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Listing from '@/components/Listing/Listing';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { helpUrl } from '@/config';
import { routeIsEnabled } from '@/router';
import Languages from '@/services/LanguagesService';
import { Component } from 'vue-property-decorator';
import { Location } from 'vue-router';
import { filtersConfig, tableConfig } from './TestsListConfig';

@Component({
	components: {
		CustomTable,
		Filters,
		Tooltip,
		TextInput,
		HelpButton,
	},
	metaInfo: {
		title: '0',
		titleTemplate: `${Languages.t('Liste des tests').toString()} (%s)`,
	},
})
export default class TestersList extends Listing {
	protected readonly tableConfig: CustomTableConfig = tableConfig;
	protected filtersConfig: FiltersConfigCollection = filtersConfig;
	protected readonly helpUrl: string = helpUrl;

	protected creationRoute: Location | '' = { name: 'test creation' };

	protected getGlobalSearchFilters(value: string): FiltersMap {
		return {
			search: {
				id: value,
				title: value,
				/* customer: {
					name: value,
				}, */
			},
		};
	}

	protected async created(): Promise<void> {
		routeIsEnabled({ name: 'test edition' }, undefined, 'tests/create');
		this.mandatoryComponentInit();
		if (
			this.creationRoute !== '' &&
			!(await routeIsEnabled(
				this.creationRoute,
				undefined,
				'tests/create'
			))
		)
			this.creationRoute = '';

		this.$gtag.pageview({ page_path: `${this.$route.path}` });
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
@import '@/components/Listing/ListingStyles';

#tests {
	@include listingProperties;

	#table-container {
		table {
			.ct-cell, .ct-label {
				&.col4, &.col5, &.col6, &.col9, &.col10 {
					text-align: right;
				}

				&.col3, &.col7, &.col8 { text-align: center; }

				&.col0, &.col4, &.col5, &.col6, &.col7, &.col8, &.col10 {
					width: 3rem;
				}

				&.col9 { width: 7rem; }

				&.col2 { width: 35rem; }

				.text.id { margin: 0; }
			}
		}
	}
}
</style>
