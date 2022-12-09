import App from '@/App.vue';
import { loadAllDirectives } from '@/directives';
import getNewRouter, { getNewBackupRouter } from '@/router';
import AxiosUtils from '@/services/AxiosUtils';
import Logger from '@/services/LoggerService';
import axios, { AxiosError } from 'axios';
import Vue, { CreateElement, VNode } from 'vue';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';

Vue.use(VueMeta);

loadAllDirectives();

axios.defaults.paramsSerializer = {
	serialize: AxiosUtils.defaultParamSerializer,
};

getNewRouter()
	.then((router: VueRouter): void => {
		new Vue({
			components: {},
			router,
			render: (h: CreateElement): VNode => h(App),
		}).$mount('#app');
	})
	.catch((reason: AxiosError): void => {
		if (reason.response?.status !== 401)
			Logger.error('getNewRouter: Cannot create router:', reason);

		Logger.dbgLog('Loading backup router');
		new Vue({
			components: {},
			router: getNewBackupRouter(),
			render: (h: CreateElement): VNode => h(App),
		}).$mount('#app');
	});
