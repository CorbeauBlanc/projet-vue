<template>
	<div id="legacy-iframe">
		<div class="loading" v-show="isLoading">
			<div class="loader"></div>
		</div>
		<iframe
			v-show="!isLoading"
			ref="iframe"
			:src="path"
			@load="initializeIframe"
			name="legacy-iframe"
			allowfullscreen="true"
		></iframe>
	</div>
</template>

<script lang="ts">
import { legacyUrl } from '@/config';
import { Vision } from '@/optician';
import { retrieveLegacyRoute } from '@/router';
import ComponentsUtils from '@/services/ComponentsUtils';
import { Cookies } from '@/services/CookiesService';
import { EventsManager } from '@/services/EventsManagerService';
import Logger from '@/services/LoggerService';
import { RouterUtils } from '@/services/RouterUtils';
import Sidebars from '@/services/SidebarsService';
import { RouteMeta } from '@/types';
import Axios from 'axios';
import { Dictionary } from 'lodash';
import { Component, Ref, Watch } from 'vue-property-decorator';
import { Location, RawLocation, Route } from 'vue-router';

/**
 * Iframe used by the router to redirect to old UI when the new UI is not done yet
 * To remove/rename later when its purpose has become irrelevant
 */
@Component({
	metaInfo: {
		title: 'Leo',
	},
})
export default class LegacyIframe extends Vision {
	private get locale(): string | undefined {
		if (this.newLocale !== '') {
			const locale: string = this.newLocale;
			this.newLocale = '';
			return locale;
		}
		Logger.dbgLog('LegacyIframe: get locale: newLocal is empty string');
		return Cookies.get('locale');
	}
	protected path: string = '';
	protected readonly isLoading: boolean = true;

	@Ref() protected readonly iframe!: HTMLIFrameElement;

	private newLocale: string = '';
	private noAuthUrl: string[] = [
		'/:locale?/', // <- Retarded addition necessary because retarded routing from the legacy ("/" == "/a/v2" if not auth)
		RouterUtils.loginUrl,
		RouterUtils.lostPwdUrl,
		RouterUtils.registerUrl,
	];
	private cancelNextLoader: boolean = false;
	private pendingRoute: Route | undefined;
	private routerListener: string = '';

	public updateLocale(locale: string): void {
		this.newLocale = locale;
		this.updatePath();
	}
	protected setIsLoading(val: boolean): void {
		if (val && this.cancelNextLoader) this.cancelNextLoader = false;
		else (this.isLoading as boolean) = val;
	}

	/**
	 * Post a message to the iframe to initialize the connexion with it.
	 */
	protected initializeIframe(): void {
		this.iframe.contentWindow?.postMessage(
			'iframe-parent-connection',
			legacyUrl
		);
	}

	/**
	 * This is retarded. Account2 is retarded, and I hate it for making me do this.
	 */
	private handleUserSettingsException(
		params: Dictionary<string | undefined>,
		url: string | undefined
	): string | undefined {
		if (!url) return url;
		if (this.$route.name === 'user edition' && params['id'] === 'me')
			return url.replace('/id/me', '/me/edit');
		return url;
	}

	/**
	 * Is the url tied to user authentication
	 */
	private urlMustIgnoreAuth(url: string): boolean {
		return (
			this.noAuthUrl.find((value: string): boolean => {
				const compiled: string | undefined = RouterUtils.compileUrl(
					value,
					{}
				);
				if (!compiled)
					throw new Error(
						'LegacyIframe: urlMustIgnoreAuth: compiled is undefined'
					);

				if (compiled === '/') return url === compiled;
				return url.includes(compiled);
			}) !== undefined
		);
	}

	private handleGenericIframeEvent(data: string): void {
		switch (data) {
			case 'cancel-next-loader':
				if (this.isLoading) this.setIsLoading(false);
				else this.cancelNextLoader = true;
				break;
			case 'navigation-change':
				this.setIsLoading(true);
				break;
			case 'no-sidebar':
				Sidebars.navigation.closeSidebar();
				break;
			case 'cancel-pending-route':
				this.pendingRoute = undefined;
				break;
			case 'go-to-pending-route':
				this.$router.push(this.pendingRoute as Location);
		}
	}

	private currentRouteIsLogin(): boolean {
		return (
			this.$route.meta?.url === RouterUtils.loginUrl ||
			this.$route.meta?.backupRouter
		);
	}

