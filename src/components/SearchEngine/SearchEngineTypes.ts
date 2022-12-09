/**
 * A search suggestion
 */
export class SearchEngineSuggestion {
	/**
	 * The value of the suggestion to be sent and displayed
	 */
	public value: string;
	/**
	 * Is the suggestion a component.
	 * If true the value will be used as the name of the component to be loaded
	 */
	public component?: boolean;
	/**
	 * The data to be passed to the component
	 */
	public data?: any;
	/**
	 * The path of the component
	 */
	public path?: string;

	constructor(value: string, component?: boolean, data?: any, path?: string) {
		this.value = value;
		this.component = component;
		this.data = data;
		this.path = path;
	}

	public toString(): string {
		return this.value;
	}
}

/**
 * Interface representing a group of search suggestions
 */
export interface SearchEngineSuggestionsGroup {
	/**
	 * The title of the group
	 */
	title: string;
	/**
	 * An array of suggestions
	 */
	suggestions: (string | SearchEngineSuggestion)[];
}
