import { Cookies } from '@/services/CookiesService';
import Logger from '@/services/LoggerService';
import Vue from 'vue';
import VueI18n, {
	Choice,
	LocaleMessages,
	Path,
	TranslateResult,
	Values,
} from 'vue-i18n';

export default class Languages {
	public get loadedLanguages(): string[] {
		return this.loaded;
	}

	public static get fallbackLocale(): string {
		return 'fr';
	}

	public static get currentLocale(): string {
		const cookieLocale: string | undefined = Cookies.get('locale');
		return cookieLocale || navigator.language;
	}
	public static readonly instance: Languages = new Languages();

	public static allLanguages: string[] = [
		'fr',
		'en',
		'de',
		'it',
		'pt',
		'es',
		'nl',
		'ru',
	];

	/**
	 * Checks the available language of a data object formatted with i18n.
	 * Returns currentLocale if the data property exists in that selected language.
	 * Otherwise, finds the first language available in the nested data and sets availableLanguageData to it.
	 */
	public static getDataAvailableLanguage(obj: any): string {
		if (obj.hasOwnProperty(Languages.currentLocale))
			return Languages.currentLocale;
		else
			for (const lang of Languages.allLanguages) {
				if (obj.hasOwnProperty(lang)) return lang;
			}
		return '';
	}

	public static getLangData(obj: any, prop: string): string {
		const availableLang: string = this.getDataAvailableLanguage(obj);
		if (
			availableLang === '' ||
			!obj[availableLang] ||
			!obj[availableLang].hasOwnProperty(prop)
		)
			return 'no data';
		return obj[availableLang][prop];
	}

	public static t(key: string, values?: Values): TranslateResult {
		return Languages.instance.i18n.t(key, values);
	}

	public static tc(key: Path, choice?: Choice, values?: Values): string {
		return Languages.instance.i18n.tc(key, choice, values);
	}

	public static te(key: VueI18n.Path, locale?: VueI18n.Locale): boolean {
		return Languages.instance.i18n.te(key, locale);
	}

	public static getCountry(locale: string): string | undefined {
		const dIndex: number = locale.indexOf('-');
		if (dIndex < 0) return Languages.fallbackCountries.get(locale);
		return locale.substring(dIndex + 1).toLowerCase();
	}

	private static fallbackCountries: Map<string, string> = new Map([
		['en', 'gb'],
		['fr', 'fr'],
	]);

	public readonly i18n: VueI18n;

	private loaded: string[] = [];

	private constructor() {
		Vue.use(VueI18n);
		const messages: LocaleMessages = {};
		this.i18n = new VueI18n({
			locale: Languages.fallbackLocale,
			fallbackLocale: Languages.fallbackLocale,
			formatFallbackMessages: true,
			silentTranslationWarn: true,
			messages,
		});
		this.loadLocale(Languages.fallbackLocale);
		this.setLocale(Languages.currentLocale, false);
	}

	public loadLocale(locale: string): Promise<LocaleMessages> {
		if (this.loaded.includes(locale))
			return Promise.resolve({
				default: this.i18n.getLocaleMessage(locale),
			});
		return new Promise<LocaleMessages>(
			(
				resolve: (value: LocaleMessages) => void,
				reject: (reason: any) => void
			): void => {
				import(
					/* webpackMode: "lazy-once", webpackPreload: true, webpackInclude: /\.json$/ */ `@/locales/${locale}.json`
				)
					.then((messages: LocaleMessages): void => {
						this.i18n.setLocaleMessage(locale, messages.default);
						this.loadedLanguages.push(locale);
						resolve(messages);
					})
					.catch((error: any): void => {
						Logger.error(
							`loadLocale: Can't load locale ${locale}:`,
							error
						);
						reject(error);
					});
			}
		);
	}

	public setLocale(locale: string, storeLocale: boolean = true): void {
		if (this.i18n.locale === locale && this.loaded.includes(locale)) return;
		if (!this.loaded.includes(locale)) {
			this.loadLocale(locale).then((): void => {
				document.querySelector('html')?.setAttribute('lang', locale);
				this.i18n.locale = locale;
			});
		} else this.i18n.locale = locale;
		if (storeLocale) Cookies.set('locale', locale);
	}
}
