import { Vision } from '@/optician';
import Logger from '@/services/LoggerService';
import _ from 'lodash';
import Vue from 'vue';
import { DirectiveBinding } from 'vue/types/options';
import { DirectiveOptions, VNode } from 'vue/types/umd';

/**
 * @param masterKeys
 * @returns The first argument of the directive or empty string if undefined
 */
function getMasterFirstKey(
	masterKeys: { [key: string]: string } | undefined
): string {
	if (!masterKeys)
		return Logger.dbgLogRet(
			'getMasterFirstKey: masterKeys is undefined',
			''
		);
	return Object.keys(masterKeys)[0];
}

/**
 * Transforms a path for a accessing value in an object into a parsed and sorted list
 * of all the different keys in the path. Will also replace variables stored in an object
 * by the computed value, but only if the key is placed between [] brackets.
 * @example
 * parseObjPath({ test: 'baz' }, 'foo.bar[test]')
 * // will return ['foo', 'bar', 'baz']
 * @param obj The object to search
 * @param str The path to parse
 * @returns The parsed path
 */
function parseObjPath(obj: any, str: string): (string | number)[] {
	if (str.includes('[')) {
		const fct: string = `${Object.keys(obj).reduce(
			(all: string, current: string): string =>
				`${all}${current}=that.${current};`,
			''
		)}return `;
		str = str.replaceAll(
			/\[[^\]]*\]+/g,
			(substr: string): string =>
				`.${new Function(
					'that',
					`${fct}(${substr.substring(1, substr.length - 1)})`
				)(obj)}`
		);
	}
	return str.split('.');
}

/**
 * Get a reference to the last key of a path in an object
 * @example
 * obj = { foo: { bar: { baz: 'test' } } };
 * getObjLastKeyRef(obj, ['foo', 'bar', 'baz']);
 * // will return { baz: 'test' }
 * @param obj The object to get the reference from
 * @param parsedPath A parsed path to the value (see parseObjPath)
 * @returns The reference to the value
 */
function getObjLastKeyRef(obj: any, parsedPath: (string | number)[]): any {
	let ref: any = obj;
	for (let i: number = 0; i < parsedPath.length - 1; i++)
		ref = ref[parsedPath[i]];
	return ref;
}

/**
 * Directive aiming at being a better v-model than the original (in the v.2 of Vue at least, and possibly the v.3)
 * Only works with Vision components (only the child needs to be one), and can be used exactly as a
 * standard v-model, except for these features:
 * - Allows multiple definitions of the directive, and links to multiple variables in the component.
 * You can differenciate them by using the ':' notation, for example: v-master:test-var-1 v-master:testVar2
 * - Linked to data and not props, so you won't be able to use v-bind on it but the linked variable can be
 * a computed one, can also be easily initialized, and be mutated by the component without sending the event
 * (though this can also be a disadvantage for structure and readability, should be used with precaution)
 * - Can be linked to another v-master or a v-model. If so it will propagate the event upward instead of
 * mutating the data, and will wait for the response of the v-master/model of the parent as usual.
 */
export const master: DirectiveOptions = {
	inserted(
		el: HTMLElement,
		binding: DirectiveBinding,
		vnode: VNode,
		oldVnode: VNode
	): void {
		if (!(vnode.componentInstance instanceof Vision))
			return Logger.dbgWarn(
				'master: inserted: vnode.componentInstance is not instance of Vision'
			);
		const instance: Vision | undefined = vnode.componentInstance;
		const expression: string | undefined = binding.expression;
		const arg: string = _.camelCase(
			binding.arg || getMasterFirstKey(instance?.$options?.master)
		);
		const event: string | undefined =
			arg !== '' && instance?.$options?.master
				? instance.$options.master[arg]
				: undefined;
		const parent: Vue | Vision | undefined = vnode.context;
		if (
			arg === undefined ||
			instance === undefined ||
			event === undefined ||
			parent === undefined ||
			expression === undefined
		)
			return Logger.dbgError(
				'master: inserted: either arg, instance, event, parent or expression equals undefined'
			);
		instance.$on(event, (value: any): void => {
			const parentModelEvent: string | undefined = parent.$options.model
				? parent.$options.model.event
				: undefined;

			if (parent instanceof Vision) {
				const parentMasterEvent: string | undefined = parent.$options
					.master
					? parent.$options.master[expression]
					: undefined;
				if (parentMasterEvent) {
					parent.$emit(parentMasterEvent, value);
					return Logger.dbgLog(
						'master: inserted: parentMasterEvent is a string'
					);
				}
			}
			if (parentModelEvent) {
				parent.$emit(parentModelEvent, value);
				return Logger.dbgLog(
					'master: inserted: parentModelEvent is a string'
				);
			}
			if ((parent as any)[expression] !== undefined)
				(parent as any)[expression] = value;
			else {
				const parsedPath: (string | number)[] = parseObjPath(
					parent,
					expression
				);
				parent.$set(
					getObjLastKeyRef(parent, parsedPath),
					parsedPath[parsedPath.length - 1],
					value
				);
			}
		});
		if (master.update) master.update(el, binding, vnode, oldVnode);
	},
	update(
		el: HTMLElement,
		binding: DirectiveBinding,
		vnode: VNode,
		oldVnode: VNode
	): void {
		const instance: Vision | undefined = vnode.componentInstance as Vision;
		const arg: string = _.camelCase(
			binding.arg || getMasterFirstKey(instance?.$options?.master)
		);
		if (
			arg === '' ||
			(arg === _.camelCase(binding.oldArg) &&
				binding.value === binding.oldValue) ||
			!instance?.$options?.master ||
			!instance?.$options?.master[arg]
		)
			return Logger.dbgWarn(
				"master: update: arg equals '', or arg equals _.camelCase(binding.oldArg) and binding.value equals binding.oldValue, or instance.$options.master[arg] is undefined"
			);
		(instance as any)[arg] = binding.value;
	},
	unbind(
		el: HTMLElement,
		binding: DirectiveBinding,
		vnode: VNode,
		oldVnode: VNode
	): void {
		const instance: Vision | undefined = vnode.componentInstance as Vision;
		const arg: string | undefined = binding.arg;
		const event: string | undefined =
			arg && instance?.$options?.master
				? instance.$options.master[arg]
				: undefined;
		if (instance && event) instance.$off(event);
	},
};

/**
 * Self explanatory
 */
export function loadAllDirectives(): void {
	Vue.directive('master', master);
}
