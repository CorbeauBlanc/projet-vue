import Environment from '@/services/EnvironmentService';

export const localisationsUrl: string = `${Environment.any.api}/observation_localisations`;
export const observationsUrl: string = `${Environment.any.api}/observations`;
export const linkSourceUrl: string = `${Environment.any.api}/observations/link-source`;
export const favSourceUrl: string = `${Environment.any.api}/observations/favorite`;
