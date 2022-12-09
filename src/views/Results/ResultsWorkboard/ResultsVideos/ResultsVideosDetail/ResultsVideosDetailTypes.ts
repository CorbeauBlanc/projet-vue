import { SttData } from '@/components/VideoPlayer/SpeechToText/SpeechToTextTypes';
import {
	RetrievedCut,
	RetrievedTask,
	RetrievedTestInfos,
} from '@/views/Results/ResultsWorkboard/ResultsWorkboardTypes';

export interface RetrievedUser {
	id: number;
	age?: number; // "mandatory" attributes they say bruh
	gender?: string;
	firstName?: string;
	lastName?: string;
}

export interface RetrievedUserAgent {
	browser?: {
		name?: string;
		version?: string;
	};
	device?: {
		manufacturer?: string;
		model?: string;
		type?: string;
		subtype?: string;
	};
	engine?: {
		name?: string;
		version?: string;
	};
	os?: {
		alias?: string;
		name?: string;
		version?: string | { value: string };
	};
}

export interface RetrievedUserInfo {
	[lang: string]: {
		scenario: string;
		usertitle: string;
	};
}

export interface RetrievedVideoDetail {
	'@id': string;
	affectationState: number;
	duration: number;
	speechToText: SttData;
	mediaLink: string;
	tasks: RetrievedTask[];
	test: RetrievedTestInfos;
	user: RetrievedUser;
	userInfo: RetrievedUserInfo;
	userAgent: RetrievedUserAgent;
}
