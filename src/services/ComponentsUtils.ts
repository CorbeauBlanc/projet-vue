import { VueListener } from '@/types';
import sanitizeHtml from 'sanitize-html';
import { MetaInfo } from 'vue-meta';
import { Vue } from 'vue-property-decorator';
import Logger from './LoggerService';

export default class ComponentsUtils {
	public static readonly instance: ComponentsUtils = new ComponentsUtils();

	public static readonly defaultSanitizerOptions: sanitizeHtml.IOptions = {
		allowedTags: [
			'h3',
			'h4',
			'h5',
			'h6',
			'blockquote',
			'p',
			'a',
			'ul',
			'ol',
			'nl',
			'li',
			'b',
			'i',
			'strong',
			'em',
			'strike',
			'code',
			'hr',
			'br',
			'div',
			'table',
			'thead',
			'caption',
			'tbody',
			'tr',
			'th',
			'td',
			'pre',
			'img',
			'figure',
			'figcaption',
			'span',
			'iframe',
			'oembed',
		],
		allowedAttributes: {
			a: ['href', 'name', 'target'],
			img: ['src'],
			'*': ['style', 'class'],
			div: ['data-oembed-url'],
			iframe: ['src', 'frameborder', 'allow', 'allowfullscreen'],
			oembed: ['url'],
		},
	};

	public static readonly defaultSttWordDelay: number = 2;

	public static findAllChildren(
		childrenClass: typeof Vue,
		component: Vue
	): Vue[] {
		return component.$children.filter((child: Vue): boolean => {
			return child instanceof childrenClass;
		});
	}

	/**
	 * Import a component from a path. Due to the way webpack works, the '@/' or 'src/' part of the path
	 * is already in included and cannot be modified.
	 *
	 * @static
	 * @param {(string | undefined)} path
	 * @returns {(Promise<typeof import('*.vue')> | undefined)}
	 */
	public static importComponent(
		path: string
	): Promise<typeof import('*.vue')> {
		if (path === '' || !path.endsWith('.vue')) {
			Logger.error('ComponentsUtils: importComponent: path is invalid');
			return Promise.reject('path is invalid');
		} else {
			switch (path.charAt(0)) {
				case '@':
					path = path.slice(2);
					break;
				case '/':
					path = path.slice(1);
					break;
			}
			return import(
				/* webpackMode: "lazy-once", webpackPreload: true, webpackInclude: /\.vue$/ */ `@/${path}`
			).catch((error: any): void => {
				Logger.error('ComponentsUtils: importComponent: ', error);
			});
		}
	}

	/**
	 * Lazy import a component and inject it in an other component as a dependency
	 * @static
	 * @param target The source component to inject the new component in
	 * @param componentPath The path of the new component
	 * @param componentName The name of the new component
	 */
	public static loadComponentInComponent(
		target: Vue,
		componentPath: string,
		componentName: string
	): Promise<void | typeof import('*.vue')> {
		const promise: Promise<typeof import('*.vue')> =
			this.importComponent(componentPath);

		return promise.then((result: typeof import('*.vue')): void => {
			if (target.$options.components) {
				target.$options.components[componentName] = result.default;
			}
		});
	}

	public static getListener(
		events: string[],
		callback: (name: string, payload: any) => any
	): VueListener {
		const ret: VueListener = {};
		events.forEach((key: string): void => {
			ret[key] = (payload: any): void => {
				callback(key, payload);
			};
		});
		return ret;
	}

	public static setTitle(component: Vue, title: string): void {
		if (!component.$options.metaInfo) return;
		(component.$options.metaInfo as MetaInfo).title = title;
		component.$meta().refresh();
	}

	private constructor() {
		return;
	}
}
