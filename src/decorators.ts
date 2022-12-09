import _ from 'lodash';
import { createDecorator, VueDecorator } from 'vue-class-component';
import { DefaultData } from 'vue/types/options';
import { ComponentOptions } from 'vue/types/umd';
import { ComponentAdvancedOptions, Vision } from './optician';

/**
 * Attribute decorator. Will transform an attribute, by default the name of the variable used to setup the decorator,
 * into a computed property returning true if the attribute is defined in the $attrs variable of the component.
 * @param attrKey A custom key to use instead of the variable name
 */
export function Attr(attrKey?: string): VueDecorator {
	return createDecorator(
		(
			options: ComponentOptions<Vue, DefaultData<Vue>>,
			key: string
		): void => {
			if (options.computed === undefined) options.computed = {};
			if (attrKey !== undefined) key = attrKey;
			options.computed[key] = {
				get(this: Vue): boolean {
					return (
						this.$attrs[key] !== undefined ||
						this.$attrs[_.kebabCase(key)] !== undefined ||
						this.$attrs[_.camelCase(key)] !== undefined
					);
				},
			};
		}
	);
}

/**
 * Decorator for the v-master directive. Only works in Vision components
 * @param event The event used to trigger the changes
 */
export function Master(event: string): VueDecorator {
	return createDecorator(
		(
			options: ComponentAdvancedOptions<Vision, DefaultData<Vision>>,
			key: string
		): void => {
			if (options.master === undefined) options.master = {};
			options.master[key] = event;
		}
	);
}
