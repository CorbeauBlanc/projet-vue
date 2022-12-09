<template>
	<div class="highlight-ignore">
		<custom-datalist
			id="search-engine-datalist"
			ref="datalist"
			@change="highlightOpt"
			v-model="searchText"
		>
			<component
				v-for="(suggestion, i) in basicSuggestions"
				:key="i"
				:is="suggestion.component ? suggestion.value : 'custom-option'"
				:data="suggestion.data"
				:value="suggestion.toString()"
			>
				{{
					typeof suggestion === 'string' || !suggestion.component
						? suggestion.toString()
						: ''
				}}
			</component>
			<custom-optgroup
				v-for="(group, i) in suggestionsGroups"
				:key="i"
				:label="group.title"
			>
				<component
					v-for="(suggestion, j) in group.suggestions"
					:key="j"
					:is="
						suggestion.component
							? suggestion.value
							: 'custom-option'
					"
					:data="suggestion.data"
					:value="suggestion.toString()"
				>
					{{
						typeof suggestion === 'string' || !suggestion.component
							? suggestion.toString()
							: ''
					}}
				</component>
			</custom-optgroup>
		</custom-datalist>
		<button class="search-engine-button" @click="search">Rechercher</button>
	</div>
</template>

<script lang="ts">
import CustomDatalist from '@/components/CustomOptions/CustomDatalist.vue';
import CustomOptgroup from '@/components/CustomOptions/CustomOptgroup.vue';
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import AxiosUtils from '@/services/AxiosUtils';
import ComponentsUtils from '@/services/ComponentsUtils';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
	SearchEngineSuggestion,
	SearchEngineSuggestionsGroup,
} from './SearchEngineTypes';

/**
 * Component highlighting user input in a given DOM element (basically it's a Ctrl + f)
 */
@Component({
	components: {
		CustomDatalist,
		CustomOption,
		CustomOptgroup,
	},
})
export default class SearchEngine extends Vue {
	/**
	 * An array of suggestions of values to search for, or the address used to retrieve this array
	 * @type {(string | SearchEngineSuggestion | SearchEngineSuggestionsGroup)[] | string}
	 */
	@Prop() public readonly suggestions!:
		| (string | SearchEngineSuggestion | SearchEngineSuggestionsGroup)[]
		| string;
	/**
	 * The parameters used when retrieving the array of suggestions
	 */
	@Prop() public readonly params!: { [keys: string]: any };
	/**
	 * A function returning the DOM Element in which the search is to be done
	 */
	@Prop() public readonly source!: () => Element;
	/**
	 * The style of the highlighted results
	 */
	@Prop() public readonly highlightStyle!: string;

	protected searchText: string = '';

	private readonly defaultStyle: string = 'background: yellow';
	private basicSuggestions: (string | SearchEngineSuggestion)[] = [];
	private suggestionsGroups: SearchEngineSuggestionsGroup[] = [];

	/**
	 * Clear the previous results and re-launch the search in el if defined, otherwise in source.
	 * If no occurence is found and log is true (so not when searching in the suggestions),
	 * it will emit an `error` event.
	 * @public
	 */
	protected search(evt?: Event, el?: Element, log?: boolean): void {
		if (!el && (!this.source || !this.source())) return;
		Js.clearHighlightedTextInHTML(el !== undefined ? el : this.source());

		if (this.searchText !== '') {
			if (
				!Js.highlightTextInHTML(
					this.searchText,
					this.highlightStyle
						? this.highlightStyle
						: this.defaultStyle,
					el !== undefined ? el : this.source()
				) &&
				(log || log === undefined)
			)
				/**
				 * Emitted when no occurence of the user input is found
				 */
				this.$emit('error');
		}
	}

	/**
	 * Highlight the user input in the suggestions, using the seach() method
	 */
	protected highlightOpt(): void {
		this.search(undefined, (this.$refs.datalist as Vue).$el, false);
	}

