<template lang="pug">
include /src/mixins

#tests-management.view
	flash-message.sticky.top(name='testsManagement')
	activate-modal(
		ref='activateModal',
		:id='currentTest.id',
		:title='currentTest.title',
		@activate='activateTest(true)'
	)
	archive-test-modal(
		ref='archiveModal',
		:id='currentTest.id',
		:title='currentTest.title',
		@archive='archiveTest(true)'
	)
	+view-heading
		.h2.title
			router-link(:to='testsRoute', :class='{ disabled: testsRoute === "" }')
				icon(long, arrow, left)
				| {{ $t("Tests") }}
			span.separator
				icon(chevron, right)
			template(v-if='mode === "create"')
				| {{ $t("Créer un test") }}
			template(v-else-if='currentTest')
				| {{ currentTest.title }}
				span.id
					| {{ currentTest.id }}
				i#device.icon(:class='deviceIcon')
				i#product.icon(:class='productIcon')
				span(:class='TestState.getStateClass(currentTest.testState.id)')
					| {{ $t(currentTest.testState.value) }}

	#view-content.with-footer
		.loading(v-if='loading')
			.loader
		.tabs.navigation.secondary
			.menu
				tab(name='infos', v-master='currentTab')
					icon(info, circle)
					span {{ $t("Informations") }}

				router-link.tab.item(
					:class='{ disabled: mode === "create" || !tasksAccess }',
					:to='tasksRoute'
				)
					icon(tasks)
					span {{ $t("Consignes") }}

				router-link.tab.item(
					:class='{ disabled: mode === "create" || currentTest.taskCount < 1 || !segmentationAccess }',
					:to='segmentationRoute'
				)
					icon(segmentation)
					span {{ $t("Ciblage") }}
				router-link.tab.item(
					:class='{ disabled: mode === "create" || currentTest.taskCount < 1 || !currentTest.segmentationDone || !campaignAccess }',
					:to='campaignRoute'
				)
					icon(campaign)
					span {{ $t("Campagnes") }}

				// tab(
				// 	name="tasks"
				// 	:disabled="mode === 'create'"
				// 	v-master="currentTab"
				// )
				// 	icon(tasks)
				// 	| {{ $t('Consignes') }}
				// tab(
				// 	name="segmentation"
				// 	v-master="currentTab"
				// 	:disabled="mode === 'create' || currentTest.taskCount < 1"
				// )
				// 	icon(segmentation)
				// 	| {{ $t('Ciblage') }}
				// tab(
				// 	name="campaign"
				// 	v-master="currentTab"
				// 	:disabled="mode === 'create' || !currentTest.segmentationDone"
				// )
				// 	icon(campaign)
				// 	| {{ $t('Campagnes') }}
		keep-alive
			router-view(:ref='currentTab')
		// test-infos(ref="infos")
		// <test-tasks-list />
		// segmentation
		// <campaign />

		.footer
			div
				button.button(v-if='infosEditAccess', @click='save') {{ $t("Enregistrer") }}
				span.button.disabled(v-else) {{ $t("Enregistrer") }}
				template(v-if='mode === "edit"')
					button.button.ghost.red(
						v-if='testState !== TestState.archived && archiveAccess',
						@click='archiveTest(false)'
					)
						| {{ $t("Archiver") }}
					button.button.ghost.green(
						v-else-if='archiveAccess',
						@click='activateTest(false)'
					)
						| {{ $t("Activer") }}
					router-link.button.ghost(
						v-if='currentTab === "infos"',
						:class='{ disabled: mode === "create" || !tasksAccess }',
						:to='tasksRoute'
					) {{ $t("Passer aux consignes") }}
</template>

