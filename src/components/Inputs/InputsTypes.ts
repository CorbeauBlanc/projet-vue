import { ValueTypes } from '@/components/Inputs/CustomInput/CustomInput';
import Js from '@/services/JsService';
import { GetListResponse, Mutation, RESTOperation, Switcher } from '@/types';

/**
 * The type of input, each one is equal to the name of its component
 */
export enum InputType {
	CHECKBOX = 'CheckboxInput',
	CHECKBOXGROUP = 'CheckboxGroup',
	COLOR = 'ColorInput',
	DATALIST = 'DatalistInput',
	DATE = 'DateInput',
	EMAIL = 'EmailInput',
	FILE = 'FileInput',
	NUMBER = 'NumberInput',
	RADIOS = 'RadiosInput',
	RANGE = 'RangeInput',
	SELECT = 'SelectInput',
	TEL = 'TelInput',
	TEXT = 'TextInput',
	TIME = 'TimeInput',
	WYSIWYG = 'WysiwygInput',
}

/**
 * Interface describing a generic shape for the value of an Input, used by most Inputs.
 * Possibility of adding additionnal classes, icons, flags, or disabling it.
 */
export class InputOption {
	public static toValue(
		option: unknown | InputOption | (unknown | InputOption)[]
	): string | string[] {
		let ret: string | string[];
		if (Array.isArray(option))
			ret = option.map((value: unknown | InputOption): string =>
				Js.isTypeOfInterface(value, 'text', 'value')
					? value.value
					: (value as any).toString()
			);
		else if (Js.isTypeOfInterface(option, 'text', 'value'))
			ret = option.value;
		else ret = (option as any).toString();
		return ret;
	}
	public text!: string;
	public value!: string;
	public class?: string;
	public icon?: string;
	public disabled?: boolean;
	public flag?: string;
	// public next?: InputOption[];
}

/**
 * Interface describing a group of options. Currently only used by Datalists
 */
export interface InputGroup {
	label: string;
	options: InputOption[] | InputOptionProvider;
	disabled?: boolean;
	class?: string;
	rest?: {
		options?: InputOptionRest;
	};
}

/**
 * Recursive Interface describing the value type used by the checkbox groups
 * Each group has its name as a key in the tree, and is either a boolean if all
 * its sub-groups have the same value, or an object describing the values of each
 * sub-groups if not.
 */
export type InputOptionTree =
	| boolean
	| string[]
	| { [key: string]: InputOptionTree };
/**
 * Alias for a function used to retrieve InputOptions asynchronously.
 * Used by Selects and Datalists with Triggers for infinite scrolling.
 * @param {'top' | 'bottom'} trigger which trigger is calling the provider
 */
export type InputOptionProvider = (trigger?: 'top' | 'bottom') => InputOption[];
export type InputGroupProvider = (trigger?: 'top' | 'bottom') => InputGroup[];
/**
 * Configuration object used to retrieve options from an API.
 */
export type InputOptionRest = {
	get: RESTOperation<GetListResponse>;
	page?: number;
	/**
	 * Additional filters to use
	 */
	filterBy?: (string | string[])[];
};

/**
 * Inputs configuration object containing the options shared by all the Inputs
 */
export interface GenericInputConfig {
	placeholder?: string;
	type?: InputType;
	autofocus?: boolean;
	/**
	 * Is the Input translating its content
	 * (be advised that it will translate everything but its values)
	 */
	translate?: boolean;
	readonly?: boolean;
	disabled?: boolean;
	/**
	 * Special attribute used for access by external tools, as the "id" attribute might
	 * change and be unpractical to use.
	 */
	externalId?: string;
	label?: string;
	/**
	 * Is the input accepting multiple values
	 */
	multiple?: boolean;
	tooltip?: {
		class?: string;
		content: string;
	};
	constraints?: {
		required?: boolean;
		accept?: string;
		min?: number | string;
		max?: number | string;
		step?: number | string;
		minlength?: number;
		maxlength?: number;
		pattern?: string;
	};
	/**
	 * Additional function used to check for the validity of the values of an Input
	 */
	validityCheck?: <T extends ValueTypes>(value?: T) => boolean;
	/**
	 * Is the input the main search component of the page (false by default)
	 */
	search?: boolean;
	name?: string;
	/**
	 * Add a message in a tooltip linked to an additional "help" icon
	 */
	help?: string;
}

