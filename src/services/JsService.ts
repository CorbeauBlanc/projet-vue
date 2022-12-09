export default class Js {
	/**
	 * Returns a unique ID
	 * @public
	 */
	public static get uid(): string {
		return Math.random().toString(36).substring(3);
	}
	public static readonly defaultHighlightStyle: string = 'background: yellow';
	public static readonly defaultDebounceDelay: number = 500;

	public static readonly instance: Js = new Js();

	/**
	 * Deep clone an object (follows references of objects and arrays)
	 * @param dest Destination
	 * @param src Source
	 */
	public static clone(
		dest: { [key: string]: any },
		src: { [key: string]: any },
		level?: number
	): object {
		for (const key in src) {
			if (src.hasOwnProperty(key)) {
				const el: any = src[key];
				let copy: any;
				if ((level === undefined || level > 0) && Array.isArray(el))
					copy = Array.from(el);
				else if (
					(level === undefined || level > 0) &&
					typeof el === 'object'
				)
					copy = this.clone(
						{},
						el,
						level !== undefined ? level - 1 : undefined
					);
				else copy = el;
				dest[key] = copy;
			}
		}
		return dest;
	}

	/* Unused and no recursive behaviour implemented, so not really useful anyway
	public static strictlyEquals(obj1: object, obj2: object): boolean {
		if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
		for (const key in obj1) {
			if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
				if ((obj1 as any)[key] !== (obj2 as any)[key]) return false;
			} else return false;
		}
		return true;
	}
	*/

	/**
	 * Check if any common property of 2 objects have a same value.
	 * If the property is not present in any of the 2 object it's ignored.
	 * @param obj1
	 * @param obj2
	 * @param deep Recursive comparison
	 */
	public static approximatelyEquals<T extends object = object>(
		obj1: T,
		obj2: T,
		deep?: boolean
	): boolean {
		let sharedPropertyFound: boolean = false;
		for (const key in obj1) {
			if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
				sharedPropertyFound = true;
				if (
					deep &&
					typeof (obj1 as any)[key] === 'object' &&
					typeof (obj2 as any)[key] === 'object'
				) {
					if (
						!this.approximatelyEquals(
							(obj1 as any)[key],
							(obj2 as any)[key],
							true
						)
					)
						return false;
				} else if ((obj1 as any)[key] !== (obj2 as any)[key])
					return false;
			}
		}
		return sharedPropertyFound;
	}

	/**
	 * Check if any common property of 2 objects have a same value.
	 * If the property is not present in any of the 2 object the return is false.
	 * @param obj1
	 * @param obj2
	 */
	public static strictlyEquals<T extends object = object>(
		obj1: T,
		obj2: T
	): boolean {
		if (Array.isArray(obj1) && Array.isArray(obj2)) {
			if (obj1.length !== obj2.length) return false;
			for (let i: number = 0; i < obj1.length; i++)
				if (!this.strictlyEquals(obj1[i], obj2[i])) return false;
			return true;
		} else if (typeof obj1 === 'object' && typeof obj2 === 'object') {
			if (Object.keys(obj1).length !== Object.keys(obj2).length)
				return false;
			for (const key in obj1) {
				if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
					if (
						!this.strictlyEquals(
							(obj1 as any)[key],
							(obj2 as any)[key]
						)
					)
						return false;
				} else return false;
			}
			return true;
		} else return obj1 === obj2;
	}

	/**
	 * Find recursively any text in a HTMLElement and replace it by a given value
	 * without breaking events or html content.
	 * Note: currently not used, but might be in the future so I'm keeping it.
	 * @param searchValue The text to search in the element
	 * @param newValue The value to replace the text with
	 * @param el The element where the search is being done
	 */
	public static replaceTextInHTML(
		searchValue: string,
		newValue: string,
		el: Element
	): void {
		el.childNodes.forEach((node: ChildNode): void => {
			if (node.nodeType === Node.TEXT_NODE) {
				const txt: Text = node as Text;
				if (txt.textContent)
					txt.textContent = txt.textContent.replace(
						new RegExp(searchValue, 'g'),
						newValue
					);
			} else if (node.nodeType === Node.ELEMENT_NODE)
				this.replaceTextInHTML(searchValue, newValue, node as Element);
		});
	}

	/**
	 * Highlight recursively any text in a HTMLElement, without breaking events or html content,
	 * by replacing it with a span with a given style.
	 * Every node having the class `highlight-ignore` will be entierly ignored.
	 * @param searchValue The text to search in the element
	 * @param style The value to replace the text with
	 * @param el The element where the search is being done
	 */
	public static highlightTextInHTML(
		searchValue: string,
		style: string,
		el: Element
	): boolean {
		if (!el.innerHTML.toLowerCase().includes(searchValue.toLowerCase()))
			return false;
		const searchNode: Element = document.createElement('span');
		const searchRegExp: RegExp = new RegExp(searchValue, 'ig');
		let found: boolean = false;
		searchNode.setAttribute('style', style);
		el.childNodes.forEach((node: ChildNode): void => {
			if (
				node.nodeType === Node.TEXT_NODE &&
				node.textContent &&
				node.textContent
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			) {
				found = true;
				const newNode: Element = document.createElement('span');
				const vals: string[] = node.textContent.split(searchRegExp);
				const foundInNode: RegExpMatchArray =
					node.textContent.match(searchRegExp) || [];
				newNode.className = 'highlight-ignore-container';

				vals.forEach((str: string, i: number): void => {
					newNode.insertAdjacentText('beforeend', str);
					searchNode.textContent = foundInNode[i];
					newNode.insertAdjacentElement(
						'beforeend',
						searchNode.cloneNode(true) as Element
					);
				});
				node.replaceWith(newNode);
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const classes: string = (node as Element).className;
				if (
					!classes ||
					(classes && !classes.includes('highlight-ignore'))
				)
					found =
						this.highlightTextInHTML(
							searchValue,
							style,
							node as Element
						) || found;
			}
		});
		return found;
	}

	/**
	 * Clear any change made by the highlightTextInHTML() function
	 * @param el The element to clear
	 */
	public static clearHighlightedTextInHTML(el: Element): void {
		el.childNodes.forEach((node: ChildNode): void => {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const classes: string = (node as Element).className;
				if (
					classes &&
					classes === 'highlight-ignore-container' &&
					node.textContent
				)
					node.replaceWith(document.createTextNode(node.textContent));
				else this.clearHighlightedTextInHTML(node as Element);
			}
		});
	}

	/**
	 * Formats time in seconds to MM:SS by default or HH:MM:SS if param includeHours is set to true.
	 */
	public static formatTime(sec: number, includeHours?: boolean): string {
		const hour: number = Math.trunc(sec / 3600);
		const min: number = Math.trunc(sec / 60);
		sec = Math.trunc(sec - 60 * min);
		const hours: string = includeHours
			? `${hour < 10 ? '0' : ''}${hour}:`
			: '';
		return `${hours}${min < 10 ? '0' : ''}${min}:${
			sec < 10 ? '0' : ''
		}${sec}`;
	}

	/**
	 * Converts time in format MM:SS or HH:MM:SS, from string to seconds
	 */
	public static convertTime(time: string): number | false {
		let totalSec: number;
		if (time.match(/([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/g)) {
			const [hours, minutes, seconds] = time.split(':');
			totalSec = +hours * 60 * 60 + +minutes * 60 + +seconds;
		} else if (time.match(/([01][0-9]|2[0-3]):[0-5][0-9]/g)) {
			const [minutes, seconds] = time.split(':');
			totalSec = +minutes * 60 + +seconds;
		} else return false;

		return totalSec;
	}

	public static countWords(str: string): number {
		const words: IterableIterator<RegExpMatchArray> = str
			.trim()
			.matchAll(/ |\n|\r|\t|\v/g);
		let count: number = 0;
		for (const word of words) count++;
		return count;

		/*
			I know I could have done this in a more compact way, for example:
				return [...str.trim().matchAll(/ |\n|\r|\t|\v/g)].length;
			but that would have created a new Array every time which is definitely
			not very optimised, or elegant.
		 */
	}

	/**
	 * The fulltext retrieved for speech to text has been cleaned in ResultsVideosDetail...
	 */
	public static wordsIndexes(str: string): number[] {
		const words: IterableIterator<RegExpMatchArray> = str
			.trim()
			.matchAll(/ /g);
		const ret: number[] = [0];
		for (const word of words) ret.push(word.index ? word.index + 1 : 0);
		return ret;
	}

	public static nbWordsBefore(index: number, str: string): number {
		return this.countWords(str.substring(0, index));
	}

	public static removeElementStyles(
		element: Element | null | undefined,
		...props: string[]
	): void {
		if (!element || !(element as HTMLElement).style) return;
		props.forEach((prop: string): void => {
			(element as HTMLElement).style.removeProperty(prop);
		});
	}

	public static getVerticallyScrollableParent(
		parent: HTMLElement | null
	): HTMLElement | null {
		return !parent || parent.scrollHeight > parent.clientHeight
			? parent
			: this.getVerticallyScrollableParent(parent.parentElement);
	}

	public static getHorizontallyScrollableParent(
		parent: HTMLElement | null
	): HTMLElement | null {
		return !parent || parent.scrollWidth > parent.clientWidth
			? parent
			: this.getHorizontallyScrollableParent(parent.parentElement);
	}

	public static getScrollableParent(
		parent: HTMLElement | null
	): HTMLElement | null {
		return !parent ||
			parent.scrollWidth > parent.clientWidth ||
			parent.scrollHeight > parent.clientHeight
			? parent
			: this.getScrollableParent(parent.parentElement);
	}

	/**
	 * Type guard for generic types, so basically you give it any kind of object and any kind of type
	 * (except interfaces) and it tells you if the object is of the same type as the one you passed.
	 * See https://dev.to/krumpet/generic-type-guard-in-typescript-258l for the full explanation,
	 * this shit is too damn complex for me to explain it here.
	 * @param object The object to check
	 * @param type The type to check
	 */
	public static isTypeOf<T extends PrimitiveOrConstructor>(
		object: any,
		type: T
	): object is GuardedGenericType<T> {
		const tmpType: PrimitiveOrConstructor = type;
		if (typeof tmpType === 'string') return typeof object === tmpType;
		return object instanceof tmpType;
	}

	public static getFirstPropOfType<T extends PrimitiveOrConstructor>(
		object: { [key: string]: any },
		type: T
	): GuardedGenericType<T> | undefined {
		for (const key in object) {
			if (object.hasOwnProperty(key)) {
				const element: any = object[key];
				if (this.isTypeOf(element, type)) return element;
			}
		}
		return undefined;
	}

	public static isTypeOfInterface<T>(
		object: any,
		...keys: (keyof T)[]
	): object is T {
		return (
			object !== undefined &&
			keys.every((key: keyof T): boolean => object.hasOwnProperty(key))
		);
	}

	public static flatObjFromEntries(
		entries: (string | number)[],
		value?: any
	): any {
		const obj: { [key: string]: any } = {};
		let tmp: { [key: string]: any } = obj;

		entries.forEach((key: string | number, index: number): void => {
			tmp[key] = index === entries.length - 1 ? value : {};
			tmp = tmp[key];
		});
		return obj;
	}

	public static tallObjFromEntries(
		entries: (string | number)[],
		value?: any
	): any {
		return Object.fromEntries(
			entries.map((entry: string | number): [string | number, any] => [
				entry,
				value,
			])
		);
	}

	public static getFlatObjValue(
		object: { [key: string]: any },
		key: string
	): any {
		if (object === undefined) return undefined;
		const firstKey: string = Object.keys(object)[0];
		return firstKey === key
			? object[firstKey]
			: this.getFlatObjValue(object[firstKey], key);
	}

	private constructor() {
		return;
	}
}

interface TypeMap {
	bigint: bigint;
	boolean: boolean;
	function: (...args: any[]) => any;
	number: number;
	object: object;
	string: string;
	symbol: symbol;
	undefined: undefined;
}

type PrimitiveOrConstructor = (new (...args: any[]) => any) | keyof TypeMap;
type GuardedGenericType<T> = T extends new (...args: any[]) => infer U
	? U
	: T extends keyof TypeMap
	? TypeMap[T]
	: never;
