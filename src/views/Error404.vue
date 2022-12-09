<template>
	<div class="container">
		<div class="segment empty state">
			<icon warning circle huge />
			<h4 class="h4 content">{{ $t('Oups ! Erreur 404') }}</h4>
			<p class="content">
				{{
					$t(
						"Cette page n'est plus disponible ou n'a pas été trouvée."
					)
				}}
			</p>
			<i18n
				path="Vous pouvez {t} pour nous signaler cette erreur."
				tag="p"
			>
				<template #t>
					<a href="mailto:info@testapic.com">
						{{ $t('nous contacter') }}
					</a>
				</template>
			</i18n>
			<router-link class="button" :to="{ name: 'home' }"
				>Revenir à la page d'accueil</router-link
			>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Error404 extends Vue {}
</script>
