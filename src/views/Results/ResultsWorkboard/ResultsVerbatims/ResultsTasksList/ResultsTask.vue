<template>
	<div class="result-task standalone" v-if="standalone">
		<div class="index-indicator">
			<span class="badge grey small"
				>{{ data.index + 1 }} / {{ data.total }}</span
			>
		</div>
		<div class="instruction">
			<span>
				Avez-vous prévu de faire ou de faire faire des travaux
				d'embellissement dans votre logement dans les 12 prochains mois
				? aumietaunsretéapetauinrtelad lnaur euar etude aulnde auldne
				laudnre uades taunsretaune aunde .tuldetluirs uldes taulnes
				taurse tandures and eaulidetsépidsr
				taueidnsraudlsraedltnsrauinrseteqaéusriet set alnrs etldsriet
				anudsri vtnaurs end vetnarsuihget aulndirse talnrudis ealnuris
			</span>
		</div>
	</div>
	<div class="result-task" v-else>
		<cursor-selector
			min-size="50"
			prop-name="id"
			v-if="selectEnabled"
			v-model="selectModel.selectedVerbatims"
			:selectables="verbatims"
		/>
		<fold-header class="segment title" v-model="active">
			<div class="index-indicator">
				<span class="badge grey small"
					>{{ data.index + 1 }} / {{ data.total }}</span
				>
			</div>
			<div class="instruction">
				<span>
					Avez-vous prévu de faire ou de faire faire des travaux
					d'embellissement dans votre logement dans les 12 prochains
					mois ? aumietaunsretéapetauinrtelad lnaur euar etude aulnde
					auldne laudnre uades taunsretaune aunde .tuldetluirs uldes
					taulnes taurse tandures and eaulidetsépidsr
					taueidnsraudlsraedltnsrauinrseteqaéusriet set alnrs
					etldsriet anudsri vtnaurs end vetnarsuihget aulndirse
					talnrudis ealnuris
				</span>
			</div>
		</fold-header>
		<foldable class="segment blue" v-if="verbatimsListLength < 1"
			>Aucun résultat trouvé.</foldable
		>
		<foldable class="listing grid stackable" v-else>
			<div
				class="three wide column"
				v-for="(verbatim, index) in verbatimsList"
				:key="`${index}${verbatim.id}`"
			>
				<verbatim
					ref="verbatims"
					:data="verbatim"
					:select-enabled="selectEnabled"
					:select-model="selectModel"
				/>
			</div>
		</foldable>
	</div>
</template>

<script lang="ts">
import CursorSelector from '@/components/CursorSelector/CursorSelector.vue';
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import { Attr } from '@/decorators';
import {
	TaskData,
	VerbatimData,
	VerbatimSelection,
} from '@/views/Results/ResultsWorkboard/ResultsVerbatims/ResultsVerbatimsTypes';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import Verbatim from './Verbatim.vue';

@Component({
	components: {
		Verbatim,
		Foldable,
		FoldHeader,
		CursorSelector,
	},
})
export default class ResultsTask extends Vue {
	@Prop() public readonly data!: TaskData;
	@Prop() public readonly hideEmpty!: boolean;
	@Prop() public readonly selectEnabled!: boolean;
	@Prop() public readonly selectModel!: VerbatimSelection;

	@Attr() public readonly standalone!: boolean;

	@Ref() protected readonly verbatims!: Verbatim[];

	protected fullVerbatimsList: VerbatimData[] = [
		{
			id: '420',
			user: {
				name: 'toto',
				id: '69',
			},
			answer: 'bidon',
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '421',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '422',
			user: {
				name: 'toto',
				id: '69',
			},
			answer: 'bidon',
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '423',
			user: {
				name: 'toto',
				id: '69',
			},
			answer: 'bidon',
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '424',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '425',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '426',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '427',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '428',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '429',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '430',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '431',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '432',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '433',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '434',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
		{
			id: '435',
			user: {
				name: 'toto',
				id: '69',
			},
			actions: ['answers', 'link'],
			status: '',
		},
	];
	protected verbatimsListLength: number = this.fullVerbatimsList.length;

	private pActive: boolean = false;

	public get verbatimsList(): VerbatimData[] {
		if (this.hideEmpty === true) {
			const list: VerbatimData[] = this.fullVerbatimsList.filter(
				(verbatim: VerbatimData): boolean => {
					return verbatim.answer !== undefined;
				}
			);
			this.verbatimsListLength = list.length;
			return list;
		} else {
			this.verbatimsListLength = this.fullVerbatimsList.length;
			return this.fullVerbatimsList;
		}
	}

	public get active(): boolean {
		return this.pActive;
	}

	public set active(v: boolean) {
		this.pActive = v;
		this.$emit('toggle', v);
	}
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

.result-task {
	position: relative;

	.segment.title {
		padding: math.div($padding, 2);
		font-weight: 700;
		display: flex;
		align-content: center;

		.index-indicator {
			flex-shrink: 0;
		}

		.instruction span {
			vertical-align: text-top;
		}

		.chevron {
			align-self: center;
		}
	}
}

</style>
