<template lang="pug">
	#link-observation
		filters(
			v-master:value="tableFilters"
			:inputs="filtersConfig"
			:lazy="false"
		)

		div.table-container
			.loading(v-if="tableIsLoading")
				.loader
			.segment.empty.state(v-if="listLength < 1 && !tableIsLoading")
				icon(search huge)/
				h4.content {{ $t('Aucun résultat') }}
			div(v-show="listLength > 0")
				custom-table.data(
					ref="table",
					:config="tableConfig",
					:labels="['Loc.', 'Val.', 'Sév.', 'Titre', 'Actions']",
					:filters="tableFilters",
					@updated="onTableUpdate($vnode.componentInstance)"
					@componentevent="handleObservationEvent($event)",
					@loading="tableIsLoading = $event",
				)
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableParserConfig,
} from '@/components/CustomTable/CustomTableTypes';
import Filters from '@/components/Filters/Filters.vue';
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import { InputOption, InputType } from '@/components/Inputs/InputsTypes';
import LocalListing from '@/components/Listing/LocalListing';
import AxiosUtils from '@/services/AxiosUtils';
import Sidebars from '@/services/SidebarsService';
import { ContentType, GetListResponse, LdData } from '@/types';
import {
	ObservationListItem,
	SourceType,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/LinkObservation/LinkObservationTypes';
import {
	favSourceUrl,
	linkSourceUrl,
	observationsUrl,
} from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarConfig';
import { SidebarEvent } from '@/views/Results/ResultsWorkboard/ResultsSidebar/ResultsSidebarTypes';
import {
	RetrievedObservation,
	SeverityType,
	ValencyType,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import Axios, { AxiosResponse } from 'axios';
import { Component, Watch } from 'vue-property-decorator';

@Component({
	components: {
		CustomTable,
		Filters,
	},
})
export default class LinkObservation extends LocalListing {
	protected results: typeof Sidebars.results = Sidebars.results;
	protected currentObservationSearch: string | InputOption = '';

	protected tableConfig: CustomTableConfig = {
		translate: true,
		enablePagination: {
			limit: 25,
		},
		enableSorting: {
			enabled: [0, 1, 2, 3],
			sortingKeys: [
				['observationLocalisation', 'name'],
				'valency',
				'severity',
				'title',
			],
		},
		restConfig: {
			get: {
				url: observationsUrl,
				config: {
					...AxiosUtils.defaultConfig,
					params: {
						result: {
							id: Sidebars.results.resultId,
						},
						sources: {
							id: SourceType.getSourceId(Sidebars.results.data),
							type: SourceType.getSourceType(
								Sidebars.results.data
							),
						},
						hasLinkedObservations: false,
					},
				},
				promiseCallback: (
					response?: AxiosResponse<LdData<RetrievedObservation>>
				): GetListResponse => {
					if (!response?.data) return { data: [] };

					const formattedResponse: GetListResponse =
						LdData.getFormattedResponse(response.data);

					formattedResponse.data.forEach(
						(observation: ObservationListItem): void => {
							observation.actions = {
								content: {
									type: ContentType.COMPONENT,
									value: '',
									component: {
										path: 'views/Results/ResultsWorkboard/ResultsSidebar/LinkObservation/LinkObservationActions.vue',
										name: 'LinkObservationActions',
										data: {
											id: `${observation.id}`,
											associationId: `${observation.observationSourceId}`,
											linked: observation.linked,
											bookmarked: observation.favorite,
										},
									},
								},
							} as CustomTableCellData;
						}
					);

					return formattedResponse;
				},
			},
			parserConfig: {
				trackBy: 'id',
				keys: new Array<keyof ObservationListItem>(
					'localisationDto',
					'valency',
					'severity',
					'title',
					'actions'
				),
				modifier: (
					value: any,
					key: keyof ObservationListItem
				): CustomTableCellData | string | number => {
					switch (key) {
						case 'localisationDto':
							return {
								key,
								content: { value: value.name },
							} as CustomTableCellData;
						case 'valency':
							return {
								key,
								content: {
									value,
									type: ContentType.ICON,
									class: `${
										value === ValencyType.positive
											? 'positive green'
											: ''
									}${
										value === ValencyType.neutral
											? 'neutral'
											: ''
									}${
										value === ValencyType.negative
											? 'negative red'
											: ''
									} text valency`,
								},
							} as CustomTableCellData;
						case 'severity':
							return {
								key,
								content: {
									value,
									type: ContentType.ICON,
									class: `${
										value === SeverityType.minor
											? 'minor yellow'
											: ''
									}${
										value === SeverityType.serious
											? 'serious orange'
											: ''
									}${
										value === SeverityType.critical
											? 'critical red'
											: ''
									} text severity`,
								},
							} as CustomTableCellData;
						case 'title':
							return {
								key,
								content: { value },
							};
						default:
							return value;
					}
				},
			} as CustomTableParserConfig<ObservationListItem>,
		},
	};

	protected filtersConfig: FilterConfig<
		InputType.CHECKBOX | InputType.DATALIST
	>[] = [
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher un constat...',
			translate: true,
			multiple: false,
			rest: {
				options: {
					page: 1,
					get: {
						url: observationsUrl,
						config: {
							...AxiosUtils.defaultConfig,
							params: {
								result: {
									id: Sidebars.results.resultId,
								},
								sources: {
									id: SourceType.getSourceId(
										Sidebars.results.data
									),
									type: SourceType.getSourceType(
										Sidebars.results.data
									),
								},
								hasLinkedObservations: false,
							},
						},
						promiseCallback: (
							response?: AxiosResponse<
								LdData<RetrievedObservation>
							>
						): GetListResponse => {
							const ret: GetListResponse<InputOption> =
								GetListResponse.empty;
							if (!response?.data) return ret;

							LdData.getFormattedResponse(
								response?.data || []
							).data.forEach(
								(observation: RetrievedObservation): void => {
									ret.data.push({
										text: observation.title,
										value: observation.title,
									});
								}
							);
							return ret;
						},
					},
					filterBy: [['search', 'title']],
				},
			},
			key: ['search', 'title'],
		},
		{
			type: InputType.CHECKBOX,
			translate: true,
			placeholder: 'Afficher uniquement les constats liés à cette source',
			key: 'hasLinkedObservations',
		},
	];

	@Watch('results.data', { immediate: true })
	protected onDataChange(): void {
		if (this.table) this.table.retrieveData();
	}

	public refreshObservationTable(): void {
		this.table.retrieveData();
	}

	protected handleObservationEvent(event: {
		sidebarEvent: string;
		state?: boolean;
		id: string;
	}): void {
		if (event.state !== undefined)
			switch (event.sidebarEvent) {
				case 'link':
					this.link(event.id, event.state);
					break;
				case 'bookmark':
					this.bookmark(event.id, event.state);
					break;
				default:
					break;
			}
		else if (event.sidebarEvent === 'edit')
			this.$emit('edit', { id: event.id });
	}

	protected link(id: string, link: boolean): void {
		Axios.put(
			`${linkSourceUrl}`,
			{
				linked: link,
				chartJson: '', // not used for video extracts
				observationId: Number.parseInt(id),
				sourceFilterOverload: null, // not used for video extracts
				sourceHeader: null, // not used for video extracts
				sourceId: SourceType.getSourceId(this.results.data), // can be number[] with verbatims
				sourceType: SourceType.getSourceType(this.results.data),
			},
			AxiosUtils.defaultConfig
		)
			.then((response: any): void => {
				this.results.refreshSidebar(true);
				this.table.retrieveData();

				if (link)
					this.$emit('sidebarEvent', {
						type: 'success',
						message: 'Association du constat effectuée avec succès',
					} as SidebarEvent);
				else
					this.$emit('sidebarEvent', {
						type: 'success',
						message:
							'Désassociation du constat effectuée avec succès',
					} as SidebarEvent);
			})
			.catch((error: any): void => {
				this.$emit('sidebarEvent', {
					type: 'error',
					message: "Échec de l'association du constat",
				} as SidebarEvent);
				AxiosUtils.defaultErrorLog(
					`LinkObservationActions: Cannot put on ${linkSourceUrl}`,
					error
				);
			});
	}

	protected bookmark(associationId: string, bookmark: boolean): void {
		Axios.put(
			favSourceUrl,
			{
				observationSourceId: Number.parseInt(associationId),
				favorite: bookmark,
			},
			AxiosUtils.defaultConfig
		)
			.then((response: any): void => {
				this.table.retrieveData();
			})
			.catch((error: any): void => {
				AxiosUtils.defaultErrorLog(
					`LinkObservationActions: Cannot put on ${favSourceUrl}`,
					error
				);
			});
	}
}
</script>

<style lang="scss">
@import '@/styles/variables';
@import '@/styles/mixins';

#link-observation {
	margin-top: $padding;
	font-size: $sidebar-font-size;

	.list-filters {
		flex-direction: column;

		.field-component {
			max-width: none !important;
			width: 100% !important;
			padding: 0;

			&:first-child {
				margin: 0 !important;
			}

			&:last-child {
				margin-bottom: 0 !important;
			}
		}
	}

	.pagination .item {
		min-width: unset !important;
	}

	.table-container {
		position: relative;
		height: 40vh;

		.segment.empty.state {
			margin-top: $padding;
		}

		table {
			.ct-cell, .ct-label {
				&.col1, &.col2 {
					text-align: center;
				}

				&.col4 {
					text-align: right;
				}

				&.col0, &.col3 {
					width: 33rem;
				}
			}
		}
	}
}
</style>
