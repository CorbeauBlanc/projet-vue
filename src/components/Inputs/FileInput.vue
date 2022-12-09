<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block field
	.field-container
		.input
			button.button.ghost(v-if='value && value.length', @click='clear')
				icon(delete)
			label.button.ghost(:for='uid', :class='{ selected: value && value.length }')
				icon(upload)
				| {{ cfg.placeholder }}
			input(
				type='file',
				ref='input',
				v-bind='cfg.constraints',
				@change='setSelection',
				@focus='focused = true',
				@blur='focused = false',
				:external-id='cfg.externalId',
				:disabled='disabled',
				:readonly='cfg.readonly',
				:key='`${uid}-reset-${resetKey}`',
				:name='cfg.name',
				:id='uid',
				:multiple='cfg.multiple'
			)/
		+after
		+tooltip
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { FileInputConfig } from '@/components/Inputs/InputsTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Logger from '@/services/LoggerService';
import { Component } from 'vue-property-decorator';
import SelectedFile from './SelectedFile.vue';

@Component({
	components: {
		SelectedFile,
		Tooltip,
	},
})
export default class FileInput extends CustomInput<File[], FileInputConfig> {
	protected masterValue: File[] = [];
	protected resetKey: boolean = false;
	protected readonly uidPrefix: string = 'file-';

	public emptyValue(val: File[] | undefined): boolean {
		if (!val) return true;
		return !val.length;
	}

	protected clear(): void {
		if (!this.cfg)
			return Logger.dbgWarn('FileInput: clear: this.cfg is false', this);
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgWarn(
				'FileInput: clear: this.disabled or this.cfg.readonly is true',
				this
			);
		this.resetKey = !this.resetKey;
		this.$emit('change', []);
	}

	/**
	 * Adds the value of the input to the array of selected values.
	 * @public
	 */
	protected setSelection(evt: Event): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'FileInput: setSelection: this.cfg is false',
				this
			);
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgWarn(
				'FileInput: setSelection: this.disabled or this.cfg.readonly is true',
				this
			);
		const files: FileList | null = (evt.target as HTMLInputElement).files;
		if (!files || files.length === 0) this.changeEvent([]);
		else this.changeEvent(Array.from(files));
	}

	protected onModelValueChange(): void {
		return;
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';

.file-input {
	.icon.help {
		position: relative;
		font-size: 1.2em;
		margin-left: 1em;
	}

	.field-container {
		display: flex;
		flex-wrap: wrap;

		.icon.delete {
			margin-right: 0;
		}

		.input {
			width: 100%;
			height: fit-content;

			input {
				display: none;
			}

			button.button {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				margin-right: 1px;
			}

			label.button {
				&.selected {
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
				margin-right: 0;
			}
		}
	}
}
</style>
