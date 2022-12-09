import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import { Mutation } from '@/types';
import { DefaultTest } from '@/views/Tests/TestsTypes';

export type TestsListItem = Mutation<
	DefaultTest,
	{ actions?: CustomTableCellData },
	| 'affectations'
	| 'createdBy'
	| 'translation'
	| 'price'
	| 'redirection'
	| 'userInfo'
	| 'segmentationDone'
	| 'taskCount'
>;
