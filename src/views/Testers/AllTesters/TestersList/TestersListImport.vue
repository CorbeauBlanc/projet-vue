<template>
	<view-root>
		<template #heading>
			<h2 class="title">
				<router-link :to="{ name: 'testers' }">
					<icon long arrow left />Liste des testeurs
				</router-link>
				<span class="separator">
					<icon chevron right />
				</span>
				<span class="last">Importer une liste de testeurs</span>
			</h2>
		</template>
		<template #content>
			<div class="container">
				<div class="segments">
					<div class="yellow segment">
						<h5 class="h5">Consignes</h5>
						<p>
							Importer votre fichier .csv, choisissez le
							séparateur et sélectionnez le panel client dans
							lequel les testeurs seront importés.
						</p>
						<p>
							<button class="button ghost">
								Télécharger le template CSV
							</button>
						</p>
					</div>
					<div class="segment">
						<div class="grid stackable">
							<div class="twelve wide column required">
								<label for="file-upload" class="label"
									>Fichier à importer (CSV)</label
								>
								<input
									type="file"
									class="ui field file upload"
									id="file-upload"
									accept="text/csv"
									required
								/>
							</div>
							<select-input
								class="four wide column required"
								:config="testersStatus"
							/>
							<text-input
								class="four wide column required"
								:config="separator"
							/>
							<datalist-input
								class="four wide column required"
								:config="clientPanel"
							/>
							<div class="twelve wide column">
								<button class="button">Suivant</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</view-root>
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import SelectInput from '@/components/Inputs/SelectInput/SelectInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import ViewRoot from '@/components/ViewRoot/ViewRoot.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ViewRoot,
		SelectInput,
		TextInput,
		DatalistInput,
	},
})
export default class TestersListImport extends Vue {
	protected testersStatus: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Statut des testeurs',
		options: [
			{
				text: 'Actif',
				value: '1',
			},
			{
				text: 'Non validé',
				value: '2',
			},
			{
				text: 'Archivé',
				value: '3',
			},
		],
	};
	protected separator: InputConfig = {
		placeholder: 'Ex. :  ,',
		multiple: false,
		label: 'Séparateur',
	};
	protected clientPanel: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Panel client',
		options: [
			{
				text: 'Foo',
				value: '1',
			},
			{
				text: 'Bar',
				value: '2',
			},
			{
				text: 'Baz',
				value: '3',
			},
		],
	};
}
</script>

<style lang="scss" scoped>

</style>
