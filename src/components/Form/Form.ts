import CustomInput, {
	ValueTypes,
} from '@/components/Inputs/CustomInput/CustomInput';
import { GenericInputConfig } from '@/components/Inputs/InputsTypes';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import { LockedObject } from '@/types';
import Axios, { AxiosResponse, Method } from 'axios';
import { compile } from 'path-to-regexp/dist/index';
import { Vue } from 'vue-property-decorator';
import { Dictionary } from 'vue-router/types/router';

export default abstract class Form<L extends string | void = void> extends Vue {
	protected abstract values: LockedObject<ValueTypes | undefined>;
	protected abstract readonly url: Map<L, string> | string;

	public abstract getFormattedFieldsValues(layer?: L): any;

	public async sendForm<R = any>(
		method: Method,
		layer: L extends string ? L : undefined
	): Promise<AxiosResponse<R>> {
		const selectedUrl: string | undefined =
			typeof this.url !== 'string'
				? (this.url as Map<L, string>).get(layer as L)
				: this.url;
		const data: any | Promise<any> = this.getFormattedFieldsValues(layer);

		if (!selectedUrl)
			return Logger.dbgErrorRet(
				Promise.reject(),
				'Form: sendForm: selectedUrl is undefined',
				this
			);

		const match: RegExpMatchArray | null =
			selectedUrl.match(/^http(s)?:\/\//);
		let url: string;
		if (match)
			url = match[0].concat(
				compile(selectedUrl.replace(match[0], ''))(
					this.getUrlParams(layer)
				)
			);
		else url = compile(selectedUrl)(this.getUrlParams(layer));

		return Axios.request<R>({
			...AxiosUtils.defaultConfig,
			url,
			method,
			data: data instanceof Promise ? await data : data,
		});
	}

	public checkFieldsValidity(): boolean {
		let valid: boolean = true;
		const fields: string[] = Object.keys(this.values);
		Object.keys(this.$refs).forEach((key: string): void => {
			if (this.$refs[key.toString()] === undefined)
				Logger.warn(
					`${key} is currently undefined. Ignoring validity check.`
				);
			else if (fields.includes(key))
				valid =
					(
						this.$refs[key.toString()] as CustomInput<
							ValueTypes,
							GenericInputConfig
						>
					).checkConstraints() && valid;
			else
				Logger.warn(
					`${key} is not a form field. Ignoring validity check.`
				);
		});
		valid = this.additionalValidityChecks() && valid;
		return valid;
	}

	protected additionalValidityChecks(): boolean {
		return true;
	}

	protected getUrlParams(layer?: L, method?: Method): Dictionary<string> {
		return {};
	}
}
