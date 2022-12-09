import LegacyIframe from '@/components/LegacyIframe/LegacyIframe.vue';
import { VideoCut } from '@/components/VideoPlayer/VideoPlayerTypes';
import { ReturnStatus } from '@/types';
import { VerbatimData } from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { EventsManager } from './EventsManagerService';

class ResultsSidebarManager {
	public get sidebarOpened(): boolean {
		return this.pSidebarOpened;
	}

	public get sidebarUnfolded(): boolean {
		return this.pSidebarUnfolded;
	}

	public set sidebarUnfolded(unfold: boolean) {
		this.pSidebarUnfolded = unfold;
	}

	public get data(): VerbatimData[] | VideoCut {
		return this.pData;
	}

	public set data(data: VerbatimData[] | VideoCut) {
		this.pData = data;
	}

	public get resultId(): string {
		return this.pResultId;
	}

	public set resultId(resultId: string) {
		this.pResultId = resultId;
	}

	public get refresh(): boolean {
		return this.pRefresh;
	}

	public set refresh(state: boolean) {
		this.pRefresh = state;
	}

	public static readonly instance: ResultsSidebarManager =
		new ResultsSidebarManager();

	private pSidebarOpened: boolean = false;
	private pSidebarUnfolded: boolean = false;
	private pData: VerbatimData[] | VideoCut = [];
	private pResultId: string = '';
	private pRefresh: boolean = false;
	private successCallback: (() => void) | undefined;
	private failureCallback: (() => void) | undefined;
	private cancelCallback: (() => void) | undefined;

	private constructor() {
		return;
	}

	public openSidebar(
		resultData?: { data?: VerbatimData[] | VideoCut; resultId?: string },
		success?: () => void,
		failure?: () => void,
		cancel?: () => void
	): void {
		if (this.failureCallback) this.failureCallback();
		this.successCallback = success;
		this.failureCallback = failure;
		this.cancelCallback = cancel;

		if (resultData?.data) this.pData = resultData.data;
		if (resultData?.resultId) this.pResultId = resultData.resultId;
		this.pSidebarOpened = true;
		this.pSidebarUnfolded = true;
	}

	public closeSidebar(status?: ReturnStatus): void {
		if (!this.pSidebarOpened) return;

		switch (status) {
			case ReturnStatus.SUCCESS:
				if (this.successCallback) this.successCallback();
				break;
			case ReturnStatus.FAILURE:
				if (this.failureCallback) this.failureCallback();
				break;
			case ReturnStatus.CANCELED:
				if (this.cancelCallback) this.cancelCallback();
		}
		this.successCallback = undefined;
		this.failureCallback = undefined;
		this.cancelCallback = undefined;
		this.pSidebarOpened = false;
		this.pData = [];
	}

	public refreshSidebar(state: boolean): void {
		this.pRefresh = state;
	}
}

class NavigationSidebarManager {
	public static openEvent: string = 'navigation-sidebar-open';
	public static closeEvent: string = 'navigation-sidebar-close';

	public get sidebarOpened(): boolean {
		return this.pSidebarOpened;
	}

	public get canBeOpened(): boolean {
		return this.pCanBeOpened;
	}

	public static instance: NavigationSidebarManager =
		new NavigationSidebarManager();

	public loadedLegacyIframe!: LegacyIframe;

	private pSidebarOpened: boolean = false;
	private pCanBeOpened: boolean = true;

	private constructor() {
		return;
	}

	public listenForOpen(
		listenerId: string,
		callback: (data?: unknown, ev?: CustomEvent) => void
	): void {
		EventsManager.instance.listenForEvent(
			NavigationSidebarManager.openEvent,
			callback,
			false,
			listenerId
		);
	}

	public listenForClose(
		listenerId: string,
		callback: (data?: unknown, ev?: CustomEvent) => void
	): void {
		EventsManager.instance.listenForEvent(
			NavigationSidebarManager.closeEvent,
			callback,
			false,
			listenerId
		);
	}

	public stopListeningForOpen(listenerId: string): void {
		EventsManager.instance.stopListeningForEvent(
			NavigationSidebarManager.openEvent,
			listenerId
		);
	}

	public stopListeningForClose(listenerId: string): void {
		EventsManager.instance.stopListeningForEvent(
			NavigationSidebarManager.closeEvent,
			listenerId
		);
	}

	public openSidebar(): void {
		if (this.canBeOpened) {
			this.pSidebarOpened = true;
			EventsManager.instance.broadcastEvent(
				NavigationSidebarManager.openEvent
			);
		}
	}

	public closeSidebar(cannotBeReopened?: boolean): void {
		if (cannotBeReopened) this.pCanBeOpened = false;
		if (!this.pSidebarOpened) return;
		EventsManager.instance.broadcastEvent(
			NavigationSidebarManager.closeEvent
		);
		this.pSidebarOpened = false;
	}
}

export default class Sidebars {
	public static readonly instance: Sidebars = new Sidebars();

	public static results: ResultsSidebarManager =
		ResultsSidebarManager.instance;
	public static navigation: NavigationSidebarManager =
		NavigationSidebarManager.instance;

	private constructor() {
		return;
	}
}
