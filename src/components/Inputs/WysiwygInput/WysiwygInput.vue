<template lang="pug">
extends /src/components/Inputs/CustomInput/CustomInputTemplate
block field
	.field(
		:class='{ disabled, readonly }',
		:external-id='cfg.externalId',
		v-if='editorConfig'
	)
		ck-editor(
			ref='input',
			v-model='inputValue',
			v-if='!forceUpdate',
			@input='emitChanges',
			@focus='focused = true',
			@blur='focused = false',
			@ready='initEditorModel',
			:readonly='cfg.readonly',
			:disabled='disabled',
			:editor='editor',
			:config='editorConfig',
			:id='uid'
		)/
		+after
		+tooltip
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { WysiwygInputConfig } from '@/components/Inputs/InputsTypes';
import CustomEditor from '@/components/Inputs/WysiwygInput/CustomEditor';
import AxiosUtils from '@/services/AxiosUtils';
import ComponentsUtils from '@/services/ComponentsUtils';
import Environment from '@/services/EnvironmentService';
import Logger from '@/services/LoggerService';
import ckeditor from '@ckeditor/ckeditor5-vue';
import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import { Component } from 'vue-property-decorator';

const customColors: string[] = [
	'#585AFA',
	'#4647C9',
	'#343598',
	'#222367',
	'#111136',
	'#2D80F7',
	'#266CD1',
	'#2059AC',
	'#194686',
	'#133361',
	'#8161CA',
	'#6A4FA7',
	'#533D84',
	'#3C2B61',
	'#251A3E',
	'#888D94',
	'#71767C',
	'#5B5F64',
	'#44484C',
	'#2E3134',
	'#FDC84A',
	'#DDAE3C',
	'#BE942F',
	'#9F7A21',
	'#806014',
	'#FBA44B',
	'#D0863B',
	'#A5692C',
	'#7A4C1D',
	'#4F2F0E',
	'#FB4F68',
	'#D44055',
	'#AD3143',
	'#862230',
	'#60131E',
	'#0CA83B',
	'#0B8B32',
	'#0B6E29',
	'#0B5120',
	'#0B3417',
];

/**
 * Wysiwyg input field. Uses values of types string.
 * This component is just a custom implementation of the ckeditor
 * plugin. The custom editor code was generated using the online
 * ckeditor builder: https://ckeditor.com/ckeditor-5/online-builder/
 * /!\ Use the source not the build /!\
 */
@Component({
	components: {
		CkEditor: ckeditor.component,
	},
})
export default class WysiwygInput extends CustomInput<
	string,
	WysiwygInputConfig
