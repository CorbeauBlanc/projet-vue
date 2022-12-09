import { RawLocation } from 'vue-router';

/**
 * Interface describing an accordion level
 */
export interface AccordionLevel {
	/**
	 * The title of the level to display
	 */
	title?: string;
	/**
	 * The route the level is redirecting to
	 */
	route?: RawLocation;
	routeLegacyRight?: string;
	/**
	 * The url the level is redirecting to
	 */
	link?: string;
	/**
	 * The target of the link (only for html links)
	 */
	target?: string;
	/**
	 * The children levels of the level, or an address to retrieve them from
	 */
	nextLevels?: (AccordionLevel | string)[];
	/**
	 * If the children are to be retrieved, the params to send with the request
	 */
	params?: { [keys: string]: any };
	/**
	 * Is the level disabled
	 */
	disabled?: boolean;
	/**
	 * Is the level hidden
	 */
	hidden?: boolean;
	/**
	 * Is the level active, i.e. are its sub-levels unfolded
	 */
	active?: boolean;
	/**
	 * The custom classes to inject to the level
	 */
	class?: string;
	/**
	 * An icon class to put in the title
	 */
	icon?: string;
}
