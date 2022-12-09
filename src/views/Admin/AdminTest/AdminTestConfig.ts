import { NumberInputConfig } from '@/components/Inputs/InputsTypes';
import Environment from '@/services/EnvironmentService';

export const adminTestsUrl: string = `${Environment.any.processingApi}/admin/tests`;

export const editQuotaConfig: NumberInputConfig = {
	label: 'Modifier le quota',
	multiple: false,
	translate: true,
	constraints: {
		min: 0,
	},
};
export const editQuotaPrice: NumberInputConfig = {
	label: 'Modifier la rémunération',
	multiple: false,
	translate: true,
	constraints: {
		min: 0,
	},
};
