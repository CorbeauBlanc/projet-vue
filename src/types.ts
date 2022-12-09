import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Enumeration used in several components to describe the type of content it is holding
 *
 * @export
 * @enum {number}
 */
export enum ContentType {
	STRING,
	IMAGE,
	COMPONENT,
	LINK,
	TABLE,
	ROUTE,
	ICON,
}

/**
 * Not really used rn but has the merit of existing
 */
export enum ReturnStatus {
	SUCCESS = 1,
	FAILURE = 2,
	CANCELED = 3,
}

/**
 * Generic objects containing a type T or the object itself
 */
export type DeepTuple<T> = [T, T | DeepTuple<T>];
export type DeepArray<T> = (T | DeepArray<T>)[];
export type LockedObject<T> = { [key: string]: T | LockedObject<T> };

/**
 * Weird thing that can switch between a type and a child deriving from it by
 * passing 'extended' or not as the generic type E.
 * No use found to this day. Maybe later.
 */
// prettier-ignore
export type Extender<
	T,
	U extends T,
	E extends 'extended' | void = void
	> = E extends 'extended' ? U : T;

/**
 * Other weird thing that can switch between completely different types by passing the 'key'
 * of one of the indexed types in M as the generic type S.
 * Currently used mainly for the InputConfig and the FilterConfig types
 * @example
 * type StringOrNumber<S extends 'foo' | 'bar'> = Switcher<{ foo: string, bar: number }, S>;
 *
 * let var1: StringOrNumber<'foo'>; // var1 is a string
 * let var2: StringOrNumber<'bar'>; // var2 is a number
 */
// prettier-ignore
export type Switcher<
	M extends { [key: string]: any },
	S extends keyof M
	> = M[S];

/**
 * Adding status messages to AxiosRequestConfig to display once the request is done.
 */
export interface RequestConfig extends AxiosRequestConfig {
	successMsg?: string;
	failureMsg?: string;
}

/**
 * Interface describing the configuration of a REST operation
 * @export
 */
export interface RESTOperation<T = any> {
	/**
	 * The url of the request
	 */
	url: string;
	/**
	 * The callback function called if the request is successful.
	 */
	promiseCallback?: (response?: AxiosResponse) => T;
	config?: RequestConfig;
}

/**
 * Standardized interface for list responses from an api
 */
export class GetListResponse<T = any> {
	public static get empty(): GetListResponse<any> {
		return { data: [] };
	}

	public totalCount?: number;
	public totalPages?: number;
	public data: T[] = [];
}

/**
 * Interface used to type a standard event vue will send
 */
export interface VueEvent extends Event {
	name: string;
	type: string;
	source: string;
	payload?: any;
}

export type VueListener = Record<
	string,
	((...args: any) => any) | ((...args: any) => any)[]
>;

/**
 * Class used to describe and format ld+json api responses to a more
 * readable GetListResponse format. Might change in the future to include more formats.
 */
export class LdData<T> {
	public static getFormattedResponse<T = unknown>(
		data: LdData<T>
	): GetListResponse<T> {
		const last: string | undefined = data['hydra:view']
			? data['hydra:view']['hydra:last']
			: undefined;
		const index: number =
			data['hydra:view'] && last ? last.indexOf('page=') : -1;
		const pages: number =
			last && index > -1 ? Number.parseInt(last.slice(index + 5)) : 0;

		return {
			data: data['hydra:member'],
			totalCount: data['hydra:totalItems'],
			totalPages: pages,
		};
	}

	public '@context': string;
	public '@id': string;
	public '@type': string;
	public 'hydra:member': T[];
	public 'hydra:totalItems': number;
	public 'hydra:view': {
		'@id': string;
		'@type': string;
		'hydra:first': string;
		'hydra:last': string;
		'hydra:next'?: string;
		'hydra:previous'?: string;
	};
	public 'hydra:search': any;
}

export type RouteMeta = {
	url?: string;
	isAbsolute?: boolean;
	hasLegacyGuard?: boolean;
};

/**
 * Yet another weird thing that can "mutate" a predefined type T by merging it with M and deleting
 * the keys defined in K from it.
 * @example
 * type Mutant = Mutation<{ foo: string; bar: string; baz: number }, { foo: number }, 'bar'>;
 *
 * let var: Mutant; // var is of type { foo: number; baz: number }
 */
export type Mutation<T, M, K extends keyof T | void = void> = M &
	Omit<T, K extends void ? keyof M : keyof M | K>;

export class ObjectExplorer<T> {
	private root: T;
	private current: any;

	constructor(root: T) {
		this.root = root;
	}

	public open(): ObjectExplorer<T> {
		this.current = this.root;
		return this;
	}

	public get<K extends keyof T = keyof T, R extends T[K] = T[K]>(
		key: K
	): ObjectExplorer<R> | undefined {
		if (!this.current) return undefined;

		this.current = (this.current as T)[key];
		return this as any;
	}

	public set<
		K extends keyof T = keyof T,
		R extends T[K] = T[K],
		M extends 'override' | 'merge' = 'override'
	>(key: K, value: R, method?: M): ObjectExplorer<R> | undefined {
		if (!this.current) return undefined;

		if (!method || method === 'override') (this.current as T)[key] = value;
		else if (method === 'merge')
			(this.current as T)[key] = {
				...(this.current as T)[key],
				...value,
			};
		this.current = (this.current as T)[key];
		return this as any;
	}

	public update<K extends keyof T = keyof T, R extends T[K] = T[K]>(
		key: K,
		value: T[K],
		modifier: (key: K, value: T[K], object: T) => void
	): ObjectExplorer<R> | undefined {
		if (!this.current) return undefined;

		modifier(key, value, this.current as T);
		this.current = (this.current as T)[key];
		return this as any;
	}
}
