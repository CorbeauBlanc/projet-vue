<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block input
	input(
		type='tel',
		ref='input',
		v-model.trim='inputValue',
		v-bind='cfg.constraints',
		@input='handleDebouncedInput',
		@keyup.enter='addToSelection',
		@focus='focused = true',
		@blur='focused = false',
		@keydown.delete='handleDelete',
		:external-id='cfg.externalId',
		:name='cfg.name',
		:readonly='cfg.readonly',
		:disabled='disabled',
		:id='uid',
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
export default class TelInput extends TextInput {
	protected readonly uidPrefix: string = 'tel-';
}
</script>

<style lang="scss" scoped>
@import './TextInput/TextInputStyle';

.tel-input {
	@include textInputProperties;
}
</style>
