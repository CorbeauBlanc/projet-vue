<template>
	<div class="home" id="test-bidon">
		<!-- <p v-if="bidon.foo['test']">TEST</p>
		<button @click="open">OPEN</button>
		<button @click="example.hide()">HIDE</button>
		<button @click="example.show()">SHOW</button>
		<button @click="close">CLOSE</button>-->
		<!-- <button @click="hide">HIDE</button>
		<button @click="show">SHOW</button>
		<button @mouseenter="show" @mouseleave="hide">HOVER</button>
		<div id="test" style="position: relative">
			Datest
			<tooltip ref="tooltip" :detached="true" class="top">
				<p>TEST</p>
			</tooltip>
		</div>-->
		<!-- <filters :inputs="input" :keys="keys" @change="filters = $event"/> -->
		<!-- <custom-table
			:data="data"
			:config="config"
			:labels="labels"
			:filters="filters"
		/> -->
		<!-- <search-engine :source="getSource" :suggestions="suggestions" @error="test"/>
		<div>void TEST void</div>-->
		<!-- <accordion ref="accordion" :level="accordionLevel" :root="true" /> -->
		<!-- <nav-sidebar :levels="accordionLevel.nextLevels" /> -->
		<!-- <radios-input :config="input" @change="test" v-model="model" /> -->
		<!-- <checkbox-group :config="chbgConfig" v-model="chbgModel" /> -->
		<!-- <color-input v-model="color" format="rgba" class="bottom right" :config="{}" /> -->
		<!-- <file-input v-model="file" :config="{multiple: true, accept: 'image/*'}" id="test"/> -->
		<!-- <slideshow-workspace /> -->
		<!-- <foo v-master:test-master="masterTest" v-master:test-master2="masterTest2" /> -->
		<!-- <google-map :markers="tmp" /> -->
		<!-- <highcharts
			:options="{
				chart: {
					type: 'spline'
				},
				title: {
					text: 'Sin chart'
				},
				series: [{
					data: [10, 0, 8, 2, 6, 4, 5, 5],
					color: '#6fcd98'
				}]
			}"
		/>-->
		<!-- <video-player /> -->
		<!-- <div style="width: 500px; background: black;">
			<range-input class="inverted" :config="rangeConfig" v-model="model" />
		</div>-->
		<!-- <div id="container">
			<div id="container2">
				<div id="test2"></div>
			</div>
		</div>-->
		<!-- <time-input
			ref="timetest"
			v-for="i in 1"
			:config="timeConfig"
			v-model="model"
			:lazy="true"
			:key="i"
		/>
		<cursor-selector min-size="50" :selectables="refs" :prop-name="'uid'" @change="test" />-->
		<!-- <scrollable
			@start:reached="start()"
			@end:reached="end()"
			@start:lost="start('lost')"
			@end:lost="end('lost')"
		>
			<time-input
				ref="timetest"
				v-for="i in 10"
				:config="timeConfig"
				v-model="model"
				:lazy="true"
				:key="i"
			/>
		</scrollable>-->
		<!-- <scroll-zone left /> -->
		<!-- <button @click="test">TEST</button> -->
		<!-- <wysiwyg-input /> -->
		<!-- <calendar :multiple-selection="true" /> -->
		<!-- <date-input v-model="model" /> -->
		<!-- <checkbox-input :config="singleInput" v-model="model" /> -->
		<!-- <slideshow :slides="slides" v-master:index="model" /> -->
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import CustomTableData from '@/components/CustomTable/CustomTableData';
import {
	CustomTableConfig,
	CustomTableDataGenericInput,
} from '@/components/CustomTable/CustomTableTypes';
import { FilterConfig } from '@/components/Filters/FiltersTypes';
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import { ContentType } from '@/types';
import { Component, Vue } from 'vue-property-decorator';

