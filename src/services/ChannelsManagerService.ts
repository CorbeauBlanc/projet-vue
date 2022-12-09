import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';

type _ListenerCallback = (
	this: BroadcastChannel,
	ev: BroadcastChannelEventMap['message']
) => void;

interface ChannelsData {
	targetListener: string | null;
	data?: unknown;
}

export class ChannelsManager {
	public static instance: ChannelsManager = new ChannelsManager();

	private channels: Map<string, BroadcastChannel> = new Map();
	private channelsListeners: Map<string, Map<string, _ListenerCallback>> =
		new Map();

	public openChannel(name: string): BroadcastChannel {
		if (!this.channels.has(name))
			this.channels.set(name, new BroadcastChannel(name));
		return this.channels.get(name) as BroadcastChannel;
	}

	public closeChannel(name: string): void {
		this.channels.get(name)?.close();
		this.channels.delete(name);
		this.channelsListeners.delete(name);
	}

	public getChannel(channel: string): BroadcastChannel | undefined {
		return this.channels.get(channel);
	}

	public stopListeningToChannel(
		channelName: string,
		listenerId: string
	): void {
		const channel: BroadcastChannel | undefined =
			this.getChannel(channelName);
		const listener: _ListenerCallback | undefined = this.channelsListeners
			.get(channelName)
			?.get(listenerId);

		if (!channel || !listener)
			return Logger.dbgLog(
				'ChannelsManager: stopListeningToChannel: channel or listener is undefined'
			);

		channel.removeEventListener('message', listener);
		this.channelsListeners.get(channelName)?.delete(listenerId);
	}

	public listenToNewChannel<T = unknown>(
		channelName: string,
		callback: (data?: T, ev?: BroadcastChannelEventMap['message']) => void,
		listenerId?: string
	): string {
		this.openChannel(channelName);
		return this.listenToChannel(channelName, callback, listenerId);
	}

	public listenToChannel<T = unknown>(
		channelName: string,
		callback: (data?: T, ev?: BroadcastChannelEventMap['message']) => void,
		listenerId?: string
	): string {
		const uid: string = listenerId || Js.uid;
		const channel: BroadcastChannel | undefined =
			this.getChannel(channelName);
		const listeners: Map<string, _ListenerCallback> =
			this.channelsListeners.get(channelName) || new Map();

		const newListener: _ListenerCallback = (
			ev: MessageEvent<ChannelsData>
		): void => {
			if (
				!ev.data.targetListener ||
				ev.data.targetListener === listenerId
			)
				callback(ev.data.data as T, ev);
		};

		if (!this.channelsListeners.has(channelName))
			this.channelsListeners.set(channelName, listeners);
		if (!channel)
			throw new Error(
				`ChannelsManager: listenToChannel: The channel "${channelName}" doesn't exist`
			);

		if (listeners.has(uid)) this.stopListeningToChannel(channelName, uid);
		listeners.set(uid, newListener);
		channel?.addEventListener('message', newListener);
		return uid;
	}

	public broadcastToNewChannel(channelName: string, data?: unknown): void {
		this.openChannel(channelName);
		this.broadcastToChannel(channelName, data);
	}

	public broadcastToChannel(channelName: string, data?: unknown): void {
		const channel: BroadcastChannel | undefined =
			this.getChannel(channelName);

		if (!this.channels.has(channelName))
			throw new Error(
				`ChannelsManager: broadcastToChannel: The channel "${channelName}" doesn't exist`
			);

		channel?.postMessage({ data, targetListener: null } as ChannelsData);
	}

	public postToNewChannel(
		channelName: string,
		targetListener: string,
		data?: unknown
	): void {
		this.openChannel(channelName);
		this.postToChannel(channelName, targetListener, data);
	}

	public postToChannel(
		channelName: string,
		targetListener: string,
		data?: unknown
	): void {
		const channel: BroadcastChannel | undefined =
			this.getChannel(channelName);

		if (!this.channels.has(channelName))
			throw new Error(
				`ChannelsManager: postToChannel: The channel "${channelName}" doesn't exist`
			);

		channel?.postMessage({ data, targetListener } as ChannelsData);
	}

	private constructor() {
		return;
	}
}
