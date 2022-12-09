<template>
	<div
		v-show="!currentLevel.hidden"
		:class="[
			'accordion',
			currentLevel.class,
			currentLevel.disabled ? 'disabled' : '',
			active ? 'active' : '',
		]"
	>
		<div
			tabindex="0"
			ref="title"
			:class="['item', `accordion-${uid}`]"
			v-if="!root"
			@mousedown.prevent="catchBlur"
			@mouseup="
				setFocus();
				emitToggle();
			"
			@blur="onBlur"
		>
			<a
				v-if="type === ContentType.LINK && !currentLevel.disabled"
				class="navlink"
				:href="currentLevel.link"
				:target="currentLevel.target"
			>
				<i v-if="currentLevel.icon" :class="currentLevel.icon"></i>
				<span class="navlink-text">{{
					translate ? $t(currentLevel.title) : currentLevel.title
				}}</span>
				<icon
					chevron
					down
					v-if="
						currentLevel.nextLevels &&
						currentLevel.nextLevels.length
					"
				/>
			</a>
			<router-link
				v-else-if="type === ContentType.ROUTE && !currentLevel.disabled"
				class="navlink"
				:to="currentLevel.route"
			>
				<i v-if="currentLevel.icon" :class="currentLevel.icon"></i>
				<span class="navlink-text">{{
					translate ? $t(currentLevel.title) : currentLevel.title
				}}</span>
				<icon
					chevron
					down
					v-if="
						currentLevel.nextLevels &&
						currentLevel.nextLevels.length
					"
				/>
			</router-link>
			<span v-else class="navlink">
				<i v-if="currentLevel.icon" :class="currentLevel.icon"></i>
				<span class="navlink-text">{{
					translate ? $t(currentLevel.title) : currentLevel.title
				}}</span>
				<icon
					chevron
					down
					v-if="
						currentLevel.nextLevels &&
						currentLevel.nextLevels.length
					"
				/>
			</span>
		</div>
		<div
			class="content"
			v-if="
				currentLevel.nextLevels &&
				currentLevel.nextLevels.length &&
				(active || root)
			"
		>
			<accordion
				v-for="(level, i) in currentLevel.nextLevels"
				:key="i"
				:level="level"
				:params="level.params"
				:active="activeIndex === i"
				:autoclose="autoclose"
				:translate="translate"
				:p-root-uid="uid"
				:class="{ 'root-level': root }"
				@toggle="toggleActive(i)"
				@close="toggleActive(i, true)"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { Attr } from '@/decorators';
import AxiosUtils from '@/services/AxiosUtils';
import Js from '@/services/JsService';
import Logger from '@/services/LoggerService';
import { ContentType } from '@/types';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { AccordionLevel } from './AccordionTypes';

/**
 * Custom Accordion able to display text, links, router links and icons.
 * Interactions handled with focus and blur
 */
@Component({})
export default class Accordion extends Vue {
	/**
	 * Is the current level the root of the accordion.
	 */
	@Attr() protected readonly root!: boolean;

	/**
	 * Object describing the content of the current level of the accordion,
	 * or an address to retrieve the content from
	 */
	@Prop() protected readonly level!: AccordionLevel | string;
	/**
	 * Parameters to use if the level is an address
	 */
	@Prop() protected readonly params!: { [keys: string]: any };
	/**
	 * Is the level active (always true for the root)
	 */
	@Prop() protected readonly active!: boolean;
	/**
	 * Is the accordion/level closing itself when losing focus to anything in the document
	 * that is not the current accordion
	 */
	@Prop() protected readonly autoclose!: boolean;
	@Prop() protected readonly translate!: boolean;

	protected readonly ContentType: typeof ContentType = ContentType;

	protected currentLevel: AccordionLevel = { title: '' };
	protected activeIndex: number = -1;
	protected preventBlur: boolean = false;
	protected type: ContentType = ContentType.STRING;
	protected titleClass: string = '';
	protected uid: string = '';

