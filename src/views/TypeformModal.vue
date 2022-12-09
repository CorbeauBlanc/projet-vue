<template lang="pug">
extends /src/components/Modal/ModalTemplate
block header
	| {{ $t("Demande de support") }}
block content
	.loading(v-if="loading")
		.loader
	div#tf(
		ref="tfMountPoint"
	)
</template>

<script lang="ts">
import Modal from '@/components/Modal/Modal';
import AxiosUtils from '@/services/AxiosUtils';
import UserUtils from '@/services/UserUtils';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import { DefaultUser } from '@/views/Users/UsersTypes';
import { createWidget } from '@typeform/embed';
import '@typeform/embed/build/css/popup.css';
import { Component, Prop, Ref } from 'vue-property-decorator';

@Component({})
export default class TypeformModal extends Modal {
	@Prop() formId!: string;

	protected readonly keepalive: boolean = true;
	protected readonly modalId: string = 'typeform-modal';

	protected hidden: boolean = true;
	protected loading: boolean = true;

	@Ref() tfMountPoint!: HTMLElement;

	public async createTfWidget(): Promise<void> {
		this.loading = true;
		try {
			const me: DefaultUser = await UserUtils.instance.currentUser;
			const company: DefaultCompany = await UserUtils.instance
				.currentUserCustomer;
			createWidget(this.formId, {
				container: this.tfMountPoint,
				hidden: {
					email: me.email,
					id_customer: `${me.id}`,
					csm: company.csmEmail || '',
					company: company.name,
				},
				onReady: (): void => {
					this.loading = false;
				},
			});
		} catch (error) {
			this.loading = false;
			createWidget(this.formId, {
				container: this.tfMountPoint,
			});
			AxiosUtils.defaultErrorLog(
				'TypeformModal: Cannot get current logged user:',
				error
			);
		}
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#typeform-modal {

	.modal {
		width: unset;
		max-width: unset;

		.content {
			padding: unset;
			position: relative;
			width: 80vw;
			height: 70vh;

			#tf div iframe{
				display: block;
				width: 80vw;
				height: 70vh;
				min-width: math.div($text-container-width, 2);
			}
		}

		.footer {
			display: none;
		}
	}
}
</style>