export interface CheckboxInputConfig<I extends InputType = InputType.CHECKBOX>
	extends Omit<GenericInputConfig, 'multiple'> {
	type?: I;
	/**
	 * Which type should be used for the value of the checkbox
	 * - boolean: as the default checkbox
	 * - string: the name of the checkbox if true, empty string otherwise
	 * - array: an array of string containing the name of the checkbox if true.
	 * - object: an object where the name of the checkbox is the key and the value is a boolean or undefined
	 */
	checkFormat?: 'boolean' | 'string' | 'array' | 'object';
}

interface CheckboxGroupRootConfig
	extends CheckboxInputConfig<InputType.CHECKBOXGROUP> {
	type?: InputType.CHECKBOXGROUP;
	checkFormat?: 'object';
	/**
	 * Configurations for the sub-groups (or checkboxes) of a group.
	 * For compatibility reasons with InpuOptionTree the checkFormat can only be a boolean.
	 */
	subConfigs: (CheckboxGroupMiddleConfig | CheckboxGroupLastConfig)[];
	/**
	 * If enabled, when all the checkboxes of the group share the same value the group will transform
	 * its current value into a single boolean representing the value of the checkboxes.
	 */
	mergeGroupValues?: boolean;
}
type CBGpConfigArray = Mutation<
	CheckboxGroupRootConfig,
	{ checkFormat: 'array'; subConfigs: CheckboxGroupLastConfig[] }
>;
export type CheckboxGroupConfig = CheckboxGroupRootConfig | CBGpConfigArray;

export type CheckboxGroupLastConfig = Mutation<
	CheckboxGroupConfig,
	{ name: string; checkFormat?: never; mergeGroupValues?: never },
	'subConfigs'
>;
export type CheckboxGroupMiddleConfig = Mutation<
	CheckboxGroupConfig,
	{ name: string }
>;

export interface ColorInputConfig extends TextInputConfig<InputType.COLOR> {
	type?: InputType.COLOR;
}

export interface DatalistInputConfig<I extends InputType = InputType.DATALIST>
	extends SelectInputConfig<I> {
	type?: I;
	/**
	 * Does the Datalist accept custom user entries
	 * 'strict: false' allows custom entry with a specific button and event 'input:added'
	 */
	strict?: boolean;
}

export interface DateInputConfig extends Omit<GenericInputConfig, 'multiple'> {
	type?: InputType.DATE;
}

export interface EmailInputConfig extends TextInputConfig<InputType.EMAIL> {
	type?: InputType.EMAIL;
}

export interface FileInputConfig extends TextInputConfig<InputType.FILE> {
	type?: InputType.FILE;
}
export interface NumberInputConfig<I extends InputType = InputType.NUMBER>
	extends TextInputConfig<I> {
	type?: I;
	constraints?: {
		required?: boolean;
		accept?: string;
		pattern?: string;
		min?: number | string;
		max?: number | string;
		step?: number | string;
	};
}

export interface RadiosInputConfig
	extends Omit<GenericInputConfig, 'placeholder' | 'multiple'> {
	type?: InputType.RADIOS;
	options?: InputOption[] | InputOptionProvider;
}

export interface RangeInputConfig
	extends Omit<GenericInputConfig, 'placeholder' | 'multiple'> {
	type?: InputType.RANGE;
	constraints?: {
		required?: boolean;
		accept?: string;
		pattern?: string;
		min?: number | string;
		max?: number | string;
		step?: number | string;
	};
}