	/**
	 * Private id. Do not use.
	 */
	@Prop() private readonly pRootUid!: string;

	/**
	 * Opens a level (and its parents) corresponding to certain criterias in an accordion
	 * @param root The root of the accordion
	 * @param searchedLevel An object describing parts or the whole level to open
	 * @public
	 */
	public open(searchedLevel: AccordionLevel): void {
		if (!this.currentLevel || !this.currentLevel.nextLevels)
			return Logger.dbgLog(
				'Accordion: open: root.currentLevel and root.currentLevel.nextLevels are undefined',
				this
			);

		const searchedLvlStr: AccordionLevel = Object.assign({}, searchedLevel);
		const searchedLvlObj: AccordionLevel = Object.assign({}, searchedLevel);
		if (searchedLevel.route) {
			if (typeof searchedLevel.route === 'string')
				searchedLvlObj.route = {
					path: searchedLevel.route,
				};
			else searchedLvlStr.route = searchedLevel.route.path;
		}

		let foundIndex: number = -1;
		const levelIterator: (
			level: AccordionLevel | string,
			i: number
		) => boolean = (level: AccordionLevel | string, i: number): boolean => {
			if (typeof level === 'string') return false;
			if (
				Js.approximatelyEquals(
					level,
					typeof level.route === 'string'
						? searchedLvlStr
						: searchedLvlObj,
					true
				)
			) {
				level.active = true;
				foundIndex = i;
				return true;
			} else if (level.nextLevels) {
				let ret: AccordionLevel | string | undefined;
				ret = level.nextLevels.find(levelIterator);
				if (ret) {
					level.active = true;
					foundIndex = i;
					return true;
				}
				return false;
			} else return false;
		};
		if (this.currentLevel.nextLevels.find(levelIterator))
			this.toggleActive(foundIndex, false, true);
	}

	public closeAll(): void {
		this.toggleActive(-1, true);
	}

	public emitToggle(): void {
		if (!this.currentLevel.disabled)
			/**
			 * Emitted when the user opens the sub-levels of an enabled accordion
			 */
			this.$emit('toggle');
		else
			Logger.dbgLog(
				'Accordion: emitToggle: currentLevel.disabled is true'
			);
	}

	/**
	 * Toggles open and close the sub-levels of an accordion by a given index
	 * @param index Index of the level to toggle
	 * @param closeOnly Will only close the current active level
	 * @param openOnly Will only open the level at the given index
	 * @public
	 */
	public toggleActive(
		index: number,
		closeOnly?: boolean,
		openOnly?: boolean
	): void {
		if ((index === -1 || this.activeIndex === index) && !openOnly)
			this.activeIndex = -1;
		else if (!closeOnly) this.activeIndex = index;
		if (closeOnly) {
			if (
				this.$parent.$options.name === 'Accordion' &&
				(this.$parent as Accordion).preventBlur
			)
				(this.$parent as Accordion).preventBlur = false;
			else this.$emit('close');
		}
	}

	/**
	 * Prevent the accordion to blur a potentially focused parent or sibling,
	 * and "informs" its parent it's going to be blured by its child
	 * @public
	 */
	protected catchBlur(): void {
		if (
			!document.activeElement?.className.includes(`accordion-${this.uid}`)
		)
			return Logger.dbgLog(
				'Accordion: catchBlur: document.activeElement?.className.includes(`accordion-${this.uid}`) is false',
				this
			);
		if (
			this.$parent.$options.name === 'Accordion' &&
			!(this.$parent as Accordion).root &&
			this.$refs['title'] !== document.activeElement
		)
			(this.$parent as Accordion).preventBlur = true;
	}

	/**
	 * Set the focus on the current accordion
	 * @public
	 */
	protected setFocus(): void {
		(this.$refs['title'] as HTMLElement).focus();
	}

