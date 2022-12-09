<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block input
	input(
		type='range',
		ref='input',
		v-bind='cfg.constraints',
		@change='changeEvent($event.target.value)',
		@focus='focused = true',
		@blur='focused = false',
		:external-id='cfg.externalId',
		:disabled='disabled',
		:readonly='cfg.readonly',
		:id='uid',
		:name='cfg.name',
		:value='value',
		:class='{ search: cfg.search }'
	)/
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { RangeInputConfig } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { Component } from 'vue-property-decorator';

@Component({
	components: {
		Tooltip,
	},
})
export default class RangeInput extends CustomInput<string, RangeInputConfig> {
	protected masterValue: string = '';
	protected readonly uidPrefix: string = 'range-';

	public emptyValue(val: string | undefined): boolean {
		return !val?.length;
	}

	protected onModelValueChange(): void {
		return;
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.range-input {
	&.inverted {
		input {
			background: $white;

			&::-webkit-slider-thumb {
				background: $white;

				&:hover {
					box-shadow: 0 0 5px $white;
				}
			}

			&::-moz-range-thumb {
				background: $white;

				&:hover {
					box-shadow: 0 0 5px $white;
				}
			}
		}
	}

	.icon.help {
		position: relative;
		font-size: 1.2em;
		margin-left: 1em;
	}

	.field {
		border: none;
		outline: none;
		background: none;

		&.focused {
			box-shadow: none;
		}
	}

	input {
		appearance: none;
		outline: none;
		width: 100%;
		height: .3em;

		&::-webkit-slider-thumb {
			appearance: none;
			width: .9em;
			height: .9em;
			border-radius: 50%;
			cursor: pointer;
		}

		&::-moz-range-thumb {
			appearance: none;
			width: .9em;
			height: .9em;
			border-radius: 50%;
			cursor: pointer;
		}
	}
}
</style>