	/**
	 * Handle events from iframe that might trigger a redirection from Vue
	 */
	private handleComplexIframeEvent(data: {
		message: string;
		navigation: string;
		title?: string;
	}): void {
		switch (data.message) {
			case 'iframe-child-connection':
				const isNoAuthUrl: boolean = this.urlMustIgnoreAuth(
					data.navigation
				);

				if (
					(this.currentRouteIsLogin() && !isNoAuthUrl) ||
					(isNoAuthUrl && RouterUtils.instance.router)
				) {
					window.location.hash = '';
					window.location.pathname = '';
					window.location.reload();
				} else {
					if (isNoAuthUrl) Sidebars.navigation.closeSidebar();
					else if (Sidebars.navigation.canBeOpened)
						Sidebars.navigation.openSidebar();
					this.setIsLoading(false);

					const url: string = data.navigation;
					if (url.includes('?') || !this.pushToExistingRoute(url)) {
						window.history.replaceState(
							null,
							'',
							`/#/legacy?url=${encodeURIComponent(url)}`
						);
					}
					ComponentsUtils.setTitle(this, data.title || '');
					this.$gtag.pageview({
						page_path: `${url}`,
					});
				}
				break;
			case 'change-route':
				this.$router.push({ name: data.navigation });
				break;
			case 'redirect':
				const href: string = `${
					data.navigation.match(
						/^https:\/\/((dev|preprod)(\d*|-[a-z]+)-)?(account2|leo)\.testapic\.com/g
					)
						? ''
						: legacyUrl
				}${data.navigation}`;
				if (
					href.match(
						/^https:\/\/((dev|preprod)(\d*|-[a-z]+)-)?leo\.testapic\.com\/#/g
					)
				) {
					window.location.href = href;
					window.location.reload();
				} else window.location.href = href;
		}
	}

	private listener(event: MessageEvent): void {
		if (
			event.origin.match(
				/^https:\/\/((dev|preprod)(\d*|-[a-z]+)-)?account2\.testapic\.com/g
			)
		) {
			if (typeof event.data === 'string')
				this.handleGenericIframeEvent(event.data);
			else this.handleComplexIframeEvent(event.data);
		}
	}

	/**
	 * Check if the given iframe url corresponds to a route
	 */
	private pushToExistingRoute(url: string): boolean {
		const resolved: (Route & Location) | undefined =
			RouterUtils.instance.resolveLegacyRoute({ path: url });

		const exists: boolean =
			resolved !== undefined && resolved.name !== 'error 404';

		if (!exists)
			retrieveLegacyRoute(url).then(
				(route: RawLocation | number): void => {
					if (typeof route !== 'number') this.$router.push(route);
					else if (route === 404) {
						if (this.$route.name !== 'legacy iframe') {
							this.preventWatchFeedback = true;
							this.$router.push({
								name: 'legacy iframe',
								query: { url },
							});
						} else this.postRouteValidated();
					}
				}
			);
		else if (
			resolved?.name &&
			this.$route.name !== resolved.name &&
			this.$route.name !== 'logout'
		) {
			this.preventWatchFeedback = true;
			this.$router.push(resolved);
		}

		return exists;
	}

	/**
	 * Update the iframe url or the route if possible depending on the params and locale
	 */
	private updatePath(): void {
		const meta: RouteMeta | undefined = this.$route.meta;
		const query: RouteMeta = { ...this.$route.query };

		if (!meta?.url && !query.url) return;
		const locale: string | undefined =
			this.$route.name === 'logout' ? undefined : this.locale;
		const params: Dictionary<string | undefined> = {
			...this.$route.params,
			locale,
		};
		let url: string | undefined = meta?.url
			? RouterUtils.compileUrl(meta.url, params)
			: query.url;

		url = this.handleUserSettingsException(params, url);
		let finalPath: string;
		delete query.url;
		const queries: string = Object.keys(query).length
			? `?${Axios.defaults.paramsSerializer?.call(this, query) || ''}`
			: '';

		this.setIsLoading(true);
		if (meta?.url && meta.isAbsolute) finalPath = meta.url;
		else {
			if (url) this.pushToExistingRoute(url);
			finalPath = `${legacyUrl}${url}${queries}`;
		}
		if (finalPath === this.path) {
			this.iframe.src = finalPath;
		} else this.path = finalPath;
	}

	private legacyRouteGuardTrigger: (next: Route) => void = (
		next: Route
	): void => {
		this.pendingRoute = next;
		this.iframe.contentWindow?.postMessage(
			'trigger-route-guard',
			legacyUrl
		);
	};

	private async postRouteValidated(): Promise<void> {
		await this.$nextTick();
		this.iframe?.contentWindow?.postMessage('route-validated', legacyUrl);
	}

	/**
	 * Update the url when the route has changed
	 */
	@Watch('$route')
	private onRouteChange(val: Route, oldVal: Route): void {
		if (this.preventWatchFeedback) this.preventWatchFeedback = false;
		else this.updatePath();
	}

	private mounted(): void {
		this.routerListener = EventsManager.instance.listenForEvent(
			RouterUtils.routeValidatedEvent,
			this.postRouteValidated
		);
	}

	private created(): void {
		window.addEventListener('message', this.listener);
		Sidebars.navigation.loadedLegacyIframe = this;
		RouterUtils.instance.triggerLegacyRouteGuard =
			this.legacyRouteGuardTrigger;
		this.updatePath();
	}

	private beforeDestroy(): void {
		window.removeEventListener('message', this.listener);
		EventsManager.instance.stopListeningForEvent(
			RouterUtils.routeValidatedEvent,
			this.routerListener
		);
	}
}
</script>

<style lang="scss" scoped>

	#legacy-iframe {
		position: relative;
		width: 100%;
		height: 100%;

		iframe {
			width: 100%;
			height: 100%;
		}
	}
</style>