import Accordion from '@/components/Accordion/Accordion.vue';
import { AccordionLevel } from '@/components/Accordion/AccordionTypes';
import Calendar from '@/components/Calendar/Calendar.vue';
import CursorSelector from '@/components/CursorSelector/CursorSelector.vue';
import CustomDatalist from '@/components/CustomOptions/CustomDatalist.vue';
import CustomOptgroup from '@/components/CustomOptions/CustomOptgroup.vue';
import CustomOption from '@/components/CustomOptions/CustomOption.vue';
import Filters from '@/components/Filters/Filters.vue';
import Foo from '@/components/Foo.development.vue';
import GoogleMap from '@/components/GoogleMap/GoogleMap.vue';
import CheckboxGroup from '@/components/Inputs/CheckboxGroup.vue';
import ColorInput from '@/components/Inputs/ColorInput.vue';
import DateInput from '@/components/Inputs/DateInput/DateInput.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import {
	InputConfig,
	InputOption,
	InputOptionTree,
	InputType,
} from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import RangeInput from '@/components/Inputs/RangeInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import TimeInput from '@/components/Inputs/TimeInput.vue';
import WysiwygInput from '@/components/Inputs/WysiwygInput/WysiwygInput.vue';
import ExampleModal from '@/components/Modal/ExampleModal.vue';
import ScrollZone from '@/components/ScrollZone/ScrollZone.vue';
import SearchEngine from '@/components/SearchEngine/SearchEngine.vue';
import {
	SearchEngineSuggestion,
	SearchEngineSuggestionsGroup,
} from '@/components/SearchEngine/SearchEngineTypes';
import Slideshow from '@/components/Slideshow/Slideshow.vue';
import { Slide, SlideLegacy } from '@/components/Slideshow/SlideshowTypes';
import Tooltip from '@/components/Tooltip/Tooltip.vue';
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue';
import Js from '@/services/JsService';
import NavSidebar from '@/views/NavSidebar.vue';
import SlideshowWorkspace from '@/views/Results/ResultsWorkboard/ResultsReport/SlideshowEditor/SlideshowWorkspace.vue';
import axios from 'axios';

@Component({
	components: {
		CustomTable,
		Filters,
		SearchEngine,
		CustomDatalist,
		CustomOption,
		CustomOptgroup,
		Accordion,
		NavSidebar,
		Tooltip,
		RadiosInput,
		CheckboxGroup,
		ColorInput,
		FileInput,
		SlideshowWorkspace,
		Foo,
		GoogleMap,
		VideoPlayer,
		RangeInput,
		TimeInput,
		ScrollZone,
		CursorSelector,
		WysiwygInput,
		Calendar,
		DateInput,
		CheckboxInput,
		Slideshow,
	},
})
export default class Test extends Vue {
	// commit
	/* public get masterTest(): string {
		return this.masterTest_;
	}
	public set masterTest(v: string) {
		this.masterTest_ = `SET ${v}`;
	} */

	public slides: SlideLegacy[] = [
		{
			type: '2',
			title: 'Optimisations ergonomiques Web & Mobile',
			body: null,
			metadata: {
				devices: null,
			},
			html: '<div class="inside cover"> <div class="image"> <img src="/img/slide-cover.jpg" class="image"> </div> <div class="content"> <h1 class="h1">Optimisations<br>ergonomiques<br>Web & Mobile</h1> <p class="catchline">Tests utilisateurs à distance</p> <div class="customer logo"> <img src="https://storage.googleapis.com/account1-prod-storage-video-eu/element/element/company/2660/original_1608537599.png?GoogleAccessId=321201099026-mn5v8nbh0pvmi6ip16vriiejpj7iq7u0@developer.gserviceaccount.com&Expires=1609259598&Signature=staySp1vBQJhRuhb%2FMywXM7oxpD26BcMt8DdHZ0tQWITnTOeDr6FKDAhxRjwty%2FfvPy9DScukLxIHiHa%2FHAGck1rse%2FH8FL9tsorciSk6rkGMuPJv01BaWJ9yUPWFf3EgM3rsfTssRuwhDE4aBnb%2Bd3RppFN78VixHWqIZejuxI%3D" class="image medium"> </div> </div></div>',
			slide_data: {
				image1: null,
				companyLogo: {
					link: 'https://storage.googleapis.com/account1-prod-storage-video-eu/element/element/company/2660/original_1608537599.png?GoogleAccessId=321201099026-mn5v8nbh0pvmi6ip16vriiejpj7iq7u0@developer.gserviceaccount.com\u0026Expires=1609251727\u0026Signature=5ZhxKtFBiprFizfsbgQvE%2B6AfVhKGNH9%2FQat4AmaO54SVj7OXLYhpdBLqD1VD81vZSA6BPUt2iAtUQEZjbqQqy9ImQNfr0CM4asH%2B%2BA4dNCNZbC2ssi5RHlUbLgKDvxBHdKcmb4V%2BVSO%2FG2tCArSMLrYBO32bgbbsn7ZHS3tApA%3D',
				},
			},
			elements: [],
		},
		{
			type: '16',
			title: 'Une solution complète',
			body: null,
			metadata: {
				devices: null,
			},
			html: '<div class="inside solution"> <div class="content"> <h1 class="ui header">Une solution complète</h1> <p class="catchline">Pour mieux comprendre les usages de vos visiteurs et optimiser l’ergonomie de vos interfaces</p> <div class="three column grid center aligned"> <div class="column"> <img src="/img/slide-solution-01.jpg"> <p class="arg">Tests d’interfaces & de la navigation <strong>Capture Vidéo + Questionnaire</strong></p> </div> <div class="column"> <img src="/img/slide-solution-02.jpg"> <p class="arg">Large panel de testeurs<br><strong>ciblés, qualifiés et réactifs</strong></p> </div> <div class="column"> <img src="/img/slide-solution-03.jpg"> <p class="arg">Analyse experte UX et ergonomie<br>Plan de <strong>recommandations</strong></p> </div> </div> </div></div>',
			slide_data: {
				slide_type_id: 16,
			},
			elements: [],
		},
	];

