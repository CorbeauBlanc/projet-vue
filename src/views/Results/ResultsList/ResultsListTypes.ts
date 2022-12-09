import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import { Mutation } from '@/types';
import { DefaultResult } from '@/views/Results/ResultsTypes';

export type ResultsListItem = Mutation<
	DefaultResult,
	{ actions?: CustomTableCellData },
	'state'
>;
