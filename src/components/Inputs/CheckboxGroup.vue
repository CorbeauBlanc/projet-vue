<template lang="pug">
include /src/components/Inputs/CustomInput/CustomInputMixins

.checkbox-group(
	v-if='cfg',
	:class='[validity, cfg.constraints && cfg.constraints.required ? "required" : ""]'
)
	template(v-if='!checkboxConfig')
		+label
	checkbox-input(
		v-else,
		ref='input',
		:config='checkboxConfig',
		v-model='checkboxValue'
	)
	checkbox-group(
		ref='subgroups',
		v-for='(group, index) in next',
		:key='index',
		:config='group',
		:model-value='getGroupsValue()',
		@change='setGroupValue(group, $event)',
		_sub-group
	)
	+errors
	+hint
</template>

<script lang="ts">
import CustomInput from '@/components/Inputs/CustomInput/CustomInput';
import { Attr } from '@/decorators';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import { Component, Ref } from 'vue-property-decorator';
import { Dictionary } from 'vue-router/types/router';
import CheckboxInput from './CheckboxInput.vue';
import {
	CheckboxGroupConfig,
	CheckboxGroupLastConfig,
	CheckboxGroupMiddleConfig,
	CheckboxInputConfig,
	InputOptionTree,
	InputType,
} from './InputsTypes';

/**
 * Component used to generate a group where each item is either a checkbox field
 * or another group. Each group can also be linked to a single checkbox
 * that will automatically check or uncheck each checkbox/group of the group.
 * Uses InputOptionTree as value.
 */
@Component({
	components: {
		CheckboxInput,
	},
})
export default class CheckboxGroup extends CustomInput<
	InputOptionTree,
	CheckboxGroupConfig | CheckboxGroupLastConfig