<script lang="ts">
import { InputOptionTree } from '@/components/Inputs/InputsTypes';
import Tab from '@/components/Tab/Tab.vue';
import TabbedView from '@/components/TabbedView/TabbedView';
import { routeIsEnabled } from '@/router';
import AxiosUtils from '@/services/AxiosUtils';
import ComponentsUtils from '@/services/ComponentsUtils';
import FlashMessages from '@/services/FlashMessagesService';
import Languages from '@/services/LanguagesService';
import Logger from '@/services/LoggerService';
import UserUtils from '@/services/UserUtils';
import ActivateModal from '@/views/Tests/Management/ActivateModal.vue';
import ArchiveTestModal from '@/views/Tests/Management/ArchiveTestModal.vue';
import { TestInfosFields } from '@/views/Tests/Management/TestInfos/TestInfosTypes';
import { testsUrl } from '@/views/Tests/TestsConfig';
import { DefaultTest, TestState } from '@/views/Tests/TestsTypes';
import Axios, { AxiosError, AxiosResponse } from 'axios';
import { Component, Prop, Ref } from 'vue-property-decorator';
import { Dictionary, Location, RawLocation } from 'vue-router/types/router';
import Campaign from './Campaign/Campaign.vue';
import Targeting from './Targeting/Targeting.vue';
import TestInfos from './TestInfos/TestInfos.vue';
import TestTasksList from './TestTasksList/TestTasksList.vue';

type TestsTabs = 'infos' | 'tasks' | 'segmentation' | 'campaign';

@Component({
	components: {
		Tab,
		TestInfos,
		TestTasksList,
		Targeting,
		Campaign,
		ArchiveTestModal,
		ActivateModal,
	},
	metaInfo: {
		title: `${Languages.t('Créer un test').toString()}`,
	},
})
export default class TestsManagement extends TabbedView<TestsTabs> {
	@Prop() protected readonly mode!: 'create' | 'edit';

	@Ref() protected infos!: TestInfos;
	@Ref() protected tasks!: TestTasksList;
	@Ref() protected readonly archiveModal!: ArchiveTestModal;
	@Ref() protected readonly activateModal!: ActivateModal;
	protected readonly TestState: typeof TestState = TestState;

	protected currentTest: DefaultTest | false = false;
	protected loading: boolean = false;

	protected readonly defaultTab: TestsTabs = 'infos';
	protected readonly viewTabs: Map<
		TestsTabs,
		RawLocation | (() => RawLocation)
	> = new Map<TestsTabs, RawLocation | (() => RawLocation)>([
		['infos', (): string => `test ${this.mode} infos`],
		/* ['tasks', 'test tasks list'],
		['segmentation', 'test infos'],
		['campaign', 'test infos'], */
	]);

	protected infosEditAccess: boolean = false;
	protected archiveAccess: boolean = false;
	protected tasksAccess: boolean = false;
	protected segmentationAccess: boolean = false;
	protected campaignAccess: boolean = false;

	protected testsRoute: Location | '' = { name: 'tests' };

	protected get tasksRoute(): Location | '' {
		if (!this.currentTest || !this.tasksAccess) return '';
		return {
			name: 'test edition tasks',
			params: { idtest: `${this.currentTest.id}` },
		};
	}

	protected get segmentationRoute(): Location | '' {
		if (!this.currentTest || !this.segmentationAccess) return '';
		return {
			name: 'test edition segmentation',
			params: { idtest: `${this.currentTest.id}` },
		};
	}

	protected get campaignRoute(): Location | '' {
		if (!this.currentTest || !this.campaignAccess) return '';
		return {
			name: 'test edition campaign',
			params: { idtest: `${this.currentTest.id}` },
		};
	}

	protected get tmpTasksUrl(): string {
		return `/:locale?/customer/test/task/list/idtest/${
			this.currentTest ? this.currentTest.id : ''
		}`;
	}

	protected get tmpSegmentationUrl(): string {
		return `/:locale?/customer/test/segmentation/edit/idtest/${
			this.currentTest ? this.currentTest.id : ''
		}`;
	}

	protected get tmpCampaignUrl(): string {
		return `/:locale?/customer/test/campaign/edit/idtest/${
			this.currentTest ? this.currentTest.id : ''
		}`;
	}

	protected get deviceIcon(): string {
		return this.currentTest ? this.currentTest?.device.icon || '' : '';
	}
	protected get productIcon(): string {
		return this.currentTest ? this.currentTest?.product.icon || '' : '';
	}

	protected get testState(): number {
		return this.currentTest ? this.currentTest?.testState.id || -1 : -1;
	}

