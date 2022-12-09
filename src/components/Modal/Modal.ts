import { Vision } from '@/optician';
import Logger from '@/services/LoggerService';
import { Component } from 'vue-property-decorator';

/**
 * Component providing basic modal interface
 */
@Component({})
export default class Modal extends Vision {
	/**
	 * Is the modal closed. True only when the `close()` function has been called,
	 * but still accessible after the closing of the modal and the destruction of the component.
	 * Can thus be used to check if a previous reference to a modal cannot be used anymore
	 */
	public get isClosed(): boolean {
		return this.closed;
	}

	/**
	 * Is the modal currently hidden
	 * @public
	 */
	public get isHidden(): boolean {
		return this.hidden;
	}

	public get isMounted(): boolean {
		return this.modalMounted;
	}

	public onOpenCallback?: (eventPayload?: any) => any;
	public onCloseCallback?: (eventPayload?: any) => any;
	public onHideCallback?: (eventPayload?: any) => any;
	public onShowCallback?: (eventPayload?: any) => any;

	protected hidden: boolean = false;

	protected readonly blurClosing: boolean = false;
	protected readonly closeIcon: boolean = true;
	protected readonly headerIcon: string = '';
	protected readonly noheader: boolean = false;
	protected readonly keepalive: boolean = false;
	protected readonly modalId: string = '';

	private closed: boolean = false;
	private modalMounted: boolean = false;
	private mountPointID: string = 'modals';

	/**
	 * Mount the modal (if not already mounted) on any Element that has the id defined by the `mountPointID`
	 * argument. If the argument is not set, the default value is `modals`
	 * @param mountPointID The id of the HTMLElement to mount the modal on
	 * @public
	 */
	public open(eventPayload?: any, mountPointID?: string): Promise<void> {
		if (this.keepalive && this.modalMounted) return this.show();
		return new Promise(
			(resolve: () => void, reject: (reason?: any) => void): void => {
				if (this.modalMounted) {
					reject('Modal already opened');
					return;
				}
				this.modalMounted = true;
				const previousMountHook: (() => void) | undefined =
					this.$options.mounted;
				this.$options.mounted = (): void => {
					if (previousMountHook) previousMountHook();
					this.$emit('opened', eventPayload);
					if (this.onOpenCallback) this.onOpenCallback(eventPayload);
					this.onOpen(eventPayload);
					resolve();
				};
				this.$mount(`#${mountPointID || this.mountPointID}`);
			}
		);
	}

	/**
	 * Destroy the modal component
	 * Replace the html by the original div with the current mountPointID by default or by nothing
	 * Once closed any previous reference to the component will become unusable,
	 * and should be given up to let the garbage collector destroy it.
	 * @public
	 */
	public close(eventPayload?: any, destroy?: boolean): Promise<void> {
		if (!this.modalMounted) return Promise.reject('Modal not opened');
		if (this.keepalive) return this.hide();
		return new Promise(
			(resolve: () => void, reject: (reason?: any) => void): void => {
				if (this.closed) return reject('Modal already closed');
				this.closed = true;
				this.modalMounted = false;
				if (destroy) this.$el.replaceWith('');
				else {
					const mountPoint: Element = document.createElement('div');
					mountPoint.id = this.mountPointID;
					this.$el.replaceWith(mountPoint);
				}
				const previousDestroyedHook: (() => void) | undefined =
					this.$options.destroyed;
				this.$options.destroyed = (): void => {
					if (previousDestroyedHook) previousDestroyedHook();
					this.$emit('closed', eventPayload);
					if (this.onCloseCallback)
						this.onCloseCallback(eventPayload);
					this.onClose(eventPayload);
					resolve();
				};
				this.$destroy();
			}
		);
	}

	/**
	 * Hide the current modal (`display: none`)
	 * @public
	 */
	public hide(eventPayload?: any): Promise<void> {
		return new Promise(
			(resolve: () => void, reject: (reason?: any) => void): void => {
				this.hidden = true;
				this.$nextTick().then((): void => {
					const el: HTMLElement = this.$el as HTMLElement;
					if (
						el.style.display === 'none' ||
						el.style.display === ''
					) {
						this.$emit('hidden', eventPayload);
						if (this.onHideCallback)
							this.onHideCallback(eventPayload);
						this.onHide(eventPayload);
						resolve();
					} else reject('Modal still visible (for some reason)');
				});
			}
		);
	}

	/**
	 * Show (unhide) the current modal
	 * @public
	 */
	public show(eventPayload?: any): Promise<void> {
		return new Promise(
			(resolve: () => void, reject: (reason?: any) => void): void => {
				this.hidden = false;
				this.$nextTick().then((): void => {
					if ((this.$el as HTMLElement).style.display !== 'none') {
						this.$emit('shown', eventPayload);
						if (this.onShowCallback)
							this.onShowCallback(eventPayload);
						this.onShow(eventPayload);
						resolve();
					} else reject('Modal still hidden (for some reason)');
				});
			}
		);
	}

	protected onOpen(eventPayload?: any): void {
		return;
	}
	protected onClose(eventPayload?: any): void {
		return;
	}
	protected onHide(eventPayload?: any): void {
		return;
	}
	protected onShow(eventPayload?: any): void {
		return;
	}

	protected blurClose(): void {
		if (this.blurClosing || this.blurClosing === undefined)
			this.keepalive ? this.hide() : this.close();
	}

	protected mounted(): void {
		if (this.modalMounted) return;

		document.getElementById(this.mountPointID)?.replaceWith(this.$el);
		this.modalMounted = true;
	}

	protected destroyed(): void {
		if (this.closed)
			return Logger.dbgWarn('Modal: destroyed: this.closed', this);

		this.closed = true;
		const mountPoint: Element = document.createElement('div');
		mountPoint.id = this.mountPointID;
		this.$el.replaceWith(mountPoint);
	}
}