> {
	protected multipleIsDefault: boolean = true;
	protected get checkboxValue(): Dictionary<boolean> | string[] | boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'CheckboxGroup: get checkboxValue: this.cfg is false',
				this
			);
		if (this.forceUpdate) this.forceUpdate = false;
		if (typeof this.value === 'boolean' || Array.isArray(this.value))
			return this.value;

		const value: Dictionary<boolean> = Js.clone(
			{},
			this.value,
			1
		) as Dictionary<boolean>;
		value[this.cfg.name || ''] = this.allGroupsHaveValue(
			true,
			this.next,
			this.value[this.cfg.name || '']
		)
			? true
			: false;
		return value;
	}
	protected set checkboxValue(
		value: Dictionary<boolean> | string[] | boolean
	) {
		if (!this.disabled) this.changeEvent(value);
		else
			Logger.dbgLog(
				'CheckboxGroup: set checkboxValue: this.disabled is true',
				this
			);
	}

	@Ref() protected readonly subgroups!: CheckboxGroup[];

	@Attr() protected readonly pSubGroup!: boolean;

	/**
	 * The checkboxes/groups the group contains.
	 */
	protected next: (CheckboxGroupMiddleConfig | CheckboxGroupLastConfig)[] =
		[];
	/**
	 * The config of the main checkbox.
	 */
	protected checkboxConfig: CheckboxInputConfig | false = false;
	protected masterValue: InputOptionTree = false;

	/**
	 * An object used to store the state of the InputOptionTree if all the groups were selected
	 * without using booleans.
	 */
	private allGroupsSelected: Dictionary<InputOptionTree> | string[] = {};
	private noGroupsSelected: Dictionary<InputOptionTree> | string[] = {};

	private requiredErrorMsg: string = '';

	public emptyValue(val: InputOptionTree): boolean {
		return !val ? true : false;
	}

	public checkConstraints(): boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'CheckboxGroup: checkConstraints: this.cfg is false',
				this
			);
		if (this.disabled) return true;
		let valid: boolean = true;
		if (
			this.checkboxConfig &&
			!(this.input as CheckboxInput).checkConstraints()
		) {
			this.validationMessage = (
				this.input as CheckboxInput
			).validationMessage;
			valid = false;
		} else if (
			this.next.length &&
			!this.subgroups.every((group: CheckboxGroup): boolean =>
				group.checkConstraints()
			)
		)
			valid = false;
		if (this.cfg.constraints?.required && !this.value) {
			this.validationMessage = this.requiredErrorMsg;
			valid = false;
		}
		this.validity = valid ? 'valid' : 'error';
		return valid;
	}

	protected onModelValueChange(value: InputOptionTree): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'CheckboxGroup: onModelValueChange: this.cfg is false',
				this
			);
		if (value === undefined) value = false;
		if (!this.cfg.mergeGroupValues) {
			const name: string | undefined = this.cfg.name;

			if (name) {
				if (typeof value === 'boolean' && !this.pSubGroup)
					this.changeEvent(
						Object.fromEntries([[name, this.getSplitValue(value)]])
					);
				else if (
					!Array.isArray(value) &&
					typeof value !== 'boolean' &&
					typeof value[name] === 'boolean'
				)
					value[name] = this.getSplitValue(value[name] as boolean);
			} else if (typeof value === 'boolean')
				this.changeEvent(this.getSplitValue(value));
		} else this.forceUpdate = true;
	}

	/**
	 * Returns a group config object in the current InputOptionTree, given the group name.
	 * @public
	 */
	protected getGroupsValue(): InputOptionTree {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				{},
				'CheckboxGroup: getGroupsValue: this.cfg is false',
				this
			);
		if (
			typeof this.value === 'boolean' ||
			Array.isArray(this.value) ||
			!this.cfg.name
		)
			return this.value;
		return this.value[this.cfg.name] || false;
	}
	/**
	 * Sets a group config object in the current InputOptionTree. It will adapt the shape of the InputOptionTree
	 * if necessary first before setting the group, then before emitting the changes.
	 * @public
	 */
	protected setGroupValue(
		group: CheckboxGroupMiddleConfig | CheckboxGroupLastConfig,
		value: Dictionary<InputOptionTree> | string[]
	): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'CheckboxGroup: setGroupValue: this.cfg is false',
				this
			);
		if (this.disabled || this.cfg.readonly)
			return Logger.dbgLog(
				'CheckboxGroup: setGroupValue: this.disabled or this.cfg.readonly is true',
				this
			);
		const name: string | undefined = this.cfg.name;
		const transformedValue: Dictionary<InputOptionTree> | string[] =
			typeof this.value === 'object' ? this.value : {};
		let valueToSend: InputOptionTree = {};

		if (name) {
			if (Array.isArray(this.value) || Array.isArray(transformedValue))
				return Logger.error('Error in CheckboxGroup config');

			if (typeof transformedValue[name] !== 'object') {
				if (transformedValue[name] === undefined)
					valueToSend[name] = this.getSplitValue(this.value);
				else
					valueToSend[name] = this.getSplitValue(
						transformedValue[name]
					);
			} else valueToSend = transformedValue;

			if (!Array.isArray(value))
				(valueToSend[name] as Dictionary<InputOptionTree>)[group.name] =
					value[group.name];
			else
				valueToSend[name] =
					(this.value === true || transformedValue[name] === true) &&
					!value.includes(group.name)
						? _.without(valueToSend[name] as string[], group.name)
						: value;
		} else {
			if (typeof this.value !== 'object') {
				valueToSend = this.getSplitValue(this.value);
			} else valueToSend = transformedValue;

			if (!Array.isArray(value))
				(valueToSend as Dictionary<InputOptionTree>)[group.name] =
					value[group.name];
			else
				valueToSend =
					this.value === true && !value.includes(group.name)
						? _.without(valueToSend as string[], group.name)
						: value;
		}

		if (this.cfg.mergeGroupValues) {
			const mergeTo: boolean | undefined = this.mergePossibility(
				name
					? (valueToSend as Dictionary<InputOptionTree>)[name]
					: valueToSend
			);

			if (mergeTo !== undefined && name)
				(valueToSend as Dictionary<InputOptionTree>)[name] = mergeTo;
			else if (mergeTo !== undefined) valueToSend = mergeTo;
		}

		this.changeEvent(valueToSend);
		this.forceUpdate = true;
	}

	protected mounted(): void {
		this.mandatoryComponentInit();
		this.uid = (this.input as CheckboxInput)?.inputId || '';
	}

	private getSplitValue(
		value: InputOptionTree | undefined
	): Dictionary<InputOptionTree> | string[] {
		const ret: Dictionary<InputOptionTree> | string[] =
			value === true ? this.allGroupsSelected : this.noGroupsSelected;
		return Array.isArray(ret) ? Array.from(ret) : { ...ret };
	}

	private isLastGroupConfig(
		config:
			| CheckboxGroupConfig
			| CheckboxGroupMiddleConfig
			| CheckboxGroupLastConfig
	): config is CheckboxGroupLastConfig {
		return !(config as any).hasOwnProperty('subConfigs');
	}

	private mergePossibility(groupVal: InputOptionTree): boolean | undefined {
		if (this.allGroupsHaveValue(true, this.next, groupVal)) return true;
		if (this.allGroupsHaveValue(false, this.next, groupVal)) return false;
		return undefined;
	}

	private allGroupsHaveValue(
		val: boolean,
		subGroups: (CheckboxGroupMiddleConfig | CheckboxGroupLastConfig)[],
		currentGpVal: InputOptionTree
	): boolean {
		if (typeof currentGpVal === 'boolean' || !subGroups.length)
			return currentGpVal === val;
		if (!val && Array.isArray(currentGpVal)) return !currentGpVal.length;

		return subGroups.every(
			(
				gp: CheckboxGroupMiddleConfig | CheckboxGroupLastConfig
			): boolean => {
				if (Array.isArray(currentGpVal))
					return currentGpVal.includes(gp.name);

				const gpVal: InputOptionTree = currentGpVal[gp.name] || false;
				if (typeof gpVal === 'boolean') return gpVal === val;
				else if (gp.mergeGroupValues) return false;
				else if (this.isLastGroupConfig(gp)) return false;
				return this.allGroupsHaveValue(val, gp.subConfigs || [], gpVal);
			}
		);
	}

	protected additionalConfigInit(): void {
		if (!this.cfg)
			return Logger.dbgWarn(
				'CheckboxGroup: additionalConfigInit: this.cfg is false',
				this
			);
		if (!this.isLastGroupConfig(this.cfg)) {
			this.next = this.cfg.subConfigs;

			if (this.cfg.checkFormat === 'array') {
				this.cfg.subConfigs.forEach(
					(group: CheckboxGroupLastConfig): void => {
						(group as CheckboxGroupMiddleConfig).checkFormat =
							'array';
					}
				);
			}
		}

		if (
			this.cfg.mergeGroupValues === undefined ||
			(!this.cfg.mergeGroupValues && !this.next.length)
		)
			this.cfg.mergeGroupValues = true;

		if (this.cfg.name)
			this.checkboxConfig = {
				...this.cfg,
				checkFormat: this.isLastGroupConfig(this.cfg)
					? this.cfg.checkFormat
					: 'object',
				type: InputType.CHECKBOX,
			};

		const allGpNames: string[] = this.next.map(
			(gp: CheckboxGroupMiddleConfig | CheckboxGroupLastConfig): string =>
				gp.name
		);
		this.allGroupsSelected =
			this.cfg.checkFormat === 'array'
				? allGpNames
				: Js.tallObjFromEntries(allGpNames, true);
		this.noGroupsSelected = this.cfg.checkFormat === 'array' ? [] : {};

		if (this.cfg.constraints?.required) {
			const tmp: HTMLInputElement = document.createElement('input');
			tmp.type = 'radio';
			tmp.required = true;
			tmp.checkValidity();
			this.requiredErrorMsg = tmp.validationMessage;
		}
	}
}
</script>

<style lang="scss">
.checkbox-group .field {
	padding: 0;
}
</style>
