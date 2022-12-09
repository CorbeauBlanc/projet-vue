import LegacyIframe from '@/components/LegacyIframe/LegacyIframe.vue';
import Environment from '@/services/EnvironmentService';
import Admin from '@/views/Admin/Admin.vue';
import CompaniesCreate from '@/views/Companies/CompaniesCreate/CompaniesCreate.vue';
import CompaniesEdit from '@/views/Companies/CompaniesEdit/CompaniesEdit.vue';
import CompaniesList from '@/views/Companies/CompaniesList/CompaniesList.vue';
import CriteriasCreate from '@/views/Criterias/CriteriasCreate/CriteriasCreate.vue';
import CriteriasList from '@/views/Criterias/CriteriasList/CriteriasList.vue';
import Error403 from '@/views/Error403.vue';
import Error404 from '@/views/Error404.vue';
import GainsHistory from '@/views/Gains/GainsHistory/GainsHistory.vue';
import GainsList from '@/views/Gains/GainsList/GainsList.vue';
import HomePage from '@/views/Home/HomePage.vue';
import ResultsGroup from '@/views/Results/ResultsGroup.vue';
import ResultsList from '@/views/Results/ResultsList/ResultsList.vue';
import ResultsGraphDetail from '@/views/Results/ResultsWorkboard/ResultsGraphs/ResultsGraphDetail/ResultsGraphDetail.vue';
import ResultsGraphs from '@/views/Results/ResultsWorkboard/ResultsGraphs/ResultsGraphs.vue';
import ResultsObservations from '@/views/Results/ResultsWorkboard/ResultsObservations/ResultsObservations.vue';
import ResultsReport from '@/views/Results/ResultsWorkboard/ResultsReport/ResultsReport.vue';
import ResultsSources from '@/views/Results/ResultsWorkboard/ResultsSources/ResultsSources.vue';
import ResultsSynthesis from '@/views/Results/ResultsWorkboard/ResultsSynthesis/ResultsSynthesis.vue';
import ResultsTesters from '@/views/Results/ResultsWorkboard/ResultsTesters/ResultsTesters.vue';
import ResultsUserVerbatims from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsUserVerbatims/ResultsUserVerbatims.vue';
import ResultsVerbatims from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatims.vue';
import ResultsVideosDetail from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosDetail/ResultsVideosDetail.vue';
import ResultsVideosList from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosList/ResultsVideosList.vue';
import ResultsVideosSynthesis from '@/views/Results/ResultsWorkboard/ResultsVideos/ResultsVideosSynthesis/ResultsVideosSynthesis.vue';
import ResultsWorkboard from '@/views/Results/ResultsWorkboard/ResultsWorkboard.vue';
import AllTestersAffectationsList from '@/views/Testers/AllTesters/AllTestersAffectationsList/AllTestersAffectationsList.vue';
import TestersList from '@/views/Testers/AllTesters/TestersList/TestersList.vue';
import TestersAffectations from '@/views/Testers/TestersAffectations/TestersAffectations.vue';
import TestersCreate from '@/views/Testers/TestersCreate/TestersCreate.vue';
import TestersEdit from '@/views/Testers/TestersEdit/TestersEdit.vue';
import TestInfos from '@/views/Tests/Management/TestInfos/TestInfos.vue';
import TestsManagement from '@/views/Tests/Management/TestsManagement.vue';
import TestsList from '@/views/Tests/TestsList/TestsList.vue';
import UsersCreate from '@/views/Users/UsersCreate/UsersCreate.vue';
import UsersEdit from '@/views/Users/UsersEdit/UsersEdit.vue';
import UsersList from '@/views/Users/UsersList/UsersList.vue';

import { RouteMeta } from '@/types';
import { RouteConfig } from 'vue-router';
import { RouterUtils } from './services/RouterUtils';

export const meUrl: string = `${Environment.any.api}/me`;
export const nodeLoginUrl: string = `${Environment.any.nodeUrl}/login`;
export const typeformUrl: string = `${Environment.any.api}/typeform`;