	protected async createTest(): Promise<void> {
		try {
			this.loading = true;
			const requestResponse: AxiosResponse<DefaultTest> =
				await this.infos.sendForm('post', 'create');
			if (this.infos.redirectionSelected()) {
				this.infos.setId(requestResponse.data.id);
				await this.infos.sendForm('post', 'redirect create');
			}
			this.loading = false;
			FlashMessages.success(
				'testsManagement',
				this.$t('Le test a bien été créé.').toString()
			);
			this.$router.push({
				name: 'test edition',
				params: { id: requestResponse.data.id.toString() },
			});
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog('Cannot create test:', error);
		}
	}

	protected async editTest(): Promise<void> {
		if (!this.currentTest)
			return Logger.dbgWarn(
				'TestsManagement: editTest: this.currentTest is false',
				this
			);

		try {
			this.loading = true;
			await this.infos.sendForm('put', 'edit');
			if (this.infos.redirectionSelected()) {
				if (this.currentTest.redirection)
					await this.infos.sendForm('put', 'redirect edit');
				else await this.infos.sendForm('post', 'redirect create');
			} else if (this.currentTest.redirection?.enable) {
				await this.infos.sendForm('delete', 'redirect edit');
				this.currentTest.redirection = null;
			}
			this.loading = false;
			this.retrieveCurrentTest().then(
				(value: AxiosResponse<DefaultTest>): void => {
					this.currentTest = value.data;
				}
			);
			FlashMessages.success(
				'testsManagement',
				this.$t('Le test a bien été sauvegardé.').toString()
			);
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog('Cannot edit test:', error);
		}
	}

	protected async activateTest(confirmed: boolean): Promise<void> {
		if (!this.currentTest)
			return Logger.dbgWarn(
				'TestsManagement: activateTest: this.currentTest is false',
				this
			);
		if (!confirmed) return this.activateModal.show();

		try {
			this.loading = true;
			await this.infos.sendForm('put', 'activate');

			const value: AxiosResponse<DefaultTest> =
				await this.retrieveCurrentTest();
			this.currentTest = value.data;
			if (this.currentTab === 'infos') this.updateForm();
			this.loading = false;
			FlashMessages.success(
				'testsManagement',
				this.$t('Le test a bien été activé.').toString()
			);
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog(
				`Cannot activate test ${this.currentTest.id}:`,
				error
			);
		}
	}

	protected async archiveTest(confirmed: boolean): Promise<void> {
		if (!this.currentTest)
			return Logger.dbgWarn(
				'TestsManagement: archiveTest: this.currentTest is false',
				this
			);
		if (!confirmed) return this.archiveModal.show();

		try {
			this.loading = true;
			await this.infos.sendForm('put', 'archive');

			const value: AxiosResponse<DefaultTest> =
				await this.retrieveCurrentTest();
			this.currentTest = value.data;
			if (this.currentTab === 'infos') this.updateForm();
			this.loading = false;
			FlashMessages.success(
				'testsManagement',
				this.$t('Le test a bien été archivé.').toString()
			);
		} catch (error) {
			this.loading = false;
			AxiosUtils.defaultErrorLog(
				`Cannot archive test ${this.currentTest.id}:`,
				error
			);
		}
	}

	protected save(): void {
		if (this.infos.checkFieldsValidity()) {
			if (this.mode === 'create') this.createTest();
			else this.editTest();
		} else
			FlashMessages.error(
				'testsManagement',
				this.$t(
					'Erreur dans le formulaire. Merci de vérifier les données renseignées.'
				).toString()
			);
	}

	protected onTabChange(newVal: TestsTabs): void {
		if (newVal !== this.currentTab) FlashMessages.hide('testsManagement');
	}

	protected onRouteChange(): void {
		this.updateCurrentTab();
		if (this.currentTab === 'infos')
			this.$nextTick().then((): void => this.initializeInfos());
	}

