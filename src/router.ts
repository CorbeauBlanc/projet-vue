import Environment from '@/services/EnvironmentService';
import Logger from '@/services/LoggerService';
import { AxiosError } from 'axios';
import Vue from 'vue';
import VueRouter, { Location, RouteConfig } from 'vue-router';
import {
	NavigationGuardNext,
	Route,
} from 'vue-router/types/router';
import {
	devRoutes,
	routes,
} from './config';
import { RouterUtils } from './services/RouterUtils';

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

function setRouterAccessGuard(router: VueRouter): void {
	router.beforeEach(
		async (
			to: Route,
			from: Route,
			next: NavigationGuardNext
		): Promise<void> => {
			if (!(await routeIsEnabled(to)))
				return Logger.dbgWarn(
					'router: setRouterAccessGuard: routeIsEnabled returned false',
					to
				);

			next();
		}
	);
}

export async function routeIsEnabled(
	route: Route | Location,
): Promise<boolean> {
	if (!route.name) return false;

	// Room to add route access check

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
			RouterUtils.instance.router = new VueRouter({
				routes: setDebugDevRoutes(Array.from(routes)),
			});
			setRouterAccessGuard(RouterUtils.instance.router);
			resolve(RouterUtils.instance.router);
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
		routes: [],
	});
	setRouterAccessGuard(router);
	return router;
}
