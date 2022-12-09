import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import ComponentsUtils from '@/services/ComponentsUtils';
import Js from '@/services/JsService';
import Languages from '@/services/LanguagesService';
import { Mutation } from '@/types';
import { DefaultResult } from '@/views/Results/ResultsTypes';
import { DefaultTest } from '@/views/Tests/TestsTypes';
import sanitizeHtml from 'sanitize-html';

export type RetrievedTestInfos = Pick<DefaultTest, 'id'>;

export type RetrievedResultInfos = Mutation<
	DefaultResult,
	{ testType: number[] }
>;
export interface RetrievedTask {
	id: number;
	beginTime: number;
	duration: number;
	success: boolean;
	instruction: {
		[lang: string]: {
			label: string;
		};
	};
}
export class TaskData {
	public static getTaskData(task: RetrievedTask, prop: string): string {
		switch (prop) {
			case 'instruction':
				return sanitizeHtml(
					Languages.getLangData(task.instruction, 'label'),
					ComponentsUtils.defaultSanitizerOptions
				);
			case 'duration':
				return Js.formatTime(task.duration, true);
			default:
				return 'no data';
		}
	}

	public id: string = '';
	public index: number = 0;
	public html: string = '';
	public timeStamp: number = 0;
}
export interface RetrievedCut {
	id: number;
	originId: number | null; // 1 or null: manually created cut, 2: from AI API
	timeStart: number;
	timeEnd: number;
	duration: number;
	observationTitle?: string[];
}

export type CutListItem = Mutation<
	RetrievedCut,
	{ actions?: CustomTableCellData }
>;

export class AffectationState {
	public static readonly done: number = 2;
	public static readonly refused: number = 5;
	public static readonly validated: number = 6;
}

export interface RefusalTemplate {
	id: number;
	content: string;
}

export class RefusalType {
	public static readonly weakComments: number = 20;
	public static readonly taskNotDone: number = 21;
	public static readonly weakWrittenComments: number = 27;
	public static readonly desktopLowSoundQuality: number = 22;
	public static readonly mobileLowSoundQuality: number = 28;
	public static readonly blackDoubleScreen: number = 24;
	public static readonly lowVideoQuality: number = 25;
	public static readonly other: number = 26;
}

export interface RetrievedObservation {
	id: number;
	title: string;
	description: string;
	recommendation: string | null;
	// frequency:	null; // not used for video extracts
	// state: number;
	// element1	[]
	// element2	[]
	valency: number;
	severity?: number;
	localisationDto?: {
		id: number;
		name: string;
	};
	resultDto: {
		id: number;
		name: string;
		// validatedTesters: null;
		// quota: null;
		// tests: null;
		// product: null;
		state: {
			id: number;
			value: string;
		};
		// type: null;
	};
	favorite?: boolean;
	linked?: boolean;
	observationSourceId?: number; // id of the association between a source and an observation once they have been linked
}

export class ValencyType {
	public static readonly positive: number = 1;
	public static readonly neutral: number = 2;
	public static readonly negative: number = 3;
}

export class SeverityType {
	public static readonly minor: number = 1;
	public static readonly serious: number = 2;
	public static readonly critical: number = 3;
}

export interface RetrievedObsLocalisation {
	dateCreation: string;
	dateUpdate: string;
	id: number;
	name: string;
	observations: string[];
	result: string;
}
