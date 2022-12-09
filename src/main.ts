import App from '@/App.vue';
import Accordion from '@/components/Accordion/Accordion.vue';
import FlashMessage from '@/components/FlashMessage/FlashMessage.vue';
import Icon from '@/components/Icon/Icon.vue';
import CheckboxGroup from '@/components/Inputs/CheckboxGroup.vue';
import { loadAllDirectives } from '@/directives';
import getNewRouter, { getNewBackupRouter } from '@/router';
import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import Languages from '@/services/LanguagesService';
import Logger from '@/services/LoggerService';
import loginNode from '@/socket';
import UserMenu from '@/views/UserMenu.vue';
import VueGtm from '@gtm-support/vue2-gtm';
import axios, { AxiosError } from 'axios';
import HighchartsVue from 'highcharts-vue';
import SocketIO from 'socket.io-client';
import Vue, { CreateElement, VNode } from 'vue';
import VueGtag from 'vue-gtag';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import * as VueGoogleMaps from 'vue2-google-maps';
import GmapCluster from 'vue2-google-maps/dist/components/cluster';

(window as any)['isNewLeo'] = true;

Vue.use(VueMeta); // Rename to VueFacebook ?
Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBegKyC3BAPVCDPRz6s7TCm7mAwbHVtmRo',
	},
});

Vue.use(VueGtag, {
	config: { id: 'UA-18998343-1' },
	includes: [{ id: 'UA-18998343-12' }],
});

Vue.use(VueGtm, {
	id: 'GTM-P7QGJXS',
});

Vue.component('Accordion', Accordion);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('Icon', Icon);
Vue.component('FlashMessage', FlashMessage);
Vue.component('GmapCluster', GmapCluster);
Vue.component('UserMenu', UserMenu);

Vue.use(HighchartsVue);

loginNode()
	.then((retrievedToken: string): void => {
		Vue.use(
			VueSocketIOExt,
			SocketIO(Environment.any.nodeUrl, {
				query: 'token=' + retrievedToken,
			})
		);
	})
	.catch();

loadAllDirectives();

axios.defaults.paramsSerializer = AxiosUtils.defaultParamSerializer;

getNewRouter()
	.then((router: VueRouter): void => {
		new Vue({
			components: {},
			router,
			render: (h: CreateElement): VNode => h(App),
			i18n: Languages.instance.i18n,
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
			i18n: Languages.instance.i18n,
		}).$mount('#app');
	});
