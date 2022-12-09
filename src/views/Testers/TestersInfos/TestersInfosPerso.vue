<template>
	<div class="stackable grid criteria">
		<text-input
			class="six wide column required"
			:config="nameInput"
			@change="inputValues.name = $event"
		/>
		<radios-input
			class="six wide column required"
			:config="sexInput"
			@change="inputValues.sex = $event"
		/>
		<text-input
			class="six wide column required"
			:config="birthYearInput"
			@change="inputValues.birthYear = $event"
		/>
		<text-input
			class="six wide column required"
			:config="codeInput"
			@change="inputValues.zipCode = $event"
		/>
		<text-input
			class="six wide column required"
			:config="townInput"
			@change="inputValues.town = $event"
		/>
		<datalist-input
			class="six wide column required"
			:config="countryInput"
			@change="inputValues.country = $event"
		/>
		<datalist-input
			class="six wide column required"
			:config="motherTongueInput"
			@change="inputValues.motherTongue = $event"
		/>
		<datalist-input
			class="six wide column"
			:config="otherLanguagesInput"
			@change="inputValues.otherLanguages = $event"
		/>
		<datalist-input
			id="select-company"
			class="twelve wide column required"
			:config="companyInput"
			@change="inputValues.company = $event"
		/>
		<a href="#" id="add-company" class="twelve wide column hint"
			>Ajouter une société</a
		>
	</div>
</template>

<script lang="ts">
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PersonnalInfos } from './TestersInfosTypes';

@Component({
	components: {
		TextInput,
		RadiosInput,
		DatalistInput,
	},
})
export default class TestersInfosPerso extends Vue {
	protected inputValues: PersonnalInfos = {
		name: '',
		sex: '',
		birthYear: '',
		zipCode: '',
		town: '',
		country: '',
		motherTongue: '',
		otherLanguages: [],
		companies: [],
	};

	protected nameInput: InputConfig = {
		label: 'Prénom',
		multiple: false,
	};
	protected sexInput: InputConfig = {
		label: 'Genre',
		options: [
			{
				text: 'Homme',
				value: 'male',
			},
			{
				text: 'Femme',
				value: 'female',
			},
		],
	};
	protected birthYearInput: InputConfig = {
		label: 'Année de naissance',
		multiple: false,
	};
	protected codeInput: InputConfig = {
		label: 'Code postal',
		multiple: false,
	};
	protected townInput: InputConfig = {
		label: 'Ville',
		multiple: false,
	};
	protected countryInput: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Pays',
		multiple: false,
		options: [
			{
				text: 'France',
				value: 'fr',
			},
			{
				text: 'Les autres',
				value: 'other',
			},
		],
	};
	protected motherTongueInput: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Langue principale',
		multiple: false,
		options: [
			{
				text: 'Français',
				value: 'fr',
			},
			{
				text: 'Barbare',
				value: 'other',
			},
		],
	};
	protected otherLanguagesInput: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Autre(s) langue(s) couramment parlée(s)',
		multiple: false,
		options: [
			{
				text: 'Français',
				value: 'fr',
			},
			{
				text: 'Barbare',
				value: 'other',
			},
		],
	};
	protected companyInput: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Société associée',
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
}
</script>

<style lang="scss" scoped>
#select-company {
	padding-bottom: 0;
}

#add-company {
	padding-top: 0;
}
</style>
