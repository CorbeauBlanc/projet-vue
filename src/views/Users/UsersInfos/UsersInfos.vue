<template>
	<div class="container text">
		<div class="segments">
			<div class="segment">
				<div class="stackable grid">
					<radios-input
						class="twelve wide column inline required"
						:config="titleInput"
						@change="inputValues.title = $event"
					/>
					<text-input
						class="six wide column required"
						:config="nameInput"
						@change="inputValues.name = $event"
					/>
					<text-input
						class="six wide column required"
						:config="lastnameInput"
						@change="inputValues.lastname = $event"
					/>
					<email-input
						class="six wide column required"
						:config="emailInput"
						@change="inputValues.email = $event"
					/>
					<datalist-input
						class="six wide column required"
						:config="motherTongueInput"
						@change="inputValues.motherTongue = $event"
					/>
					<tel-input
						class="six wide column"
						:config="telInput"
						@change="inputValues.tel = $event"
					/>
					<datalist-input
						id="select-company"
						class="six wide column required"
						:config="companyInput"
						@change="inputValues.company = $event"
					/>
					<div id="spacer" class="six wide column"></div>
					<a href="#" id="add-company" class="six wide column hint"
						>Ajouter une société</a
					>
				</div>
			</div>
			<div class="segment">
				<checkbox-input
					class="twelve wide column inline required"
					:config="mainSpeakerInput"
					@change="inputValues.mainSpeaker = $event"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import DatalistInput from '@/components/Inputs/DatalistInput.vue';
import EmailInput from '@/components/Inputs/EmailInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import TelInput from '@/components/Inputs/TelInput.vue';
import TextInput from '@/components/Inputs/TextInput/TextInput.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { UsersInfosFields } from './UsersInfosTypes';

@Component({
	components: {
		EmailInput,
		TelInput,
		TextInput,
		DatalistInput,
		RadiosInput,
		CheckboxInput,
	},
})
export default class UsersInfos extends Vue {
	protected inputValues: UsersInfosFields = {
		companies: [],
		email: '',
		lastname: '',
		motherTongue: '',
		name: '',
		tel: '',
		title: '',
		mainSpeaker: false,
	};

	protected nameInput: InputConfig = {
		label: 'Prénom',
		multiple: false,
		placeholder: 'Prénom',
	};
	protected lastnameInput: InputConfig = {
		label: 'Nom',
		multiple: false,
		placeholder: 'NOM',
	};
	protected emailInput: InputConfig = {
		label: 'Email',
		multiple: false,
		placeholder: 'email@societe.com',
	};
	protected telInput: InputConfig = {
		label: 'Téléphone',
		multiple: false,
	};
	protected titleInput: InputConfig = {
		label: 'Civilité',
		options: [
			{
				text: 'M',
				value: 'male',
			},
			{
				text: 'Mme',
				value: 'female',
			},
		],
	};
	protected motherTongueInput: InputConfig = {
		placeholder: 'Rechercher...',
		label: 'Langue',
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
	protected mainSpeakerInput: InputConfig = {
		label: 'Désigner comme interlocuteur principal avec la société',
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
