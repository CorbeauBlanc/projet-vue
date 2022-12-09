<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block input
	input(
		type='email',
		ref='input',
		v-model.trim='inputValue',
		v-bind='cfg.constraints',
		@input='handleDebouncedInput',
		@keyup.enter='addToSelection',
		@keydown.delete='handleDelete',
		@focus='focused = true',
		@blur='focused = false',
		:external-id='cfg.externalId',
		:readonly='cfg.readonly',
		:disabled='disabled',
		:id='uid',
		:name='cfg.name',
		:placeholder='cfg.translate ? $t(cfg.placeholder) : cfg.placeholder',
		:class='{ search: cfg.search }'
	)/
</template>

<script lang="ts">
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class EmailInput extends TextInput {
	protected readonly uidPrefix: string = 'email-';
}
</script>

<style lang="scss" scoped>
@import './TextInput/TextInputStyle';

.email-input {
	@include textInputProperties;
}
</style>
