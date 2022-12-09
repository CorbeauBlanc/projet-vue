<template>
	<div class="filters">
		<div class="list-filters">
			<component
				v-for="(filter, i) in inputsList"
				v-model="rawValues[getKeyVal(filter.key)]"
				:ref="getKeyVal(filter.key)"
				:key="getKeyVal(filter.key) + i"
				:is="filter.type"
				:config="filter"
				:class="filter.class"
				:style="{ maxWidth: inputSize }"
				:lazy="lazy"
				@change="emitChanges(false)"
			/>
		</div>
		<div
			class="filters-actions center aligned"
			v-if="lazy"
		>
			<button class="reset-button button ghost" @click="reset">
				{{ $t('Réinitialiser') }}
			</button>
			<button
				class="submit-button button"
				@click="emitChanges(true)"
			>
				{{ $t('Lancer la recherche') }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxGroup from '@/components/Inputs/CheckboxGroup.vue';
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import CustomInput, {
	ValueTypes,
} from '@/components/Inputs/CustomInput/CustomInput';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import DateInput from '@/components/Inputs/DateInput/DateInput.vue';
import {
	GenericInputConfig,
	InputOption,
} from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { Master } from '@/decorators';
import { Component, Vision } from '@/optician';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import _, { Dictionary } from 'lodash';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import {
	FilterConfig,
	FiltersConfigCollection,
	FiltersMap,
	FiltersValue,
} from './FiltersTypes';

/**
 * Component rendering a list of predefined filters and emitting the choices of the user
 */
@Component({
	components: {
		CheckboxInput,
		CheckboxGroup,
		TextInput,
		DateInput,
		SelectInput,
		DatalistInput,
		NumberInput,
	},
})
export default class Filters extends Vision {
	/**
	 * The array of filters and their parameters
	 * @type {FilterConfig[]}
	 */
	@Prop() public readonly inputs!: FiltersConfigCollection;
	/**
	 * The keys of the cells each filter relates to.
	 * (can also be set directly in `inputs`)
	 * @type {string[]}
	 */
	@Prop() public readonly keys!: (string | string[])[];
	/**
	 * Tells if the filter should emit the filters every time they change or only when the user click a button
	 * (button only displayed when `lazy` is true)
	 */
	@Prop() public readonly lazy!: boolean;

	@Master('change') protected readonly value!: FiltersMap;

	@Master('change-raw')
	public get raw(): Dictionary<FiltersValue> {
		return this.rawValues;
	}
	public set raw(val: Dictionary<FiltersValue>) {
		this.rawValues = val;
		this.changeEvent(this.getFormatedValues());
	}

	protected rawValues: Dictionary<FiltersValue> = {};
	protected inputsMap: Map<string, FilterConfig> = new Map();

	protected get inputsList(): FiltersConfigCollection {
		if (this.forceUpdate) this.forceUpdate = false;

		return this.inputs;
	}

	public reset(): void {
		this.changeRawEvent({});
	}

	@Watch('inputs')
	protected onInputsChange(): void {
		if (!this.inputs)
			return Logger.dbgLog(
				'Filters: onInputsChange: this.inputs is undefined',
				this
			);
		this.inputs.forEach(
			async (
				input: FilterConfig | Promise<FilterConfig>,
				i: number
			): Promise<void> => {
				if (input instanceof Promise) {
					input = await input;
					this.inputs[i] = input;
				}
				if (!input.key)
					input.key =
						this.keys && i < this.keys.length
							? this.keys[i]
							: i.toString();
				this.inputsMap.set(this.getKeyVal(input.key), input);
				this.forceUpdate = true;
			}
		);
	}

	/**
	 * If the conditions are right emit the filtered values set by the user,
	 * but not before removing all the empty filters from the object to be sent
	 * @public
	 */
	public emitChanges(buttonTriggered: boolean): void {
		if (this.lazy && !buttonTriggered)
			return Logger.dbgLog(
				'Filters: emitChanges: this.lazy is true and buttonTriggered is false',
				this
			);
		this.changeEvent(this.getFormatedValues());
		this.changeRawEvent(this.rawValues);
	}

	protected getKeyVal(key: string | string[]): string {
		return Array.isArray(key) ? _.camelCase(key.join('-')) : key;
	}

	protected get inputSize(): string {
		return `${100 / this.inputs.length}%`;
	}

	@Emit('change')
	protected changeEvent(payload?: FiltersMap): void {
		this.preventWatchFeedback = true;
	}

	protected bidon: Dictionary<FiltersValue> = {};

	@Emit('change-raw')
	protected changeRawEvent(payload?: FiltersMap): void {
		if (payload) this.removeEmptyFromRaw();
		this.preventWatchFeedback = true;
	}

	private removeEmptyFromRaw(): void {
		for (const key in this.rawValues) {
			if (
				this.rawValues.hasOwnProperty(key) &&
				(
					this.$refs[key] as CustomInput<
						ValueTypes,
						GenericInputConfig
					>[]
				)[0].emptyValue(this.rawValues[key])
			)
				delete this.rawValues[key];
		}
	}

	private getFormatedValues(): FiltersMap {
		const formatted: FiltersMap = {};

		for (const key in this.rawValues) {
			if (
				this.rawValues.hasOwnProperty(key) &&
				(!this.$refs[key] ||
					!(
						this.$refs[key] as CustomInput<
							ValueTypes,
							GenericInputConfig
						>[]
					)[0].emptyValue(this.rawValues[key]))
			) {
				const input: FilterConfig | undefined = this.inputsMap.get(key);
				const finalVal: string | string[] = InputOption.toValue(
					this.rawValues[key]
				);

				if (!input || !input.key) {
					Logger.dbgError(
						'Filters: getFormatedValues: input or input.key is undefined',
						this
					);
					break;
				}

				if (Array.isArray(input.key))
					formatted[input.key[0]] = Js.flatObjFromEntries(
						input.key,
						finalVal
					)[input.key[0]];
				else formatted[input.key] = finalVal;
			}
		}
		return formatted;
	}

	/**
	 * Sets the keys of the filters if necessary using either the `key` prop, or the position of the index as a key.
	 */
	private created(): void {
		this.onInputsChange();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.filters {
	font-size: 1rem;

	.list-filters {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;

		& > div {
			margin: math.div($padding, 2) 0;
			padding: 0 math.div($padding, 2);
			min-width: min-content;
			flex-grow: 1;

			&:first-child {
				padding-left: 0;
			}

			&:last-child {
				padding-right: 0;
			}
		}
	}

	.filters-actions {
		flex: 0 100%;
		justify-content: center;
		margin: $padding;
	}
}
</style>
