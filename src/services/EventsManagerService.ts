import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';

type _ListenerCallback = (
	this: any,
	ev: Event | CustomEvent<EventData>
) => void;

interface EventData {
	targetListener: string | null;
	data?: unknown;
}

export class EventsManager {
	public static instance: EventsManager = new EventsManager();

	public listeners: Map<string, Map<string, _ListenerCallback>> = new Map();

	private eventsHistory: Map<string, CustomEvent<EventData>> = new Map();

	public clearEventHistory(eventName: string): void {
		this.eventsHistory.delete(eventName);
	}

	public listenForEvent<T = unknown>(
		eventName: string,
		callback: (data?: T, ev?: CustomEvent<EventData>) => void,
		retroactiveCall?: boolean,
		listenerId?: string
	): string {
		const uid: string = listenerId || Js.uid;
		const listeners: Map<string, _ListenerCallback> =
			this.listeners.get(eventName) || new Map();
		const lastEventCall: CustomEvent<EventData> | undefined =
			this.eventsHistory.get(eventName);

		const newListener: _ListenerCallback = (
			ev: Event | CustomEvent<EventData>
		): void => {
			if (ev instanceof CustomEvent) {
				const detail: unknown = ev.detail;
				if (
					Js.isTypeOfInterface<EventData>(detail, 'targetListener') &&
					(!detail.targetListener ||
						detail.targetListener === listenerId)
				)
					callback(detail.data as T, ev);
			}
		};

		if (!this.listeners.has(eventName))
			this.listeners.set(eventName, listeners);
		if (listeners.has(uid)) this.stopListeningForEvent(eventName, uid);

		listeners.set(uid, newListener);
		addEventListener(eventName, newListener);

		if (retroactiveCall && lastEventCall) newListener(lastEventCall);
		return uid;
	}

	public stopListeningForEvent(eventName: string, listenerId: string): void {
		const listener: _ListenerCallback | undefined = this.listeners
			.get(eventName)
			?.get(listenerId);

		if (!listener)
			return Logger.dbgLog(
				'EventsManager: stopListeningForEvent: listener is undefined'
			);

		removeEventListener('message', listener);
		this.listeners.get(eventName)?.delete(listenerId);
	}

	public broadcastEvent(eventName: string, data?: unknown): void {
		this.postEvent(eventName, null, data);
	}

	public postEvent(
		eventName: string,
		targetListener: string | null,
		data?: unknown
	): void {
		const newEvent: CustomEvent<EventData> = new CustomEvent<EventData>(
			eventName,
			{
				detail: { data, targetListener },
			}
		);

		this.eventsHistory.set(eventName, newEvent);
		dispatchEvent(newEvent);
	}

	private constructor() {
		return;
	}
}