	public singleInput: InputConfig = {
		label: 'Rendre la collection unique',
	};

	public masterTest2: string = 'TEST2';

	public rangeConfig: InputConfig = {
		constraints: {
			min: 0,
			max: 100,
		},
	};

	public timeConfig: InputConfig = {
		multiple: false,
		constraints: {
			step: 'any',
			min: '00:00:00.000',
		},
	};

	public tmp: google.maps.LatLngLiteral[] = [
		{ lat: 48.7698403, lng: 2.2617509 },
		{ lat: 48.8934955, lng: 2.1089728 },
		{ lat: 48.8585799, lng: 2.2847017 },
		{ lat: 47.4178159, lng: -1.6344852 },
		{ lat: 45.8454077, lng: 2.1703277 },
		{ lat: 44.7943058, lng: -0.1307797 },
		{ lat: 43.5264742, lng: 5.2579968 },
		{ lat: 46.7922672, lng: -0.9541366 },
		{ lat: 48.822241, lng: 2.4062528 },
		{ lat: 43.6931912, lng: 0.658333 },
		{ lat: 47.5340147, lng: -0.4533086 },
		{ lat: 48.9008079, lng: 2.2553567 },
		{ lat: 48.6622037, lng: 2.2448341 },
		{ lat: 45.9018461, lng: 6.8012212 },
		{ lat: 39.399872, lng: -8.224454 },
		{ lat: 44.8391346, lng: -0.6867939 },
		{ lat: 49.2442751, lng: 4.0346212 },
		{ lat: 46.1705765, lng: 0.2729377 },
		{ lat: 44.151745, lng: 0.5446912 },
		{ lat: 49.1364797, lng: 6.1371111 },
		{ lat: 43.5667679, lng: 7.1224782 },
		{ lat: 43.4574538, lng: 1.2698475 },
		{ lat: 43.6589621, lng: 1.2987349 },
		{ lat: 50.5766743, lng: 4.7707367 },
		{ lat: 43.25424, lng: 5.3819969 },
	];

	public example: ExampleModal | undefined;

	public file: any = [];

	public color: any = { r: 0, g: 0, b: 0 };

	public chbgModel: InputOptionTree = false;

	public model: any = 0;

	public input: InputConfig = {
		options: [
			{
				text: 'Bidon 1',
				value: 'bidon1',
			},
			{
				text: 'Bidon 2',
				value: 'bidon2',
			},
		],
	};

	public levels: AccordionLevel = {
		nextLevels: [
			{
				title: 'Tests',
				nextLevels: [
					{
						title: 'LVL1-a',
					},
					{
						title: 'Home',
						route: {
							name: 'home',
						},
					},
					{
						title: 'About',
						route: '/about',
					},
				],
			},
			{
				title: 'TEST2',
				class: 'bidon',
				nextLevels: [
					{
						title: 'LVL2-a',
						route: 'https://www.google.fr',
						target: '_blank',
						disabled: true,
					},
					{
						title: 'LVL2-test',
						route: {
							name: 'legacy',
						},
					},
					{
						title: 'LVL2-test',
						route: {
							name: 'phpinfo',
						},
					},
				],
			},
		],
	};

	public suggestions: SearchEngineSuggestionsGroup[] = [
		{
			title: 'test',
			suggestions: [
				{ value: 'test1' },
				{ value: 'test2' },
				{ value: 'test3' },
			],
		},
		{
			title: 'bidon',
			suggestions: ['bidon', 'BIDON'],
		},
	];

