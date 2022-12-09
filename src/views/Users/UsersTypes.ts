import { State } from '@/AppTypes';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';

export interface DefaultUser {
	id: number;
	firstName: string;
	lastName: string;
	dateCreation: string;
	email: string;
	state: UserState;
	permissionGroup: UserGroup;
	customers: DefaultUserCompany[];
}

export type DefaultUserCompany = Pick<DefaultCompany, 'id' | 'name'>;

export class UserState extends State {
	public static readonly active: number = 0;
	public static readonly archived: number = 1;
	public static readonly notValidated: number = 2;
	public static getStateClass(id: number): string {
		const prefix: string = 'badge basic';
		switch (id) {
			case UserState.active:
				return `${prefix} green`;
			case UserState.notValidated:
				return `${prefix} yellow`;
			case UserState.archived:
				return `${prefix} red`;
			default:
				return '';
		}
	}

	public id!: number;
	public value!: string;
	public class?: string;
}

export interface UserGroup {
	id: number;
	title: string;
}
