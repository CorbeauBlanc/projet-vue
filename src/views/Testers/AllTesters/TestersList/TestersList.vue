<template lang="pug">
include /src/components/Listing/ListingMixins
include /src/mixins

#all-testers.view(v-if='tableConfig')
	+flash-message
	+view-heading
		+heading
			| {{ $t("Liste des testeurs") }}
	#view-content
		+heading-secondary
			router-link.button.heading-button(:to='creationRoute' :class='{ disabled: creationRoute === "" }')
				icon(add)/
				| {{ $t("Ajouter un testeur") }}
			router-link.button.ghost.icon(:to='importRoute' :class='{ disabled: importRoute === "" }')
				icon(import, file)/
				tooltip.top
					| {{ $t("Importer une liste de testeurs") }}
			router-link.button.ghost.icon(:to='recruitmentRoute' :class='{ disabled: recruitmentRoute === "" }')
				icon(type, droplist)/
				tooltip.top.align.right
					| {{ $t("Formulaire de recrutement") }}
		+table("", "very compact", "[ 'ID', 'Date', 'Prénom', 'Nom', 'Email', 'Société', 'Statut', 'Actions' ]")
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import { CustomTableConfig } from '@/components/CustomTable/CustomTableTypes';
import Filters from '@/components/Filters/Filters.vue';
import {
	FiltersConfigCollection,
	FiltersMap,
} from '@/components/Filters/FiltersTypes';
import FlashMessage from '@/components/FlashMessage/FlashMessage.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Listing from '@/components/Listing/Listing';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { testapicId } from '@/config';
import { routeIsEnabled } from '@/router';
import UserUtils from '@/services/UserUtils';
import {
	filtersConfig,
	tableConfig,
} from '@/views/Testers/AllTesters/TestersList/TestersListConfig';
import { DefaultUser } from '@/views/Users/UsersTypes';
import { Component } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component({
	components: {
		CustomTable,
		Filters,
		Tooltip,
		TextInput,
		FlashMessage,
	},
})
export default class TestersList extends Listing {
	protected tableConfig: CustomTableConfig | false = false;
	protected filtersConfig: FiltersConfigCollection = filtersConfig;

	protected currentUser: DefaultUser | false = false;

	protected creationRoute: Location | '' = { name: 'tester creation' };
	protected importRoute: Location | '' = { name: 'testers import' };
	protected recruitmentRoute: Location | '' = { name: 'testers recruitment' };

	protected getGlobalSearchFilters(value: string): FiltersMap {
		return {
			search: {
				id: value,
				firstName: value,
				lastName: value,
				email: value,
			},
		};
	}

	protected async created(): Promise<void> {
		this.mandatoryComponentInit();

		const currentCustomer: number = (
			await UserUtils.instance.currentUserCustomer
		).id;
		const config: CustomTableConfig = { ...tableConfig };

		if (currentCustomer !== testapicId && config.restConfig?.get)
			config.restConfig.get.url += `?userTestingCustomer[id][]=${currentCustomer}`;
		this.tableConfig = config;

		if (
			this.creationRoute !== '' &&
			!(await routeIsEnabled(
				this.creationRoute,
				undefined,
				'panel/usertesting/create'
			))
		)
			this.creationRoute = '';
		if (
			this.importRoute !== '' &&
			!(await routeIsEnabled(
				this.importRoute,
				undefined,
				'panel/usertesting/import'
			))
		)
			this.importRoute = '';
		if (
			this.recruitmentRoute !== '' &&
			!(await routeIsEnabled(
				this.recruitmentRoute,
				undefined,
				'panel/usertesting/recruitment'
			))
		)
			this.recruitmentRoute = '';

		this.$gtag.pageview({ page_path: `${this.$route.path}` });
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';
@import '@/components/Listing/ListingStyles';

#all-testers {
	@include listingProperties;

	#table-container {
		table {
			.ct-cell, .ct-label {
				&.col7 { text-align: right; }

				&.col6 { text-align: center }

				&.col0, &.col1, &.col6, &.col7 { width: 3rem; }

				//&.col2, &.col3, &.col4 { width: 7rem; }

				.text.id { margin: 0; }
			}
		}
	}
}
</style>
