import { ValueTypes } from '@/components/Inputs/CustomInput/CustomInput';
import { InputOption } from '@/components/Inputs/InputsTypes';
import { LockedObject } from '@/types';

export interface SidebarEvent {
	type: 'error' | 'success' | 'warning';
	message: string;
}

export interface ObservationFields
	extends LockedObject<ValueTypes | undefined> {
	localisation: string | InputOption;
	valency: string;
	severity?: string;
	title: string;
	description: string;
	recommendation?: string;
}

export interface OptionalObservationFields
	extends LockedObject<ValueTypes | undefined> {
	bookmarked: boolean;
	videoCutDescription: string;
}

export interface FormattedCreateObservation {
	resultId: number;
	sourceId: number;
	sourceType: number;
	// to define later with verbatims/charts...
	chartJson: null;
	sourceFilterOverload: null;
	localisationId: number;
	valency: number;
	severity?: null | number;
	title: string;
	description: string;
	recommendation?: string;
	favorite: boolean;
	sourceHeader: null | string;
}
