import { CustomTableCellData } from '@/components/CustomTable/CustomTableTypes';

export interface FormattedCutRowData {
	report: string;
	start: string;
	end: string;
	length: string;
	actions: CustomTableCellData;
	cutId: string;
}
