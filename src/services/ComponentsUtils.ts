import Logger from './LoggerService';

export default class ComponentsUtils {
	public static readonly instance: ComponentsUtils = new ComponentsUtils();

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

	private constructor() {
		return;
	}
}
