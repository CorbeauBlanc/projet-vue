<template>
	<div id="user-menu">
		<div id="user">
			<div id="logo" v-if="logoSrc !== ''">
				<img alt="Logo" :src="logoSrc" />
			</div>
			<div id="logo-default" class="text primary" v-else>
				<icon user />
			</div>
			<div id="meta">
				<div id="username">{{ $t('Mon compte') }}</div>
				<div id="company">
					<div
						id="credits"
						:class="['text', credits === 0 ? 'red' : 'green']"
					>
						<icon infinity v-if="credits === 'unlimited'" />
						<span v-else>
							<icon credit />
							{{ credits }}
						</span>
					</div>
					{{ companyName }}
				</div>
			</div>
		</div>
		<div id="menu">
			<div id="items">
				<router-link
					:class="{ disabled: meRoute === '' }"
					:to="meRoute"
					>{{ $t('Paramètres') }}</router-link
				>
				<a v-if="mySpaceUrl !== ''" target="blank" :href="mySpaceUrl">
					{{ $t('Mon espace testeur') }}
					<icon external link />
				</a>
				<span v-else class="link disabled"
					>{{ $t('Mon espace testeur') }} <icon external link
				/></span>
				<div class="separator"></div>
				<router-link
					:class="{ disabled: companiesRoute === '' }"
					:to="companiesRoute"
					>{{ $t('Sociétés') }}</router-link
				>
				<router-link
					:class="{ disabled: usersRoute === '' }"
					:to="usersRoute"
					>{{ $t('Utilisateurs') }}</router-link
				>
				<div class="separator"></div>
				<router-link class="red" :to="{ name: 'logout' }">{{
					$t('Se déconnecter')
				}}</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { legacyUrl, testapicLogo } from '@/config';
import { routeIsEnabled } from '@/router';
import { RouterUtils } from '@/services/RouterUtils';
import UserUtils from '@/services/UserUtils';
import { Component, Vue } from 'vue-property-decorator';
import { Location } from 'vue-router';

@Component({})
export default class UserMenu extends Vue {
	protected logoSrc: string = testapicLogo;
	protected companyName: string = '';
	protected credits: 'unlimited' | number = 0;

	protected meRoute: Location | '' = { name: 'me edition' };
	protected companiesRoute: Location | '' = { name: 'companies' };
	protected usersRoute: Location | '' = { name: 'users' };
	protected mySpaceUrl: string = `${legacyUrl}${RouterUtils.mySpaceUrl}`;

	private async created(): Promise<void> {
		this.companyName = (
			await UserUtils.instance.currentUserCustomer
		).name.toUpperCase();
		this.credits = await UserUtils.instance.currentUserCredits;
		this.logoSrc = (await UserUtils.instance.currentUserCustomer).logo;

		if (
			this.meRoute !== '' &&
			!(await routeIsEnabled(
				this.meRoute,
				undefined,
				'myaccount/parameters/infos/see'
			))
		)
			this.meRoute = '';
		if (
			this.companiesRoute !== '' &&
			!(await routeIsEnabled(
				this.companiesRoute,
				undefined,
				'myaccount/customer/see'
			))
		)
			this.companiesRoute = '';
		if (
			this.usersRoute !== '' &&
			!(await routeIsEnabled(
				this.usersRoute,
				undefined,
				'myaccount/users/see'
			))
		)
			this.usersRoute = '';

		if (
			!(await routeIsEnabled(
				{ name: 'tester space' },
				undefined,
				'my/account/usertesting'
			))
		)
			this.mySpaceUrl = '';
	}
}
</script>

<style lang="scss" scoped>
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

@import '@/styles/headings';

#user-menu {
	@include z-index(topHeading);
	display: block;
	flex-shrink: 0;

	#user {
		cursor: pointer;
		margin: $padding $padding $padding 0;
		padding-left: $padding;
		border-left: $heading-border;
		display: flex;

		&:hover + #menu #items {
			transition: transform .2s;
			transform: scale(1);
		}

		#logo {
			display: flex;
			justify-content: center;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 50%;
			border: 1px solid rgba($grey, .2);
			margin-right: math.div($padding, 2);
			overflow: hidden;

			&-default {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 2.5rem;
				height: 2.5rem;
				border-radius: 50%;
				border: 1px solid rgba($grey, .2);
				margin-right: math.div($padding, 2);
				background: $light-grey;

				i.icon.user {
					font-size: 1.2rem;
				}
			}
		}

		#meta {
			#username {
				font-size: 1.2rem;
			}

			#company {
				font-size: .6rem;
				text-transform: uppercase;
				color: $dark-grey;

				#credits {
					margin-right: .3rem;
					display: inline-block;

					i.icon {
						&.credits {
							margin-right: .3rem;
						}
					}
				}
			}
		}
	}

	#menu {
		overflow-y: visible;
		height: 0;

		#items {
			transform: scale(0);
			background: $heading-bg;
			border-bottom: $heading-border;
			border-bottom-left-radius: 4px;
			position: relative;
			top: -$padding;
			padding-top: $padding;

			&:hover {
				transform: scale(1);
			}

			.separator {
				border-top: $heading-border;
			}

			a, span {
				border-left: $heading-border;
				display: block;
				padding: math.div($padding, 2) $padding;
				color: $text-color;

				&:active, &:hover {
					color: scale-color($text-color, $lightness: -40%);
					background: scale-color($primary-color, $lightness: 85%);
				}

				@each $swatch, $color in $swatch {
					&.#{$swatch} {
						color: $color;

						&:active, &:hover {
							color: scale-color($color, $lightness: -40%);
							background: scale-color($color, $lightness: 85%);
						}
					}
				}

				i.icon {
					height: auto;
					font-size: 1rem;
					color: inherit;
				}
			}
		}
	}
}

</style>