	private retrieveSuggestions(): void {
		Axios.get(this.suggestions as string, { params: this.params })
			.then((response: AxiosResponse): void => {
				if (!Array.isArray(response.data)) {
					Logger.error(
						`SearchEngine: retrieveSuggestions: invalid response from ${this.suggestions}`,
						response
					);
					return;
				}
				this.parseSuggestionsArray(response.data);
			})
			.catch((error: AxiosError): void => {
				AxiosUtils.defaultErrorCatch(
					error,
					`SearchEngine: retrieveSuggestions: cannot get suggestions from ${this.suggestions}`
				);
			});
	}

	/**
	 * Load all the suggestions that are components with the ComponentsUtils service
	 */
	private loadSuggestionsComponents(): void {
		const fct: (val: string | SearchEngineSuggestion) => void = (
			value: string | SearchEngineSuggestion
		): void => {
			if (typeof value !== 'string' && value.component) {
				const tmp: string = value.value;
				value.value = '';
				ComponentsUtils.loadComponentInComponent(
					this,
					value.path ? value.path : '',
					tmp
				).then((): void => {
					value.value = tmp;
				});
			}
		};
		this.basicSuggestions.forEach(fct);
		this.suggestionsGroups.forEach(
			(group: SearchEngineSuggestionsGroup): void => {
				group.suggestions.forEach(fct);
			}
		);
	}

	/**
	 * Generate a new SearchEngineSuggestionsGroup with any given source
	 */
	private createSuggestionGroup(src: any): SearchEngineSuggestionsGroup {
		const group: SearchEngineSuggestionsGroup = {
			title: src.title,
			suggestions: [],
		};
		if (src.suggestions && Array.isArray(src.suggestions))
			(src.suggestions as (SearchEngineSuggestion | string)[]).forEach(
				(suggestion: SearchEngineSuggestion | string): void => {
					group.suggestions.push(this.createSuggestion(suggestion));
				}
			);
		return group;
	}

	/**
	 * Generate a new SearchEngineSuggestion with any given source
	 */
	private createSuggestion(src: any): SearchEngineSuggestion | string {
		if (typeof src !== 'string')
			return new SearchEngineSuggestion(
				src.value,
				src.component,
				src.data,
				src.path
			);
		else return src;
	}

	/**
	 * Parse the given/retrieved suggestions and split them into 2 different arrays,
	 * depending if it's a suggestion group or a single suggestion, and lazy load all needed components
	 */
	private parseSuggestionsArray(
		data: (string | SearchEngineSuggestion | SearchEngineSuggestionsGroup)[]
	): void {
		data.forEach(
			(
				element:
					| string
					| SearchEngineSuggestion
					| SearchEngineSuggestionsGroup
			): void => {
				if (
					element.hasOwnProperty('title') &&
					element.hasOwnProperty('suggestions') &&
					(element as SearchEngineSuggestionsGroup).title !== '' &&
					(element as SearchEngineSuggestionsGroup).suggestions.length
				)
					this.suggestionsGroups.push(
						this.createSuggestionGroup(element)
					);
				else if (
					typeof element === 'string' ||
					element.hasOwnProperty('value')
				)
					this.basicSuggestions.push(this.createSuggestion(element));
				else
					Logger.error(
						'SearchEngine: parseSuggestionsArray: invalid suggestion encountered, skipping: ',
						element
					);
			}
		);
		this.loadSuggestionsComponents();
	}

	private created(): void {
		if (!this.suggestions)
			return Logger.dbgWarn(
				'SearchEngine: highlightOpt: this.suggestions is false or undefined',
				this
			);
		if (typeof this.suggestions === 'string') this.retrieveSuggestions();
		else if (Array.isArray(this.suggestions))
			this.parseSuggestionsArray(this.suggestions);
		else
			Logger.error(
				'SearchEngine: created: invalid suggestions prop: ',
				this.suggestions
			);
	}
}
</script>
