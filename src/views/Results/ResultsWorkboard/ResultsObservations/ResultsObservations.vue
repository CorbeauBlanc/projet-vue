<template>
	<div id="results-observations">
		<div class="container fluid">
			<div class="heading secondary">
				<div class="title">Liste des constats</div>
			</div>
			<div class="heading secondary">
				<div>
					<select-input :config="testSelect" v-model="selectedTest" />
				</div>
				<div>
					<text-input :config="searchInput" v-model="searched" />
					<button class="button ghost"><icon filter />Filtrer</button>
					<button class="button ghost" @click="openFusionModal">
						<icon merge />Fusionner des constats
					</button>
					<button class="button icon ghost">
						<icon export file />
					</button>
				</div>
			</div>
		</div>
		<div class="container fluid">
			<div class="stackable grid">
				<observations-spread />
				<observations-local-spread />
			</div>
		</div>
		<div class="container fluid">
			<div class="segments">
				<div class="segment very compact">
					<custom-table
						class="data"
						ref="table"
						:data="list"
						:config="config"
						:labels="[
							'Titre',
							'Localisation',
							'Supports',
							'Valence',
							'Sévé.',
							'Occ.',
							'Description',
							'Recommandation',
							'Actions',
						]"
						:filters="tableFilters"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableDataGenericInput,
} from '@/components/CustomTable/CustomTableTypes';
import { InputConfig, InputOption } from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { ContentType } from '@/types';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ObservationsLocalSpread from './ObservationsLocalSpread.vue';
import ObservationsSpread from './ObservationsSpread.vue';
import ResultsObservationsFusion from './ResultsObservationsFusion/ResultsObservationsFusion.vue';

@Component({
	components: {
		TextInput,
		SelectInput,
		ObservationsSpread,
		ObservationsLocalSpread,
		CustomTable,
	},
})
export default class ResultsObservations extends Vue {
	protected fusionModal!: ResultsObservationsFusion;
	protected testSelect: InputConfig = {
		options: [
			{
				text: 'test1',
				value: '1',
			},
			{
				text: 'test2',
				value: '2',
			},
			{
				text: 'test3',
				value: '3',
			},
		],
	};
	protected searchInput: InputConfig = {
		placeholder: 'Rechercher par mot clé...',
		multiple: false,
		search: true,
	};

	protected selectedTest: InputOption[] = [{ text: '', value: '1' }];
	protected searched: string[] = [''];

	protected config: CustomTableConfig = {
		enablePagination: {
			limit: 25,
		},
	};

	protected tableFilters: { [key: string]: string | string[] } = {};

	protected list: CustomTableDataGenericInput = {
		data: [
			{
				title: 'peace',
				localisation: 'bravo',
				device: {
					content: {
						value: 'mobile',
						type: ContentType.ICON,
					},
				} as CustomTableCellData,
				valency: {
					content: {
						value: 'valency positive',
						type: ContentType.ICON,
						class: 'text green',
					},
				} as CustomTableCellData,
				gravity: '-',
				occurence: 1,
				description: 'flex',
				recommandation: '',
				actions: {
					content: {
						type: ContentType.COMPONENT,
						value: '',
						component: {
							path: 'views/Results/ResultsWorkboard/ResultsObservations/ResultsObservationsActions.vue',
							name: 'ResultsObservationsActions',
						},
					},
				} as CustomTableCellData,
			},
		],
	};

	protected openFusionModal(): void {
		if (this.fusionModal && !this.fusionModal.isClosed) return;
		this.fusionModal = new ResultsObservationsFusion();
		this.fusionModal.open();
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#results-observations {
	table {
		&.data > thead > tr > th, &.data > tbody > tr > td {
			&:last-child, &:nth-child(6), &:nth-child(7), &:nth-child(8) {
				text-align: right;
				text-align-last: auto;
				align-items: flex-end;
				justify-content: flex-end;
			}

			&:last-child, &:nth-child(3), &:nth-child(4), &:nth-child(5) {
				width: 3rem;
			}

			&:nth-child(3), &:nth-child(4),
			&:nth-child(5) {
				text-align: center;
			}
		}
	}

	.segment.header {
		display: flex;
		justify-content: space-between;
	}

	.text-input {
		display: inline-block;
		vertical-align: middle;
		margin-right: math.div($padding, 2);
	}
}
</style>
