import Logger from '@/services/LoggerService';
import { LockedObject } from '@/types';
import { Dictionary } from 'lodash';
import { compile } from 'path-to-regexp';
import VueRouter, {
	Location,
	RawLocation,
	Route,
	RouteRecordPublic,
} from 'vue-router';
import ComponentsUtils from './ComponentsUtils';

type Resolved = {
	location: Location;
	route: Route;
	href: string;
	normalizedTo: Location;
	resolved: Route;
};

export type RouteQuery = LockedObject<
	| undefined
	| string
	| string[]
	| LockedObject<undefined | string | string[]>[]
>;
export class RouterUtils {
	public static instance: RouterUtils = new RouterUtils();

	public get router(): VueRouter | undefined {
		return this.pRouter;
	}

	public set router(val: VueRouter | undefined) {
		if (this.pRouter)
			Logger.dbgWarn(
				'RouterUtils: set router: this.pRouter is already defined'
			);
		else
			this.pRouter = val;

		this.pRouter?.getRoutes().forEach((route: RouteRecordPublic): void => {
			if (route.name) this.routes.set(route.name, route);
		});
	}

	public routes: Map<string, RouteRecordPublic> = new Map();

	private pRouter: VueRouter | undefined;

	private constructor() {
		return;
	}

	/**
	 * Generate a promise used to load a component asynchronously
	 * @param path Path to the component. The component must be located in /src, the preceding "/" at the start of the path
	 * is not mandatory.
	 * @returns {Promise<typeof import('*.vue')>}
	 */
	public static getComponentLoaderFunction(
		path: string
	): () => Promise<typeof import('*.vue')> {
		return (): Promise<typeof import('*.vue')> =>
			ComponentsUtils.importComponent(path);
	}

	public static compileUrl(
		url: string,
		params?: Dictionary<string | undefined>
	): string | undefined {
		return compile(url)(params);
	}

	public resolveRoute(to: RawLocation): (Route & Location) | undefined {
		const resolved: Resolved | undefined = this.router?.resolve(to);

		if (!resolved?.route.matched.length) return undefined;

		return Object.assign(resolved.location, resolved.route);
	}
}
