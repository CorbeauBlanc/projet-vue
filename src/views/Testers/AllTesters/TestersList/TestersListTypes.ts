import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';
import { Mutation } from '@/types';
import { DefaultUser } from '@/views/Users/UsersTypes';

export type TestersListItem = Mutation<
	DefaultUser,
	{ actions?: CustomTableCellData }
>;
