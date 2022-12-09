<template>
	<div id="results-graph-detail">
		<div class="container fluid">
			<div class="heading secondary">
				<h3 class="title">
					<router-link :to="{ name: 'result charts' }">
						<icon long arrow left />Liste des graphiques </router-link
					>- Graphique
					<span class="counter">1/3</span>
				</h3>
				<div>
					<button class="button icon ghost">
						<icon chevron left />
					</button>
					<button class="button icon ghost">
						<icon chevron right />
					</button>
				</div>
			</div>
		</div>
		<div class="container fluid">
			<div class="heading secondary">
				<select-input :config="testInput" v-model="selectedTest" />
			</div>
		</div>
		<div class="container fluid">
			<results-graph />
		</div>
		<div class="container fluid">
			<div class="heading secondary">
				<div class="title">Verbatims (1)</div>
				<div>
					<checkbox-input
						class="inline"
						:config="hideEmptyCheckbox"
					/>
					<text-input class="inline" :config="searchInput" />
					<button
						:class="[
							'button ghost filter',
							showFilters ? 'active' : '',
						]"
						@click="showFilters = !showFilters"
					>
						<icon filter />Filtrer
					</button>
				</div>
			</div>
		</div>
		<div v-if="showFilters">
			<div class="container fluid">
				<filters
					id="advanced-filters"
					class="four columns stackable grid"
					:inputs="filters"
					:lazy="true"
				/>
			</div>
		</div>
		<div class="container fluid">
			<div class="listing grid stackable">
				<div
					class="three wide column"
					v-for="verbatim in verbatimsList"
					:key="`${verbatim.id}`"
				>
					<verbatim
						:data="verbatim"
						:select-enabled="selectEnabled"
						:select-model="selectModel"
					/>
				</div>
			</div>
		</div>
		<div class="footer">
			<div>
				<button
					:class="[
						'button',
						selectEnabled ? 'green' : 'primary ghost',
						selectEnabled &&
						selectModel.selectedVerbatims.length < 1
							? 'disabled'
							: '',
					]"
					@click="handleSelectionMode"
				>
					<icon tags />
					{{
						`Associer ${
							selectEnabled
								? selectModel.selectedVerbatims.length
								: 'plusieurs'
						} sources à un constat`
					}}
				</button>
				<button
					v-if="selectEnabled"
					class="button"
					@click="cancelSelection"
				>
					Annuler
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import {
	InputConfig,
	InputOption,
	InputType,
} from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import Sidebars from '@/services/SidebarsService';
import ResultsGraph from '@/views/Results/ResultsWorkboard/ResultsGraphs/ResultsGraphs.vue';
import Verbatim from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsTasksList/Verbatim.vue';
import {
	VerbatimData,
	VerbatimSelection,
} from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		SelectInput,
		ResultsGraph,
		Verbatim,
		CheckboxInput,
		TextInput,
	},
})
export default class ResultsGraphDetail extends Vue {
	protected showFilters: boolean = false;
	protected selectedTest: string = '';
	protected selectEnabled: boolean = false;
	protected selectModel: VerbatimSelection = { selectedVerbatims: [] };
	protected hideEmptyCheckbox: InputConfig = {
		label: 'Masquer les réponses vides',
	};
	protected testInput: InputConfig = {
		options: [
			{
				text: 'Tous les tests',
				value: '',
			},
			{
				text: 'Test 1',
				value: '1',
			},
			{
				text: 'Test 2',
				value: '2',
			},
		],
	};

	protected filters: FilterConfig[] = [
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Type',
			class: 'column',
			options: [
				{ text: 'Agrégat', value: 'Agrégat' },
				{ text: 'Simple', value: 'Par défaut' },
				{ text: 'Comparaison', value: '3' },
			],
			key: 'type',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Support',
			class: 'column',
			options: [
				{ text: 'Smartphone', value: 'mobile' },
				{ text: 'Tablette', value: 'mobile' },
				{ text: 'Ordinateur', value: 'desktop' },
			],
			key: 'tests_support',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Société associée',
			class: 'column',
			options: [
				{ text: 'AccordHotel', value: '1' },
				{ text: 'ACMIS', value: '2' },
				{ text: 'ACS', value: '3' },
				{ text: 'Adagios', value: '4' },
			],
			key: 'company',
		},
		{
			type: InputType.DATALIST,
			placeholder: 'Rechercher',
			label: 'Statut',
			class: 'column',
			options: [
				{ text: 'En cours', value: 'En cours' },
				{ text: 'Terminé', value: 'Terminé' },
				{ text: 'Abandonné', value: 'Abandonné' },
			],
			key: 'status',
		},
	];

	protected searchInput: InputConfig = {
		placeholder: 'Rechercher par mot clé...',
		multiple: false,
		search: true,
	};

	protected verbatimsList: VerbatimData[] = [
		{
			id: '420',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			answer: 'bidon',
		},
		{
			id: '421',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
		},
		{
			id: '422',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			answer: 'bidon',
		},
		{
			id: '423',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			answer: 'bidon',
		},
		{
			id: '424',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
		},
	];

	protected handleSelectionMode(): void {
		if (!this.selectEnabled) this.selectEnabled = true;
		else if (this.selectModel.selectedVerbatims.length)
			Sidebars.results.openSidebar();
	}

	protected cancelSelection(): void {
		this.selectEnabled = false;
		this.selectModel.selectedVerbatims = [];
	}
}
</script>

<style lang="scss" scoped>
// #results-graph-detail {}
</style>
