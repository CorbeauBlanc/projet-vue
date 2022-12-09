import { Vision } from '@/optician';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Watch } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

export default abstract class TabbedView<T extends string> extends Vision {
	protected get currentTab(): T {
		if (!this.initialized) {
			(this.pCurrentTab as string) = '';
			this.updateCurrentTab();
		}
		return this.pCurrentTab;
	}
	protected set currentTab(val: T) {
		this.onTabChange(val);
		this.pCurrentTab = val;
		let dest: RawLocation | (() => RawLocation) | undefined =
			this.viewTabs.get(val);
		if (!dest) return;
		if (typeof dest === 'function') dest = dest();
		if (typeof dest === 'string') {
			if (this.$route.name !== dest)
				this.$router.push({ name: dest }).catch((err: Error): void => {
					if (err.name !== 'NavigationDuplicated')
						Logger.error(err.message, err.stack);
				});
		} else {
			if (!Js.approximatelyEquals<object>(this.$route, dest))
				this.$router.push(dest).catch((err: Error): void => {
					if (err.name !== 'NavigationDuplicated')
						Logger.error(err.message, err.stack);
				});
		}
	}
	protected abstract readonly viewTabs: Map<
		T,
		string | (() => string) | RawLocation | (() => RawLocation)
	>;
	protected abstract readonly defaultTab: T | undefined;

	protected pCurrentTab!: T;

	private initialized: boolean = false;

	protected onTabChange(newVal?: T): void {
		return;
	}

	protected updateCurrentTab(): void {
		if (this.defaultTab) this.pCurrentTab = this.defaultTab;

		this.viewTabs.forEach(
			(dest: RawLocation | (() => RawLocation), key: T): void => {
				if (typeof dest === 'function') dest = dest();
				if (typeof dest === 'string') {
					if (dest === this.$route.name) this.pCurrentTab = key;
				} else {
					if (Js.approximatelyEquals<object>(dest, this.$route))
						this.pCurrentTab = key;
				}
			}
		);
		if (!this.initialized) this.initialized = true;
	}

	@Watch('$route')
	protected onRouteChange(): void {
		this.updateCurrentTab();
	}
}
