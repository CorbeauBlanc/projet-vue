import HomePage from '@/views/Home/HomePage.vue';

import { RouteConfig } from 'vue-router';
import { RouterUtils } from './services/RouterUtils';

/**
 * All the routes used by the router.
 */
export const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'home',
		component: HomePage,
	},
];

/**
 * Routes that will only be loaded in dev AND if the flag VUE_APP_FORCE_DEV_ROUTES in .env.development is set to true
 */
export const devRoutes: RouteConfig[] = [
	{
		path: '/testbidon',
		name: 'test',
		component: RouterUtils.getComponentLoaderFunction(
			'@/tests.development.vue'
		),
	},
];