export interface SelectInputConfig<I extends InputType = InputType.SELECT>
	extends TextInputConfig<I> {
	type?: I;
	options?: InputOption[] | InputOptionProvider;
	groupedOptions?: InputGroup[] | InputGroupProvider;
	/**
	 * If defined will be used to retrieve options from an API
	 */
	rest?: {
		options?: InputOptionRest;
		groupedOptions?: InputOptionRest;
	};
}

export interface TelInputConfig extends TextInputConfig<InputType.TEL> {
	type?: InputType.TEL;
}

export interface TextInputConfig<I extends InputType = InputType.TEXT>
	extends GenericInputConfig {
	type?: I;
}

export interface TimeInputConfig extends TextInputConfig<InputType.TIME> {
	type?: InputType.TIME;
}

export interface WysiwygInputConfig
	extends Omit<GenericInputConfig, 'multiple'> {
	/**
	 * Configuration object for the ckeditor plugin
	 */
	wysiwyg?: CKEDITOR.config;
}

/**
 * Type used to switch easily between the different types of Input configurations
 * Useful when multiple configs types coexist (in an array for example), if the "type"
 * option is set in the object, the config type will automatically be detected, enabling
 * precise type checking and autocompletion.
 * (See `FilterConfig` for a practical and often used example)
 */
export type InputConfig<I extends InputType = InputType> = Switcher<
	{
		CheckboxInput: CheckboxInputConfig;
		CheckboxGroup: CheckboxGroupConfig;
		ColorInput: ColorInputConfig;
		DatalistInput: DatalistInputConfig;
		DateInput: DateInputConfig;
		EmailInput: EmailInputConfig;
		FileInput: FileInputConfig;
		NumberInput: NumberInputConfig;
		RadiosInput: RadiosInputConfig;
		RangeInput: RangeInputConfig;
		SelectInput: SelectInputConfig;
		TelInput: TelInputConfig;
		TextInput: TextInputConfig;
		TimeInput: TimeInputConfig;
		WysiwygInput: WysiwygInputConfig;
	},
	I
>;

export interface HslColor {
	h: number;
	s: number;
	l: number;
	a: number;
}

export interface RgbaColor {
	r: number;
	g: number;
	b: number;
	a: number;
}

export interface HsvColor {
	h: number;
	s: number;
	v: number;
	a: number;
}

export class Color {
	public static getColorType(
		color: string | HslColor | RgbaColor | HsvColor | Color
	): 'hsl' | 'hex' | 'hex8' | 'rgba' | 'hsv' | 'color' | 'undefined' {
		if (typeof color === 'string' && color.charAt(0) === '#')
			return color.length < 9 ? 'hex' : 'hex8';
		else if (
			(color as any).hasOwnProperty('h') &&
			(color as any).hasOwnProperty('s') &&
			(color as any).hasOwnProperty('l')
		)
			return 'hsl';
		else if (
			(color as any).hasOwnProperty('h') &&
			(color as any).hasOwnProperty('s') &&
			(color as any).hasOwnProperty('v')
		)
			return 'hsv';
		else if (
			(color as any).hasOwnProperty('r') &&
			(color as any).hasOwnProperty('g') &&
			(color as any).hasOwnProperty('b') &&
			(color as any).hasOwnProperty('a')
		)
			return 'rgba';
		else if (
			(color as any).hasOwnProperty('hsl') &&
			(color as any).hasOwnProperty('hex') &&
			(color as any).hasOwnProperty('hex8') &&
			(color as any).hasOwnProperty('rgba') &&
			(color as any).hasOwnProperty('hsv') &&
			(color as any).hasOwnProperty('source') &&
			(color as any).hasOwnProperty('a')
		)
			return 'color';
		return 'undefined';
	}

	public hsl?: HslColor;
	public hex?: string;
	public hex8?: string;
	public rgba?: RgbaColor;
	public hsv?: HsvColor;
	public source?: 'hsl' | 'hsla' | 'hex' | 'hex8' | 'rgba' | 'hsv' | 'hsva';
	public a?: number;
}
