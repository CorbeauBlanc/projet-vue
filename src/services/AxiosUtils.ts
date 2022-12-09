import FlashMessages from '@/services/FlashMessagesService';
import Logger from '@/services/LoggerService';
import { RouterUtils } from '@/services/RouterUtils';
import { AxiosError, AxiosRequestConfig } from 'axios';
import QueryString from 'qs';

export default class AxiosUtils {
	public static instance: AxiosUtils = new AxiosUtils();

	public static defaultHeaders: any = {
		accept: 'application/ld+json',
	};

	public static defaultConfig: AxiosRequestConfig = {
		headers: AxiosUtils.defaultHeaders,
		withCredentials: true,
	};

	public static legacyRoutesConfig: AxiosRequestConfig = {
		headers: {
			accept: 'application/json',
		},
		withCredentials: true,
	};

	public static defaultParamSerializerOptions: QueryString.IStringifyOptions =
		{
			arrayFormat: 'brackets',
			encodeValuesOnly: true,
		};

	public static defaultParamSerializer(params: any): string {
		return QueryString.stringify(
			params,
			AxiosUtils.defaultParamSerializerOptions
		);
	}

	public static defaultParamParser(params: any): QueryString.ParsedQs {
		return QueryString.parse(params);
	}

	public static setDefaultHeadersAuthorization(token: string): void {
		AxiosUtils.defaultHeaders.authorization = `Bearer ${token}`;
	}

	public static defaultErrorLog(msg: string, ...error: any[]): void {
		Logger.error(msg, ...error);
		FlashMessages.error(
			'general',
			"Une erreur s'est produite. Veuillez vérifier votre connexion internet et contacter l'équipe technique si l'erreur se reproduit."
		);
	}

	public static defaultErrorCatch(error: AxiosError, src?: string): void {
		src = src || `AxiosUtils: request failed`;
		if (error.response?.status !== 401)
			AxiosUtils.defaultErrorLog(src, error);
		else {
			Logger.dbgWarn(`${src}: error 401`);
			RouterUtils.instance.router?.push({ name: 'login' });
		}
	}

	public static defaultErrorThrow(error: AxiosError, src?: string): void {
		this.defaultErrorCatch(error, src);
		throw error;
	}

	public static defaultSilentErrorLog(msg: string, ...error: any[]): void {
		Logger.dbgError(msg, ...error);
	}

	public static defaultSilentErrorCatch(
		error: AxiosError,
		src?: string
	): void {
		src = src || `AxiosUtils: request failed`;
		if (error.response?.status !== 401)
			AxiosUtils.defaultSilentErrorLog(src, error);
		else {
			Logger.dbgWarn(`${src}: error 401`);
			RouterUtils.instance.router?.push({ name: 'login' });
		}
	}

	public static defaultSilentErrorThrow(
		error: AxiosError,
		src?: string
	): void {
		this.defaultSilentErrorCatch(error, src);
		throw error;
	}

	private constructor() {
		return;
	}
}
