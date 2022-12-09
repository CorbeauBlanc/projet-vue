import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import {
	isVideoCut,
	VideoCut,
} from '@/components/VideoPlayer/VideoPlayerTypes';
import { Mutation } from '@/types';
import { VerbatimData } from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { RetrievedObservation } from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';

export type ObservationListItem = Mutation<
	RetrievedObservation,
	{ actions?: CustomTableCellData }
>;

export class SourceType {
	public static readonly videoExtract: number = 1;
	public static readonly graph: number = 2;
	public static readonly verbatim: number = 3;
	public static readonly medley: number = 5;
	public static readonly fusion: number = 6;

	public static getSourceType(source: VideoCut | VerbatimData[]): number {
		if (isVideoCut(source)) return this.videoExtract;
		else return this.verbatim;
	}

	/**
	 * Only handles videoCuts for now
	 */
	public static getSourceId(source: VideoCut | VerbatimData[]): number {
		if (isVideoCut(source)) return Number.parseInt((source as VideoCut).id);
		else return 0;
	}
}
