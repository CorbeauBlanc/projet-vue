```vue
<template>
	<div class="container">
		<filters
			class="four columns stackable grid"
			:inputs="filters"
			:lazy="true"
			@change="tableFilters = $event"
		/>
		{{ tableFilters }}
	</div>
</template>
<script>
import Vue from 'vue';

export default {
	data: () => {
		return {
			tableFilters: {},
			filters: [
				{
					type: 'DatalistInput',
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
					type: 'DatalistInput',
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
					type: 'DatalistInput',
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
					type: 'DatalistInput',
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
		}
	}
}
</script>
```
