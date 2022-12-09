import {
	Color,
	GenericInputConfig,
	HslColor,
	HsvColor,
	InputOption,
	InputOptionTree,
	RadiosInputConfig,
	RgbaColor,
	SelectInputConfig,
} from '@/components/Inputs/InputsTypes';
import { Master } from '@/decorators';
import { Vision } from '@/optician';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { Dictionary } from 'lodash';
import { Model, Prop, Ref, Watch } from 'vue-property-decorator';

/**
 * Types retrieved from the input component or HTMLElement used in the CustomInput.
 */
export type NativeValueTypes =
	| string
	| boolean
	| InputOption
	| HslColor
	| RgbaColor
	| HsvColor
	| Color;

/**
 * Types used by the CustomInput and its parent.
 * Those types are more complex and cannot be used by the input component or HTMLElement
 */
export type ValueTypes =
	| NativeValueTypes
	| (string | InputOption)[]
	| number
	| (number | string)[]
	| Dictionary<boolean>
	| File[]
	| InputOptionTree;

/**
 * Abstract class used as a foundation for all the generic fields used in the views.
 * This permits the standardization of the interactions with all of these fields.
 * The generic type T is used to lock the type of values the CustomInput will use, and
 * those types must be registered in ValueTypes.
 * To create a new field from CustomInput, extend the class and specify T.
 * You will have to redefine some of the components of the class, namely:
 * - {@link CustomInput.masterValue}, simply set a default value of type T
 * - the {@link CustomInput.mounted} hook, which *must* contain a call to {@link CustomInput.mandatoryComponentInit}.
 *   `mounted` cannot be pre-defined in CustomInput as Vue is a dumb b*tch and hooks don't work with
 *   abstract classes (and yes abstract classes are cool so no CustomInput souldn't be a regular class)
 *
 * Example:
 * ```typescript
 * export default class StringInput extends CustomInput<string> {
 * 		protected masterValue: string = '';
 *
 * 		// Your code
 *
 * 		protected mounted(): void {
 * 			this.mandatoryComponentInit();
 * 		}
 * 	}
 * ```
 * The input component or HTMLElement used by the CustomInput must also has a reference named `input` to be properly
 * initialized
 * @export
 */
