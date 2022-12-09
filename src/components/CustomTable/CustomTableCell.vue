<template>
	<td :class="cellData.class" :colspan="colspan">
		<tooltip
			v-if="cellContent.tooltip"
			:class="cellContent.tooltip.class"
			:intrusive="true"
			>{{
				translateEnabled
					? $t(cellContent.tooltip.text)
					: cellContent.tooltip.text
			}}</tooltip
		>
		<button
			class="button secondary small expand"
			v-if="cellData.toggleSubtable"
			@click="$emit('togglesubtable')"
		>
			<i :class="['icon chevron', subTableHidden ? 'down' : 'up']"></i>
		</button>
		<template v-if="isString">
			<span
				v-if="!editModeEnabled"
				:class="['text', cellContent.class]"
				@click="editModeEnabled = true"
				>{{ translateEnabled ? $t(value) : value }}</span
			>
			<text-input
				v-else-if="editModeEnabled && !userEditConfig"
				class="cell-editor"
				ref="cellEditor"
				v-master="value"
				:config="defaultEditConfig"
				:lazy="true"
				@keyup.escape.native="editModeEnabled = false"
			/>
			<component
				v-else-if="editModeEnabled"
				class="cell-editor"
				ref="cellEditor"
				v-master="value"
				:is="userEditConfig.type ? userEditConfig.type : 'TextInput'"
				:config="userEditConfig"
				:lazy="true"
				@keyup.escape.native="editModeEnabled = false"
			/>
		</template>
		<i v-else-if="isIcon" :class="['icon', value]"></i>
		<img
			v-else-if="isImage"
			:class="cellContent.class"
			:src="cellContent.scr"
			:alt="translateEnabled ? $t(cellContent.value) : cellContent.value"
		/>
		<a v-else-if="isLink" :class="cellContent.class" :href="href">{{
			translateEnabled ? $t(value) : value
		}}</a>
		<router-link
			v-else-if="isRoute"
			:class="cellContent.class"
			:to="cellContent.route"
			>{{ translateEnabled ? $t(value) : value }}</router-link
		>
		<component
			v-else-if="isComponent"
			v-bind="component.data"
			:is="component.name"
			:class="cellContent.class"
			v-on="transparentEvents"
		/>
		<custom-table
			v-else-if="isTable"
			:config="cellContent.table.config"
			:labels="cellContent.table.labels"
			:data="cellContent.table.data"
			class="sub-table"
			:class="cellContent.class"
		/>
	</td>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import ColorInput from '@/components/Inputs/ColorInput.vue';
import CustomInput, {
	ValueTypes,
} from '@/components/Inputs/CustomInput/CustomInput';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import DateInput from '@/components/Inputs/DateInput/DateInput.vue';
import EmailInput from '@/components/Inputs/EmailInput.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import {
	GenericInputConfig,
	InputConfig,
} from '@/components/Inputs/InputsTypes';
import NumberInput from '@/components/Inputs/NumberInput.vue';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import RangeInput from '@/components/Inputs/RangeInput.vue';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TelInput from '@/components/Inputs/TelInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import TimeInput from '@/components/Inputs/TimeInput.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import ComponentsUtils from '@/services/ComponentsUtils';
import { ContentType, VueListener } from '@/types';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import {
	CustomTableCellContent,
	CustomTableCellData,
	CustomTableEditionEvent,
} from './CustomTableTypes';

/**
 * Component used to render the content of a cell
 */
@Component({
	components: {
		Tooltip,
		TextInput,
		CheckboxInput,
		ColorInput,
		DatalistInput,
		DateInput,
		EmailInput,
		FileInput,
		NumberInput,
		RadiosInput,
		RangeInput,
		SelectInput,
		TelInput,
		TimeInput,
	},
})
export default class CustomTableCell extends Vue {
	/**
	 * Prop used to retrieve the content of the cell. Either a string or a CustomTableCellData
	 * @type {string | CustomTableCellData}
	 */
	@Prop() public readonly cellData!: string | CustomTableCellData;
	@Prop() public readonly enableInlineEdition!: boolean | InputConfig;
	@Prop() public readonly colspan!: number;
	@Prop() public readonly subTableHidden!: boolean;
	@Prop() public readonly translate!: boolean;

	protected cellContent: CustomTableCellContent = {};
	protected href: string = '';
	protected isString: boolean = false;
	protected isComponent: boolean = false;
	protected isImage: boolean = false;
	protected isLink: boolean = false;
	protected isRoute: boolean = false;
	protected isTable: boolean = false;
	protected isIcon: boolean = false;
	protected defaultEditConfig: InputConfig = {
		autofocus: true,
		multiple: false,
	};
	protected userEditConfig: InputConfig | false = false;
	protected component: { name: string; data: { [key: string]: any } } = {
		name: '',
		data: {},
	};
	protected transparentEvents: VueListener = ComponentsUtils.getListener(
		[
			'post',
			'put',
			'patch',
			'delete',
			'change:cell',
			'delete:row',
			'togglesubtable',
			'componentevent',
		],
		this.bubbleup
	);

