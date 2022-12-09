import LegacyIframe from '@/components/LegacyIframe/LegacyIframe.vue';

import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import Languages from '@/services/LanguagesService';
import Logger from '@/services/LoggerService';
import Sidebars from '@/services/SidebarsService';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import Vue from 'vue';
import VueRouter, { Location, RouteConfig } from 'vue-router';
import {
	NavigationGuardNext,
	RawLocation,
	Route,
	RouteRecordPublic,
} from 'vue-router/types/router';
import {
	additionalRoutes,
	devRoutes,
	legacyAuthApi,
	legacyRoutesApi,
	routes,
} from './config';
import { EventsManager } from './services/EventsManagerService';
import { RouterUtils } from './services/RouterUtils';
import UserUtils from './services/UserUtils';

type FetchedRoute = {
	zf_route: string;
	js_route: string;
	is_vue: boolean;
	is_absolute: boolean;
	params?: any;
};
interface AuthData {
	token: string;
}

Vue.use(VueRouter);

/**
 * Adds the dev routes to the `routes` param, if forceDevRoutes is enabled
 * @param routes The route list to add the dev routes to
 * @returns {RouteConfig[]} returns the `routes` param
 */
function setDebugDevRoutes(routesList: RouteConfig[]): RouteConfig[] {
	if (!Environment.dev.forceDevRoutes)
		return Logger.dbgLogRet(
			routesList,
			'setDebugDevRoutes: Dev routes not enabled'
		);

	Logger.warn('Router loading debug dev routes');
	return routesList.concat(devRoutes);
}

/**
 * Adds the additional routes to the `routes` param
 * @param routes The route list to add the additional routes to
 * @returns {RouteConfig[]} returns the `routes` param
 */
function setAdditionalRoutes(routesList: RouteConfig[]): RouteConfig[] {
	additionalRoutes.forEach((route: RouteConfig): void => {
		if (!route.name)
			return Logger.dbgError(
				'router: setAdditionalRoutes: route.name is undefined',
				route
			);

		RouterUtils.userAccessList.set(route.name, true);
	});
	return routesList.concat(additionalRoutes);
}

function setRouterAccessGuard(router: VueRouter): void {
	router.beforeEach(
		async (
			to: Route,
			from: Route,
			next: NavigationGuardNext
		): Promise<void> => {
			if (
				!to.name ||
				to.name === 'first login' ||
				to.name === 'legacy iframe'
			) {
				EventsManager.instance.clearEventHistory(
					RouterUtils.routeValidatedEvent
				);
				EventsManager.instance.broadcastEvent(
					RouterUtils.routeValidatedEvent
				);
				return next();
			}

			if (!routeIsEnabled(to, { next }))
				return Logger.dbgWarn(
					'router: setRouterAccessGuard: routeIsEnabled returned false',
					to
				);

			if (to.query['lang'] !== undefined)
				Languages.instance.setLocale(to.query['lang'].toString());
			else
				Logger.dbgLog(
					"setRouterLocaleAndSidebarGuard: to.query['lang'] undefined"
				);

			if (!Sidebars.navigation.sidebarOpened)
				Sidebars.navigation.openSidebar();
			else
				Logger.dbgLog(
					'setRouterLocaleAndSidebarGuard: Sidebars.navigation.sidebarOpened false'
				);
		}
	);
}

export async function retrieveLegacyRoute(
	path: string
): Promise<RawLocation | number> {
	try {
		const response: AxiosResponse<FetchedRoute> = await Axios.get(
			legacyRoutesApi,
			{
				...AxiosUtils.legacyRoutesConfig,
				params: { zf_route: path },
			}
		);

		if (!response.data)
			throw new Error(
				'router: retrieveLegacyRoute: response.data is undefined'
			);

		return (
			RouterUtils.compileUrl(
				response.data.js_route,
				response.data.params
			) || 404
		);
	} catch (error) {
		switch ((error as AxiosError).response?.status) {
			case 401:
				Logger.dbgWarn(
					`router: retrieveLegacyRoute: user is not logged`,
					error
				);
				return 401;
			case 404:
				Logger.dbgWarn(
					`router: retrieveLegacyRoute: ${path} is unknown`,
					error
				);
				return 404;
			case 403:
				Logger.dbgWarn(
					`router: retrieveLegacyRoute: ${path} is not enabled for this user`,
					error
				);
				return 403;
			default:
				return Logger.dbgErrorRet(
					(error as AxiosError).response?.status || -1,
					`router: routeIsEnabled: cannot get ${legacyRoutesApi}`,
					error
				);
		}
	}
}

