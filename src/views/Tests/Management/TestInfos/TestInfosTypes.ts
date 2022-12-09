import { ValueTypes } from '@/components/Inputs/CustomInput/CustomInput';
import { InputOption, InputOptionTree } from '@/components/Inputs/InputsTypes';
import { Extender, LockedObject, Mutation } from '@/types';
import { DefaultTest, TestRedirection } from '@/views/Tests/TestsTypes';
import { Dictionary } from 'vue-router/types/router';

export interface TestInfosFields extends LockedObject<ValueTypes | undefined> {
	title: string;
	quota: number;
	product: string;
	device: string;
	os?: InputOptionTree;
	customer: string | InputOption;
	createdBy: string | InputOption;
	price: number;
	links?: boolean;
	linkFinish?: string;
	linkQuota?: string;
	linkFilter?: string;
	storyline: Dictionary<string>;
	testerTitle: Dictionary<string>;
}

export type FormattedCreateInfos = Mutation<
	DefaultTest,
	{
		product: string;
		device: string;
		customer: string;
		owner?: string;
		createdBy: string;
		testState: string;
		os?: { id: number }[];
	},
	| 'affectations'
	| 'credits'
	| 'dateCreation'
	| 'id'
	| 'redirection'
	| 'translation'
	| 'endedTesters'
	| 'segmentationDone'
	| 'previousState'
	| 'taskCount'
>;

export type FormattedRedirInfos = Mutation<
	TestRedirection,
	{
		test: string;
	},
	'id'
>;

export type FormattedArchiveInfos = Mutation<
	Pick<DefaultTest, 'previousState' | 'testState'>,
	{ testState: string }
>;

export type ProductInfos<T extends 'extended' | void = void> = Extender<
	{ credits: number },
	{ credits: number; quota: number; price: number },
	T
>;