	@Ref() private readonly cellEditor!: CustomInput<
		ValueTypes,
		GenericInputConfig
	>;

	private editMode: boolean = false;

	protected get value(): string {
		return this.pValue;
	}
	protected set value(val: string) {
		this.emitChanges(val);
	}

	protected set editModeEnabled(val: boolean) {
		if (this.enableInlineEdition) this.editMode = val;
	}
	protected get editModeEnabled(): boolean {
		return this.editMode;
	}

	protected get translateEnabled(): boolean {
		return this.cellContent.translate !== undefined
			? this.cellContent.translate
			: this.translate;
	}

	private pValue: string = '';

	/**
	 * Emits an event when the content of the cell is changed by the user and toggles the edit mode
	 * @public
	 */
	public emitChanges(value: string): void {
		/**
		 * Check input constraints
		 */
		if (typeof this.enableInlineEdition !== 'boolean') {
			if (this.enableInlineEdition.constraints) {
				if (this.enableInlineEdition.constraints.min)
					if (value < this.enableInlineEdition.constraints.min) {
						this.editModeEnabled = false;
						return;
					}

				if (this.enableInlineEdition.constraints.max)
					if (value > this.enableInlineEdition.constraints.max) {
						this.editModeEnabled = false;
						return;
					}
			}
		}

		/**
		 * Emits a CustomTableEditionEvent
		 * @type {CustomTableEditionEvent}
		 */
		this.$emit('change:cell', {
			rowIndex: '',
			colIndex: '',
			oldValue: this.pValue,
			newValue: value,
		} as CustomTableEditionEvent);
		this.pValue = value;
		this.editModeEnabled = false;
	}

	public toggleEditMode(cancelModifications?: boolean): void {
		this.setEditMode(!this.editModeEnabled);
	}

	public setEditMode(value: boolean, cancelModifications?: boolean): void {
		this.editModeEnabled = value;
		if (!this.editModeEnabled && !cancelModifications)
			this.emitChanges(this.cellEditor.getCurrentInputValue() as string);
	}

	protected bubbleup(name: string, payload: any): void {
		this.$emit(name, payload);
	}

	@Watch('cellData', { immediate: true, deep: true })
	private onCellDataChange(): void {
		this.resetCellData();
	}

	private resetCellData(): void {
		this.pValue = '';
		this.href = '';
		this.isString = false;
		this.isComponent = false;
		this.isImage = false;
		this.isLink = false;
		this.isRoute = false;
		this.isTable = false;
		this.isIcon = false;
		this.editMode = false;
		this.userEditConfig = false;
		this.component = { name: '', data: {} };

		if (
			this.enableInlineEdition &&
			typeof this.enableInlineEdition !== 'boolean'
		)
			this.userEditConfig = this.enableInlineEdition;

		if (typeof this.cellData === 'string') {
			this.pValue = this.cellData;
			if (
				this.cellData.indexOf('https://') === 0 ||
				this.cellData.indexOf('http://') === 0
			) {
				this.href = this.cellData;
				this.isLink = true;
			} else this.isString = true;
		} else {
			this.cellContent = this.cellData.content;
			this.defaultEditConfig.translate = this.cellContent.translate;
			switch (this.cellContent.type) {
				case ContentType.COMPONENT:
					this.loadComp();
					this.isComponent = true;
					break;
				case ContentType.STRING:
					this.pValue = this.cellContent.value || '';
					this.isString = true;
					break;
				case ContentType.IMAGE:
					this.isImage = true;
					break;
				case ContentType.LINK:
					this.pValue = this.cellContent.value || '';
					this.href = this.cellContent.href
						? this.cellContent.href
						: '';
					this.isLink = true;
					break;
				case ContentType.ROUTE:
					this.pValue = this.cellContent.value || '';
					this.isRoute = true;
					break;
				case ContentType.TABLE:
					this.isTable = true;
					break;
				case ContentType.ICON:
					this.isIcon = true;
					this.pValue = `${this.cellContent.icon || ''}
								${this.cellContent.class || ''}`;
					break;
				default:
					this.pValue = this.cellContent.value || '';
					this.isString = true;
					break;
			}
		}
	}

	/**
	 * Lazy loads the CustomTable component before creation in case the content of the cell is a table.
	 * (classic import does not work if you're wondering, I tried)
	 */
	private beforeCreate(): void {
		if (this.$options.components)
			this.$options.components.CustomTable =
				require('./CustomTable.vue').default;
	}

	/**
	 * Setup at creation some parameters of the cell depending of the content to render
	 */
	private created(): void {
		this.resetCellData();
	}

	/**
	 * Lazy loads a component to render in the cell using the ComponentsUtils service and enable its rendering
	 */
	private loadComp(): void {
		const data: CustomTableCellData = this.cellData as CustomTableCellData;
		ComponentsUtils.loadComponentInComponent(
			this,
			data.content.component?.path || '',
			data.content.component?.name
				? data.content.component.name
				: data.content.value || ''
		).then((): void => {
			this.component = {
				name: data.content.component
					? data.content.component.name
					: data.content.value || '',
				data: data.content.component?.data || {},
			};
		});
	}
}
</script>