> {
	protected masterValue: string = '';
	protected readonly uidPrefix: string = 'wysiwyg-';
	protected inputValue: string = '';
	protected editor: typeof CustomEditor = CustomEditor;
	protected editorConf: CKEDITOR.config = {
		fontColor: {
			colors: customColors,
			columns: 5,
		},
		fontSize: {
			options: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
		},
		toolbar: {
			items: [
				'bold',
				'italic',
				'fontColor',
				'fontSize',
				'alignment',
				'removeFormat',
				'|',
				'specialCharacters',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'imageInsert',
				'insertTable',
				'mediaEmbed',
				'htmlEmbed',
				'|',
				'undo',
				'redo',
			],
		},
		language: 'fr',
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'tableCellProperties',
				'tableProperties',
			],
			tableProperties: {
				borderColors: customColors,
				backgroundColors: customColors,
			},
			tableCellProperties: {
				borderColors: customColors,
				backgroundColors: customColors,
			},
		},
		simpleUpload: {
			uploadUrl: `${Environment.any.api}/upload/image`,
			withCredentials: true,
			headers: AxiosUtils.defaultHeaders,
		},
		mediaEmbed: {
			previewsInData: true,
		},
	};
	protected get editorConfig(): CKEDITOR.config {
		if (this.forceUpdate)
			this.$nextTick().then((): void => {
				this.forceUpdate = false;
			});
		return this.editorConf;
	}
	protected set editorConfig(val: CKEDITOR.config) {
		this.editorConf = val;
	}

	private editorReady: boolean = false;
	private pendingValue: string = '';

	private requiredErrorMsg: string = '';

	/**
	 * I don't know why or how, but the original `value` is
	 * magically transformed into a prop in this component and only
	 * in this component. So I had to re-define it here. Oh and also
	 * v-model doesn't work anymore, use v-master instead.
	 * Thanks Vuejs.
	 */
	protected get fixValue(): string {
		return this.modelValue || this.masterValue;
	}

	public editEditorConfig(config: CKEDITOR.config): void {
		_.merge(this.editorConfig, config);
		this.forceUpdate = true;
	}

	public emitChanges(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'WysiwygInput: emitChanges: this.cfg is false',
				this
			);
		if (
			this.disabled ||
			this.cfg.readonly ||
			this.inputValue === this.fixValue
		)
			return;
		const value: string = sanitizeHtml(
			this.inputValue,
			ComponentsUtils.defaultSanitizerOptions
		);

		if (value === this.fixValue) return;
		this.$emit('change', value);
	}

	public checkConstraints(value?: string): boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'WysiwygInput: checkConstraints: this.cfg is false',
				this
			);
		if (this.disabled) return true;
		const valueToCheck: string =
			value !== undefined ? value : this.fixValue;

		const valid: boolean =
			!this.cfg.constraints?.required ||
			(this.cfg.constraints?.required === true &&
				!this.emptyValue(valueToCheck) &&
				(this.cfg.validityCheck
					? this.cfg.validityCheck(valueToCheck)
					: true));

		if (!valid) this.validationMessage = this.requiredErrorMsg;
		if (!this.cfg.constraints?.required && this.emptyValue(valueToCheck))
			this.validity = '';
		else this.validity = valid ? 'valid' : 'error';
		return valid;
	}

	public emptyValue(val: string | undefined): boolean {
		return !val?.length;
	}

	protected initEditorModel(): void {
		this.editorReady = true;
		if (this.disabled)
			return Logger.dbgLog(
				'WysiwygInput: initEditorModel: this.disabled is true',
				this
			);
		this.inputValue = this.pendingValue;
	}

	protected onModelValueChange(val: string | undefined): void {
		if (this.disabled)
			return Logger.dbgLog(
				'WysiwygInput: onModelValueChange: this.disabled is true',
				this
			);
		if (!val) this.inputValue = '';
		else {
			if (this.editorReady) {
				const newVal: string = sanitizeHtml(
					val,
					ComponentsUtils.defaultSanitizerOptions
				);
				if (
					newVal !==
					sanitizeHtml(
						this.inputValue,
						ComponentsUtils.defaultSanitizerOptions
					)
				)
					this.inputValue = newVal;
			} else
				this.pendingValue = sanitizeHtml(
					val,
					ComponentsUtils.defaultSanitizerOptions
				);
		}
	}

	protected additionalConfigInit(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'WysiwygInput: additionalConfigInit: this.cfg is false',
				this
			);
		if (this.cfg.constraints?.required) {
			const tmp: HTMLInputElement = document.createElement('input');
			tmp.type = 'text';
			tmp.required = true;
			tmp.checkValidity();
			this.requiredErrorMsg = tmp.validationMessage;
		}
	}

	private created(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'WysiwygInput: created: this.cfg is false',
				this
			);
		if (this.cfg.wysiwyg) _.merge(this.editorConfig, this.cfg.wysiwyg);
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
		console.log('TEST')
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.wysiwyg-input {
	.field {
		border: none;
		padding: 0;

		.ck {
			&.ck-editor__main {
				min-height: 300px;
				overflow: hidden;
				resize: vertical;
				transition: none;


				>.ck-editor__editable {
					min-height: 300px;
					height: 100%;
				}

				>.ck-editor__editable:not(.ck-focused),
				.ck .ck-toolbar {
					border-color: $border-color;
				}

				>.ck-editor__editable.ck-focused {
					border-color: $default-color;
					box-shadow: 0 0 0 $border-width-focused rgba($default-color, .3);
					transition: box-shadow $normal-speed;
				}
			}

			&.ck-toolbar__separator {
				background: $border-color;
			}

			.ck-content {
				.text-8pt {
					font-size: 8pt;
				}
				.text-10pt {
					font-size: 10pt;
				}
				.text-12pt {
					font-size: 12pt;
				}
				.text-14pt {
					font-size: 14pt;
				}
				.text-18pt {
					font-size: 18pt;
				}
				.text-24pt {
					font-size: 24pt;
				}
			}
		}
	}
}
</style>
