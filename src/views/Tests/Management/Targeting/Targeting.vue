<template>
	<div class="container">
		<!-- attention critère #69 sur 1 ligne
		tooltips
		margins
		calcul répartition = 100% -->
		<div class="segments">
			<div class="segment">
				<div id="segmentation-settings" class="four column grid">
					<datalist-input
						class="column"
						:config="countryConfig"
						v-model="country"
					/>
					<datalist-input
						class="column"
						:config="motherTongueConfig"
						v-model="motherTongue"
					/>
					<datalist-input
						class="column"
						:config="sourcePanelConfig"
						v-model="sourcePanel"
					/>
					<datalist-input
						class="column"
						:config="excludeConfig"
						v-model="exclude"
					/>
				</div>
			</div>
			<div class="segment">
				<progress-bar v-model="totalPanel">Panel total</progress-bar>
				<progress-bar v-model="totalPanel">Critère #69</progress-bar>
			</div>
			<div class="segment green">
				<icon check />
				<strong>420</strong> testeurs pour <strong>69</strong>
				affectations
			</div>
		</div>
		<div class="grid center aligned">
			<div class="column">
				<i class="icon segmentation huge"></i>
				<h4>Aucun critère</h4>
				<p class="content">
					Ajoutez vos critères de ciblage des utilisateurs par ordre
					d'importance décroissante (le plus important en 1er).
				</p>
				<button class="button">Ajouter un critère</button>

				<button class="button secondary">
					Charger des critères par défaut
				</button>
			</div>
		</div>
		<criteria :color="'red'" :index="69" />
	</div>
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig, InputOption } from '@/components/Inputs/InputsTypes';
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import AxiosUtils from '@/services/AxiosUtils';
import Environment from '@/services/EnvironmentService';
import { GetListResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import Criteria from './Criteria/Criteria.vue';

@Component({
	components: {
		DatalistInput,
		ProgressBar,
		Criteria,
	},
})
export default class Targeting extends Vue {
	protected country: InputOption[] = [];
	protected motherTongue: InputOption[] = [];
	protected sourcePanel: InputOption[] = [];
	protected exclude: InputOption[] = [];
	protected totalPanel: number = 100;

	protected countryConfig: InputConfig = {
		label: 'Pays',
		groupedOptions: [
			{
				label: 'TEST1',
				options: [
					{
						text: 'foo',
						value: '1',
					},
					{
						text: 'bar',
						value: '2',
					},
				],
			},
			{
				label: 'TEST2',
				options: [
					{
						text: 'baz',
						value: '3',
					},
					{
						text: 'bidon',
						value: '4',
					},
				],
			},
		],
	};
	protected motherTongueConfig: InputConfig = {
		label: 'Langue(s) du test',
	};
	protected sourcePanelConfig: InputConfig = {
		label: 'Origine du panel des testeurs',
		multiple: false,
		rest: {
			options: {
				get: {
					url: `${Environment.any.api}/companies`,
					config: {
						...AxiosUtils.defaultConfig,
						params: { state: 0 },
					},
					promiseCallback: (
						response?: AxiosResponse<any[]>
					): GetListResponse => {
						const ret: GetListResponse<InputOption> = { data: [] };
						response?.data.forEach((company: any): void => {
							ret.data.push({
								text: company.name,
								value: company.id,
							});
						});
						return ret;
					},
				},
				filterBy: ['company', 'name'],
			},
		},
	};
	protected excludeConfig: InputConfig = {
		label: 'Exclure les testeurs ayant participé au(x) test(s)',
	};
}
</script>

<style lang="scss" scoped>
#segmentation-settings {
	align-items: end;
}
</style>
