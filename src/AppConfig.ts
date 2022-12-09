import { AccordionLevel } from '@/components/Accordion/AccordionTypes';
import { helpUrl } from '@/config';

export const levels: AccordionLevel[] = [
	{
		title: 'Tests',
		class: 'lvl1',
		icon: 'icon tests',
		route: {
			name: 'tests',
		},
		routeLegacyRight: 'tests/create/list',
	},
	{
		title: 'Résultats',
		class: 'lvl1',
		icon: 'icon results',
		route: {
			name: 'results',
		},
		routeLegacyRight: 'result/list',
	},
	{
		title: 'Panel',
		class: 'lvl1',
		icon: 'icon panel',
		nextLevels: [
			{
				title: 'Testeurs',
				class: 'lvl2',
				icon: 'icon users',
				route: {
					name: 'testers',
				},
				routeLegacyRight: 'panel/see',
			},
			{
				title: 'Affectations',
				class: 'lvl2',
				icon: 'icon affectations',
				nextLevels: [
					{
						title: 'Liste',
						class: 'lvl3',
						route: {
							name: 'all testers affectations',
						},
						routeLegacyRight: 'panel/affectations/list',
					},
				],
			},
			{
				title: 'Spécificités',
				icon: 'icon specificities',
				class: 'lvl2',
				nextLevels: [
					{
						title: 'Critères',
						class: 'lvl3',
						route: {
							name: 'criterias',
						},
						routeLegacyRight: 'panel/criteria/criterion/list',
					},
					{
						title: 'Groupes',
						class: 'lvl3',
						route: {
							name: 'groups',
						},
						routeLegacyRight: 'panel/criteria/group/see',
					},
					{
						title: 'Pages',
						class: 'lvl3',
						route: {
							name: 'pages',
						},
						routeLegacyRight: 'panel/criteria/page/see',
					},
				],
			},
		],
	},
	{
		title: 'Aide en ligne',
		class: 'lvl1',
		icon: 'icon circle help',
		link: helpUrl,
		target: '_blank',
		routeLegacyRight: 'faq/see',
	},
];
