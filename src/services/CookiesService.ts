export class Cookies {
	public static set(
		key: string,
		value: string,
		expires?: string,
		path?: string
	): void {
		const cookieVal: string = `${key}=${value}`;
		const expiresVal: string = expires ? `; expires=${expires}` : '';
		const pathVal: string = path ? `; path=${path}` : '';
		document.cookie = `${cookieVal}${expiresVal}${pathVal}`;
	}

	public static get<T = string>(
		key: string,
		parseJSON?: boolean
	): T | undefined {
		const allCookies: string = decodeURIComponent(document.cookie);
		const cookie: string | undefined = allCookies
			.split(';')
			.find((val: string): boolean => val.trim().startsWith(`${key}=`))
			?.trim();
		if (cookie === undefined) return undefined;
		return parseJSON
			? JSON.parse(cookie.replace(`${key}=`, ''))
			: cookie.replace(`${key}=`, '');
	}

	public static has(key: string, value?: string): boolean {
		if (value !== undefined)
			return document.cookie.includes(`${key}=${value}`);
		return document.cookie.includes(`${key}=`);
	}

	public static remove(key: string): void {
		Cookies.set(key, '', new Date(0).toUTCString());
	}

	// public static readonly instance: Cookies = new Cookies();
	private constructor() {
		return;
	}
}