export async function routeIsEnabled(
	route: Route | Location,
	redirect?: {
		next: NavigationGuardNext; // object format used to improve code readability
	},
	crappyRetardedStupidLegacyRight?: string
): Promise<boolean> {
	if (!route.name) return false;

	if (!RouterUtils.userAccessList.has(route.name)) {
		if (
			crappyRetardedStupidLegacyRight &&
			!(await UserUtils.instance.currentUserHasPermission(
				crappyRetardedStupidLegacyRight
			))
		) {
			RouterUtils.userAccessList.set(route.name || '', false);
			Logger.dbgWarn(
				`router: routeIsEnabled: ${route.name} is not enabled for this user`
			);
			redirect?.next({ name: 'error 403' });
			return false;
		}

		try {
			const response: AxiosResponse<FetchedRoute> = await Axios.get(
				legacyRoutesApi,
				{
					...AxiosUtils.legacyRoutesConfig,
					params: {
						name: route.name,
					},
				}
			);

			if (!response.data)
				throw new Error(
					'router: routeIsEnabled: response.data is undefined'
				);

			RouterUtils.userAccessList.set(route.name || '', true);
			RouterUtils.instance.legacyRouter.addRoute({
				name: route.name,
				path: `/:locale?${response.data.zf_route}`,
			});
			if (!response.data.is_vue) {
				const legacy: string = response.data.is_absolute
					? response.data.zf_route
					: `/:locale?${response.data.zf_route}`;
				const config: RouteRecordPublic | undefined =
					RouterUtils.instance.routes.get(route.name);
				if (!config)
					return Logger.dbgErrorRet(
						false,
						'router: routeIsEnabled: RouterUtils.instance.routes.get(route.name) is undefined'
					);

				config.meta = {
					...config.meta,
					url: legacy,
					isAbsolute: response.data.is_absolute,
				};
				config.components['default'] = LegacyIframe;

				if (redirect) {
					EventsManager.instance.clearEventHistory(
						RouterUtils.routeValidatedEvent
					);
					EventsManager.instance.broadcastEvent(
						RouterUtils.routeValidatedEvent
					);
					redirect.next({ ...route } as RawLocation);
				}
				return true;
			}
		} catch (error) {
			RouterUtils.userAccessList.set(route.name || '', false);
			switch ((error as AxiosError).response?.status) {
				case 401:
					Logger.dbgWarn(
						`router: routeIsEnabled: user is not logged`,
						error
					);
					redirect?.next({ name: 'login' });
					return false;
				case 404:
					Logger.dbgWarn(
						`router: routeIsEnabled: ${route.name} is unknown`,
						error
					);
					redirect?.next({ name: 'error 404' });
					return false;
				case 403:
					Logger.dbgWarn(
						`router: routeIsEnabled: ${route.name} is not enabled for this user`,
						error
					);
					redirect?.next({ name: 'error 403' });
					return false;
				default:
					return Logger.dbgErrorRet(
						false,
						`router: routeIsEnabled: cannot get ${legacyRoutesApi}`,
						error
					);
			}
		}
	} else if (!RouterUtils.userAccessList.get(route.name)) {
		redirect?.next({ name: 'error 403' });
		return false;
	}

	if (redirect) {
		EventsManager.instance.clearEventHistory(
			RouterUtils.routeValidatedEvent
		);
		EventsManager.instance.broadcastEvent(RouterUtils.routeValidatedEvent);
		redirect?.next();
	}
	return true;
}

/**
 * Creates a Router depending on the .environment files, the routes api, and logged user.
 * @returns {Promise<VueRouter>} A promise for the router to be created
 */
export default function getNewRouter(): Promise<VueRouter> {
	return new Promise<VueRouter>(
		(
			resolve: (value: VueRouter) => void,
			reject: (reason: AxiosError) => void
		): void => {
			Axios.get<AuthData>(legacyAuthApi, AxiosUtils.defaultConfig)
				.then((response: AxiosResponse<AuthData>): void => {
					AxiosUtils.setDefaultHeadersAuthorization(
						response.data.token
					);
					RouterUtils.instance.router = new VueRouter({
						routes: setAdditionalRoutes(
							setDebugDevRoutes(Array.from(routes))
						),
					});
					setRouterAccessGuard(RouterUtils.instance.router);
					resolve(RouterUtils.instance.router);
				})
				.catch((reason: AxiosError): void => {
					if (
						Environment.current !== 'development' ||
						!Environment.dev.forceLocalRoutes
					)
						return reject(reason);

					Logger.dbgError(
						`router: cannot get ${legacyAuthApi}`,
						reason
					);
					RouterUtils.instance.router = new VueRouter({
						routes: setAdditionalRoutes(Array.from(routes)),
					});
					setRouterAccessGuard(RouterUtils.instance.router);
					resolve(RouterUtils.instance.router);
				});
		}
	);
}

/**
 * Creates a backup router to provide minimal functionalities in case no user is logged in or the routes api failed.
 * As the general case is when no user is logged in, it will only contain the login page.
 * @returns {VueRouter} The backup router created
 */
export function getNewBackupRouter(): VueRouter {
	const router: VueRouter = new VueRouter({
		routes: [
			{
				name: 'legacy iframe',
				path: '/:locale?/legacy',
				component: LegacyIframe,
				meta: {
					backupRouter: true,
				},
			},
			{
				name: 'first login',
				path: '/:locale?/*',
				alias: RouterUtils.loginUrl,
				component: LegacyIframe,
				meta: {
					url: RouterUtils.loginUrl,
					backupRouter: true,
				},
			},
		],
	});
	setRouterAccessGuard(router);
	return router;
}
