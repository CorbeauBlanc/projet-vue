<template>
	<div v-show="active" :class="['flash-message', type]">
		<div class="flash-message-container">
			<div>
				<i :class="['icon', iconType]"></i>
				<span class="message">{{ displayedMessage }}</span>
				<router-link v-if="routeText" :to="route" :class="routeClass">{{
					routeText
				}}</router-link>
			</div>
			<icon close @click="hide" />
		</div>
	</div>
</template>

<script lang="ts">
import { FlashMessageInterface } from '@/components/FlashMessage/FlashMessageTypes';
import FlashMessages from '@/services/FlashMessagesService';
import Js from '@/services/JsService';
import { Component, Prop } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class FlashMessage extends FlashMessageInterface {
	public get id(): string {
		return this.uid;
	}

	protected get iconType(): string {
		switch (this.type) {
			case 'success':
				return 'check';
			case 'warning':
				return 'warning sign';
			case 'error':
				return 'error circle';
			case 'info':
				return 'info';
		}
	}

	@Prop() protected readonly name!: string;
	@Prop() protected readonly message!: string;

	protected active: boolean = false;
	protected type: 'success' | 'warning' | 'error' | 'info' = 'info';
	protected displayedMessage: string = '';
	protected routeText: string | false = false;
	protected routeClass: string = '';
	protected route: Location | '' = '';

	private uid: string = Js.uid;

	public showSuccess(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		this.show(message, route, 'success');
	}

	public showWarning(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		this.show(message, route, 'warning');
	}

	public showError(
		message: string,
		route?: { text: string; class: string; to: Location }
	): void {
		this.show(message, route, 'error');
	}

	public hide(): void {
		this.active = false;
	}

	protected show(
		message: string,
		route?: { text: string; class: string; to: Location },
		type?: 'success' | 'warning' | 'error' | 'info'
	): void {
		this.type = type || 'info';
		this.displayedMessage = message || this.message || '';
		this.routeText = route?.text || false;
		this.routeClass = route?.class || '';
		this.route = route?.to || '';
		this.active = true;
	}

	private created(): void {
		this.uid = this.name || this.uid;
		FlashMessages.set(this.uid, this);
	}

	private beforeDestroy(): void {
		FlashMessages.delete(this.uid);
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.flash-message {
	width: 100%;
	height: 0;
	overflow: visible;
	@include z-index(topMessage);

	&.fixed {
		position: fixed;
	}

	&.absolute {
		position: absolute;
	}

	&.sticky {
		position: sticky
	}

	&.fixed, &.absolute, &.sticky {
		&.top {
			top: 0
		}

		&.bottom {
			bottom: 0
		}

		&.left {
			left: 0
		}

		&.right {
			right: 0
		}
	}

	&.success .flash-message-container {
		background: $success;
	}

	&.warning .flash-message-container {
		background: $warning;
	}

	&.error .flash-message-container {
		background: $error;
	}

	.flash-message-container {
		display: flex;
		justify-content: space-between;
		background: $info;
		padding: $padding;
		color: $white;

		i.icon.close {
			cursor: pointer;
		}

		.message {
			margin-left: 1em;
			vertical-align: middle;
		}

		a {
			margin-left: 1.5em;
		}

	}
}
</style>
