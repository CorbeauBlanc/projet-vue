<template>
	<form class="container text">
		<div class="segments">
			<div class="segment">
				<div class="stackable grid">
					<text-input
						class="six wide column inline required"
						:config="nameInput"
						v-model="inputValues.name"
					/>
					<text-input
						class="six wide column required"
						:config="websiteInput"
						v-model="inputValues.website"
					/>
					<text-input
						class="six wide column required"
						:config="addressInput"
						v-model="inputValues.address"
					/>
					<text-input
						class="six wide column required"
						:config="zipCodeInput"
						v-model="inputValues.zipCode"
					/>
					<text-input
						class="six wide column required"
						:config="townInput"
						v-model="inputValues.town"
					/>
					<datalist-input
						class="six wide column"
						:config="countryInput"
						v-model="inputValues.country"
					/>
				</div>
			</div>
			<div class="segment">
				<div class="stackable grid">
					<datalist-input
						class="six wide column required"
						:config="companyInput"
						v-model="inputValues.company"
					/>
					<datalist-input
						class="six wide column required"
						:config="csmInput"
						v-model="inputValues.csm"
					/>
				</div>
			</div>
			<div class="segment">
				<div class="stackable grid">
					<datalist-input
						class="six wide column required"
						:config="fontInput"
						v-model="inputValues.font"
					/>
					<color-input
						class="six wide column top right"
						format="hex"
						:config="colorInput"
						v-model="inputValues.color"
					/>
					<file-input
						class="six wide column"
						:config="logoInput"
						v-model="inputValues.logo"
					/>
				</div>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import ColorInput from '@/components/Inputs/ColorInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CompaniesInfosFields } from './CompaniesInfosTypes';

@Component({
	components: {
		TextInput,
		DatalistInput,
		ColorInput,
		FileInput,
	},
})
export default class CompaniesInfos extends Vue {
	protected inputValues: CompaniesInfosFields = {
		name: [],
		website: [],
		address: [],
		zipCode: [],
		town: [],
		country: [],
		company: [],
		csm: [],
		font: [],
		color: '#006fdd',
		logo: [],
	};

	protected nameInput: InputConfig = {
		label: 'Nom de la société',
		multiple: false,
		placeholder: 'ex : Panisero',
		name: 'organization',
	};
	protected websiteInput: InputConfig = {
		label: 'Site internet',
		multiple: false,
		placeholder: 'ex : http://www.site.com',
		name: 'url',
	};
	protected addressInput: InputConfig = {
		label: 'Adresse',
		multiple: false,
		placeholder: 'ex : 100 Rue de la Folie Méricourt',
		name: 'street-address',
	};
	protected zipCodeInput: InputConfig = {
		label: 'Code postal',
		multiple: false,
		name: 'postal-code',
	};
	protected townInput: InputConfig = {
		label: 'Ville',
		multiple: false,
		placeholder: 'ex : Paris',
		name: 'address-level2',
	};
	protected countryInput: InputConfig = {
		label: 'Pays',
		multiple: false,
		name: 'address-level1',
		options: [
			{
				text: 'France',
				value: 'fr',
			},
			{
				text: 'Barbare',
				value: 'other',
			},
		],
	};
	protected companyInput: InputConfig = {
		label: 'Société mère',
		multiple: false,
		name: 'organization',
		options: [
			{
				text: 'Société 1',
				value: '1',
			},
			{
				text: 'Société 2',
				value: '2',
			},
		],
	};
	protected csmInput: InputConfig = {
		label: 'Customer Success Manager',
		multiple: false,
		name: 'name',
		options: [
			{
				text: 'machin',
				value: '1',
			},
			{
				text: 'bidule',
				value: '2',
			},
		],
	};
	protected fontInput: InputConfig = {
		label: 'Police du texte',
		multiple: false,
		options: [
			{
				text: 'truc',
				value: '1',
			},
			{
				text: 'chose',
				value: '2',
			},
		],
	};
	protected colorInput: InputConfig = {
		label: 'Couleur principale',
		help: 'Cette couleur sera utilisée dans la présentation des résultats',
	};
	protected logoInput: InputConfig = {
		label: 'Logo (png, jpg, gif | 425px x 121px)',
		placeholder: 'Importer le logo',
		constraints: {
			accept: 'image/*',
		},
	};
}
</script>

<style lang="scss" scoped>
#select-company, #spacer {
	padding-bottom: 0;
}

#add-company, #spacer {
	margin: 0;
	padding-top: 0;
}
</style>
