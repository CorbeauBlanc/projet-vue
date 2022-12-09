import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import { LockedObject } from '@/types';

export type FilterConfig<I extends InputType = InputType> = InputConfig<I> & {
	/**
	 * The key of the cells it should filter
	 */
	key?: string | string[];
	/**
	 * Class to add to the root of each filter
	 */
	class?: string;
};

export type FiltersValue = string | InputOption | (string | InputOption)[];
export type FiltersMap = LockedObject<FiltersValue>;
export type FiltersConfigCollection<I extends InputType = InputType> = (
	| FilterConfig<I>
	| Promise<FilterConfig<I>>
)[];
