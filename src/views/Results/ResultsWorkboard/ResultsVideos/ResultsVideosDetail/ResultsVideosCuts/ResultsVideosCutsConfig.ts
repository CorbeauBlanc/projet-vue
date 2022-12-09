import {
	CustomTableCellData,
	CustomTableConfig,
	CustomTableParserConfig,
} from '@/components/CustomTable/CustomTableTypes';
import AxiosUtils from '@/services/AxiosUtils';
import Js from '@/services/JsService';
import { ContentType, GetListResponse, LdData } from '@/types';
import { videoExtractUrl } from '@/views/Results/ResultsWorkboard/ResultsWorkboardConfig';
import {
	CutListItem,
	RetrievedCut,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';
import { AxiosResponse } from 'axios';

export const tableConfig: CustomTableConfig = {
	enableSorting: {
		enabled: [0, 2, 3, 4],
		sortingKeys: ['observationTitle', 'timeStart', 'timeEnd', 'duration'],
	},
	restConfig: {
		get: {
			url: videoExtractUrl,
			config: {
				...AxiosUtils.defaultConfig,
				params: {
					pagination: false,
				},
			},
			promiseCallback: (
				response?: AxiosResponse<LdData<RetrievedCut>>
			): GetListResponse => {
				if (!response?.data) return { data: [] };

				const formattedResponse: GetListResponse =
					LdData.getFormattedResponse(response.data);

				formattedResponse.data.forEach((cut: CutListItem): void => {
					cut.actions = {
						content: {
							type: ContentType.COMPONENT,
							value: '',
							component: {
								path: 'views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosCuts/ResultsVideosCutsActions.vue',
								name: 'ResultsVideosCutsActions',
								data: {
									id: `${cut.id}`,
								},
							},
						},
					} as CustomTableCellData;
				});

				return formattedResponse;
			},
		},
		parserConfig: {
			trackBy: 'id',
			keys: new Array<keyof CutListItem>(
				'observationTitle',
				'id',
				'timeStart',
				'timeEnd',
				'duration',
				'actions'
			),
			modifier: (
				value: any,
				key: keyof CutListItem
			): CustomTableCellData | string | number => {
				switch (key) {
					case 'observationTitle':
						return {
							key,
							content: {
								value: value.join(', ') || '',
							},
						} as CustomTableCellData;
					case 'id':
						return {
							key,
							content: { value },
						} as CustomTableCellData;
					case 'timeStart':
					case 'timeEnd':
					case 'duration':
						const time: string = Js.formatTime(value, true);
						return {
							key,
							content: {
								value: time,
							},
						};
					default:
						return value;
				}
			},
		} as CustomTableParserConfig<CutListItem>,
	},
};
