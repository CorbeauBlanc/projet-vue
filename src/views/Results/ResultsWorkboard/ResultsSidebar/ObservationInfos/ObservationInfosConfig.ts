import { InputConfig, InputType } from '@/components/Inputs/InputsTypes';

export const valencyInputConfig: InputConfig<InputType.RADIOS> = {
	label: 'Valence',
	translate: true,
	options: [
		{
			text: 'Positif',
			value: '1',
			class: 'compact ghost secondary',
			icon: 'valency positive green text',
		},
		{
			text: 'Neutre',
			value: '2',
			class: 'compact ghost secondary',
			icon: 'valency neutral',
		},
		{
			text: 'Négatif',
			value: '3',
			class: 'compact ghost secondary',
			icon: 'valency negative red text',
		},
	],
	constraints: {
		required: true,
	},
};

export const severityInputConfig: InputConfig<InputType.RADIOS> = {
	label: 'Sévérité',
	translate: true,
	options: [
		{
			text: 'Mineur',
			value: '1',
			class: 'compact ghost secondary',
			icon: 'severity minor yellow text',
		},
		{
			text: 'Sérieux',
			value: '2',
			class: 'compact ghost secondary',
			icon: 'severity serious orange text',
		},
		{
			text: 'Critique',
			value: '3',
			class: 'compact ghost secondary',
			icon: 'severity critical red text',
		},
	],
	constraints: {
		required: true,
	},
};

export const titleConfig: InputConfig<InputType.TEXT> = {
	multiple: false,
	constraints: {
		required: true,
		maxlength: 60,
	},
};

export const obsDescriptionConfig: InputConfig<InputType.WYSIWYG> = {
	constraints: {
		required: true,
	},
};

export const obsRecommendationConfig: InputConfig<InputType.WYSIWYG> = {
	/* label: 'Recommendation',
    externalId: '',
    translate: true, */
};
