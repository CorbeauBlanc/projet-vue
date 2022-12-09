import { legacyUrl, nodeLoginUrl } from '@/config';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import Axios, { AxiosResponse } from 'axios';

const legacyNodeTokenUrl: string = `${legacyUrl}/customer/test/segmentation/ajax/read/token`;

type RetrievedToken = {
	token: string;
};

type RetrievedTokenContent = {
	content: {
		token: string;
	};
};

function getNodeLoginTokenAccess(): Promise<string> {
	return new Promise<string>(
		(
			resolve: (value: string) => void,
			reject: (reason: any) => void
		): void => {
			Axios.get(legacyNodeTokenUrl, AxiosUtils.defaultConfig)
				.then(
					(response: AxiosResponse<RetrievedTokenContent>): void => {
						resolve(response.data.content.token || '');
					}
				)
				.catch((reason: any): void => {
					Logger.error(
						`getNodeLoginTokenAccess: Cannot get data from ${legacyNodeTokenUrl}:`,
						reason
					);
					reject(reason);
				});
		}
	);
}

/**
 * @returns the token to connect with the websocket server
 */
export default function loginNode(): Promise<string> {
	return new Promise<string>(
		(
			resolve: (value: any) => void,
			reject: (reason: any) => void
		): void => {
			getNodeLoginTokenAccess().then((retrievedToken: string): void => {
				Axios.post(nodeLoginUrl, {
					tokenAcc2: retrievedToken,
				})
					.then((response: AxiosResponse<RetrievedToken>): void => {
						resolve(response.data.token);
					})
					.catch((reason: any): void => {
						Logger.error(
							`loginNode: Cannot post on ${nodeLoginUrl}:`,
							reason
						);
						reject(reason);
					});
			});
		}
	);
}
