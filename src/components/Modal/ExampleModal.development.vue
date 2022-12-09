<template lang="pug">
	extends /src/components/Modal/ModalTemplate
	block header
		h1
			| {{ headerText }}

	block content
		p This is an example of how custom modals should be made using the <strong>Modal</strong> component

	block footer
		| {{ footerText }}
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import Modal from './Modal';

/**
 * To use the default js interface you simply have to extends the `Modal` component.
 */
@Component({})
export default class ExampleModal extends Modal {
	protected headerText: string = 'Example Modal';
	protected footerText: string = '(this is the footer)';
}
</script>
