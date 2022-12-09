<template lang="pug">
include /src/components/Listing/ListingMixins
include /src/mixins

#results.view
	+view-heading
		+heading
			| {{ $t("Liste des résultats") }}
	#view-content
		+heading-secondary
			router-link.button(:to='{ name: "create results group" }')
				icon(folder, open)/
				| {{ $t("Grouper") }}
		+table("", "very compact", "[ 'ID', 'Nom', 'Testeurs Validés', 'Quota', 'Actions' ]")
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import { CustomTableConfig } from '@/components/CustomTable/CustomTableTypes';
import Filters from '@/components/Filters/Filters.vue';
import { FilterConfig, FiltersMap } from '@/components/Filters/FiltersTypes';
import FlashMessage from '@/components/FlashMessage/FlashMessage.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Listing from '@/components/Listing/Listing';
import { Component } from 'vue-property-decorator';
import { filtersConfig, tableConfig } from './ResultsListConfig';

@Component({
	components: {
		CustomTable,
		Filters,
		TextInput,
		FlashMessage,
	},
})
export default class ResultsList extends Listing {
	protected tableConfig: CustomTableConfig = tableConfig;
	protected filtersConfig: FilterConfig[] = filtersConfig;

	protected getGlobalSearchFilters(value: string): FiltersMap {
		return {
			search: {
				id: value,
				name: value,
				customer: {
					name: value,
				},
			},
		};
	}

	protected created(): void {
		this.mandatoryComponentInit();

		this.$gtag.pageview({ page_path: `${this.$route.path}` });
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
@import '@/components/Listing/ListingStyles';

#results {
	@include listingProperties;

	#table-container {
		table {
			&:not(.sub-table) {
				> tbody > tr > .ct-cell,
				> thead > tr > .ct-label {
					&.col2, &.col3, &.col4 {
						text-align: right;
					}

					&.col4, &.col0 {
						width: 3rem;
					}

					.text.id { margin: 0; }
				}

				.sub-table {
					.ct-cell, .ct-label {
						&.col1, &.col2 {
							width: 3rem;
							text-align: center;
						}

						&.col3 {
							width: 5rem;
							text-align: right;
						}
					}
				}
			}
		}
	}
}
</style>
