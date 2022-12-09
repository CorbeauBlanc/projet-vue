import { InputConfig } from '@/components/Inputs/InputsTypes';

export const testConfig: InputConfig = {
	label: 'Par ID test',
	multiple: false,
	constraints: {
		pattern: /[0-9]*/.source,
	},
};

export const resultConfig: InputConfig = {
	label: 'Par ID résultat',
	multiple: false,
	constraints: {
		pattern: /[0-9]*/.source,
	},
};

export const affectationConfig: InputConfig = {
	label: 'Par ID affectation',
	multiple: false,
	constraints: {
		pattern: /[0-9]*/.source,
	},
};
