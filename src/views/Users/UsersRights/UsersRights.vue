<template>
	<div class="container">
		<div class="segments">
			<div class="segment" style="z-index: 1">
				<div class="stackable grid">
					<div class="column four">
						Liste des droits :
						<select-input
							class="inline"
							:config="rightsListConfig"
							v-model="rightsPreset"
							@change="selectPreset"
						/>
					</div>
				</div>
			</div>
			<div class="segment">
				<div class="stackable grid">
					<checkbox-group
						class="column wide five root"
						:config="testsGroupConfig"
						v-model="testsGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="resultsGroupConfig"
						v-model="resultsGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="panelGroupConfig"
						v-model="panelGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="kpiGroupConfig"
						v-model="kpiGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="accountGroupConfig"
						v-model="accountGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="monitoringGroupConfig"
						v-model="monitoringGroupValues"
					/>
					<checkbox-group
						class="column wide five root"
						:config="helpGroupConfig"
						v-model="helpGroupValues"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxGroup from '@/components/Inputs/CheckboxGroup.vue';
import {
	InputConfig,
	InputOption,
	InputOptionTree,
} from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		SelectInput,
		CheckboxGroup,
	},
})
export default class UsersRights extends Vue {
	/*
	protected rightsListConfig: InputConfig = {
		options: [
			{
				text: 'Testapic Admin',
				value: 't_admin',
			},
			{
				text: 'Testapic Editeur',
				value: 't_editor',
			},
			{
				text: 'Agence Editeur',
				value: 'a_editor',
			},
			{
				text: 'Client Editeur',
				value: 'c_editor',
			},
			{
				text: 'Consultation',
				value: 'consult',
			},
			{
				text: 'Custom',
				value: 'custom',
			},
			{
				text: 'Aucun',
				value: 'none',
			},
		],
	};

	protected testsGroupConfig: InputOption = {
		text: 'Tests',
		value: 'tests',
		next: [
			{
				text: 'Liste',
				value: 'list',
			},
			{
				text: 'Créer',
				value: 'create',
			},
			{
				text: 'Informations',
				value: 'infos',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},

					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Consignes',
				value: 'instructions',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},

					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Ciblage',
				value: 'segmentation',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},

					{
						text: 'Éditer',
						value: 'write',
					},

					{
						text: 'Charge Test',
						value: 'loadTest',
					},
				],
			},
			{
				text: 'Campagnes',
				value: 'campaigns',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},

					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Télécharger',
				value: 'downloads',
				next: [
					{
						text: 'Vidéo',
						value: 'video',
					},
				],
			},
		],
	};
	protected resultsGroupConfig: InputOption = {
		text: 'Résultats',
		value: 'results',
		next: [
			{
				text: 'Liste',
				value: 'list',
			},
			{
				text: 'Créer',
				value: 'create',
			},
			{
				text: 'Participants',
				value: 'contributor',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Video',
				value: 'video',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
					{
						text: 'Speech to text',
						value: 'speechToText',
					},
				],
			},
			{
				text: 'Graphiques',
				value: 'graphs',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Verbatims',
				value: 'verbatims',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Constats / Recos',
				value: 'analysis',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Compte-rendu',
				value: 'report',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
		],
	};
	protected panelGroupConfig: InputOption = {
		text: 'Panel',
		value: 'panel',
		next: [
			{
				text: 'DPO',
				value: 'dpo',
				next: [
					{
						text: 'Authentifier',
						value: 'authenticate',
					},
				],
			},
			{
				text: 'Testeurs',
				value: 'testers',
				next: [
					{
						text: 'Liste',
						value: 'list',
					},
					{
						text: 'Créer',
						value: 'create',
					},
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
					{
						text: 'Archiver',
						value: 'archive',
					},
					{
						text: 'Inviter',
						value: 'invite',
					},
					{
						text: 'Importer',
						value: 'import',
					},
					{
						text: 'Recruter',
						value: 'recruit',
					},
				],
			},
			{
				text: 'Affectations',
				value: 'affects',
				next: [
					{
						text: 'Liste',
						value: 'list',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
				],
			},
			{
				text: 'Spécificités',
				value: 'specs',
				next: [
					{
						text: 'Critères',
						value: 'criterias',
						next: [
							{
								text: 'Liste',
								value: 'list',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
					{
						text: 'Groupes',
						value: 'groups',
						next: [
							{
								text: 'Lister',
								value: 'list',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
					{
						text: 'Pages',
						value: 'pages',
						next: [
							{
								text: 'Lister',
								value: 'list',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
				],
			},
			{
				text: 'Gains',
				value: 'gains',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Payer',
						value: 'pay',
					},
					{
						text: "Télécharger l'historique",
						value: 'downloadHistory',
					},
				],
			},
		],
	};
	protected kpiGroupConfig: InputOption = {
		text: 'KPI',
		value: 'kpi',
		next: [
			{
				text: 'Testeurs',
				value: 'testers',
			},
			{
				text: 'Sollicitations',
				value: 'queries',
			},
			{
				text: 'Activité',
				value: 'activity',
			},
			{
				text: 'Gains',
				value: 'gains',
			},
		],
	};
	protected accountGroupConfig: InputOption = {
		text: 'Mon compte',
		value: 'account',
		next: [
			{
				text: 'Paramètres',
				value: 'settings',
				next: [
					{
						text: 'Informations',
						value: 'infos',
						next: [
							{
								text: 'Voir',
								value: 'read',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
					{
						text: 'Droits',
						value: 'rights',
						next: [
							{
								text: 'Voir',
								value: 'read',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
				],
			},
			{
				text: 'Mon espace testeur',
				value: 'testerSection',
			},
			{
				text: 'Sociétés',
				value: 'companies',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Voir toutes les sociétés',
						value: 'readAll',
					},
					{
						text: 'Créer',
						value: 'create',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
					{
						text: 'Archiver',
						value: 'archive',
					},
					{
						text: 'Offres',
						value: 'offers',
						next: [
							{
								text: 'Voir',
								value: 'read',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
				],
			},
			{
				text: 'Utilisateurs',
				value: 'users',
				next: [
					{
						text: 'Voir',
						value: 'read',
					},
					{
						text: 'Créer',
						value: 'create',
					},
					{
						text: 'Éditer',
						value: 'write',
					},
					{
						text: 'Archiver',
						value: 'archive',
					},
					{
						text: 'Inviter',
						value: 'invite',
					},
					{
						text: 'Authentifier',
						value: 'authenticate',
					},
					{
						text: 'Droits',
						value: 'rights',
						next: [
							{
								text: 'Voir',
								value: 'read',
							},
							{
								text: 'Éditer',
								value: 'write',
							},
						],
					},
				],
			},
		],
	};
	protected monitoringGroupConfig: InputOption = {
		text: 'Monitoring',
		value: 'monitoring',
		next: [
			{
				text: 'Ciblage',
				value: 'segmentation',
			},
			{
				text: 'Campaign',
				value: 'campaign',
			},
			{
				text: 'Precalc',
				value: 'precalc',
			},
			{
				text: 'Vidéo',
				value: 'video',
			},
		],
	};
	protected helpGroupConfig: InputOption = {
		text: 'Aide en ligne',
		value: 'help',
		next: [
			{
				text: 'Voir',
				value: 'read',
			},
		],
	};

	protected rightsPreset: InputOption[] = [];

	protected testsGroupValues: InputOptionTree = false;
	protected resultsGroupValues: InputOptionTree = false;
	protected panelGroupValues: InputOptionTree = false;
	protected kpiGroupValues: InputOptionTree = false;
	protected accountGroupValues: InputOptionTree = false;
	protected monitoringGroupValues: InputOptionTree = false;
	protected helpGroupValues: InputOptionTree = false;

	protected testsGroupPreset: Map<string, InputOptionTree> = new Map([
		[
			't_admin',
			{
				list: true,
				create: true,
				infos: true,
				instructions: true,
				segmentation: { read: true, write: true, loadTest: false },
				campaigns: true,
				downloads: true,
			},
		],
		[
			't_editor',
			{
				list: true,
				create: true,
				infos: true,
				instructions: true,
				segmentation: { read: true, write: true, loadTest: false },
				campaigns: true,
				downloads: true,
			},
		],
		[
			'a_editor',
			{
				list: true,
				create: true,
				infos: true,
				instructions: true,
				segmentation: false,
				campaigns: false,
				downloads: true,
			},
		],
		[
			'c_editor',
			{
				list: true,
				create: true,
				infos: true,
				instructions: true,
				segmentation: false,
				campaigns: false,
				downloads: true,
			},
		],
		[
			'consult',
			{
				list: true,
				create: false,
				infos: { read: true, write: false },
				instructions: { read: true, write: false },
				segmentation: false,
				campaigns: false,
				downloads: true,
			},
		],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected resultsGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', true as InputOptionTree],
		['a_editor', true as InputOptionTree],
		['c_editor', true as InputOptionTree],
		[
			'consult',
			{
				list: true,
				create: false,
				contributor: { read: true, write: false },
				video: { read: true, speechToText: true },
				graphs: { read: true, write: false },
				verbatims: { read: true, write: false },
				analysis: { read: true, write: false },
				report: { read: true, write: false },
			},
		],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected panelGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		[
			't_editor',
			{
				dpo: false,
				testers: {
					list: true,
					create: true,
					read: true,
					write: true,
					archive: false,
					invite: true,
					import: true,
					recruit: true,
				},
				affects: true,
				specs: {
					criterias: { list: true, write: false },
					groups: { list: true, write: false },
					pages: { list: true, write: false },
				},
				gains: false,
			},
		],
		['a_editor', false as InputOptionTree],
		['c_editor', false as InputOptionTree],
		['consult', false as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected kpiGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', false as InputOptionTree],
		['a_editor', false as InputOptionTree],
		['c_editor', false as InputOptionTree],
		['consult', false as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected accountGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', false as InputOptionTree],
		['a_editor', false as InputOptionTree],
		['c_editor', false as InputOptionTree],
		['consult', false as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected monitoringGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', true as InputOptionTree],
		['a_editor', false as InputOptionTree],
		['c_editor', false as InputOptionTree],
		['consult', false as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);
	protected helpGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', true as InputOptionTree],
		['a_editor', true as InputOptionTree],
		['c_editor', true as InputOptionTree],
		['consult', true as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]);

	protected selectPreset(): void {
		this.testsGroupValues = this.presetFinalValue(
			this.testsGroupPreset.get(this.rightsPreset[0].value)
		);
		this.resultsGroupValues = this.presetFinalValue(
			this.resultsGroupPreset.get(this.rightsPreset[0].value)
		);
		this.panelGroupValues = this.presetFinalValue(
			this.panelGroupPreset.get(this.rightsPreset[0].value)
		);
		this.kpiGroupValues = this.presetFinalValue(
			this.kpiGroupPreset.get(this.rightsPreset[0].value)
		);
		this.accountGroupValues = this.presetFinalValue(
			this.accountGroupPreset.get(this.rightsPreset[0].value)
		);
		this.monitoringGroupValues = this.presetFinalValue(
			this.monitoringGroupPreset.get(this.rightsPreset[0].value)
		);
		this.helpGroupValues = this.presetFinalValue(
			this.helpGroupPreset.get(this.rightsPreset[0].value)
		);
	}

	private presetFinalValue(preset?: InputOptionTree): InputOptionTree {
		return preset ? preset : false;
	}
	*/
}
/*
protected kpiGroupPreset: Map<string, InputOptionTree> = new Map([
		['t_admin', true as InputOptionTree],
		['t_editor', false as InputOptionTree],
		['a_editor', false as InputOptionTree],
		['c_editor', false as InputOptionTree],
		['consult', false as InputOptionTree],
		['custom', true as InputOptionTree],
		['none', false as InputOptionTree],
	]); */
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.root {
	.field {
		padding-top: math.div($padding, 4);
		padding-bottom: math.div($padding, 4);
	}

	&>.checkbox-input {
		border-bottom: $border-width solid $border-color;
		margin-bottom: math.div($padding, 2);
	}

	&>.checkbox-group .checkbox-group {
		border-left: 2px solid $primary-color;
		margin-left: 1.4rem;
	}
}
</style>
