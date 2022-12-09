<template>
	<div class="actions">
		<button
			v-if="isArchived()"
			:class="`button icon ${archiveAccess ? '' : 'disabled'}`"
			@click="validate"
		>
			<tooltip v-if="archiveAccess" class="top">{{
				$t('Activer')
			}}</tooltip>
			<icon restore text green />
		</button>
		<button
			v-else-if="hasBeenValidated()"
			:class="`button icon ${archiveAccess ? '' : 'disabled'}`"
			@click="archive(false)"
		>
			<tooltip v-if="archiveAccess" class="top">{{
				$t('Archiver')
			}}</tooltip>
			<icon delete text red />
		</button>
		<button
			v-else
			:class="`button icon ${archiveAccess ? '' : 'disabled'}`"
			@click="validate"
		>
			<tooltip v-if="archiveAccess" class="top">{{
				$t('Valider')
			}}</tooltip>
			<icon check text green />
		</button>
		<archive-tester-modal
			ref="archiveModal"
			:id="id"
			@archive="archive(true)"
		/>
		<router-link
			:class="`button icon ${billAccess ? '' : 'disabled'}`"
			:to="billRoute"
		>
			<tooltip v-if="billAccess" class="top">{{
				$t('Voir les factures')
			}}</tooltip>
			<icon gain />
		</router-link>
		<a
			:class="`button icon ${authenticationAccess ? '' : 'disabled'}`"
			:target="authenticationAccess ? '_blank' : ''"
			:href="authenticationUrl"
		>
			<tooltip v-if="authenticationAccess" class="top">{{
				$t('Authentifier')
			}}</tooltip>
			<icon auth />
		</a>
		<router-link
			:class="`button icon ${affectationsAccess ? '' : 'disabled'}`"
			:to="affectationsRoute"
		>
			<tooltip v-if="affectationsAccess" class="top">{{
				$t('Affectations')
			}}</tooltip>
			<icon affectations />
		</router-link>
		<router-link
			:class="`button icon ${editionAccess ? '' : 'disabled'}`"
			:to="editionRoute"
		>
			<tooltip v-if="editionAccess" class="top">{{
				$t('Éditer')
			}}</tooltip>
			<icon edit />
		</router-link>
	</div>
</template>

<script lang="ts">
import ListingActions from '@/components/Listing/ListingActions';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import Logger from '@/services/LoggerService';
import UserUtils from '@/services/UserUtils';
import ArchiveTesterModal from '@/views/Testers/AllTesters/ArchiveTesterModal.vue';
import { testerAuthUrl } from '@/views/Testers/TestersConfig';
import { usersStatesUrl } from '@/views/Users/UsersConfig';
import { UserState } from '@/views/Users/UsersTypes';
import { Component, Prop, Ref } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component({
	components: {
		Tooltip,
		ArchiveTesterModal,
	},
})
export default class TestersActions extends ListingActions {
	@Prop() public readonly id!: number;
	@Prop() public readonly state!: number;

	@Ref() protected readonly archiveModal!: ArchiveTesterModal;

	protected archiveAccess: boolean = false;
	protected billAccess: boolean = false;
	protected authenticationAccess: boolean = false;
	protected affectationsAccess: boolean = false;
	protected editionAccess: boolean = false;

	protected get billRoute(): RawLocation | '' {
		const id: string = `${this.id}`;
		return this.billAccess ? { name: 'tester bill', params: { id } } : '';
	}
	protected get authenticationUrl(): string {
		if (!this.authenticationAccess) return '';

		return `${testerAuthUrl}/${this.id}`;
	}
	protected get affectationsRoute(): RawLocation | '' {
		const id: string = `${this.id}`;
		return this.affectationsAccess
			? {
					name: 'tester affectations',
					params: { id },
			  }
			: '';
	}
	protected get editionRoute(): RawLocation | '' {
		const id: string = `${this.id}`;
		return this.editionAccess
			? {
					name: 'tester edition',
					params: { id },
			  }
			: '';
	}

	protected hasBeenValidated(): boolean {
		return this.state !== UserState.notValidated;
	}

	protected isArchived(): boolean {
		return this.state === UserState.archived;
	}

	protected validate(): void {
		if (!this.archiveAccess)
			return Logger.dbgLog(
				'TestersActions: validate: this.archiveAccess is false',
				this
			);

		this.put({
			data: {
				state: `${usersStatesUrl}/${UserState.active}`,
			},
			successMsg: 'Le testeur a bien été validé.',
			failureMsg: "Le testeur n'a pas été validé.",
		});
	}

	protected archive(confirmed: boolean): void {
		if (!this.archiveAccess)
			return Logger.dbgLog(
				'TestersActions: archive: this.archiveAccess is false',
				this
			);

		if (confirmed) {
			this.put({
				data: {
					state: `${usersStatesUrl}/${UserState.archived}`,
				},
				successMsg: 'Le testeur a bien été archivé.',
				failureMsg: "Le testeur n'a pas été archivé.",
			});
		} else this.archiveModal.show();
	}

	private async created(): Promise<void> {
		this.archiveAccess = await UserUtils.instance.currentUserHasPermission(
			'panel/usertesting/archive/action'
		);
		this.billAccess = await UserUtils.instance.currentUserHasPermission(
			'panel/gain/see'
		);
		this.authenticationAccess =
			await UserUtils.instance.currentUserHasPermission(
				'panel/usertesting/authenticate/action'
			);
		this.affectationsAccess =
			await UserUtils.instance.currentUserHasPermission(
				'panel/affectations/list'
			);
		this.editionAccess = await UserUtils.instance.currentUserHasPermission(
			'panel/see'
		);
	}
}
</script>
