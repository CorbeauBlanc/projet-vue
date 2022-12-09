import AxiosUtils from '@/services/AxiosUtils';
import { EventsManager } from '@/services/EventsManagerService';
import Logger from '@/services/LoggerService';
import { LockedObject } from '@/types';
import { Dictionary } from 'lodash';
import { compile } from 'path-to-regexp';
import { ParsedQs } from 'qs';
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

	public static readonly loginUrl: string = '/:locale?/a/v2';
	public static readonly logoutUrl: string = '/:locale?/logout';
	public static readonly lostPwdUrl: string = '/:locale?/password';
	public static readonly registerUrl: string =
		'/:locale?/register/usertesting';
	public static readonly mySpaceUrl: string =
		'/customer/authentication/myaccount';

	public static readonly userAccessList: Map<string, boolean> = new Map();

	public static routerInitializedEvent: string = 'router-initialized';
	public static routeValidatedEvent: string = 'route-validated';

	public legacyRouter: VueRouter = new VueRouter();

	public get router(): VueRouter | undefined {
		return this.pRouter;
	}

	public set router(val: VueRouter | undefined) {
		if (this.pRouter)
			Logger.dbgWarn(
				'RouterUtils: set router: this.pRouter is already defined'
			);
		else {
			this.pRouter = val;
			EventsManager.instance.broadcastEvent(
				RouterUtils.routerInitializedEvent
			);
		}

		this.pRouter?.getRoutes().forEach((route: RouteRecordPublic): void => {
			if (route.name) this.routes.set(route.name, route);
		});
	}

	public routes: Map<string, RouteRecordPublic> = new Map();

	public triggerLegacyRouteGuard: ((next: Route) => void) | undefined;

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

	public static getRouterInitPromise(): Promise<void> {
		if (this.instance.router) return Promise.resolve();

		return new Promise<void>((resolve: () => void): void => {
			const id: string = EventsManager.instance.listenForEvent(
				this.routerInitializedEvent,
				(): void => {
					EventsManager.instance.stopListeningForEvent(
						this.routerInitializedEvent,
						id
					);
					resolve();
				}
			);
		});
	}

	public static getRouteValidatedPromise(): Promise<void> {
		return new Promise<void>((resolve: () => void): void => {
			const id: string = EventsManager.instance.listenForEvent(
				this.routeValidatedEvent,
				(): void => {
					EventsManager.instance.stopListeningForEvent(
						this.routeValidatedEvent,
						id
					);
					resolve();
				},
				true
			);
		});
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

	public resolveLegacyRoute(to: RawLocation): (Route & Location) | undefined {
		const resolved: Resolved | undefined = this.legacyRouter?.resolve(to);

		if (!resolved?.route.matched.length) return undefined;
		return Object.assign(resolved.location, resolved.route);
	}

	public addQueryToCurrentRoute(query: any): void {
		const str: string = AxiosUtils.defaultParamSerializer(query);
		const hash: string = window.location.hash.replace(/\?.*/, '');
		window.history.replaceState(
			null,
			'',
			`/${hash}${str !== '' ? '?' + str : ''}`
		);
	}

	public getCurrentRouteQuery(): RouteQuery {
		if (!window.location.href.includes('?')) return {};

		const tmp: RouteQuery | ParsedQs = AxiosUtils.defaultParamParser(
			window.location.href.replace(/.*\?/, '')
		);
		return tmp as RouteQuery;
	}
}
