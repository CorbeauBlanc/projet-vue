import Logger from '@/services/LoggerService';
import { AxiosRequestConfig } from 'axios';
import QueryString from 'qs';

export default class AxiosUtils {
	public static instance: AxiosUtils = new AxiosUtils();

	public static defaultHeaders: any = {};

	public static defaultConfig: AxiosRequestConfig = {
		headers: AxiosUtils.defaultHeaders,
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

	public static defaultErrorLog(msg: string, ...error: any[]): void {
		Logger.error(msg, ...error);
	}

	public static defaultSilentErrorLog(msg: string, ...error: any[]): void {
		Logger.dbgError(msg, ...error);
	}

	private constructor() {
		return;
	}
}
