import { State } from '@/AppTypes';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { DefaultUser } from '@/views/Users/UsersTypes';
import { Dictionary } from 'vue-router/types/router';

export interface DefaultTest {
	id: number;
	affectations: {
		close: number;
		subCampaign: {
			type: number;
		};
	}[];
	title: string;
	testState: TestState;
	credits: number;
	expectedTesters: number;
	endedTesters: number;
	dateCreation: string;
	device: TestDevice;
	product: TestProduct;
	previousState: number | null;
	segmentationDone: boolean;
	taskCount: number;
	customer: DefaultTestCompany;
	createdBy: DefaultTestUser;
	translation: string;
	price: number;
	userInfo: Dictionary<{
		scenario: string;
		usertitle: string;
	}>;
	redirection: TestRedirection | null;
	os: { id: number; name: string; active: number }[] | null;
}

export type DefaultTestCompany = Pick<DefaultCompany, 'id' | 'name'>;

export type DefaultTestUser = Pick<
	DefaultUser,
	'id' | 'firstName' | 'lastName'
>;

export class TestState extends State {
	public static readonly inPreparation: number = 1;
	public static readonly pilot: number = 2;
	public static readonly inProgress: number = 3;
	public static readonly ended: number = 4;
	public static readonly archived: number = 5;
	public static getStateClass(id: number): string {
		const prefix: string = 'badge basic small';
		switch (id) {
			case TestState.inPreparation:
			case TestState.pilot:
				return prefix;
			case TestState.inProgress:
				return `${prefix} blue`;
			case TestState.ended:
				return `${prefix} green`;
			case TestState.archived:
				return `${prefix} red`;
			default:
				return '';
		}
	}

	public id!: number;
	public value!: string;
	public class?: string;
}

export class TestProduct {
	public static readonly video: number = 5;
	public static readonly form: number = 6;
	public static readonly survey: number = 7;

	public id!: number;
	public icon?: string;
}

export class TestDevice {
	public static readonly smartphone: number = 1;
	public static readonly tablet: number = 2;
	public static readonly computer: number = 3;

	public id!: number;
	public icon?: string;
}

export interface TestRedirection {
	id: number;
	enable: 1 | 0;
	quota?: string;
	filter?: string;
	finish?: string;
}
