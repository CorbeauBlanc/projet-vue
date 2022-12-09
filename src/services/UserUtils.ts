import { RetrievedMe } from '@/AppTypes';
import { meUrl } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { DefaultUser } from '@/views/Users/UsersTypes';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dictionary } from 'lodash';

export default class UserUtils {
	public static get instance(): UserUtils {
		if (!UserUtils.pInstance) UserUtils.pInstance = new UserUtils();
		return UserUtils.pInstance;
	}
	private static pInstance: UserUtils | undefined;

	public currentUser: Promise<DefaultUser>;
	public currentUserCustomer: Promise<DefaultCompany>;
	public currentUserPermissions: Promise<string>;
	public currentUserCredits: Promise<'unlimited' | number>;

	private me!: Promise<RetrievedMe>;
	private cachedPermissions: Dictionary<boolean> = {};

	public async currentUserHasPermission(
		permission: string
	): Promise<boolean> {
		if (this.cachedPermissions[permission]) return true;

		try {
			const userPermissions: string = await this.currentUserPermissions;
			if (userPermissions.match(new RegExp(`,${permission},`))) {
				this.cachedPermissions[permission] = true;
				return true;
			}
			return false;
		} catch (error) {
			throw error;
		}
	}

	private constructor() {
		this.me = new Promise(
			(
				resolve: (value: RetrievedMe | Promise<RetrievedMe>) => void,
				reject: (reason?: any) => void
			): void => {
				axios
					.get(meUrl, AxiosUtils.defaultConfig)
					.then((value: AxiosResponse<RetrievedMe>): void =>
						resolve(value.data)
					)
					.catch((error: AxiosError): void => {
						reject(error);
						AxiosUtils.defaultErrorCatch(
							error,
							`Cannot get user from ${meUrl}:`
						);
					});
			}
		);
		this.currentUser = new Promise(
			(
				resolve: (value: DefaultUser | Promise<DefaultUser>) => void,
				reject: (reason?: any) => void
			): void => {
				this.me
					.then((value: RetrievedMe): void => resolve(value.user))
					.catch((error: AxiosError): void => {
						reject(error);
						AxiosUtils.defaultSilentErrorCatch(error);
					});
			}
		);
		this.currentUserCustomer = new Promise(
			(
				resolve: (
					value: DefaultCompany | Promise<DefaultCompany>
				) => void,
				reject: (reason?: any) => void
			): void => {
				this.me
					.then((value: RetrievedMe): void => resolve(value.customer))
					.catch((error: AxiosError): void => {
						reject(error);
						AxiosUtils.defaultSilentErrorCatch(error);
					});
			}
		);
		this.currentUserPermissions = new Promise(
			(
				resolve: (value: string | Promise<string>) => void,
				reject: (reason?: any) => void
			): void => {
				this.me
					.then((value: RetrievedMe): void =>
						resolve(`,${value.permissions.join()},`)
					)
					.catch((error: AxiosError): void => {
						reject(error);
						AxiosUtils.defaultSilentErrorCatch(error);
					});
			}
		);
		this.currentUserCredits = new Promise(
			(
				resolve: (
					value: 'unlimited' | number | Promise<'unlimited' | number>
				) => void,
				reject: (reason?: any) => void
			): void => {
				this.me
					.then((value: RetrievedMe): void =>
						resolve(
							value.credits.unlimited
								? 'unlimited'
								: value.credits.remained
						)
					)
					.catch((error: AxiosError): void => {
						reject(error);
						AxiosUtils.defaultSilentErrorCatch(error);
					});
			}
		);
		return;
	}
}
