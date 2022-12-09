import Vue from 'vue';
import VueClassComponent from 'vue-class-component';
import { VueClass } from 'vue-class-component/lib/declarations';
import {
	DefaultComputed,
	DefaultData,
	DefaultMethods,
	DefaultProps,
	PropsDefinition,
} from 'vue/types/options';
import { ComponentOptions, FunctionalComponentOptions } from 'vue/types/umd';

// prettier-ignore
export interface ComponentAdvancedOptions<
	V extends Vue,
	Data = DefaultData<V>,
	Methods = DefaultMethods<V>,
	Computed = DefaultComputed,
	PropsDef = PropsDefinition<DefaultProps>,
	Props = DefaultProps
	> extends ComponentOptions<V, Data, Methods, Computed, PropsDef, Props> {
	master?: { [key: string]: string };
}

// prettier-ignore
export interface FunctionalComponentAdvancedOptions<
	Props = DefaultProps,
	PropDefs = PropsDefinition<Props>
	> extends FunctionalComponentOptions<Props, PropDefs> {
	master?: { [key: string]: string };
}

export class Vision extends Vue {
	public readonly $options!: ComponentAdvancedOptions<Vue>;

	protected preventWatchFeedback?: boolean;
	protected forceUpdate?: boolean = false;
}

// tslint:disable-next-line: variable-name
// export const vision: VueConstructor<Vision> = Vue;

/**
 * Class aiming at improving the default Vue by adding functionalities often used, such as:
 * - The possibility to use the v-master directive
 * - A variable used to prevent a feedback loop when Watching and mutating a v-model
 * - A variable used to trigger a refresh of a computed property
 * - Maybe more in the future
 */
// tslint:disable-next-line: variable-name
export const Component: <V extends Vision>(
	options: ComponentAdvancedOptions<V> & ThisType<V>
) => <VC extends VueClass<V>>(target: VC) => VC = VueClassComponent;
