import Environment from '@/services/EnvironmentService';

export const adminAffectationsUrl: string = `${Environment.any.processingApi}/admin/affectations`;
export const videoStatus: { text: string; class: string }[] = [
	{
		text: 'Pas de vidéo disponible',
		class: 'yellow',
	},
	{
		text: 'Vidéo disponible',
		class: 'green',
	},
	{
		text: 'Vidéo en erreur',
		class: 'red',
	},
];