export default abstract class CustomInput<
	T extends ValueTypes,
	C extends GenericInputConfig
	// tslint:disable-next-line: prettier
	> extends Vision {
	/**
	 * The v-master directive. Deeply linked with v-model, by default will trigger exactly the same events
	 * and call the same function ({@link CustomInput.onModelValueChange}),
	 * the value is stored elsewhere though ({@link CustomInput.masterValue});
	 */
	@Master(CustomInput.mutationEvent)
	public get default(): T {
		return this.masterValue;
	}
	public set default(val: T) {
		this.masterValue = val;
		this.validity = '';
		this.onModelValueChange(val);
	}

	/**
	 * Returns the accessible value depending on whether we are using v-model or v-master
	 */
	protected get value(): T {
		return this.modelValue !== undefined
			? this.modelValue
			: this.masterValue;
	}

	public get inputId(): string {
		return this.uid;
	}

	/**
	 * The default event used by v-master and v-model to trigger changes
	 */
	public static readonly mutationEvent: string = 'change';
	/**
	 * The config object used to specify all the options of a CustomInput
	 */
	@Prop({
		default: (): any => {
			return {};
		},
	})
	public readonly config!: C | Promise<C>;
	/**
	 * Is the CustomInput 'lazy', meaning does it require an additional user interaction
	 * to validate the changes made to its value.
	 */
	@Prop() public readonly lazy!: boolean;

	/**
	 * The v-model directive. Upon changes will call {@link CustomInput.onModelValueChange},
	 * redefine as you wish.
	 */
	@Model(CustomInput.mutationEvent) public readonly modelValue!: T;

	public validationMessage: string = '';
	public validity: 'error' | 'valid' | '' = '';

	private configNeedsReload: boolean = false;
	private loadedConfig: C | false = false;
	private pFocused: boolean = false;

	@Ref() protected input!:
		| HTMLInputElement
		| HTMLInputElement[]
		| CustomInput<ValueTypes, C>
		| CustomInput<ValueTypes, C>[];

	/**
	 * The variable used to store the value of the v-master directive. It is of type T and *needs*
	 * a default value, otherwise Vue will not be able track the changes.
	 */
	protected abstract masterValue: T;

	protected get cfg(): C | false {
		if (this.configNeedsReload) {
			this.configNeedsReload = false;
			this.initConfig();
		}
		return this.loadedConfig;
	}

	/**
	 * The prefix of the generated unique id of the component
	 */
	protected readonly uidPrefix: string = 'input-';
	/**
	 * Used to specify beforehand if by default the CustomInput will store and send a collection of values
	 * instead of a single value with each user interaction.
	 */
	protected readonly multipleIsDefault: boolean = false;
	/**
	 * Is the component focused
	 */
	protected get focused(): boolean {
		return this.pFocused;
	}
	protected set focused(val: boolean) {
		if (!this.disabled) this.pFocused = val;
	}
	protected get disabled(): boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'CustomInput: get disabled: this.cfg is false',
				this
			);

		return this.cfg.disabled || false;
	}
	protected get readonly(): boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'CustomInput: get readonly: this.cfg is false',
				this
			);

		return this.cfg.readonly || false;
	}
	/**
	 * The current value of the input component or HTMLElement used by the CustomInput
	 */
	protected inputValue: NativeValueTypes | undefined = '';
	/**
	 * A generated unique id for the component
	 */
	protected uid: string = `${this.uidPrefix}${Js.uid}`;

	public get currentConfig(): Promise<C> {
		if (!this.config)
			return Promise.reject('The config object is undefined');
		if (this.config instanceof Promise)
			return this.config.then(
				(value: C): Promise<C> => Promise.resolve(value)
			);
		return Promise.resolve(this.loadedConfig as C);
	}

	/*
	public get configExplorer(): Promise<ObjectExplorer<C>> {
		if (!this.config)
			return Promise.reject('The config object is undefined');
		if (this.config instanceof Promise)
			return this.config.then(
				(value: C): Promise<ObjectExplorer<C>> =>
					Promise.resolve(new ObjectExplorer(value))
			);
		return Promise.resolve(new ObjectExplorer(this.config));
	}
	*/

	public checkConstraints(value?: T): boolean {
		if (!this.cfg || this.disabled)
			return Logger.dbgLogRet(
				true,
				'CustomInput: checkConstraints: this.cfg is false or this.disabled is true',
				this
			);

		const inputs: (HTMLInputElement | CustomInput<ValueTypes, C>)[] =
			Array.isArray(this.input) ? this.input : [this.input];
		const valueToCheck: T = value !== undefined ? value : this.value;

		let valid: boolean = false;
		inputs.forEach(
			(input: HTMLInputElement | CustomInput<ValueTypes, C>): void => {
				if (!this.cfg)
					return Logger.dbgLog(
						'CustomInput: checkConstraints: this.cfg is false'
					);
				let validInput: boolean;

				if (input instanceof CustomInput)
					validInput = input.checkConstraints(value);
				else {
					if (value !== undefined) {
						const currentVal: string = input.value;
						input.value = value.toString();
						validInput = input.checkValidity();
						this.validationMessage = input.validationMessage;
						input.value = currentVal;
					} else {
						validInput = input.checkValidity();
						this.validationMessage = input.validationMessage;
					}
				}
				valid =
					(validInput &&
						(this.cfg.validityCheck
							? this.cfg.validityCheck(valueToCheck)
							: true)) ||
					valid;
			}
		);
		if (!this.cfg.constraints?.required && this.emptyValue(valueToCheck))
			this.validity = '';
		else this.validity = valid ? 'valid' : 'error';
		return valid;
	}

	/**
	 * A public accessor for {@link CustomInput.inputValue}
	 * @returns {NativeValueTypes | undefined}
	 */
	public getCurrentInputValue(): NativeValueTypes | undefined {
		return this.inputValue;
	}

	/**
	 * Check if a given value is considered "empty", i.e. unusable and unsendable.
	 * @public
	 */
	public abstract emptyValue(val: T | undefined): boolean;

	@Watch('focused') protected onFocusedChange(): void {
		this.validity = '';
	}

	protected changeEvent(payload?: T): void {
		if (this.disabled)
			return Logger.dbgLog(
				'used: changeEvent: this.disabled is true',
				this
			);

		if (!this.emptyValue(payload)) this.preventWatchFeedback = true;
		this.$emit(CustomInput.mutationEvent, payload);
	}

	/**
	 * Removes the selected value from the array
	 * @public
	 */
	protected removeFromSelection(index: number): void {
		if (this.disabled || !Array.isArray(this.value) || !this.value.length)
			return;
		this.value.splice(index, 1);
		this.changeEvent(this.value.length ? this.value : undefined);
	}

	/**
	 * Called upon changes of model or master value
	 */
	protected abstract onModelValueChange(val: T): void;

	protected getOptionFromVal(val: string): string | InputOption {
		const config: SelectInputConfig | RadiosInputConfig = this.cfg as
			| SelectInputConfig
			| RadiosInputConfig;
		if (config.options) {
			const opt: InputOption | undefined = (
				Array.isArray(config.options)
					? config.options
					: config.options()
			).find((option: InputOption): boolean => {
				return (
					option.value.toString().toLowerCase() === val.toLowerCase()
				);
			});
			if (opt) return opt;
		}
		return val;
	}

	protected getValueText(val: NativeValueTypes): string {
		if (Js.isTypeOfInterface<InputOption>(val, 'text', 'value'))
			return val.text;
		const option: string | InputOption = this.getOptionFromVal(
			val.toString()
		);
		return typeof option === 'string' ? option : option.text;
	}

	/**
	 * Standardized function used to specify if the CustomInput currently uses multiple values
	 */
	protected multipleIsEnabled(): boolean {
		if (!this.cfg)
			return Logger.dbgWarnRet(
				false,
				'CustomInput: multipleIsEnabled: this.cfg is false',
				this
			);

		return this.cfg.multiple === undefined
			? this.multipleIsDefault
			: this.cfg.multiple;
	}

	protected additionalConfigInit(): void {
		return;
	}

	protected initConfig(): void {
		if (!this.loadedConfig)
			return Logger.dbgError(
				'CustomInput: initConfig: this.loadedConfig is false',
				this
			);

		if (
			this.loadedConfig.autofocus &&
			(this.$refs['input'] as any).focus !== undefined &&
			typeof (this.$refs['input'] as any).focus === 'function'
		)
			(this.$refs['input'] as any).focus();

		if (this.loadedConfig.disabled) this.inputValue = undefined;
		this.additionalConfigInit();
	}

	/**
	 * Function initializing the CustomInput, must be called at least once, preferably in the `mounted` hook.
	 */
	protected mandatoryComponentInit(): void {
		if (this.config instanceof Promise) {
			this.config.then((value: C): void => {
				this.loadedConfig = value;
				this.initConfig();
			});
		} else {
			this.loadedConfig = this.config;
			this.initConfig();
		}
		this.$watch('modelValue', this.onModelValueChange, { immediate: true });
		this.$watch(
			'modelValue',
			(): void => {
				this.validity = '';
			},
			{ immediate: true }
		);
	}

	/**
	 * Does the CustomInput have anything in the `hint` slot
	 */
	protected hasHint(): boolean {
		return this.$slots['hint'] !== undefined;
	}

	/**
	 * `mounted` hook that *must* be redefined by the CustomInput to initialize properly the component
	 */
	protected abstract mounted(): void;
}
