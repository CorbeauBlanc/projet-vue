<template>
	<div
		id="nav-menu"
		:class="{ collapsed }"
		v-if="levels.length && navigation.sidebarOpened"
	>
		<div class="navigation">
			<div class="menu">
				<div class="items top">
					<router-link class="navlink logo" :to="{ name: 'home' }">
						<icon testapic logo />
						<span class="navlink-text">{{ company }}</span>
					</router-link>
					<accordion
						id="accordion"
						ref="accordion"
						root
						:translate="true"
						:autoclose="collapsed"
						:level="accordionLevels"
					/>
					<button
						v-if="typeformId !== '' && levelsReady"
						class="button navlink"
						@click="openTfModal()"
					>
						<icon question answer />
						<span class="navlink-text">
							{{ $t('Demande de support') }}
						</span>
					</button>
				</div>
				<div class="items bottom">
					<custom-select
						class="navlink"
						v-model="locale"
						@change="setLocale"
					>
						<template #before>
							<span
								:class="`flag country-${Languages.getCountry(
									locale
								)}`"
							></span>
						</template>
						<custom-option
							class="link"
							v-for="(loc, i) in availableLocales"
							:key="loc + i"
						>
							<span
								:class="`flag country-${Languages.getCountry(
									loc
								)}`"
							></span>
							{{ loc }}
						</custom-option>
					</custom-select>
					<div class="navlink" @click="collapsed = !collapsed">
						<i
							:class="[
								'icon chevron',
								collapsed ? 'right' : 'left',
							]"
						></i>
						<span class="navlink-text">{{ $t('Réduire') }}</span>
					</div>
				</div>
				<typeform-modal
					v-if="typeformId !== '' && levelsReady"
					ref="tfModal"
					:formId="typeformId"
				></typeform-modal>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Accordion from '@/components/Accordion/Accordion.vue';
import { AccordionLevel } from '@/components/Accordion/AccordionTypes';
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import CustomSelect from '@/components/CustomOptions/CustomSelect.vue';
import { typeformUrl } from '@/config';
import { routeIsEnabled } from '@/router';
import AxiosUtils from '@/services/AxiosUtils';
import Languages from '@/services/LanguagesService';
import Logger from '@/services/LoggerService';
import { RouterUtils } from '@/services/RouterUtils';
import Sidebars from '@/services/SidebarsService';
import UserUtils from '@/services/UserUtils';
import { DefaultCompany } from '@/views/Companies/CompaniesTypes';
import TypeformModal from '@/views/TypeformModal.vue';
import axios, { AxiosResponse } from 'axios';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

/**
 * Main navigation menu of the app
 */
@Component({
	components: {
		Accordion,
		CustomSelect,
		CustomOption,
		TypeformModal,
	},
})
export default class NavSidebar extends Vue {
	/**
	 * The levels of the menu, or an address to retrieve them from
	 */
	@Prop() public readonly levels!: AccordionLevel[] | string;

	@Ref() protected readonly accordion!: Accordion;
	@Ref() tfModal!: TypeformModal;

	protected typeformId: string = '';
	protected levelsReady: boolean = false;

	protected accordionLevels: AccordionLevel | string = '';
	protected loginUrl: string = RouterUtils.loginUrl;
	protected navigation: typeof Sidebars.navigation = Sidebars.navigation;
	protected locale: string = Languages.currentLocale;
	protected company: string = 'Testapic';

	protected readonly Languages: typeof Languages = Languages;
	protected readonly availableLocales: string[] = ['fr', 'en'];
	protected get collapsed(): boolean {
		return this.pCollapsed;
	}
	protected set collapsed(val: boolean) {
		this.pCollapsed = val;
		this.accordion.closeAll();
	}

	private pCollapsed: boolean = false;

	protected setLocale(): void {
		Languages.instance.setLocale(this.locale);
		this.getTypeformId();
		if (this.$route.name === 'legacy iframe') {
			let url: string = this.$route.query['url']?.toString() || '';
			const loc: RegExpMatchArray | null = url
				.substring(0, 4)
				.match(/\/[a-z]{2}\//);
			if (loc) url = url.replace(loc[0], `/${this.locale}/`);
			else url = `/${this.locale}${url}`;
			this.$router.push({ name: 'legacy iframe', query: { url } });
		} else if (this.$route.meta?.url)
			Sidebars.navigation.loadedLegacyIframe.updateLocale(this.locale);
	}

	private hasOneValidLevel(levels: (AccordionLevel | string)[]): boolean {
		return levels.some((level: AccordionLevel | string): boolean => {
			if (typeof level === 'string') return true;

			if (typeof level.route === 'object') {
				const resolved: Route | undefined =
					RouterUtils.instance.resolveRoute(level.route);
				if (
					!resolved ||
					resolved.name === 'error 404' ||
					!routeIsEnabled(resolved, undefined, level.routeLegacyRight)
				)
					return false;
			} else if (typeof level.route === 'string' && level.route === '')
				return false;

			if (level.nextLevels)
				return this.hasOneValidLevel(level.nextLevels);

			return true;
		});
	}

	private async pruneUnavailableLevel(
		level: string | AccordionLevel
	): Promise<boolean> {
		if (
			typeof level === 'string' ||
			typeof level.route === 'string' ||
			typeof level.link === 'string'
		)
			return Logger.dbgLogRet(
				false,
				'NavSidebar: pruneUnavailableLevels: level or level.route or level.link is a string',
				level
			);

		if (level.route) {
			const resolved: Route | undefined =
				RouterUtils.instance.resolveRoute(level.route);
			if (
				!resolved ||
				!(await routeIsEnabled(
					resolved,
					undefined,
					level.routeLegacyRight
				))
			)
				return true;
		}
		if (level.nextLevels) {
			let index: number = 0;
			while (index < level.nextLevels.length) {
				if (await this.pruneUnavailableLevel(level.nextLevels[index]))
					level.nextLevels.splice(index, 1);
				else index++;
			}
			if (!level.nextLevels.length) return true;
		}
		return false;
	}

	/**
	 * When the current route has been changed by an other means than cliking on a router-link of the nav-menu
	 * will open the corresponding level of the nav-menu
	 */
	@Watch('$route')
	private onRouteChange(): void {
		if (
			this.$route.params.linkNavigation !== 'true' &&
			this.accordionLevels !== ''
		)
			this.openCurrentLevel();
	}

	protected openTfModal(): void {
		this.tfModal.open().then((): void => {
			this.tfModal.createTfWidget();
		});
	}

	protected async getTypeformId(): Promise<void> {
		let lang: string = this.locale;
		if (lang !== 'en' && lang !== 'fr') lang = Languages.fallbackLocale;

		axios
			.get(typeformUrl, {
				...AxiosUtils.defaultConfig,
				params: {
					lang,
				},
			})
			.then((response: AxiosResponse<string>): void => {
				if (!response.data) return;

				this.typeformId = response.data;
			})
			.catch((error: any): void => {
				Logger.error(`NavSidebar: cannot get Typeform`, error);
			});
	}

	private created(): void {
		UserUtils.instance.currentUserCustomer.then(
			(customer: DefaultCompany): void => {
				this.company = customer.name;
			}
		);
	}

	private openCurrentLevel(): void {
		if (this.accordionLevels === '' || !this.accordion) return;

		this.accordion.open({
			route: {
				name: this.$route.name || '',
			},
		});

		this.levelsReady = true;
	}

	private async mounted(): Promise<void> {
		this.getTypeformId();

		if (typeof this.levels === 'string') this.accordionLevels = this.levels;
		else {
			await RouterUtils.getRouteValidatedPromise();
			await this.pruneUnavailableLevel({ nextLevels: this.levels });
			if (!this.hasOneValidLevel(this.levels)) {
				Logger.warn(
					'NavSidebar: No valid level found, hiding the Sidebar'
				);
				Sidebars.navigation.closeSidebar(true);
			} else
				this.accordionLevels = {
					nextLevels: this.levels,
				};
			await this.$nextTick();
			this.openCurrentLevel();
		}
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';
@import '@/styles/icons';

#nav-menu {
	flex-shrink: 0;
	height: 100%;
	display: flex;
	flex-direction: column;
	width: $sidebar-width;
	background: $menu-background-color;

	&.collapsed {
		width: auto;

		& #accordion .root-level>.item>.navlink>.navlink-text,
		& #accordion .root-level>.item>.navlink>.chevron,
		& .items>.navlink>.navlink-text {
			display: none;
		}

		.navigation {
			#accordion {
				.accordion:not(.root-level) {
					position: relative;
				}

				.lvl1 {
					.content {
						background: $menu-background-color;
						position: absolute;
						left: 90px;
						margin-top: -50%;
						box-shadow: $selected-shadow;
						width: 200px;
						transform: translateY(-50%);

						&:before {
							@include triangle(scale-color($menu-background-color, $lightness: -30%), .5rem, 'left');
						}

						.item {
							justify-content: flex-start;

							.navlink {
								padding: $padding;
								.navlink-text {
									margin-left: $padding;
									display: flex;
									text-align: start;
								}
							}

							.icon {
								width: auto;
								margin: 0;

								&.chevron.down {
									display: flex;
									margin: 0 0 0 auto;
									transform: rotate(-90deg);
								}
							}
						}

						.content {
							left: 0;
							margin: 0;
							width: 100%;
							top: 50%;
							transform: translateY(-50%) translateX(108%);
						}
					}
				}

				.lvl2, .lvl3, .lvl4, .lvl5 {
					background: rgba(black, .3);
				}
			}
		}
	}

	.navigation {
		width: 100%;
		height: 100%;
		background: $menu-background-color;
		position: relative;
		font-family: $header-font;
		@include z-index(navigation);

		&.sticky {
			position: fixed;
		}

		.menu {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			text-align: center;
			margin: auto;
			height: 100%;

			.items {
				display: flex;
				flex-direction: column;
				align-items: center;
				list-style-type: none;
				width: auto;
				color: $light-grey;

				&.top {
					max-height: 100%;
					overflow: auto;
					@include scrollbar;
				}

				&.bottom {
					min-height: min-content;
				}

				/* 1st level */
				.navlink {
					display: flex;
					height: 100%;
					align-items: center;
					margin-right: auto;
					width: 100%;
					padding: $padding;
					cursor: pointer;
					color: rgba($white, .65);
					transition: color $fast-speed, background $fast-speed;

					&:not(.logo):hover {
						color: $light-grey;
						background: rgba($white, .05);
					}

					&.logo {
						position: sticky;
						top: 0;
						min-height: 89px;
						background: scale-color($menu-background-color, $lightness: 12%);
						color: $white;
						font-size: 1.1rem;
						font-weight: 700;
						@include z-index(navigation);
					}

					&.active {
						color: $white;
					}

					&.disabled {
						cursor: not-allowed;
					}

					.icon.chevron.down, .icon.chevron.up {
						margin: 0 0 0 auto;
						font-size: .6rem;
					}

					.navlink-text {
						margin-left: $padding;
					}

					&.button {
						background: transparent;
						border: none;
						border-radius: unset;

						&:hover {
							box-shadow: none;
						}

						.icon {
							margin-right: 0;
						}
					}
				}

				#accordion {
					width: 100%;

					.lvl1.active {
						background: scale-color($menu-background-color, $lightness: -30%);
						color: $white;
					}

					.lvl2>.item>.navlink {
						padding-left: $padding * 1.25;
					}

					.lvl2, .lvl3, .lvl4, .lvl5 {

						.icon:not(.chevron) {
							font-size: 1rem;
						}

						&.active {
							background: scale-color($menu-background-color, $lightness: -50%);
							color: $white;
						}

						.navlink:hover {
							background: inherit;
							color: $white;
						}
					}
				}
			}
		}
	}

	.select.navlink {
		position: relative;
		padding: 0;

		.cs-input-container {
			width: 100%;

			.flag {
				margin: 0;
			}

			input {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				border: none;
				background: none;
				color: transparent;
			}

			.icon-container {
				display: none;
			}
		}

		.cs-suggestions {
			width: unset;
			position: absolute;
			bottom: 100%;
			left: 50%;
			transform: translateX(-50%);
			background: $white;
			border-radius: $radius;
			padding: math.div($padding, 4) math.div($padding, 3);
			box-shadow: $selected-shadow;

			overflow: visible; // Used to display the arrow of the "tooltip". Disable it if the max height is reached.

			&::after {
				$arrow-size: 10px;

				content: '';
				display: block;
				position: absolute;
				left: 50%;
				top: 100%;
				transform: translateX(-50%);
				border-top: solid $arrow-size $white;
				border-left: solid $arrow-size transparent;
				border-right: solid $arrow-size transparent;
			}

			.option {
				text-align: left;

				.flag {
					margin-right: math.div($padding, 3);
				}
			}
		}
	}
}
</style>