	/**
	 * On blur, closes itself if autoclose is set to true and neither its children, nor its siblings
	 * are going to take the focus
	 * @public
	 */
	protected onBlur(): void {
		if (
			!document.activeElement?.className.includes(
				`accordion-${this.uid}`
			) &&
			!this.autoclose
		)
			return Logger.dbgLog(
				'Accordion: onBlur: document.activeElement?.className.includes(`accordion-${this.uid}`) is true or this.autoclose is true',
				this
			);
		if (this.preventBlur) this.preventBlur = false;
		else if (
			this.$parent.$options.name === 'Accordion' &&
			(this.$parent as Accordion).preventBlur
		)
			(this.$parent as Accordion).preventBlur = false;
		else this.$emit('close');
	}

	/**
	 * When deactivated, will close all of its sub-levels
	 * @public
	 */
	@Watch('active')
	private onActiveChange(val: boolean, oldVal: boolean): void {
		if (!val && oldVal) this.activeIndex = -1;
	}

	@Watch('level', { immediate: true })
	private onLevelChange(): void {
		this.initLevels();
	}

	private retrieveLevel(): void {
		if (typeof this.level !== 'string' || this.level === '')
			return Logger.dbgLog(
				"Accordion: retrieveLevel: this.level is typeof 'string' or this.level equals ''",
				this
			);
		Axios.get(this.level, { params: this.params })
			.then((response: AxiosResponse): void => {
				if (Array.isArray(response.data))
					this.currentLevel.nextLevels = response.data;
				else if (response.data.hasOwnProperty('title')) {
					this.currentLevel = response.data;
					this.initCurrentLevel();
				} else {
					Logger.dbgError(
						"Accordion: retrievLevels: response.data.hasOwnProperty('title') is false",
						this
					);
					Logger.error(
						`Accordion: retrieveLevels: invalid response from ${this.level}`,
						response,
						this
					);
				}
			})
			.catch((error: AxiosError): void => {
				AxiosUtils.defaultErrorCatch(
					error,
					`Accordion: retrieveLevels: cannot get levels from ${this.level}`
				);
			});
	}

	/**
	 * If the href of the level is a string that begins by `/`, it will automatically be considered as a route
	 */
	private initCurrentLevel(): void {
		if (this.currentLevel.active) {
			this.$emit('toggle');
			this.currentLevel.active = false;
		}
		if (this.currentLevel.route) {
			this.type = ContentType.ROUTE;
			if (typeof this.currentLevel.route === 'string')
				this.currentLevel.route = {
					path: this.currentLevel.route,
				};
			if (!this.currentLevel.route.params)
				this.currentLevel.route.params = {};
		} else if (this.currentLevel.link) this.type = ContentType.LINK;
	}

	private initLevels(): void {
		this.uid = this.root ? Js.uid : this.pRootUid;

		if (typeof this.level === 'string') this.retrieveLevel();
		else {
			this.currentLevel = this.level;
			this.initCurrentLevel();
		}
	}

	private created(): void {
		if (!this.level)
			return Logger.dbgWarn(
				'Accordion: created: this.level is undefined',
				this
			);
		this.initLevels();
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.accordion {

	.item {
		background: none;
		border-radius: $radius;
		cursor: pointer;
		transition: all $fast-speed;

		&:hover {
			color: $primary-color;
		}

		.icon.chevron {
			opacity: .7;
			float: right;
			transition: all $fast-speed;
		}
	}

	&.active {
		>.item {
			color: $primary-color;

			>.navlink>.icon.chevron {
				transform: rotate(180deg);
			}
		}
	}

	&.basic {
		.item {
			background: none;
			padding: 0;

			&:hover {
				color: rgba($text-color, .6);
			}

			.icon.chevron {
				float: none;
				margin-left: math.div($padding, 4);
			}
		}

		.content {
			padding: math.div($padding, 2) 0;

			&:last-child {
				padding-bottom: 0;
			}
		}
	}
}
</style>
