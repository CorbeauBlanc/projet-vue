<template>
	<div class="actions">
		<duplicate-modal
			ref="duplicateModal"
			v-master="duplicateName"
			@duplicate="duplicate(true)"
		/>
		<archive-test-modal
			ref="archiveModal"
			:id="id"
			:title="title"
			@archive="archive(true)"
		/>
		<activate-modal
			ref="activateModal"
			:id="id"
			:title="title"
			@activate="activate(true)"
		/>
		<button
			v-if="isArchived"
			:class="`button icon ${archiveAccess ? '' : 'disabled'}`"
			@click="activate(false)"
		>
			<tooltip class="top">{{ $t('Activer') }}</tooltip>
			<icon restore text green />
		</button>
		<button
			v-else
			:class="`button icon ${archiveAccess ? '' : 'disabled'}`"
			@click="archive(false)"
		>
			<tooltip class="top">{{ $t('Archiver') }}</tooltip>
			<icon delete text red />
		</button>
		<router-link
			:class="`button icon ${resultsAccess ? '' : 'disabled'}`"
			:to="resultsRoute"
		>
			<tooltip class="top">{{ $t('Voir les résultats') }}</tooltip>
			<icon results />
		</router-link>
		<button
			:class="`button icon ${duplicateAccess ? '' : 'disabled'}`"
			@click="duplicate(false)"
		>
			<tooltip class="top">{{ $t('Dupliquer') }}</tooltip>
			<icon copy />
		</button>
		<router-link
			:to="editionRoute"
			:class="`button icon ${editionAccess ? '' : 'disabled'}`"
		>
			<tooltip class="top">{{ $t('Éditer') }}</tooltip>
			<icon edit />
		</router-link>
	</div>
</template>

<script lang="ts">
import ListingActions from '@/components/Listing/ListingActions';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import { routeIsEnabled } from '@/router';
import Logger from '@/services/LoggerService';
import UserUtils from '@/services/UserUtils';
import ActivateModal from '@/views/Tests/Management/ActivateModal.vue';
import ArchiveTestModal from '@/views/Tests/Management/ArchiveTestModal.vue';
import DuplicateModal from '@/views/Tests/Management/DuplicateModal.vue';
import { FormattedArchiveInfos } from '@/views/Tests/Management/TestInfos/TestInfosTypes';
import { testStatesUrl } from '@/views/Tests/TestsConfig';
import { TestState } from '@/views/Tests/TestsTypes';
import { Component, Prop, Ref } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component({
	components: {
		Tooltip,
		DuplicateModal,
		ArchiveTestModal,
		ActivateModal,
	},
})
export default class TestsActions extends ListingActions {
	@Prop() public readonly id!: number;
	@Prop() public readonly title!: string;
	@Prop() public readonly state!: number;
	@Prop() public readonly previousState!: number | null;

	@Ref() protected readonly duplicateModal!: DuplicateModal;
	@Ref() protected readonly archiveModal!: ArchiveTestModal;
	@Ref() protected readonly activateModal!: ActivateModal;

	protected duplicateName: string = '';

	protected archiveAccess: boolean = false;
	protected duplicateAccess: boolean = false;
	protected editionAccess: boolean = false;
	protected resultsAccess: boolean = false;

	protected get editionRoute(): RawLocation | '' {
		const id: string = `${this.id}`;
		return this.editionAccess
			? { name: 'test edition', params: { id } }
			: '';
	}

	protected get resultsRoute(): RawLocation | '' {
		const id: string = `${this.id}`;
		return this.resultsAccess
			? { name: 'results', query: { test_id: id } }
			: '';
	}

	protected get isArchived(): boolean {
		return this.state === TestState.archived;
	}

	protected archive(confirmed: boolean): void {
		if (!this.archiveAccess)
			return Logger.dbgLog(
				'TestsActions: archive: this.archiveAccess is false',
				this
			);

		if (confirmed) {
			this.put({
				data: {
					testState: `${testStatesUrl}/${TestState.archived}`,
					previousState: this.state,
				} as FormattedArchiveInfos,
				successMsg: 'Le test a bien été archivé.',
				failureMsg: "Le test n'a pas été archivé.",
			});
			this.deleteRow();
		} else this.archiveModal.show();
	}

	protected activate(confirmed: boolean): void {
		if (!this.archiveAccess)
			return Logger.dbgLog(
				'TestsActions: activate: this.archiveAccess is false',
				this
			);

		if (confirmed) {
			this.put({
				data: {
					testState: `${testStatesUrl}/${
						this.previousState &&
						this.previousState !== TestState.archived
							? this.previousState
							: TestState.inPreparation
					}`,
					previousState: TestState.archived,
				} as FormattedArchiveInfos,
				successMsg: 'Le test a bien été activé.',
				failureMsg: "Le test n'a pas été activé.",
			});
			this.deleteRow();
		} else this.activateModal.show();
	}

	protected duplicate(confirmed: boolean): void {
		if (!this.duplicateAccess)
			return Logger.dbgWarn(
				'TestsActions: duplicate: this.duplicateAccess is false or undefined',
				this
			);

		if (confirmed)
			this.post({
				params: { id: this.id },
				data: { title: this.duplicateName },
			});
		else
			this.duplicateModal.show().then((): void => {
				this.duplicateName = `${this.$t('COPIE DE')} ${this.title}`;
			});
	}

	private async created(): Promise<void> {
		this.archiveAccess = await UserUtils.instance.currentUserHasPermission(
			'customer/test/archiveconfirm'
		);
		this.duplicateAccess =
			await UserUtils.instance.currentUserHasPermission(
				'customer/test/duplicate'
			);
		this.editionAccess = await routeIsEnabled(
			{ name: 'test edition' },
			undefined,
			'tests/create'
		);
		this.resultsAccess = await routeIsEnabled(
			{ name: 'results' },
			undefined,
			'result/list'
		);
	}
}
</script>
