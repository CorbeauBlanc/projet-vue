<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block input
	input(
		type='time',
		ref='input',
		v-model='inputValue',
		v-bind='cfg.constraints',
		@input='handleDebouncedInput',
		@keyup.enter='addToSelection',
		@keydown.delete='handleDelete',
		@focus='focused = true',
		@blur='focused = false',
		:external-id='cfg.externalId',
		:readonly='cfg.readonly',
		:disabled='disabled',
		:name='cfg.name',
		:id='uid',
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
export default class TimeInput extends TextInput {
	protected readonly uidPrefix: string = 'time-';
}
</script>

<style lang="scss" scoped>
@import './TextInput/TextInputStyle';

.time-input {
	@include textInputProperties;
}
</style>
