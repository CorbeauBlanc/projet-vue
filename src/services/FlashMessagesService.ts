import FlashMessage from '@/components/FlashMessage/FlashMessage.vue';
import { FlashMessageInterface } from '@/components/FlashMessage/FlashMessageTypes';
import { Location } from 'vue-router';

export default class FlashMessages {
	public static readonly instance: FlashMessages = new FlashMessages();

	public static get(id: string): FlashMessageInterface | undefined {
		return FlashMessages.instance.messagesMap.get(id) as
			| FlashMessageInterface
			| undefined;
	}

	public static set(id: string, message: FlashMessage): void {
		FlashMessages.instance.messagesMap.set(id, message);
	}

	public static delete(id: string): void {
		FlashMessages.instance.messagesMap.delete(id);
	}

	public static success(
		id: string,
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		FlashMessages.get(id)?.showSuccess(message, route);
	}
	public static warning(
		id: string,
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		FlashMessages.get(id)?.showWarning(message, route);
	}
	public static error(
		id: string,
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		FlashMessages.get(id)?.showError(message, route);
	}

	public static hide(id: string): void {
		FlashMessages.get(id)?.hide();
	}

	public messagesMap: Map<string, FlashMessage> = new Map();

	private constructor() {
		return;
	}
}
