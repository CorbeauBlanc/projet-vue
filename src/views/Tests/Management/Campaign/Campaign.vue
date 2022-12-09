<template>
	<div id="campaign">
		<div class="container text">
			<div id="template" class="segment">
				<radios-input class="inline" :config="templateConfig" />
				<div>
					<button class="button small">
						<icon edit />
						Éditer
					</button>
					<button class="button ghost small">
						<icon eye />
						Prévisualiser
					</button>
				</div>
			</div>
			<div class="segments">
				<fold-header
					name="acceptance"
					class="segment header antipodes"
					active
				>
					Recette
				</fold-header>
				<foldable name="acceptance" class="segment">
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Envoyés
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Reçus
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Ouverts
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Non sollicités</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Affectation retirée</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Non débutés</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						En cours</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Terminés
					</progress-bar>
					<div class="total">
						<span> Total </span>
						<a>69 testeurs</a>
					</div>
				</foldable>
				<foldable name="acceptance" class="segment">
					<button class="button ghost small">
						<icon users add />
						Ajouter des destinataires
					</button>
					<button class="button ghost small">
						<icon rocket />
						Jouer le test
					</button>
					<button class="button ghost small">
						<icon mail />
						Envoyer le pilote
					</button>
				</foldable>
			</div>
			<div class="segments">
				<fold-header
					name="campaign"
					class="segment header antipodes"
					active
				>
					Campagne
				</fold-header>
				<foldable name="campaign" class="segment">
					<progress-bar class="huge" inline-value
						>Atteinte du quota</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Envoyés
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Reçus
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Ouverts
					</progress-bar>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Non sollicités</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Affectation retirée</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Non débutés</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						En cours</progress-bar
					>
					<progress-bar
						class="inline big compact aligned"
						inline-value
					>
						Terminés
					</progress-bar>
					<div class="total">
						<span> Total </span>
						<a>420 testeurs</a>
					</div>
				</foldable>
				<foldable name="campaign" class="segment">
					<custom-table
						:labels="[
							'',
							'Statut',
							'Testeurs',
							'Date & horaire',
							'Responsable',
							'Relances',
						]"
					/>
					<button class="button flat">
						<icon pause />
						Mettre en pause les envois d'email
					</button>
				</foldable>
				<foldable name="campaign" class="segment">
					<checkbox-input :config="testersMailsConfig" />
				</foldable>
				<foldable name="campaign" class="segment">
					<button class="button ghost small">
						<icon users add />
						Ajouter des testeurs
					</button>
					<button class="button ghost small">
						<icon linked />
						Générer un lien externe
					</button>
					<button class="button small">
						<icon mail />
						Lancer la campagne
					</button>
					<button class="button ghost small icon">
						<icon calendar />
					</button>
					<button class="button ghost small icon red">
						<icon stop />
					</button>
				</foldable>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import CustomTable from '@/components/CustomTable/CustomTable.vue';
import Foldable from '@/components/Foldable/Foldable.vue';
import FoldHeader from '@/components/Foldable/FoldHeader.vue';
import CheckboxInput from '@/components/Inputs/CheckboxInput.vue';
import { InputConfig } from '@/components/Inputs/InputsTypes';
import RadiosInput from '@/components/Inputs/RadiosInput.vue';
import ProgressBar from '@/components/ProgressBar/ProgressBar.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
	components: {
		RadiosInput,
		ProgressBar,
		CustomTable,
		FoldHeader,
		Foldable,
		CheckboxInput,
	},
})
export default class Campaign extends Vue {
	protected templateConfig: InputConfig = {
		options: [
			{ text: 'Template testapic', value: '1' },
			{ text: 'Template custom', value: '2' },
		],
	};
	protected testersMailsConfig: InputConfig = {
		label: 'Ne pas envoyer de mails de validation / refus aux testeurs',
	};
}
</script>

<style lang="scss">
@use "sass:math";
@import '@/styles/variables';
@import '@/styles/mixins';

#campaign {
	#template {
		display: flex;
		justify-content: space-between;
	}

	.total {
		font-weight: bold;
		margin-top: math.div($padding, 2);

		span {
			display: inline-block;
			margin-right: math.div($padding, 2);
		}
	}

	.progress-bar.aligned p, .total span {
		width: 8rem;
		text-align: right;
	}
}
</style>
