import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { DefaultUser } from '@/views/Users/UsersTypes';

export interface RetrievedMe {
	user: DefaultUser;
	permissions: string[]; // Horrendous, disgusting, retarded, and overall really really really bad legacy permissions.
	customer: DefaultCompany;
	credits: {
		unlimited: boolean;
		remained: number;
	};
}

export abstract class State {
	public static getStateClass(id: number): string {
		return '';
	}
	public abstract id: number;
	public abstract value: string;
	public abstract class?: string;
}
