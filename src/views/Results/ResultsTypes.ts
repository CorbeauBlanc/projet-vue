import { DefaultTest } from '@/views/Tests/TestsTypes';

export interface DefaultResult {
	id: number;
	name: string;
	validatedTesters: number;
	quota: number;
	tests: DefaultResultTest[];
	state: ResultState;
}

export interface ResultState {
	id: string;
	value: string;
}

export type DefaultResultTest = Pick<
	DefaultTest,
	'id' | 'title' | 'device' | 'product' | 'expectedTesters'
>;