	/* public suggestions: (SearchEngineSuggestion | string)[] = [
		{
			value: 'Test',
			component: true,
			path: 'components/Test.vue',
		},
	];
 */
	public keys: string[] = ['name'];

	public inputs: FilterConfig[] = [
		/* {
			type: FilterType.TEXT,
			placeholder: 'bidon',
			label: 'select bidon',
		}, */
		{
			type: InputType.SELECT,
			placeholder: 'bidon',
			label: 'select bidon',
		},
		/* {
			type: FilterType.DATALIST,
			placeholder: 'bidon',
			label: 'select bidon',
			values: ['user0', 'user1', 'user2', 'user3', 'user4'],
		}, */
		/* {
			type: FilterType.DATE,
			placeholder: 'bidon',
			label: 'select bidon',
		}, */
	];

	public config: CustomTableConfig = {
		enableSelection: true,
		// enableInlineEdition: true,
		/* enablePagination: {
			limit: 2,
		}, */
		// enableSorting: true,
		/* restOperations: {
			get: {
				url: 'https://pokeapi.co/api/v2/pokemon',
				promiseCallback: (response: any): any => {
					return this.data;
				},
			},
		}, */
	};

	public data: any = {
		data: [
			{
				id: '123',
				name: 'user0',
				value: 'TEST',
				bidon: 'BIDON',
			},
			{
				id: '456',
				name: 'user2',
				value: 'TEST',
				bidon: 'https://github.com/microsoft/TypeScript-Vue-Starter',
			},
			{
				id: '789',
				name: 'user1',
				value: 'TEST',
				bidon: 'BIDON VIDE',
			},
			{
				id: 'ui',
				name: 'user2',
				value: 'TEST',
				bidon: {
					value: 'Test',
					type: ContentType.COMPONENT,
					path: 'components/Test.vue',
				},
			},
			{
				id: 'aui',
				name: 'user3',
				value: 'TEST',
				bidon: {
					value: '',
					type: ContentType.TABLE,
					componentData: [
						['1', '2', '3'],
						['4', '5', '6'],
						['7', '8', '9'],
					],
					tableConfig: {
						parseData: true,
					},
				},
			},
			{
				id: 'nr',
				name: 'user4',
				value: 'TEST',
				bidon: [
					{ 1: '1', 2: '2', 3: '3' },
					{ 4: '4', 5: '5', 6: '6' },
					{ 7: '7', 8: '8', 9: '9' },
				],
			},
		],
		keys: ['bidon', 'name'],
		trackBy: 'id',
	};

	public filters: any = {};
	public labels: string[] = ['Nom', 'Url'];

	public bidon: any = {
		foo: {
			test: false,
		},
	};

	protected refs: Vue[] = [];
	// private masterTest_: string = 'TEST';

	public start(ev?: string): void {
		console.log(`START ${ev}`);
	}

	public end(ev?: string): void {
		console.log(`END ${ev}`);
	}
	/*
	public close() {
		if (!this.example) return;
		this.example.close();
	}

	public open() {
		if (!this.example || this.example.isClosed) {
			this.example = new ExampleModal();
			this.example.open();
		}
	}

	public hide() {
		(this.$refs['tooltip'] as Tooltip).hide();
	}

	public show() {
		(this.$refs['tooltip'] as Tooltip).show();
	} */

	protected test(ev: any): void {
		// console.log('LOG', ev);
	}

	private mounted(): void {
		this.refs = this.$refs['timetest'] as Vue[];
		/* const test: IntersectionObserver = new IntersectionObserver(
			() => {
				console.log('TEST');
			},
			{
				root: document.querySelector('#container'),
			}
		);
		test.observe(document.querySelector('#test2') as any); */
	}

	private getSource(): Element {
		return this.$el;
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#test-bidon {
	&.home {
		width: 100%;
		height: 100%;
		//display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		position: relative;
		overflow: auto;
	}

	.scrollable {
		height: 200px;
	}

	.search-result {
		background: yellow;
	}

	#test {
		width: 500px;
	}

	#container {
		width: 50vw;
		height: 50px;
		overflow: auto;
		border: 1px solid;
	}

	#container2 {
		position: relative;
		width: 90%;
		height: 100%;
		min-width: 50vh;
	}

	#test2 {
		width: 0px;
		height: 100%;
		background: red;
		position: absolute;
		right: 0;
	}
}
</style>