	private updateForm(): void {
		if (!this.currentTest) {
			this.infos.resetFieldsValues();
			this.infos.resetTranslations();
			this.infos.setTestState(TestState.inPreparation);
			ComponentsUtils.setTitle(
				this,
				`${this.$t('Créer un test').toString()}`
			);
		} else {
			const trsKeys: string[] = Object.keys(this.currentTest.userInfo);
			const values: TestInfosFields = {
				title: this.currentTest.title,
				quota: this.currentTest.expectedTesters,
				product: this.currentTest.product.id.toString(),
				device: this.currentTest.device.id.toString(),
				customer: {
					text: this.currentTest.customer.name,
					value: this.currentTest.customer.id.toString(),
				},
				createdBy: {
					text: `${this.currentTest.createdBy.firstName} ${this.currentTest.createdBy.lastName}`,
					value: `${this.currentTest.createdBy.id}`,
				},
				price: this.currentTest.price,
				storyline: {},
				testerTitle: {},
				links: this.currentTest.redirection?.enable ? true : false,
				linkFinish: this.currentTest.redirection?.finish,
				linkFilter: this.currentTest.redirection?.filter,
				linkQuota: this.currentTest.redirection?.quota,
			};
			if (this.currentTest.os !== null && this.currentTest.os.length) {
				values.os = {};
				this.currentTest.os.forEach((os: { id: number }): void => {
					(values.os as Dictionary<InputOptionTree>)[os.id] = true;
				});
			} else values.os = true;
			trsKeys.forEach((trs: string): void => {
				values.storyline[trs] = (
					this.currentTest as DefaultTest
				).userInfo[trs].scenario;
				values.testerTitle[trs] = (
					this.currentTest as DefaultTest
				).userInfo[trs].usertitle;
			});
			this.infos.setTranslationTabs(trsKeys);
			this.infos.translation = trsKeys[0];
			this.infos.setFieldsValues(values);
			if (this.currentTest.redirection)
				this.infos.setRedirectionId(this.currentTest.redirection.id);
			this.infos.setTestState(this.currentTest.testState.id);
			this.infos.setPreviousState(this.currentTest.previousState);

			ComponentsUtils.setTitle(this, this.currentTest.title);
		}
	}

	private retrieveCurrentTest(): Promise<AxiosResponse<DefaultTest>> {
		return Axios.get(
			`${testsUrl}/${this.$route.params['id'] || ''}`,
			AxiosUtils.defaultConfig
		);
	}

	private initializeInfos(): void {
		if (this.mode === 'edit') {
			const id: string = this.$route.params['id'] || '';

			if (this.currentTab === 'infos') this.infos.setId(id);
			this.loading = true;

			this.retrieveCurrentTest()
				.then((value: AxiosResponse<DefaultTest>): void => {
					this.loading = false;
					this.currentTest = value.data;
					if (this.currentTab === 'infos') this.updateForm();
				})
				.catch((error: AxiosError): void => {
					this.loading = false;
					AxiosUtils.defaultErrorCatch(
						error,
						'TestsManagement: initializeInfos'
					);
				});
		} else {
			this.currentTest = false;
			if (this.currentTab === 'infos') {
				this.updateForm();
			}
		}
	}

	private async created(): Promise<void> {
		if (
			this.testsRoute !== '' &&
			!(await routeIsEnabled(
				this.testsRoute,
				undefined,
				'tests/create/list'
			))
		)
			this.testsRoute = '';
		this.infosEditAccess =
			await UserUtils.instance.currentUserHasPermission(
				'tests/create/info/edit'
			);
		this.archiveAccess = await UserUtils.instance.currentUserHasPermission(
			'customer/test/archiveconfirm'
		);
		this.tasksAccess = await UserUtils.instance.currentUserHasPermission(
			'customer/test/task/list'
		);
		this.segmentationAccess =
			await UserUtils.instance.currentUserHasPermission(
				'customer/test/segmentation'
			);
		this.campaignAccess = await UserUtils.instance.currentUserHasPermission(
			'tests/campaign/see'
		);

		this.$gtag.pageview({ page_path: `${this.$route.path}` });
	}

	private mounted(): void {
		this.updateCurrentTab();
		this.initializeInfos();
	}
}
</script>

<style lang="scss" scoped>

#tests-management {
	position: relative;

	.heading .h2.title {
		align-items: center;

		#device, #product {
			font-size: 1.3rem;
		}

		> a {
			white-space: nowrap;
		}
	}

	a.tab.item.disabled {
		pointer-events: none;
	}
}
</style>
