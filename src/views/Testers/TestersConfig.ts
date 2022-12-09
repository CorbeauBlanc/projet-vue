import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import { usersUrl } from '@/views/Users/UsersConfig';
import { AxiosRequestConfig } from 'axios';

export const testersUrl: string = usersUrl;

export const testersConfig: AxiosRequestConfig = {
	...AxiosUtils.defaultConfig,
	params: {
		userType: 2,
	},
};

export const testerAuthUrl: string = `${Environment.any.legacyUrl}/customer/authentication/usertesting/id`;
