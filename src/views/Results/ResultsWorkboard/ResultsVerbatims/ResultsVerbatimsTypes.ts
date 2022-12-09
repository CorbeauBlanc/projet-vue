export interface TaskData {
	index: number;
	total: number;
	content: string;
	verbatims?: VerbatimData[];
}

export interface VerbatimData {
	id: string;
	actions: ('answers' | 'hide' | 'link')[];
	user?: {
		name: string;
		id: string;
	};
	status?: string;
	answer?: string;
	task?: TaskData;
}

export type VerbatimSelection = { selectedVerbatims: string[] };
