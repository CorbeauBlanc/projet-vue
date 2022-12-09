import Vue from 'vue';
import { Location } from 'vue-router';

export abstract class FlashMessageInterface extends Vue {
	public abstract showSuccess(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void;
	public abstract showWarning(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void;
	public abstract showError(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void;
	public abstract hide(): void;
}
