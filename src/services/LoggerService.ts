import { Cookies } from '@/services/CookiesService';
import { Dictionary } from 'lodash';
import Environment from './EnvironmentService';

/**
 * Service used provide a unified method for logging in the console accross the whole project.
 * More detailed logs can be displayed with the "dbg" functions, and by setting a cookie named "VERBOSE_MODE"
 * @export
 */
export default class Logger {
	public static readonly instance: Logger = new Logger();

	private static readonly sharedDbgCss: ConsoleCSS = {
		display: 'inline-block',
		padding: '2px',
		color: 'whitesmoke',
		border: '1px solid',
	};

	private static readonly dbgErrorCss: string = cssToString({
		...Logger.sharedDbgCss,
		background: 'maroon',
		'border-color': 'firebrick',
	});
	private static readonly dbgLogCss: string = cssToString({
		...Logger.sharedDbgCss,
		background: 'midnightblue',
		'border-color': 'darkslateblue',
	});
	private static readonly dbgWarnCss: string = cssToString({
		...Logger.sharedDbgCss,
		background: 'sienna',
		'border-color': 'goldenrod',
	});

	public static get verboseMode(): boolean | 'log' | 'warn' | 'error' {
		let cookie: string | undefined = Cookies.get('VERBOSE_MODE');
		if (Environment.current === 'production' || cookie === undefined)
			return false;
		if (
			cookie !== '' &&
			!['all', 'log', 'warn', 'error'].includes(cookie)
		) {
			console.error(
				'Logger: get verboseEnabled: VERBOSE_MODE set to an unknown value, displaying all.'
			);
			cookie = 'all';
		}
		if (cookie === 'all' || cookie === '') return true;

		return cookie as 'log' | 'warn' | 'error';
	}

	public static error(msg: string, ...error: any[]): void {
		console.error(msg, ...error);
	}

	public static log(msg: string, ...info: any[]): void {
		console.log(msg, ...info);
	}

	public static warn(msg: string, ...info: any[]): void {
		console.warn(msg, ...info);
	}

	public static dbgError(msg: string, ...error: any[]): void {
		if (Logger.verboseMode === true || Logger.verboseMode === 'error')
			console.debug(`%c ${msg} `, this.dbgErrorCss, ...error);
	}

	public static dbgLog(msg: string, ...info: any[]): void {
		if (Logger.verboseMode === true || Logger.verboseMode === 'log')
			console.debug(`%c ${msg} `, this.dbgLogCss, ...info);
	}

	public static dbgWarn(msg: string, ...info: any[]): void {
		if (Logger.verboseMode === true || Logger.verboseMode === 'warn')
			console.debug(`%c ${msg} `, this.dbgWarnCss, ...info);
	}

	public static dbgErrorRet<T = unknown>(
		ret: T,
		msg: string,
		...error: any[]
	): T {
		this.dbgError(msg, ...error);
		return ret;
	}

	public static dbgLogRet<T = unknown>(
		ret: T,
		msg: string,
		...info: any[]
	): T {
		this.dbgLog(msg, ...info);
		return ret;
	}

	public static dbgWarnRet<T = unknown>(
		ret: T,
		msg: string,
		...info: any[]
	): T {
		this.dbgWarn(msg, ...info);
		return ret;
	}

	private constructor() {
		return;
	}
}

function cssToString(cssObject: ConsoleCSS): string {
	let result: string = '';

	for (const key in cssObject) {
		if (
			Object.prototype.hasOwnProperty.call(cssObject, key) &&
			(cssObject as Dictionary<string>)[key]
		)
			result += `${key}: ${(cssObject as Dictionary<string>)[key]}; `;
	}
	return result;
}

interface ConsoleCSS {
	background?: string;
	'background-attachment'?: string;
	'background-clip'?: string;
	'background-color'?: string;
	'background-image'?: string;
	'background-origin'?: string;
	'background-position'?: string;
	'background-repeat'?: string;
	'background-size'?: string;
	border?: string;
	'border-width'?: string;
	'border-top-width'?: string;
	'border-right-width'?: string;
	'border-bottom-width'?: string;
	'border-left-width'?: string;
	'border-style'?: string;
	'border-top-style'?: string;
	'border-right-style'?: string;
	'border-bottom-style'?: string;
	'border-left-style'?: string;
	'border-color'?: string;
	'border-top-color'?: string;
	'border-right-color'?: string;
	'border-bottom-color'?: string;
	'border-left-color'?: string;
	'border-radius'?: string;
	'box-decoration -break'?: string;
	'box-shadow'?: string;
	clear?: string;
	float?: string;
	color?: string;
	cursor?: string;
	display?: string;
	font?: string;
	'font-family'?: string;
	'font-size'?: string;
	'font-stretch'?: string;
	'font-style'?: string;
	'font-variant'?: string;
	'font-weight'?: string;
	'line-height'?: string;
	margin?: string;
	outline?: string;
	padding?: string;
	'text-align'?: string;
	'text-align-last'?: string;
	'text-combine-upright'?: string;
	'text-decoration'?: string;
	'text-decoration-color'?: string;
	'text-decoration-line'?: string;
	'text-decoration-skip-ink'?: string;
	'text-decoration-style'?: string;
	'text-emphasis'?: string;
	'text-emphasis-color'?: string;
	'text-emphasis-position'?: string;
	'text-emphasis-style'?: string;
	'text-indent'?: string;
	'text-justify'?: string;
	'text-orientation'?: string;
	'text-overflow'?: string;
	'text-rendering'?: string;
	'text-shadow'?: string;
	'text-transform'?: string;
	'white-space'?: string;
	'word-spacing'?: string;
	'word-break'?: string;
	'writing-mode'?: string;
}