export const testapicId: number = 2660;

export const testapicLogo: string =
	'https://storage.googleapis.com/account2-dev-storage-video-eu/element/element/company/2660/original_1576141676.png';

export const legacyUrl: string = Environment.any.legacyUrl;
export const legacyRoutesApi: string = `${legacyUrl}/api/routes`;
export const legacyAuthApi: string = `${legacyUrl}/api/api_authentication`;

export const helpUrl: string = 'https://support.testapic.com/hc';

/**
 * All the routes used by the router. All the retarded path params are because of the legacy compatibility.
 */
export const routes: RouteConfig[] = [
	{
		path: '/',
		name: 'home',
		component: HomePage,
	},
	{
		path: '/login',
		name: 'login',
		component: LegacyIframe,
	},
	{
		path: '/logout',
		name: 'logout',
		component: LegacyIframe,
	},
	{
		path: '/admin',
		name: 'admin',
		component: Admin,
	},
	{
		path: '/me',
		name: 'me edition',
		component: LegacyIframe,
	},
	{
		path: '/companies/creation',
		name: 'companies creation',
		component: CompaniesCreate,
	},
	{
		path: '/companies/:id/edition',
		name: 'company edition',
		component: CompaniesEdit,
	},
	{
		path: '/companies/:id/offers',
		name: 'company offers',
		component: CompaniesEdit,
	},
	{
		path: '/companies',
		name: 'companies',
		component: CompaniesList,
	},
	{
		path: '/results',
		name: 'results',
		component: ResultsList,
	},
	{
		path: '/results/group/create',
		name: 'create results group',
		component: ResultsGroup,
	},
	{
		path: '/results/group/:id/edit',
		name: 'edit results group',
		component: ResultsGroup,
	},
	{
		path: '/results/:id/workboard/videos/list',
		name: 'result videos list',
		component: LegacyIframe,
	},
	{
		path: '/results/:group_id/workboard',
		name: 'result workboard',
		component: ResultsWorkboard,
		children: [
			/* {
				path: '',
				name: 'result workboard',
				redirect: { name: 'result synthesis' },
			},
			{
				path: 'charts',
				name: 'result charts',
				component: ResultsGraphs,
			},
			{
				path: 'charts/:chartId',
				name: 'result charts detail',
				component: ResultsGraphDetail,
			},
			{
				path: 'observations',
				name: 'result observations',
				component: ResultsObservations,
			},
			{
				path: 'observations/:observationId/sources',
				name: 'result observation sources',
				component: ResultsSources,
			},
			{
				path: 'report',
				name: 'result report',
				component: ResultsReport,
			},
			{
				path: 'synthesis',
				name: 'result synthesis',
				component: ResultsSynthesis,
			},
			{
				path: 'testers',
				name: 'result testers',
				component: ResultsTesters,
			},
			{
				path: 'verbatims',
				name: 'result verbatims',
				component: ResultsVerbatims,
			},
			{
				path: 'verbatims/user/:userId',
				name: 'result user verbatims',
				component: ResultsUserVerbatims,
			},
			{
				path: 'videos',
				name: 'result videos',
				component: ResultsVideosSynthesis,
			},
			{
				path: 'videos/list',
				name: 'result videos list',
				component: ResultsVideosList,
			}, */
			{
				path: 'videos/:affectation_id',
				name: 'result videos detail',
				component: ResultsVideosDetail,
			},
		],
	},
	{
		path: '/results/:id/workboard/synthesis',
		name: 'result synthesis',
		component: LegacyIframe,
	},
	{
		path: '/results/:id/workboard/charts',
		name: 'result charts',
		component: LegacyIframe,
	},
	{
		path: '/results/:id/workboard/verbatims',
		name: 'result verbatims',
		component: LegacyIframe,
	},
	{
		path: '/results/:id/workboard/videos',
		name: 'result videos',
		component: LegacyIframe,
	},
	{
		path: '/results/:id/workboard/observations',
		name: 'result observations',
		component: LegacyIframe,
	},
	{
		path: '/results/:id/workboard/report',
		name: 'result report',
		component: ResultsReport,
	},
	{
		path: '/testers/list',
		name: 'testers',
		component: TestersList,
	},
	{
		path: '/testers/create',
		name: 'tester creation',
		component: TestersCreate,
	},
	{
		path: '/testers/:id/edit',
		name: 'tester edition',
		component: LegacyIframe,
	},
	{
		path: '/testers/:id/details/bill',
		name: 'tester bill',
		component: LegacyIframe,
	},
	{
		path: '/testers/:id/affectations',
		name: 'tester affectations',
		component: TestersAffectations,
	},
	{
		path: '/testers/import',
		name: 'testers import',
		component: LegacyIframe,
	},
	{
		path: '/testers/recruitment',
		name: 'testers recruitment',
		component: LegacyIframe,
	},
	{
		path: '/testers/affectations',
		name: 'all testers affectations',
		component: AllTestersAffectationsList,
	},
	{
		path: '/users/list',
		name: 'users',
		component: UsersList,
	},
	{
		path: '/users/create',
		name: 'users creation',
		component: UsersCreate,
	},
	{
		path: '/users/:id/edit',
		name: 'users edition',
		component: UsersEdit,
	},
	{
		path: '/tests',
		name: 'tests',
		component: TestsList,
	},
	{
		path: '/tests/create',
		component: TestsManagement,
		props: {
			mode: 'create',
		},
		children: [
			{
				path: '',
				name: 'test creation',
				redirect: { name: 'test creation infos' },
			},
			{
				path: '',
				name: 'test creation infos',
				component: TestInfos,
			},
		],
	},
	{
		path: '/tests/:idtest/edit/tasks',
		name: 'test edition tasks',
		component: LegacyIframe,
		meta: {
			hasLegacyGuard: true,
		} as RouteMeta,
	},
	{
		path: '/tests/:idtest/edit/segmentation',
		name: 'test edition segmentation',
		component: LegacyIframe,
	},
	{
		path: '/tests/:idtest/edit/campaign',
		name: 'test edition campaign',
		component: LegacyIframe,
	},
	{
		path: '/tests/:id/edit',
		component: TestsManagement,
		props: {
			mode: 'edit',
		},
		children: [
			{
				path: '',
				name: 'test edition',
				redirect: { name: 'test edition infos' },
			},
			{
				path: 'infos',
				name: 'test edition infos',
				component: TestInfos,
			},
		],
	},
	{
		path: '/criterias',
		name: 'criterias',
		component: CriteriasList,
	},
	{
		path: '/criterias/create',
		name: 'criterias creation',
		component: CriteriasCreate,
	},
	{
		path: '/groups',
		name: 'groups',
		component: LegacyIframe,
	},
	{
		path: '/pages',
		name: 'pages',
		component: LegacyIframe,
	},
	{
		path: '/gains',
		name: 'gains',
		component: GainsList,
	},
	{
		path: '/gains/history',
		name: 'gains history',
		component: GainsHistory,
	},
	{
		path: '/help',
		name: 'help',
		component: LegacyIframe,
	},
	{
		/**
		 * Route only used for rights checking. There is technically no need to register it in the router but
		 * I did it anyway to make it less confusing in the code.
		 */
		name: 'tester space',
		path: '/tester/space',
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

/**
 * Additional routes not listed in the api that will be added at the end of the router. Should only be used for
 * error pages, or occasionally for legacy stupidity. WARNING! These routes are by default always enabled for the
 * user, no rights checks are performed on them.
 */
export const additionalRoutes: RouteConfig[] = [
	{
		name: 'legacy iframe',
		path: '/legacy',
		component: LegacyIframe,
	},
	{
		path: '/forbidden',
		name: 'error 403',
		component: Error403,
	},
	{
		path: '*',
		name: 'error 404',
		component: Error404,
	},
];
